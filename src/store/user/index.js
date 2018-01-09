import * as firebase from 'firebase'

/* eslint-disable */
export default {
  state: {
    user: null,
    users: []
  },
  mutations: {
    createEvent (state, payload) {
      console.log('je cherche le user dans createEvent', state.user)
      state.user.events.push(payload)
    },
    addNotification (state, payload) {
      state.user.notifications.push(payload)
      state.user.notifications.sort((notificationA, notificationB) => {
        return notificationA.event.date < notificationB.event.date
      })
    },
    addEventToMyEvents (state, payload) {
      state.user.events.push(payload)
      state.user.events.sort((eventA, eventB) => {
        return eventA.event.date > eventB.event.date
      })
    },
    setLoadedUsers (state, payload) {
      state.users = payload
    },
    createUser (state, payload) {
      state.users.push(payload)
      console.log('in mutation create user ', payload);
    },
    addFriendToUser(state, payload) {
      const newFriend = payload
      if(state.user.friends.findIndex(user => user.id === newFriend.id) >= 0) {
        console.log('Refused to add this friend as it already exist in the friends list!!!');
        return
      }
      console.log('je cherche le user dans addFriendToUser', state.user)
      state.user.friends.push(newFriend)
      // Below we use the fbKey created by firebase to give an id of the element on our store, so that it's then easy to unregister if needed.
      state.user.fbKeysFriends[newFriend.id] = payload.fbKey
    },
    setUser (state, payload) {
      state.user = payload
      console.log('payload of the state.user in the setUser', payload);
    },
    registerUserForMeetup(state, payload) {
      // I can easily get the id as it has been passed in the actions to the mutations - commit('registerUserForMeetup', {id: payload, fbKey: data.key})
      const id = payload.id
      // Double check if this user is already registered to this meetup, in case that he is already registered, nothing should happen
      if(state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      // Below we use the fbKey created by firebase to give an id of the element on our store, so that it's then easy to unregister if needed.
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromMeetup(state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      // Below we check if we can find the meetup for which the user wants to unregister. We check in the list of events of the user if we can find it
      // With the splice, we get back a numer of element, here only the meetup.id that the user want to unregister from
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      // To erase this meetup from the list in the store, we need to use the reflect.deleteProperty from JS,
      // passing where? state.user.fbKeys and what? the payload as it's the meetup.id
      Reflect.deleteProperty(state.user.fbKeys, payload)
    }
  },
  actions: {

    // ***************SINGIN********************

    signUserUp ({commit}, payload) {
      //As we are doing a request to the web, we change the status of loading to true.
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          //Here we got our user, so we are not loading anymore and we change the status of setLoading
          commit('setLoading', false)
          const newUser = {
            id: user.uid,
            email: user.email,
            userName: payload.userName,
            notifications: [],
            events: [],
            friends: [],
            fbKeys: {}
          }
          commit('setUser', newUser)

          let imageUrl
          let key
          let id = user.uid
          // Here below I create the user in the database of Firebase, not only Firebase's authentification as above
          firebase.database().ref('users/' + id).set(newUser)
          // We store the profile image of the user in FB storage.
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref('users/' + id + '.' + ext).put(payload.image)
          .then(fileData => {
            imageUrl = fileData.metadata.downloadURLs[0]
            // to reach the specific item under the user id in the users array:
            // I can change any value with the update as below
            return firebase.database().ref('users').child(id).update({imageUrl: imageUrl})
          }).then(() => {
            // here we commit that to my local store
            console.log('setUser dans signUserUp');

            commit('setUser', {
              ...newUser,
              imageUrl: imageUrl,
              id: id
            })
          })
          .catch((error) => {
            console.log(error);
          })
        }
      )
      .catch(
        error => {
          //Here we got an error, so we are not loading anymore and we change the status of setLoading
          commit('setLoading', false)
          commit('setError', error)
          console.log(error);
        }
      )
    },

    signUserIn ({commit}, payload) {
      //As we are doing a request to the web, we change the status of loading to true.
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          commit('setLoading', false)
          const userName = firebase.database().ref('users/' + user.uid + 'userName').once('value')
          const imageUrl = firebase.database().ref('users/' + user.uid + 'imageUrl').once('value')
          const newUser = {
            id: user.uid,
            userName: this.userName,
            imageUrl: this.imageUrl,
            friends: [],
            events: [],
            fbKeys: {}
          }
          console.log('newUser dans signin', newUser);
          console.log('setUser dans signUserIn');

          commit('setUser', newUser)
        }
      )
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error);
        }
      )
    },

    autoSignIn ({commit}, payload) {
      console.log('setUser dans autoSignIn');

      commit('setUser', {
        id: payload.uid,
         events: [],
         friends: [],
         fbKeys: {},
         userName: payload.userName,
         imageUrl: payload.imageUrl
       })
    },

    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    },

    // ***********FETCHUSERDATA************************

    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      let events = []
      let swappedPairsEvents = {}
      let friends = []
      let swappedPairsFriends = {}
      let notifications = []
      let userName
      let imageUrl
      // Get the userName and userImage, then the user's friends
      firebase.database().ref('/users/' + getters.user.id).once('value')
      .then(data => {
        const userData = data.val()
        if (!getters.user.imageUrl) {
          console.log('image prise est this.imageUrl = userData.imageUrl');
          this.imageUrl = userData.imageUrl
        }
        else {
          console.log('image prise est this.imageUrl = getters.user.imageUrl');
          this.imageUrl = getters.user.imageUrl
        }

        this.userName = userData.userName
        console.log('this.imageUrl, this.userName', this.imageUrl , this.userName);
      })
      .then( _=>{
        // Fetch the user's ****FRIENDS**** from Firebase and store it in the local store
        firebase.database().ref('/users/' + getters.user.id + '/friends/').once('value')
        .then(data => {
          const dataPairs = data.val()
          for (let key in dataPairs) {
            const userId = dataPairs[key]
            // Here I try to fetch the data for each friend and store it in vuex in order to be able to present it on the friends page.
            // I should check if it's updated when there is a change in the value of one of the friends data.
            firebase.database().ref('/users/' + userId).once('value').then(data =>{
              const friendData = data.val()
              const newFriend = {
                id: friendData.id,
                imageUrl: friendData.imageUrl,
                userName: friendData.userName
              }
              friends.push(newFriend)
            })
            .catch(error => {
              console.log(error);
            }),
            swappedPairsFriends[dataPairs[key]] = key
          }
          commit('setLoading', false)
          // commit('setUser', updatedUser)
        }).
        catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
        // Once all the info fetched from events, friends and notifications, we can update the local store
        const updatedUser = {
          id: getters.user.id,
          imageUrl: this.imageUrl,
          userName: this.userName,
          events: events,
          friends: friends,
          fbKeysEvents: swappedPairsEvents,
          fbKeysFriends: swappedPairsFriends,
          notifications: notifications
        }
        console.log('setUser dans fetchuserData');
        commit('setUser', updatedUser)
      })



    },

    fetchUsersEvents ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/userEvents/').on('child_added', data => {
        // console.log('data dans fetchUsersEvents', data.val())
        const eventId = data.val()
          firebase.database().ref('/events/' + eventId).once('value').then(data =>{
            const eventData = data.val()
            const newEvent = {
              event: eventData,
              eventId: eventId
            }
            if (newEvent.event.imageUrl) {
              commit('addEventToMyEvents', newEvent)
            }
            commit('setLoading', false)
          })
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
          })
      })
    },

    // ****************LOADUSERS FOR THE TESTS****************

    loadUsers ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('users').once('value')
      .then((data) => {
        console.log('data in loadusers', data);
        const users = []
        const obj = data.val()
        for (let key in obj) {
          users.push({
            id: key,
            userName: obj[key].userName,
            imageUrl: obj[key].imageUrl,
            friends: [],

          })
        }
        commit('setLoadedUsers', users)
        commit('setLoading', false)
      })
      .catch(
        (error) => {
          console.log(error)
          commit('setLoading', false)
        }
      )
    },

    // **************ACTIONS****************

    sendFriendRequest ({commit, getters}, payload) {
      commit('setLoading', true)
      const friendId = payload
      const user = getters.user
      // We only add the friends's ID in the friends array of the user.
      if(getters.user.friends.findIndex(user => user.id === payload) >= 0) {
        console.log('Refused to add this friend as it already exist in the friends list!!!');
        commit('setLoading', false)
        return
      }
      firebase.database().ref('/users/' + user.id + '/friends').push(friendId)
      .then(data =>{
        // We push the info of this same new friend to the vuex with all the info of the new friend
        firebase.database().ref('/users/' + friendId).once('value').then(data =>{
          const friendData = data.val()
          const newFriend = {
            id: friendData.id,
            imageUrl: friendData.imageUrl,
            userName: friendData.userName
          }
          commit('addFriendToUser', newFriend)
        })
        .catch(error => {
          console.log(error);
        }),
        commit('setLoading', false)
      })
      .catch(error => {
        console.log(error);
        commit('setLoading', false)
      }),
      // Add user to friend
      firebase.database().ref('/users/' + friendId + '/friends').push(user.id)
      .then(data =>{
        // In the commit, we are sending new value to the mutations
        commit('setLoading', false)
        // commit('addUserToFriend', user.id)
      })
      .catch(error => {
        console.log(error);
        commit('setLoading', false)
      })
    },

    // *************MEETUPS***********************

    registerUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      firebase.database().ref('/users/' + user.id).child('/registrations/')
      .push(payload)
      .then(data =>{
        console.log(data.key);
        // In the commit, we are sending new value to the mutations
        commit('setLoading', false)
        commit('registerUserForMeetup', {id: payload, fbKey: data.key})
      })
      .catch(error => {
        console.log(error);
        commit('setLoading', false)
      })
    },
    unregisterUserFromMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      // First we check if the user has fbKey at all, which would be strange that not, but just a double check
      if(!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      console.log('fbKey', fbKey);
      firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey).remove()
      .then(() => {
        commit('setLoading', false)
        commit('unregisterUserFromMeetup', payload)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    }
  },

  getters: {
    user (state) {
      return state.user
    },
    users (state) {
      return state.users
    },
    getUser (state) {
      return (userId) => {
        return state.users.find((user) => {
          return user.id === userId
        })
      }
    }
  }
}

// Fetch the user's *****NOTIFICATIONS**** from Firebase and store it in the local store
// firebase.database().ref('/users/' + getters.user.id + '/notifications/').once('value')
// .then(data => {
//   console.log('dans les notifications');
//   const notifObj = data.val()
//
//   for (let key in notifObj) {
//     firebase.database().ref('/events/' + key).once('value')
//     .then(data => {
//       // console.log('events trouvés', data.val());
//       const event = data.val()
//       return event
//     })
//     .then(event => {
//       firebase.database().ref('/users/' + getters.user.id + '/notifications/' + key).on('value', data => {
//         const userList = data.val()
//         let counter = -1
//         for (let user in userList) {
//           counter++
//         }
//         // We update the counter on the number of object (userId) found in this notification
//         firebase.database().ref('/users/' + getters.user.id + '/notifications/' + key + '/counter').set(counter)
//         const notification = {
//           event: event,
//           counter: counter,
//           key: key
//         }
//         notifications.push(notification)
//         console.log('counter', counter);
//         counter = -1
//       })
//     })
//     .catch(error => {
//       console.log(error)
//       commit('setLoading', false)
//     })
//     const eventId = notifObj[key]
//     // console.log('eventId quand je cherche les notifications', eventId);
//   }
//   commit('setLoading', false)
//   // commit('setUser', updatedUser)
// })
// .catch(error => {
//   console.log(error)
//   commit('setLoading', false)
// })








// ***************NOT SURE IT WORKS BELOW!!!!!! **************************
// BUT NOT SURE IT'S AN ISSUE AS THE WHEN USER LOGGIN, IT FETCH THE DATA AS FRIENDS AND EVENTS...
// THAT'S WHY I BLINDED IT AND REMOVE THE MUTATION UPDATE FROM THE ACTIONS

// addUserToFriend(state, payload) {
//   const id = payload
//   if(state.user.friends.findIndex(user => user.id === id) >= 0) {
//     return
//   }
//   state.user.friends.push(id)
//   // Below we use the fbKey created by firebase to give an id of the element on our store, so that it's then easy to unregister if needed.
//   state.user.fbKeys[id] = payload.fbKey
// },
