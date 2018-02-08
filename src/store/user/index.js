import * as firebase from 'firebase'

/* eslint-disable */
export default {
  state: {
    user: null,
    users: []
  },
  mutations: {
    removeEventFromUser(state, payload) {
      const events = state.user.events
      events.splice(events.findIndex(event => event.key === payload), 1)
      Reflect.deleteProperty(state.user.events, payload)
      console.log('[removeEventFromUser] mutation payload', payload);
    },
    addProfilePicture (state, payload) {
      const user = payload.user
      if (payload.imageUrl) {
        user.imageUrl = payload.imageUrl
      }
    },
    // createEvent (state, payload) {
    //   state.user.events.push(payload)
    // },
    addNotification (state, payload) {
      state.user.notifications.push(payload)
      state.user.notifications.sort((notificationA, notificationB) => {
        return notificationA.dateToRank > notificationB.dateToRank
      })
    },
    updateNotification (state, payload) {
      console.log('[updateNotification] check the payload', payload)
      const notification = state.user.notifications.find(notification => {
        return notification.key === payload.key
      })
      if (payload.clickerName) {
        notification.clickerName = payload.clickerName
      }
      if (payload.dateToRank) {
        notification.dateToRank = payload.dateToRank
      }
      if (payload.friendsCount) {
        notification.friendsCount = payload.friendsCount
      }
      console.log('[updateNotification] notification', notification);
    },
    addEventToMyEvents (state, payload) {
      console.log('[addEventToMyEvents] mutation => payload', payload);
      state.user.events.push(payload)
      state.user.events.sort((eventA, eventB) => {
        return eventA.event.dateToRank > eventB.event.dateToRank
      })
    },
    setLoadedUsers (state, payload) {
      state.users = payload
    },
    addUser (state, payload) {
      state.users.push(payload)
    },
    createUser (state, payload) {
      state.users.push(payload)
      console.log('in mutation create user ', payload);
    },
    addPendingInvitations(state, payload) {
      const newFriend = payload
      const id = newFriend.id
      // console.log('[addPendingInvitations] newFriend', newFriend);
      if(state.user.pendingInvitations.findIndex(friend => friend.id === payload.id) >= 0) {
        console.log('Refused to add this friend as it already exist in the pendingInvitations list!!!');
        return
      }
      // console.log('[addPendingInvitations] pushing the new invittation of payload to user', state.user.pendingInvitations);
      state.user.pendingInvitations.push(payload)
      // console.log('[addPendingInvitations] state.user.pendingInvitations', state.user.pendingInvitations);
      // Below we use the fbKey created by firebase to give an id of the element on our store, so that it's then easy to unregister if needed.
      // state.user.fbKeysInvitations[id] = payload.fbKey
    },
    addPendingFriendToUser(state, payload) {
      const newFriend = payload
      if(state.user.pendingFriends.findIndex(user => user.id === newFriend.id) >= 0) {
        console.log('Refused to add this friend as it already exist in the pendingFriends list!!!');
        return
      }
      console.log('[addPendingFriendToUser] state.user', state.user)
      state.user.pendingFriends.push(newFriend)
      // Below we use the fbKey created by firebase to give an id of the element on our store, so that it's then easy to unregister if needed.
      // state.user.fbKeysPendingFriends[newFriend.id] = payload.fbKey
    },
    removePendingFriendFromUser(state, payload) {
      const pendingFriends = state.user.pendingFriends
      // Below we check if we can find the friend that need to be removed from the pendingfriends. We check in the list of pendingfriends of the user if we can find it
      // With the splice, we get back a numer of element, here only the friend.id that need to be removed
      // console.log('[removePendingFriendFromUser] BEFORE REMOVAL pendingFriends', pendingFriends);
      pendingFriends.splice(pendingFriends.findIndex(friend => friend.id === payload), 1)
      // To erase this meetup from the list in the store, we need to use the reflect.deleteProperty from JS,
      // passing where? state.user.fbKeys and what? the payload as it's the user.id
      Reflect.deleteProperty(state.user.pendingFriends, payload)
      // console.log('[removePendingFriendFromUser] AFTER REMOVAL pendingFriends', pendingFriends);
    },
    removePendingInvitationFromUser(state, payload) {
      const pendingInvitations = state.user.pendingInvitations
      console.log('[removePendingInvitationFromUser] ', payload);
      pendingInvitations.splice(pendingInvitations.findIndex(friend => friend.id === payload), 1)
      Reflect.deleteProperty(state.user.pendingInvitations, payload)
    },
    removeFriendFromUser(state, payload) {
      const friends = state.user.friends
      friends.splice(friends.findIndex(friend => friend.id === payload), 1)
      Reflect.deleteProperty(state.user.friends, payload)
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
            //*********************************************************
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/iwtapplication.appspot.com/o/profileImgLight.png?alt=media&token=f5ce0264-b98b-4806-a81a-15ad52ba803e'
          }
          console.log('[signUserUp] setUser - newUser', newUser);
          commit('setUser', newUser)
          let id = user.uid
          // Here below I create the user in the database of Firebase, not only Firebase's authentification as above
          firebase.database().ref('users/' + id).set(newUser)
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
      if (payload.image !="") {
        commit('setLoading', true)
        let user = getters.user
        console.log("[addProfilePicture] user", user);
        console.log("[addProfilePicture] payload", payload);
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
      }
      else {
        commit('setLoading', false)
      }
    },

    signUserIn ({commit}, payload) {
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
            events: []
          }
          console.log('[signUserIn] newUser b4 commit(setUser, newUser)', newUser);
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
      commit('setUser', {
        id: payload.uid,
        email: payload.email
        //  events: [],
        //  friends: [],
        //  userName: payload.userName,
        //  imageUrl: payload.imageUrl
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
      let friends = []
      let notifications = []
      let userName = ''
      let imageUrl = ''
      let pendingFriends = []
      let pendingInvitations = []
      // Here below we use promise to get the info one after the other and send everything to the local storage once everything has been received
      // Fetch the userName and userImage
      firebase.database().ref('/users/' + getters.user.id).once('value')
      .then(data => {
        const userData = data.val()
        // console.log('[fetchUserData] userData', userData);
        if (!getters.user.imageUrl) {
          this.imageUrl = userData.imageUrl
        }
        else {
          // console.log('[fetchUserData] image prise est this.imageUrl = getters.user.imageUrl');
          this.imageUrl = getters.user.imageUrl
        }
        this.userName = userData.userName
        // console.log('[fetchUserData] this.userName', this.userName);
      })
      .then( _=>{
        // Fetch the user's ****FRIENDS**** from Firebase and store it in the local store
        firebase.database().ref('/users/' + getters.user.id + '/friends/').on('child_added', data => {
          const userId = data.val()
          const fbKey = data.key
          // console.log('[fetchUserData] child_added in friends data.val()', data.val())
          // console.log('[fetchUserData] child_added in friends data.key', data.key)
          firebase.database().ref('/users/' + userId).once('value').then(data =>{
              const friendData = data.val()
              const newFriend = {
                id: friendData.id,
                imageUrl: friendData.imageUrl,
                userName: friendData.userName,
                fbKey: fbKey
              }
              friends.push(newFriend)
            })
          })
      })
      .then( _ => {
        // Fetch the user's ****PENDINGFRIENDS**** from Firebase and store it in the local store
        firebase.database().ref('/users/' + getters.user.id + '/pendingFriends/').on('child_added', data => {
          const userId = data.val()
          const fbKey = data.key
          // Here I try to fetch the data for each friend and store it in vuex in order to be able to present it on the friends page.
          // I should check if it's updated when there is a change in the value of one of the friends data.
          firebase.database().ref('/users/' + userId).once('value').then(data =>{
            // console.log('[fetchUserData] PENDINGFRIENDS data.val() ', data.val())
            const friendData = data.val()
            const newFriend = {
              id: friendData.id,
              imageUrl: friendData.imageUrl,
              userName: friendData.userName,
              fbKey: fbKey
              }
            pendingFriends.push(newFriend)
            })
          })
        })
        .then(_=> {
          firebase.database().ref('/users/' + getters.user.id + '/pendingInvitations/').on('child_added', data => {
            // Fetch the user's ****PENDINGINVITAITONS**** from Firebase and store it in the local store
            const userId = data.val()
            const fbKey = data.key
            firebase.database().ref('/users/' + userId).once('value').then(data =>{
              const friendData = data.val()
              const newFriend = {
                id: friendData.id,
                fbKey: fbKey
                }
              commit('addPendingInvitations', newFriend)
              })
            })
        })
        .then( _=> {
          const updatedUser = {
            id: getters.user.id,
            imageUrl: this.imageUrl,
            userName: this.userName,
            events: events,
            friends: friends,
            notifications: notifications,
            pendingFriends: pendingFriends,
            pendingInvitations: pendingInvitations
          }
          // console.log('[fetchUserData] updatedUser b4 commit(setUser, updatedUser)', updatedUser);
          commit('setUser', updatedUser)
          commit('setLoading', false)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },

    fetchUsersEvents ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/userEvents/').orderByChild("dateToRank").on('child_added', data => {
        const key = data.val()
        const fbKey = data.key
        firebase.database().ref('/events/' + key).once('value').then(data =>{
          const eventData = data.val()
          // let counter;
          // // I get the number of element in the array users in the event and update the event of the store with the new event user number of the event.
          // firebase.database().ref('events/' + key + '/users/').once('value')
          // .then(data =>{
          //   this.counter = data.numChildren()
          //   console.log('[fetchUsersEvents] counter => data.val().users.numChildren()', this.counter);
          //   // commit ('updateEventUsersCounter', {counter, key})
          // })
          // .then( _=> {
          //
          // })
          const newEvent = {
            event: eventData,
            key: key,
            fbKey: fbKey
            // counter: this.counter
          }
          if (newEvent.event.imageUrl) {
            console.log('[fetchUsersEvents] b4 commit add event => newEvent', newEvent);
            commit('addEventToMyEvents', newEvent)
            commit('addEvent', newEvent)
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
      firebase.database().ref('users').on('child_added', data => {
        // const users = []
        const userData = data.val()
        const fbKey = data.key
        console.log('[loadUsers] userData', userData)
        console.log('[loadUsers] fbKey', fbKey)
        const newUser = {
          id: userData.id,
          imageUrl: userData.imageUrl,
          userName: userData.userName,
          fbKey: fbKey
        }
        // users.push(newFriend)
        commit('addUser', newUser)
        commit('setLoading', false)
        })
      // firebase.database().ref('users').once('value')
      // .then((data) => {
      //   const users = []
      //   const obj = data.val()
      //   for (let key in obj) {
      //     console.log('[]');
      //     users.push({
      //       id: key,
      //       userName: obj[key].userName,
      //       imageUrl: obj[key].imageUrl,
      //       friends: []
      //     })
      //   }
      //   commit('setLoadedUsers', users)
      //   commit('setLoading', false)
      // })
      // .catch(
      //   (error) => {
      //     console.log(error)
      //     commit('setLoading', false)
      //   }
      // )
    },

    // **************ACTIONS****************

    sendFriendRequest ({commit, getters}, payload) {
      commit('setLoading', true)
      const friendId = payload
      const userId = getters.user.id
      // We check if the friend already exist on the pendingFriend list of the user
      if(getters.user.pendingFriends.findIndex(user => userId === payload) >= 0) {
        console.log('Refused to add this friend as it already exist in the pendingFriends list!!!');
        commit('setLoading', false)
        return
      }
      // Send the friend an invitation to accept the friendship in his pending friends.
      firebase.database().ref('/users/' + friendId + '/pendingFriends').push(userId)
      // Add the friend id in the pending invitation's user
      firebase.database().ref('/users/' + userId + '/pendingInvitations').push(friendId)
      // commit('addPendingInvitations', friendId)
      commit('setLoading', false)
    },

    acceptFriendRequest ({commit, getters}, payload) {
      // console.log('[acceptFriendRequest] payload', payload);
      const friendId = payload.id
      const user = getters.user
      commit('setLoading', true)
      // We remove the friend from the user's pending list
      firebase.database().ref('/users/' + user.id + '/pendingFriends').child(payload.fbKey).remove()
      // We update the store
      commit('removePendingFriendFromUser', friendId)
      // We need to get the firebase key of the user in the friend's list to remove it from his database.
      firebase.database().ref('/users/' + friendId + '/pendingInvitations').once('value')
      .then( data => {
        const dataPairs = data.val()
        // console.log('[acceptFriendRequest] dataPairs', dataPairs);
        for (let key in dataPairs) {
          if (dataPairs[key] === user.id) {
            // console.log('[acceptFriendRequest] dans le for if (dataPairs[key] === user.id)', key)
            firebase.database().ref('/users/' + friendId + '/pendingInvitations').child(key).remove()
          }
        }
        commit('setLoading', false)
      })
      // We check if the friend already exist on the friend list of the user
      if(getters.user.friends.findIndex(user => user.id === payload) >= 0) {
        console.log('Refused to add this friend as it already exist in the friends list!!!');
        commit('setLoading', false)
        return
      }
      // We push the friendID to the user's friend list
      firebase.database().ref('/users/' + user.id + '/friends').push(friendId)
      .catch(error => {
        console.log(error);
        commit('setLoading', false)
      }),
      // Add user to friend
      firebase.database().ref('/users/' + friendId + '/friends').push(user.id)
      .catch(error => {
        console.log(error);
        commit('setLoading', false)
      })
    },

    removeFriend ({commit, getters}, payload) {
      const friendId = payload.id
      const user = getters.user
      console.log('[removeFriend] payload', payload);
      // We remove the friend from the user's pending list
      firebase.database().ref('/users/' + user.id + '/friends').child(payload.fbKey).remove()
      // We update the store
      commit('removeFriendFromUser', friendId)
    },
    refuseFriend ({commit, getters}, payload) {
      const friendId = payload.id
      const user = getters.user
      console.log('[refuseFriend] payload', payload);
      // We remove the friend from the user's pending list
      firebase.database().ref('/users/' + user.id + '/pendingFriends').child(payload.fbKey).remove()
      // We update the store
      commit('removePendingFriendFromUser', friendId)
    },

    // ****************** REMOVE ITEMS FROM LOCAL STORE *********************

    listenToInvitationRemoval ({commit, getters}) {
      const userId = getters.user.id
      console.log('[listenToInvitationRemoval] avant d ecouter le child_removed');
      firebase.database().ref('/users/' + userId + '/pendingInvitations').on('child_removed', data => {
        const friendId = data.val()
        console.log('[listenToInvitationRemoval] data.val() du .on(child_removed before the removePendingInvitationFromUser', data.val())
        commit('removePendingInvitationFromUser', friendId)
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
