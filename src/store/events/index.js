import * as firebase from 'firebase'
import Vue from 'vue'
require('firebase/functions')
/* eslint-disable */
// Here we are not eporting anymore a store, it's done in the index.js of the all store, so we export a normal JS object
// export const store = new Vuex.Store({
export default {
  state: {
    loadedNotifications: [],
    currentEvent: null,
    events: []
  },
  mutations: {
    addEvent (state, payload) {
      // IL FAUT VOIR POURQUOI IL NE LES VOIS PAS DANS STATE.EVENTS
      if (state.events.findIndex(events => events.key === payload.key) < 0) {
        state.events.push(payload)
      }
      else {
        Vue.console.log('[addEvent] event not added as already existing');
      }
    },
    updateEventCounter (state, payload) {
      const eventData = state.events.find(event => {
        return event.key === payload.key
      })
    },
    updateEvent (state, payload) {
      const eventData = state.events.find(event => {
        return event.key === payload.key
      })
      eventData.event = payload.event
    },
    setCurrentEvent (state, eventData) {
      state.currentEvent = eventData
    }
  },
  actions: {
    setCurrentEvent (store, id) {
      firebase.database()
      .ref(`/events/${id}`)
      .once('value')
      .then(res => {
        const event = res.val()
        event.id = id
        store.commit('setCurrentEvent', event)
        store.dispatch('loadPersons', Object.values(event.users))
      })
      .catch(Vue.console.debug)
    },
    loadEvent ({commit, ...context}, key) {
      firebase.database()
      .ref(`/events/${key}`)
      .once('value')
      .then(res => {
        commit('addEvent', {
          event: res.val(),
          key: key
        });
      })
      .catch(Vue.console.log);
    },
    removeEventFromUser ({commit, getters}, payload) {
      const eventId = payload.key
      const user = getters.user
      commit('setLoading', true)
      // We remove the event from the user's list
      firebase.database().ref('/users/' + user.id + '/userEvents').child(payload.fbKey).remove()
      // We update the store
      commit('removeEventFromUser', eventId)
      commit('setLoading', false)
    },
    uploadPictures (store, {files}) {
      const currentEvent = store.state.currentEvent
      if (!currentEvent) {
        return null
      }
      Promise.all(
        files.map(file => {
          const filename = Math.round(Math.random() * 10000) + '-' + file.name;
          return firebase.storage().ref(`events/${filename}`).put(file)
        })
      )
      .then(storedfiles => {
        return Promise.all(
          storedfiles.map(storedFile => {
            const imageUrl = storedFile.metadata.downloadURLs[0]
            return firebase.database().ref(`/events/${currentEvent.id}/pictures`).push({ imageUrl: imageUrl })
          })
        )
      })
      .then(() => {
        store.dispatch('setCurrentEvent', currentEvent.id)
      })
      .catch(this.$debug)
    },
    addPicture ({commit, getters}, payload) {
      let image = payload.image
      let id = payload.key
      // let id = payload.eventId
      let imageUrl = ''
      let key
      Vue.console.log('[addpicture] image', payload)
      Vue.console.log('[addpicture] image', image)
      Vue.console.log('[addpicture] id', id)
      // Below I send an empty imageUrl in order to get the key from FB
      // and then I stock the image in FB storage and then I update it to the event pictures with the real pic.
      firebase.database().ref('events/' + id + '/pictures/').push(imageUrl)
      .then((data) => {
        key = data.key
        Vue.console.log('key of the resoponse from firebase when stocking the imagge', key)
        return key
      }).then(key => {
        // I stock the event's image in FB storage
        const filename = payload.image.name
        // AS I REDRAW THE IMAGE IN CANVAS, IT WILL ALWAYS BE .PNG SO NO NEED OF THE BELOW LINE
        // const ext = filename.slice(filename.lastIndexOf('.'))
        const ext = 'png'
        return firebase.storage().ref('events/' + key + '.' + ext).put(payload.image)
      })
      .then(fileData => {
        imageUrl = fileData.metadata.downloadURLs[0]
        // to reach the specific item witht the key in the events array:
        Vue.console.log('[addPicture] imageUrl', imageUrl);
        return firebase.database().ref('events/' + id + '/pictures/' + key).update({imageUrl: imageUrl})
      }).then(() => {
        // here we commit that to my local store
        firebase.database().ref('events/' + id).once('value').then( data => {
          Vue.console.log('dans add pic retour de firebase avec le nouvel evenement', data.val())
          const updateddEvent = data.val()
          const updateddEventWithAddedPic = {
            event: updateddEvent,
            key: id
          }
          Vue.console.log('newPicture ', updateddEventWithAddedPic);
          commit('updateEvent', updateddEventWithAddedPic)
        })
      })
    },
    listenToEventPictures({commit, state}, evid) {
      firebase.database().ref(`/events/${evid}/pictures`)
      .on('child_added')
      .then(data => { // new picture snapshot
        const picture = data.val()
      })
      .catch(Vue.console.error)
    },
    reloadEvent({commit, ...store}, evid) {
      if (evid=='null') return
      firebase.database().ref(`/events/${evid}`).once('value').then(data => {
        const noti = store.rootGetters.notification(data.key)
        if (!noti) return
        noti.event = data.val()
        commit('updateNotifications', noti)
      })
      .catch(Vue.console.error)
    },
    listenToNotifications ({commit, getters, dispatch}) {
      function updateNotifications(data) {
        const evid = data.key
        const notifData = data.val()
        if (evid=='null' || notifData==null) return
        const newNotif = {
          key:          evid,
          clickerName:  notifData.clickerName,
          userId:       notifData.userId,
          dateToRank:   notifData.dateToRank,
          friendsCount: data.child('users').numChildren(),
          event:        null
        }
        commit('updateNotifications', newNotif)
        dispatch('reloadEvent', evid) // after reloadEvent notification object will be updated
      }
      const ref = firebase.database().ref(`users/${getters.user.id}/notifications/`)
      ref.on('child_added', updateNotifications)
      ref.on('child_changed', updateNotifications)
    },

    listenToNotificationsChanges ({commit, getters}) {
      return
      // I listen to any new notifications received by the user.
      //
   // firebase.database().ref(`users/${getters.user.id}/notifications/`)
   // .on('child_changed')
   //   const key = data.key
   //   const notifData = data.val()
   //   var thisEvent;
   //   var counter;
   //   // var eventUserCounter;

   //   firebase.database().ref('/events/' + key).once('value')
   //   .then( data => {
   //     this.thisEvent = data.val()
   //     Vue.console.log('[listenToNotificationsChanges] this.thisEvent', this.thisEvent);
   //     //
   //     // I add a setTimeout, otherwise, the userFriends has no time to get updated and it keep the same amount of chiuldren
   //     setTimeout( _=> {
   //       firebase.database().ref('users/' + getters.user.id + '/notifications/' + key + '/users/').once('value')
   //       .then( data => {
   //         this.counter = data.numChildren()
   //         console.log('[listenToNotificationsChanges] counter changed!!!!!!', this.counter);
   //       })
   //     }, 8000)
   //   })
   //   .then( _ => {
   //     firebase.database().ref('/events/' + key).once('value')
   //     .then(data => {
   //       const fbKey = data.key
   //       const userEvents =  getters.user.events
   //       const event = data.val()
   //       const newNotif = {
   //         key: key,
   //         clickerName : notifData.clickerName,
   //         userId: notifData.userId,
   //         dateToRank : notifData.dateToRank,
   //         friendsCount : this.counter
   //         // eventUserCounter: this.eventUserCounter
   //       }

   //       // Here update firebase
   //       console.log('[listenToNotificationsChanges] newNotif avant de le faire le commit de updateNotification', newNotif);
   //       commit('updateNotification', newNotif)
   //       commit('setLoading', false)
   //     })
   //   })
   // })
    },

    iwtClicked ({commit, getters}, payload) {
      Vue.console.debug('[iwtClicked] notification - payload', payload);
      const key = payload.notification.id
      const userId = payload.userId
      const clickerName = payload.firstName
      Vue.console.debug('[iwtClicked] clickerId', userId);
      Promise.all([
      // I push the new event key in the events array of the clicker user
      firebase.database().ref('users/' + getters.user.id + '/userEvents').push(key),
      // Then I push the userId in the users array of the event
      firebase.database().ref('events/' + key + '/users/').push(getters.user.id)
      ])
      .then(res => {
        const LFKnow = firebase.functions().httpsCallable('letFriendsKnowMyNewEvent')
        return LFKnow({
          evid: key,
          uid: getters.user.id
        })
      })
      /**
      // I get the friend's list of the user in order to send them notifications
        const friends = res.val()[2];
        for (let item in friends) {
          // const userId = dataPairs[item]
          const friendId = dataPairs[item]
          Vue.console.log('[iwtClicked] friendId', friendId);
          // I send notifications to each friend of the user about the clicked event
          firebase.database().ref('/users/' + friendId + '/notifications/' + key + '/users/').push(getters.user.id)
          Vue.console.log('[iwtClicked] after push userId');
          Vue.console.log('[iwtClicked] clickerName', clickerName);
          Vue.console.log('[iwtClicked] userId', userId);

          // I update the clickerId and the dateToRank
          // QUAND JE CLIQUE SUR UN USER, C'EST LA PAGE DE CELUI QUI EST LOADER QUI APPARAIT CAR IL EST COMME CA DANS FIREBASE
          firebase.database().ref('/users/' + friendId + '/notifications/' + key).update({
            clickerName: clickerName,
            userId: userId,
            dateToRank: - Date.now()
          });
        }
        */
      .catch(Vue.console.log)
      .finally(() => commit('setLoading', false))
    },

    createEvent ({commit, getters, dispatch}, payload) {
      const eventData = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        duration: payload.duration,
        creatorId: getters.user.id,
        creationDate: Date(),
        dateToRank: - payload.date.getTime()
      }
      Vue.console.log('[createEvent] eventData', eventData);
      let imageUrl
      let key
      let userEvents = []
      let users = []
      let fbKey
      let pictures
      //Reach out to firebase and store it
      firebase.database().ref('events/').push(eventData)
      .then((data) => {
        key = data.key
        // Here I'm getting the key of the new event created.
        // Push the new event key in the events array of the creator user
        firebase.database().ref('users/' + getters.user.id + '/userEvents').push(key)
        .then( data => {
          this.fbKey = data.key
        })
        .catch((error) => {
          console.log(error);
        })
        // Push the userId in the users array of the event
        firebase.database().ref('events/' + key + '/users/').push(getters.user.id)
        .then(() => {
          firebase.database().ref('events/' + key + '/users/').once('value')
          .then(data => {
            this.users = data.val()
            // console.log('[createEvent] data.val() de users', this.users);
            })
          })
          return key
        })
        .then(key => {
          // I stock the event's image in FB storage
          const filename = payload.image.name
          // const ext = filename.slice(filename.lastIndexOf('.'))
          const ext = 'png'
          return firebase.storage().ref('events/' + key + '.' + ext).put(payload.image)
        })
        .then(fileData => {
          imageUrl = fileData.metadata.downloadURLs[0]
          // QUAND ON RECOIT UNE NOUVELLE NOTIFICATION QUI VIENT D'ETRE CREE, ON N E VOIT PAS CETTE PHOTO
          // IL FAUT RELOADER LA PAGE POUR LA VOIR
          // dispatch('addPicture', {image:payload.image, key: key})


          // to reach the specific item with the key in the events array and set the imageUrl stored above:
          // Here we set the picture as the event picture
          return firebase.database().ref('events').child(key).update({imageUrl: imageUrl})
        })
        // .then( _=> {
        //   dispatch('addPicture', {image:payload.image, key: key})
        // })
        .then( _=> {
          return firebase.database().ref('events/' + key + '/pictures/' + key).update({imageUrl: imageUrl})
        })
        .then( _ => {
          // return firebase.database().ref('events/' + key + '/pictures/' + key).once('value')
          return firebase.database().ref('events/' + key + '/pictures/').once('value')
        })
        .then( data => {
          console.log('create Event picture => data.val()', data.val());
          this.pictures = data.val()
          console.log('create Event picture => this.pictures', this.pictures);
        })
        .then(() => {
        // here we commit that to my local store
        const newEventData = {
          title: payload.title,
          location: payload.location,
          description: payload.description,
          date: payload.date.toISOString(),
          duration: payload.duration,
          creatorId: getters.user.id,
          creationDate: new Date(),
          imageUrl: imageUrl,
          users: this.users,
          dateToRank: - Date.now(),
          pictures: this.pictures
          }
          console.log('newEventData', newEventData);

          const newEvent = {
            event: newEventData,
            key: key,
            fbKey: this.fbKey
          }
          // I commit here in the addEvent only the events created here. The one already existing are fetched by the listenToNotifications child_added.
          commit('addEvent', newEvent)
          commit('addEventToMyEvents', newEvent)
          // I get the friend's list of the user in order to send them notifications
          firebase.database().ref('/users/' + getters.user.id + '/friends/').once('value')
          .then(data => {
            const dataPairs = data.val()
            for (let friendId in dataPairs) {
              friendId = dataPairs[friendId] === true ? friendId : dataPairs[friendId]
              // I send notifications to each friend of the user on the newly created event
              firebase.database().ref('/users/' + friendId + '/notifications/' + key + '/users/').push(getters.user.id)
              // I set the clickerId and the dateToRank
              console.log('[createEvent] just b4 .set clickerName etc');
              firebase.database().ref('/users/' + friendId + '/notifications/' + key).update({
                clickerName: getters.user.firstName,
                userId: getters.user.id,
                dateToRank: - Date.now()
              });
            }
            commit('setLoading', false)
          })
        })
        .catch((error) => {
          console.log(error)
          commit('setLoading', false)
        })
      },
    },
    getters: {
      getCurrentEvent: state => state.currentEvent,
      getEventData (state) {
        return (key) => {
          return state.events.find(event => event.key === key )
        }
      },
      loadedNotifications (state) {
        return state.loadedNotifications.sort((notificationA, notificationB) => notificationA.date - notificationB.date)
      }
    }
}
