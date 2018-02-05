import * as firebase from 'firebase'
/* eslint-disable */
// Here we are not eporting anymore a store, it's done in the index.js of the all store, so we export a normal JS object
// export const store = new Vuex.Store({
export default {
  state: {
    events: []
  },
  mutations: {
    addEvent (state, payload) {
      state.events.push(payload)
      // console.log('[addEvent] state.events', state.events);
    },
    // updateEventUsersCounter (state, payload) {
    //   console.log('[updateEventUserCounter] dans mutation, payload', payload);
    //   const event = state.events.find(event => {
    //     console.log('[updateEventUserCounter] dans mutation, event', event);
    //     return event.key === payload.key
    //   })
    //   if (payload.counter) {
    //     event.event.counter = payload.counter
    //   }
    // },
    // addEventFromCreate (state, payload) {
    //   state.user.events.push(payload)
    //   console.log('payload in addEventFromCreate', payload);
    // },
    updateEvent (state, payload) {
      const eventData = state.events.find(event => {
        return event.key === payload.key
      })
      eventData.event = payload.event
      console.log('in addpicture eventData', eventData);
      console.log('in addpicture mutation', payload);
    }
  },
  actions: {
    addPicture ({commit, getters}, payload) {
      let image = payload.image
      let id = payload.eventId
      let imageUrl = ''
      let key
      console.log('[addpicture] imaage', image)
      console.log('[addpicture] id', id)
      //Reach out to firebase and store it
      firebase.database().ref('events/' + id + '/pictures/').push(imageUrl)
      .then((data) => {
        key = data.key
        console.log('key of the resoponse from firebase when stocking the imagge', key)
        return key
      }).then(key => {
        // I stock the event's image in FB storage
        const filename = payload.image.name
        const ext = filename.slice(filename.lastIndexOf('.'))
        return firebase.storage().ref('events/' + key + '.' + ext).put(payload.image)
      })
      .then(fileData => {
        imageUrl = fileData.metadata.downloadURLs[0]
        // to reach the specific item witht the key in the events array:
        return firebase.database().ref('events/' + id + '/pictures/' + key).update({imageUrl: imageUrl})
      }).then(() => {
        // here we commit that to my local store
        firebase.database().ref('events/' + id).once('value').then( data => {
          console.log('dans add pic retour de firebase avec le nouvel evenement', data.val())
          const updateddEvent = data.val()
          const updateddEventWithAddedPic = {
            event: updateddEvent,
            key: id
          }
          console.log('newPicture ', updateddEventWithAddedPic);
          commit('updateEvent', updateddEventWithAddedPic)
        })
      })
    },

    listenToNotifications ({commit, getters}) {
      var clickerName;
      var friendsCount;
      var counter;
      commit('setLoading', true)
      // I listen to any new notifications received by the user.
      firebase.database().ref('users/' + getters.user.id + '/notifications/').on('child_added', data => {
        // In order to find the data.ref_.key, I console.log the data and look into the response
        const key = data.ref_.key
        // I want to get the name of the user that sent this notification
        firebase.database().ref('users/' + getters.user.id + '/notifications/' + key).limitToLast(1).on('child_added', data => {
          console.log('[listenToNotifications] clickerId', clickerId);
          const clickerId = data.val()
          // Let's get the userName of the clicker to pass it to the notification
          firebase.database().ref('users/' + clickerId).once('value')
          .then( data => {
            this.clickerName = data.val().userName
            console.log('[listenToNotifications] this.clickerName', this.clickerName);
            })
          });
        // We get the number of friends that were in the event:
        // NOT SURE IT'S CORRECT, SHOULD CHECK THE USERS IN THE EVENT AND CHECK IF THEY ARE IN THE FRIENDS, OR THE OPPOSITE
        // firebase.database().ref('users/' + getters.user.id + '/notifications/' + key).once('value')
        // .then(data => {
        //   this.friendsCount = data.numChildren()
        //   console.log('[listenToNotifications] friendsCount', friendsCount);
        // })
        // J'ESSAYE DE PRENDRE LES FRIENDS ET DE VOIR SI ILS SONT DANS LES USERS DE L'EVENT
        firebase.database().ref('users/' + getters.user.id + '/friends/').once('value')
        .then( data => {
          const friendsArray = data.val()
          for (let friend in friendsArray) {
            const userId = friendsArray[friend]
            console.log('[listenToNotifications] friend in friendsArray', userId.length);
          }
        })
        // I get the number of element in the array users in the event and update the event of the store with the new event user number of the event.
        firebase.database().ref('events/' + key + '/users/').once('value')
        .then(data =>{
          this.counter = data.numChildren()
        })
        .then( _ => {
          // Here we get the event data from fb in order to add it to our store in the notif
          firebase.database().ref('/events/' + key).once('value')
          .then(data => {
            const event = data.val()
            const newNotif = {
              event: event,
              key: key,
              clickerName : this.clickerName,
              dateToRank : event.dateToRank,
              friendsCount : this.friendsCount
            }

            const newEvent = {
              key: key,
              event: event,
              counter : this.counter
            }
            console.log('[listenToNotifications] newNotif avant de le faire le commit', newNotif);
            // I commit the addEvent below to be able to have it available to see the event itself.
            commit('addEvent', newEvent)
            commit('addNotification', newNotif)
            commit('setLoading', false)
        })
        // // Here we get the event data from fb in order to add it to our store in the notif
        // firebase.database().ref('/events/' + key).once('value')
        // .then(data => {
        //   const event = data.val()
        //   const newNotif = {
        //     event: event,
        //     key: key,
        //     clickerName : this.clickerName,
        //     dateToRank : event.dateToRank,
        //     friendsCount : this.friendsCount
        //   }
        //
        //   const newEvent = {
        //     key: key,
        //     event: event,
        //     counter : this.counter
        //   }
        //   console.log('[listenToNotifications] newNotif avant de le faire le commit', newNotif);
        //   // I commit the addEvent below to be able to have it available to see the event itself.
        //   commit('addEvent', newEvent)
        //   commit('addNotification', newNotif)
        //   // commit('setLoading', false)
        })
      })
    },

    listenToNotificationsChanges ({commit, getters}) {
      var clickerName;
      var friendsCount;
      commit('setLoading', true)
      // I listen to any new notifications received by the user.
      firebase.database().ref('users/' + getters.user.id + '/notifications/').on('child_changed', data => {
        // In order to find the data.ref_.key, I console.log the data and look into the response
        const key = data.ref_.key
        firebase.database().ref('users/' + getters.user.id + '/notifications/' + key).once('value')
        .then(data => {
          this.friendsCount = data.numChildren()
          console.log('[listenToNotificationsChanges] data.val()', data.val());
          console.log('[listenToNotificationsChanges] friendsCount', friendsCount);
        })
        // I want to get the name of the user that sent this notification
        firebase.database().ref('users/' + getters.user.id + '/notifications/' + key).limitToLast(1).on('child_added', data => {
          const clickerId = data.val()
          console.log('[listenToNotificationsChanges] clickerId', clickerId);
          // Let's get the userName of the clicker to pass it to the notification
          firebase.database().ref('users/' + clickerId).once('value')
          .then( data => {
            this.clickerName = data.val().userName
            console.log('[listenToNotificationsChanges] this.clickerName', this.clickerName);
            })
        });
        // Here we get the event data from fb in order to add it to our store in the notif
        firebase.database().ref('/events/' + key).once('value')
        .then(data => {
          const event = data.val()
          const newNotif = {
            // event: event,
            key: key,
            clickerName : this.clickerName,
            dateToRank : - Date.now(),
            friendsCount : this.friendsCount
          }
          console.log('[listenToNotificationsChanges] newNotif avant de le faire le commit de updateNotification', newNotif);
          commit('updateNotification', newNotif)
          commit('setLoading', false)
        })
      })
    },

    // onEventChanged ({commit, getters}) {
    //   // commit('setLoading', true)
    //   firebase.database().ref('events').on('child_changed', data =>{
    //     const key = data.ref_.key
    //     // I get the number of element in the array users in the event and update the event of the store with the new event user number of the event.
    //     firebase.database().ref('events/' + key + '/users/').once('value')
    //     .then(data => {
    //       let counter = data.numChildren()
    //       console.log('[onEventChanged] {counter, key} just avant le commit', counter, key);
    //       commit ('updateEventUsersCounter', {counter, key})
    //       // commit('setLoading', false)
    //     })
    //   })
    // },

    iwtClicked ({commit, getters}, payload) {
      const key = payload.key
      // I push the new event key in the events array of the creator user
      firebase.database().ref('users/' + getters.user.id + '/userEvents').push(key)
      .catch((error) => {
        console.log(error);
      })
      // Then I push the userId in the users array of the event
      firebase.database().ref('events/' + key + '/users/').push(getters.user.id)
      .catch((error) => {
        console.log(error);
      })
      // I get the friend's list of the user in order to send them notifications
      firebase.database().ref('/users/' + getters.user.id + '/friends/').once('value')
      .then(data => {
        const dataPairs = data.val()
        for (let item in dataPairs) {
          const userId = dataPairs[item]
          // I send notifications to each friend of the user on the newly created event
          firebase.database().ref('/users/' + userId + '/notifications/' + key).push(getters.user.id)
        }
        commit('setLoading', false)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },

    createEvent ({commit, getters}, payload) {
      const eventData = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id,
        creationDate: Date(),
        dateToRank: - Date.now()
      }
      console.log('[createEvent] eventData', eventData);
      let imageUrl
      let key
      let userEvents = []
      let users = []
      //Reach out to firebase and store it
      firebase.database().ref('events/').push(eventData).then((data) => {
        key = data.key
        // Here I'm getting the key of the new event created.
        // Push the new event key in the events array of the creator user
        firebase.database().ref('users/' + getters.user.id + '/userEvents').push(key)
        .catch((error) => {
          console.log(error);
        })
        // Push the userId in the users array of the event
        firebase.database().ref('events/' + key + '/users/').push(getters.user.id)
        .then(() => {
          firebase.database().ref('events/' + key + '/users/').once('value')
          .then(data => {
            this.users = data.val()
            console.log('[createEvent] data.val() de users', this.users);
          })
        })
        return key
      }).then(key => {
        // I stock the event's image in FB storage
        const filename = payload.image.name
        const ext = filename.slice(filename.lastIndexOf('.'))
        return firebase.storage().ref('events/' + key + '.' + ext).put(payload.image)
      })
      .then(fileData => {
        imageUrl = fileData.metadata.downloadURLs[0]
        // to reach the specific item with the key in the events array and set the imageUrl stored above:
        return firebase.database().ref('events').child(key).update({imageUrl: imageUrl})
      }).then(() => {
        // here we commit that to my local store
        const newEvent = {
          title: payload.title,
          location: payload.location,
          description: payload.description,
          date: payload.date.toISOString(),
          creatorId: getters.user.id,
          creationDate: new Date(),
          imageUrl: imageUrl,
          users: this.users,
          dateToRank: - Date.now()
        }
        const newEventObj = {
          event: newEvent,
          eventId: key,
          dateToRank: - Date.now(),
          clickerName : getters.user.userName,
          counter: 1
        }
        const newNotif = {
          event: newEvent,
          key: key,
          dateToRank: - Date.now(),
          clickerName : getters.user.userName,
          counter: 1
        }

        console.log('addEventToMyEvents dans create event', newEventObj);
        commit('addEventToMyEvents', newEventObj)
        commit('addEvent', newNotif)

        // I get the friend's list of the user in order to send them notifications
        firebase.database().ref('/users/' + getters.user.id + '/friends/').once('value')
        .then(data => {
          const dataPairs = data.val()
          for (let item in dataPairs) {
            const userId = dataPairs[item]
            // I send notifications to each friend of the user on the newly created event
            firebase.database().ref('/users/' + userId + '/notifications/' + key).push(getters.user.id)
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
    getEventData (state) {
      return (eventId) => {
        return state.events.find((event) => {
          return event.key === eventId
        })
      }
    },
    loadedNotifications (state) {
      return state.loadedNotifications.sort((notificationA, notificationB) => {
        return notificationA.date < notificationB.date
      })
    },
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    loadedMeetup (state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    }
  }
}
