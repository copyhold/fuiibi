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
      // console.log('payload in addevent', payload);
    },
    addEventFromCreate (state, payload) {
      state.user.events.push(payload)
      console.log('payload in addEventFromCreate', payload);
    },
    // addEventMainPicture (state, payload, key) {
    //   console.log(payload, key);
    // },
    updateEvent (state, payload) {
      const eventData = state.events.find(event => {
        return event.key === payload.eventId
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
      console.log('dans addpicture imaage', image)
      console.log('dans addpicture id', id)

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
            eventId: id
          }
          console.log('newPicture ', updateddEventWithAddedPic);
          commit('updateEvent', updateddEventWithAddedPic)
        })

      })
    },
    listenToNotifications ({commit, getters}) {
      commit('setLoading', true)
      let counter = 0;
      firebase.database().ref('users/' + getters.user.id + '/notifications/').on('child_added', data => {
        // In order to find the data.ref_.key, I console.log the data and look into the response
        const key = data.ref_.key
        let userCounter = data.val().counter + 1
        counter++
        firebase.database().ref('/events/' + key).once('value')
        .then(data => {

          // console.log('events trouvés', data.val());
          const event = data.val()
          console.log(event.users);
          const newNotif = {
            event: event,
            key: key,
            userCounter: userCounter,
            counter: counter
          }
          // console.log('in listenToNotifications');
          commit('addEvent', newNotif)
          commit('addNotification', newNotif)
          commit('setLoading', false)
        })
      })
    },

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
        console.log('data.val() dans createevent en retour de la requete pour les friends', data.val());
        const dataPairs = data.val()
        for (let item in dataPairs) {
          const userId = dataPairs[item]
          let counter = 1
          // I send notifications to each friend of the user on the newly created event
          firebase.database().ref('/users/' + userId + '/notifications/' + key).push(getters.user.id)
          .catch(error => {
            console.log(error);
          })
          firebase.database().ref('/users/' + userId + '/notifications/' + key).set(counter)
          .catch(error => {
            console.log(error);
          })
        }
        commit('setLoading', false)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    // increaseCounter(ref){
    //   ref.once("value", (snapshot)=> {
    //   let counter =snapshot.val();
    //   if(counter == null){
    //     counter = 0
    //   }
    //   counter--;
    //   ref.set(counter);
    // });
    // }
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
      console.log('event obj in the createEvent', eventData);
      let imageUrl
      let key
      let userEvents = []
      let users = []
      //Reach out to firebase and store it
      firebase.database().ref('events/').push(eventData).then((data) => {
        key = data.key
        // Here I'm getting the key of the new event created.
        // Then I push the new event key in the events array of the creator user
        firebase.database().ref('users/' + getters.user.id + '/userEvents').push(key)
        .catch((error) => {
          console.log(error);
        })
        // Then I push the userId in the users array of the event
        firebase.database().ref('events/' + key + '/users/').push(getters.user.id).then(() => {
          firebase.database().ref('events/' + key + '/users/').once('value')
          .then(data => {
            this.users = data.val()
            console.log('data.val() dans create new event', this.users);
          })
        })
        .catch((error) => {
          console.log(error);
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
        // to reach the specific item witht the key in the events array:
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
        console.log('this.key', this.key);
        console.log('key', key);

        const newEventObj = {
          event: newEvent,
          eventId: key
        }

        const newNotif = {
          event: newEvent,
          key: key
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
            // let counter = 1
            // I send notifications to each friend of the user on the newly created event
            firebase.database().ref('/users/' + userId + '/notifications/' + key).push(getters.user.id)
            .catch(error => {
              console.log(error);
            })
            // firebase.database().ref('/users/' + userId + '/notifications/' + key).set(counter)
            // .catch(error => {
            //   console.log(error);
            // })
          }
          commit('setLoading', false)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
      })
      .catch((error) => {
        console.log(error);
      })
    },

    updateMeetupData ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      firebase.database().ref('meetups').child(payload.id).update(updateObj)
      .then(() => {
        commit('setLoading', false)
        // Below I commit the changed done in updateMeetup from the mutations above, passing the payload, where is the data
        commit('updateMeetup', payload)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    }
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
