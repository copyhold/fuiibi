import * as firebase from 'firebase'

/* eslint-disable */
export default {
  state: {
    user: null,
    users: []
  },
  mutations: {
    addProfilePicture (state, payload) {
      const user = payload.user
      console.log('[addProfilePicture] user', user);
      console.log('[addProfilePicture] imageUrl', payload.imageUrl);
      if (payload.imageUrl) {
        user.imageUrl = payload.imageUrl
      }
    },
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
      // console.log('addEventToMyEvents dans mutation', payload);
      state.user.events.push(payload)
      state.user.events.sort((eventA, eventB) => {
        return eventA.event.dateToRank > eventB.event.dateToRank
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
            fbKeys: {},
            //*********************************************************
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/iwtapplication.appspot.com/o/users%2FprofileImgLight.png?alt=media&token=309dd6f9-9def-450d-bf45-65f9b3de860a'
          }
          console.log('[signUserUp] setUser - newUser', newUser);
          commit('setUser', newUser)
          //*************************************************
          // let imageUrl
          // let key
          let id = user.uid
          // Here below I create the user in the database of Firebase, not only Firebase's authentification as above
          firebase.database().ref('users/' + id).set(newUser)
          // // We store the profile image of the user in FB storage.
          // const filename = payload.image.name
          // const ext = filename.slice(filename.lastIndexOf('.'))
          // return firebase.storage().ref('users/' + id + '.' + ext).put(payload.image)
          // .then(fileData => {
          //   imageUrl = fileData.metadata.downloadURLs[0]
          //   // to reach the specific item under the user id in the users array:
          //   // I can change any value with the update as below
          //   return firebase.database().ref('users').child(id).update({imageUrl: imageUrl})
          // }).then(() => {
          //   // here we commit that to my local store
          //   console.log('setUser dans signUserUp');
          //   commit('setLoading', false)
          //   commit('setUser', {
          //     ...newUser,
          //     imageUrl: imageUrl,
          //     id: id
          //   })
          // })
          // // .catch((error) => {
          // //   console.log(error);
          // // })
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

    //*****************************************************
    addProfilePicture ({commit, getters}, payload) {
      let user = getters.user
      console.log("user in addProfilePicture", user);
      let imageUrl
      // We store the profile image of the user in FB storage.
      const filename = payload.image.name
      const ext = filename.slice(filename.lastIndexOf('.'))
      return firebase.storage().ref('users/' + user.id + '.' + ext).put(payload.image)
      .then(fileData => {
        imageUrl = fileData.metadata.downloadURLs[0]
        // to reach the specific item under the user id in the users array:
        // I can change any value with the update as below
        return firebase.database().ref('users').child(user.id).update({imageUrl: imageUrl})
      }).then(() => {
        // here we commit that to my local store
        console.log('setUser dans addProfilePicture');
        commit('setLoading', false)
        commit('addProfilePicture', {
          imageUrl: imageUrl,
          user: user
        })
      })
      .catch(
        error => {
          //Here we got an error, so we are not loading anymore and we change the status of setLoading
          commit('setLoading', false)
          commit('setError', error)
          console.log(error);
        }
      )
    },
    //******************************************************


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
      let pendingFriends = []
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
        // const updatedUser = {
        //   id: getters.user.id,
        //   imageUrl: this.imageUrl,
        //   userName: this.userName,
        //   events: events,
        //   friends: friends,
        //   fbKeysEvents: swappedPairsEvents,
        //   fbKeysFriends: swappedPairsFriends,
        //   notifications: notifications,
        //   pendingFriends: pendingFriends
        // }
        // console.log('setUser dans fetchuserData');
        // commit('setUser', updatedUser)
      })
      .then( _=>{
        // Fetch the user's ****FRIENDS**** from Firebase and store it in the local store
        firebase.database().ref('/users/' + getters.user.id + '/pendingFriends/').once('value')
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
              pendingFriends.push(newFriend)
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
          notifications: notifications,
          pendingFriends: pendingFriends
        }
        console.log('setUser dans fetchuserData');
        commit('setUser', updatedUser)
      })
    },

    fetchUsersEvents ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/userEvents/').orderByChild("dateToRank").on('child_added', data => {
        // console.log('data dans fetchUsersEvents', data.val())
        const eventId = data.val()
          firebase.database().ref('/events/' + eventId).once('value').then(data =>{
            const eventData = data.val()
            const newEvent = {
              event: eventData,
              eventId: eventId
            }
            if (newEvent.event.imageUrl) {
              // console.log('addEventToMyEvents dans fetchUsersEvents', newEvent);
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
