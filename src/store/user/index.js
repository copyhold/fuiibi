import * as firebase from 'firebase'
import Vue from 'vue'
import router from './../../router'

/* eslint-disable */
export default {
  state: {
    user: null,
    users: [],
    emails: []
  },
  mutations: {
    removeEventFromUser(state, payload) {
      const events = state.user.events
      events.splice(events.findIndex(event => event.key === payload), 1)
      Reflect.deleteProperty(state.user.events, payload)
    },
    addProfilePicture (state, payload) {
      const user = payload.user
      if (payload.imageUrl) {
        user.imageUrl = payload.imageUrl
      }
    },
    updateNotifications(state, payload) {
      if (!payload.key) return
      const noti = {}
      noti[payload.key] = payload
      state.user.notifications = { ...state.user.notifications || {}, ...noti }
    },
    addNotification (state, payload) {
      state.user.notifications.push(payload)
      // I REMOVED THE SORT AS I SORT IT ALREADY WITH FIREBASE ORDERBYCHILD()!!!
      state.user.notifications.sort((notificationA, notificationB) => {
        // Vue.console.log('[mutations addNotification] notificationA, notificationB', notificationA, notificationB);
        return notificationA.dateToRank - notificationB.dateToRank
      })
    },
    updateNotification (state, payload) {
      Vue.console.log('[updateNotification] check the payload', payload)
      const notification = state.user.notifications.find(notification => {
        return notification.key === payload.key
      })
      if (payload.clickerName) {
        notification.clickerName = payload.clickerName
      }
      if (payload.userId) {
        notification.userId = payload.userId
      }
      if (payload.dateToRank) {
        notification.dateToRank = payload.dateToRank
      }
      if (payload.friendsCount) {
        notification.friendsCount = payload.friendsCount
      }
      state.user.notifications.sort((notificationA, notificationB) => {
        return notificationA.dateToRank - notificationB.dateToRank
      })
      Vue.console.log('[updateNotification] notification', notification);
    },
    updateProfile (state, payload) {
      const user = state.users.find(user => {
        return user.id === payload.payload.id
      })
      const indexOfItem = state.users.findIndex(user => {
        return user.id === payload.payload.id
      })
      if (payload.imageUrl) {
        user.imageUrl = payload.imageUrl
        state.user.imageUrl = user.imageUrl
      }
      if (payload.payload.gender) {
        state.user.gender = payload.payload.gender
      }
      if (payload.payload.livingIn) {
        state.user.livingIn = payload.payload.livingIn
      }
      if (payload.payload.dateOfBirth) {
        state.user.dateOfBirth = payload.payload.dateOfBirth
      }
    },
    updateUser (state, payload) {
      Vue.console.log('[updateUser] check the payload', payload)
      const user = this.getters.person(payload.id)
      if (user.userEvents) {
        user.userEvents = payload.userEvents
      }
      if (payload.livingIn) {
        user.livingIn = payload.livingIn
      }
      if (payload.dateOfBirth) {
        user.dateOfBirth = payload.dateOfBirth
      }
      if (payload.gender) {
        user.gender = payload.gender
      }
      if (payload.image) {
        user.image = payload.image
      }
      Vue.console.log('[updateuser] user', user);
    },
    addEventToMyEvents (state, payload) {
      state.user.events = state.user.events || []
      state.user.events.push(payload)
      state.user.events.sort((eventA, eventB) => {
        return eventA.event.dateToRank - eventB.event.dateToRank
      })
    },
    setLoadedUsers (state, payload) {
      state.users = payload
      Vue.console.log('[setLoadedUsers] state.users', state.users);
    },
    addUser (state, payload) {
      if (state.users.findIndex(user => user.id === payload.id) < 0) {
        state.users.push(payload)
      }
    },
    addEmail (state, payload) {
      // Vue.console.log('[addEmail]');
      if (state.emails.findIndex(user => user.id === payload.id) < 0) {
        state.emails.push(payload)
        // Vue.console.log('[addEmail] state.emails', state.emails);
      }
    },
    createUser (state, payload) {
      state.users.push(payload)
      Vue.console.log('in mutation create user ', payload);
    },
    addPendingInvitations(state, fid) {
      if (state.user.pendingInvitations) {
        if(state.user.pendingInvitations && state.user.pendingInvitations[fid]) {
          Vue.console.log('Refused to add this friend as it already exist in the pendingInvitations list!!!');
          return
        }
        Vue.set(state.user.pendingInvitations, fid, true)
      }
    },
    addPendingFriendToUser(state, payload) {
      const newFriend = payload

      if(state.user.pendingFriends[newFriend.id]) {
        Vue.console.log('Refused to add this friend as it already exist in the pendingFriends list!!!');
        return
      }
      Vue.console.log('[addPendingFriendToUser] state.user', state.user)
      state.user.pendingFriends[newFriend.id] = newFriend
    },
    removePendingFriendFromUser(state, friendId) {
      Reflect.deleteProperty(state.user.pendingFriends, friendId) // why Reflect? I dont' know
    },
    cancelInvitation(state, fid) {
      const pendingInvitations = { ...state.user.pendingInvitations }
      delete(pendingInvitations[fid])
      state.user.pendingInvitations = pendingInvitations
    },
    removeFriendFromUser(state, payload) {
      console.log("[removeFriendFromUser] friend should be removed from user...");
      const friends = state.user.friends
      friends.splice(friends.findIndex(friend => friend.id === payload), 1)
      Reflect.deleteProperty(state.user.friends, payload)
    },
    setUser (state, payload) {
      if (payload === null) {
        state.user = payload
        return
      }
      state.email = payload.email
      if (!payload.notifications) payload.notifications = []
      state.user = payload
    }
  },
  actions: {

    // ***************SINGIN********************
    signInWithGoogle ({commit, getters}) {
      Vue.console.log('[signInWithGoogle]');
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        Vue.console.log('[signInWithGoogle] user by google', user);
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
    },

    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        const firstName = firebase.database().ref('users/' + user.uid + 'firstName').once('value')
        const email = firebase.database().ref('users/' + user.uid + 'email').once('value')
        const lastName = firebase.database().ref('users/' + user.uid + 'lastName').once('value')
        const imageUrl = firebase.database().ref('users/' + user.uid + 'imageUrl').once('value')
        const gender = firebase.database().ref('users/' + user.uid + 'gender').once('value')
        const livingIn = firebase.database().ref('users/' + user.uid + 'livingIn').once('value')
        const dateOfBirth = firebase.database().ref('users/' + user.uid + 'dateOfBirth').once('value')
        const userData = firebase.database().ref('users/' + user.uid).once('value')
        Vue.console.debug('[signUserIn] userData', userData);
        Vue.console.debug('[signUserIn] userData.firstName', userData.firstName);

        const newUser = {
          id: user.uid,
          firstName: this.firstName,
          lastName: this.lastName,
          imageUrl: this.imageUrl,
          email: this.email,
          livingIn: this.livingIn,
          gender: this.gender,
          dateOfBirth: this.dateOfBirth,
          friends: [],
          events: []
        }
        Vue.console.debug('[signUserIn] newUser b4 commit(setUser, newUser)', newUser);
        commit('setUser', newUser)
      })
      .catch(error => {
        commit('setError', error)
        Vue.console.log(error);
      })
      .finally(() => {
        commit('setLoading', false)
      })
    },
    checkUserFromGoogle ({commit, dispatch}, payload) {
      Vue.console.log('[checkUserFromGoogle] payload')
      firebase.database().ref('users/' + payload.uid).once('value')
      .then( user =>{
        Vue.console.log('[checkUserFromGoogle] user');
        let userData = user.val()
        if (userData === null) {
          Vue.console.log('[checkUserFromGoogle] this user is new => userData === null', userData)
          dispatch('createUserFromGoogle', payload)
        } else {
          const friends = {}
          for (let friendid of Object.values(userData.friends || {})) {
            if (friendid!==true) {
              friends[friendid] = true
            }
          }
          commit('setUser', { ...userData, photoUrl: userData.imageURL, friends })
          Vue.console.log('[checkUserFromGoogle] this user is NOT new')
          const ids = new Set([ ...Object.keys(userData.pendingFriends || {}), ...Object.keys(userData.pendingInvitations || {}), ...Object.values(userData.friends || {})])
          dispatch('loadPersons', Array.from(ids))
          // dispatch('fetchUserData')
          dispatch('setupMessagingAndToken')
          dispatch('listenToNotifications')
          dispatch('fetchUsersEvents')
          dispatch('listenToNotificationsChanges')
          dispatch('listenToInvitationRemoval')
          dispatch('listenToFriendRemoval')
        }
      })
    },
    createUserFromGoogle ({commit}, payload) {
      Vue.console.log('let create a user from google', payload);
      commit('setLoading', true)
      const [firstName, ...lastName] = payload.displayName.split(' ')
      const newUser = {
        id: payload.uid,
        email: payload.email,
        firstName: firstName,
        lastName: lastName.join(' '),
        notifications: [],
        events: [],
        friends: [],
        pendingFriends: {},
        pendingInvitations: {},
        imageUrl: payload.photoURL
      }
      Vue.console.log('[signUserUpWithGoogle] setUser - newUser', newUser);
      commit('setUser', newUser)
      commit('setLoading', false)
      // Here below I create the user in the database of Firebase, not only Firebase's authentification as above
      firebase.database().ref('users/' + payload.id).set(newUser)
      router.push('/welcome')
    },
    signUserUp ({commit}, payload) {
      //As we are doing a request to the web, we change the status of loading to true.
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        //Here we got our user, so we are not loading anymore and we change the status of setLoading
        const newUser = {
          id: user.uid,
          email: user.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          notifications: [],
          events: [],
          friends: [],
          //*********************************************************
          imageUrl: 'https://firebasestorage.googleapis.com/v0/b/iwtapplication.appspot.com/o/default_avatar.png?alt=media&token=245e435c-c87b-4af3-8688-a6469500b7de'
        }
        Vue.console.log('[signUserUp] setUser - newUser', newUser);
        commit('setUser', newUser)
        debugger
        // Here below I create the user in the database of Firebase, not only Firebase's authentification as above
        return firebase.database().ref(`users/${user.uid}`).set(newUser)
      })
      .then(() => {
        commit('setLoading', false)
      })
      .catch(
        error => {
          //Here we got an error, so we are not loading anymore and we change the status of setLoading
          commit('setLoading', false)
          commit('setError', error)
          Vue.console.log(error);
        }
      )
      router.push('/welcome')
    },

    //*****************************************************
    addProfilePicture ({commit, getters}, payload) {
      if (payload.image !="") {
        commit('setLoading', true)
        let user = getters.user
        Vue.console.log("[addProfilePicture] user", user);
        Vue.console.log("[addProfilePicture] payload", payload);
        let imageUrl
        // We store the profile image of the user in FB storage.
        const filename = payload.image.name
        // const ext = filename.slice(filename.lastIndexOf('.'))
        const ext = 'png'
        return firebase.storage().ref('users/' + user.id + '.' + ext).put(payload.image)
        .then(fileData => {
          imageUrl = fileData.metadata.downloadURLs[0]
          // to reach the specific item under the user id in the users array:
          // I can change any value with the update as below
          return firebase.database().ref('users').child(user.id).update({imageUrl: imageUrl})
        }).then(() => {
          // here we commit that to my local store
          Vue.console.log('setUser dans addProfilePicture');
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
            Vue.console.log(error);
          }
        )
      }
      else {
        commit('setLoading', false)
      }
    },

    autoSignIn ({commit}, payload) {
      commit('setUser', {
        id: payload.uid,
        email: payload.email
       })
    },

    logout ({commit}) {
      firebase.auth()
      .signOut()
      .then(() => {
        commit('setUser', null)
        router.push('/')
      })
      .catch(console.error)
    },

    fetchUsersEvents ({commit, getters}) {
      const events = getters.user.userEvents
      if (!events) return
      for (let evid of Object.values(events)) {
        firebase.database()
        .ref(`/events/${evid}`)
        .once('value')
        .then(snap => {
          const newEvent = {
            event: snap.val(),
            key:   snap.key,
            fbKey: snap.key
          }
          if (newEvent.event && newEvent.event.imageUrl) {
            commit('addEventToMyEvents', newEvent)
            commit('addEvent', newEvent)
          }
        })
      }
    },

    // ****************LOADUSERS FOR THE TESTS****************

    loadUsers ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('users').on('child_added', data => {
        // const users = []
        const userData = data.val()
        const fbKey = data.key
        const newUser = {
          id: userData.id,
          imageUrl: userData.imageUrl,
          firstName: userData.firstName,
          lastName: userData.lastName,
          fbKey: fbKey,
          userEvents: userData.userEvents
        }
        commit('addUser', newUser)
        commit('setLoading', false)
        commit('addEmail', {email: userData.email, id: userData.id})
      })
    },

    getUserData ({commit, getters}, payload) {
      commit('setLoading', true)
      const newUserEvents = []
      firebase.database().ref('users/' + payload.userId).once('value')
      .then( data => {
        Vue.console.log('[getUserData] payload.userId', payload.userId);
        const userData = data.val()
        const userEventsList = userData.userEvents
        Vue.console.log('[getUserData] data', userData);
        // ATTENTION THE FB KEY BELOW IS THE USER FBKEY AND NOT THE EVENT AS SENT TO THE STORE BELOW!!!!!!!!!!!!!!!!!
        const fbKey = data.key
        // const userEvents = []
        for (let item in userEventsList) {
          let eventId = userEventsList[item]
          firebase.database().ref('events/' + eventId).once('value')
          .then( data => {
            const eventData = data.val()
            const newEvent = {
              event: eventData,
              key: eventId,
              fbKey: eventId
            }
            newUserEvents.push(newEvent)
            commit('addEvent', newEvent)
          })
        }
      })
      .then( _ => {
        Vue.console.log('[getUserData] userEvents', newUserEvents);
        const newUser = {
          id: payload.userId,
          userEvents: newUserEvents
        }
        Vue.console.log('[getUserData] data', newUser);
        // users.push(newFriend)
        commit('updateUser', newUser)
        commit('setLoading', false)
      })
    },

    listenToProfileUpdate ({commit, getters}) {
      firebase.database().ref('users/' + getters.user.id).on('child_changed', data => {
        Vue.console.log('[listenToProfileUpdate] child_changed => data', data)

      })
    },

    updateProfile ({commit, getters}, payload) {
      let imageUrl
      if (payload.image) {
        firebase.storage().ref('users/' + payload.id + '.' + 'png').put(payload.image)
          .then( fileData => {
            this.imageUrl = fileData.metadata.downloadURLs[0]
            firebase.database().ref('users/' + payload.id).update({imageUrl: this.imageUrl})
            Vue.console.log('imageUrl', this.imageUrl);
          })
          .then( _=> {
            firebase.database().ref('users/' + payload.id).update({
              dateOfBirth: payload.dateOfBirth,
              livingIn: payload.livingIn,
              gender: payload.gender,
              email: payload.email,
              firstName: payload.firstName,
              lastName: payload.lastName
              })
            .then( _=> {
              commit('updateProfile', {payload: payload, imageUrl: this.imageUrl})
            })
          })
      } else {
        firebase.database().ref('users/' + payload.id).update({
          dateOfBirth: payload.dateOfBirth,
          livingIn: payload.livingIn,
          gender: payload.gender,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName
          })
          .then( _=> {
            commit('updateProfile', {payload: payload})
          })
      }

    },

    // ************** FRIENDSACTIONS****************
    cancelInvitation ({commit, getters}, fid) {
      commit('cancelInvitation', fid)
      firebase.database().ref(`/users/${getters.user.id}/pendingInvitations/${fid}`).remove()
    },
    sendFriendRequest ({commit, getters}, payload) {
      commit('setLoading', true)
      const friendId = payload
      const userId = getters.user.id
      // We check if the friend already exist on the pendingFriend list of the user
      if(getters.user.pendingFriends && getters.user.pendingFriends[friendId]) {
        Vue.console.log('Refused to add this friend as it already exist in the pendingFriends list!!!');
        commit('setLoading', false)
        return
      }
      // Send the friend an invitation to accept the friendship in his pending friends.
      firebase.database().ref(`/users/${friendId}/pendingFriends/${userId}`).set(true)
      // Add the friend id in the pending invitation's user
      firebase.database().ref(`/users/${userId}/pendingInvitations/${friendId}`).set(true)
      commit('addPendingInvitations', friendId)
      commit('setLoading', false)
    },

    acceptFriendRequest ({commit, getters}, fid) {
      // Vue.console.log('[acceptFriendRequest] payload', payload);
      const user = getters.user
      commit('setLoading', true)
      firebase.database().ref(`/users/${fid}/pendingInvitations/${user.id}`).remove()
      firebase.database().ref(`/users/${user.id}/pendingFriends/${fid}`).remove()
      if(getters.user.friends[fid]) {
        Vue.console.log('Refused to add this friend as it already exist in the friends list!!!');
        commit('setLoading', false)
        commit('removePendingFriendFromUser', fid)
        return
      }
      return Promise.all([
        firebase.database().ref(`/users/${user.id}/friends`).push(fid),
        firebase.database().ref(`/users/${fid}/friends`).push(user.id),
      //firebase.database().ref('/users/' + user.id + '/friends/' + fid).set(true),
      //firebase.database().ref('/users/' + fid + '/friends/' + user.id).set(true)
      ])
      .then(res => {
        commit('removePendingFriendFromUser', fid)
        Vue.console.debug('added friends')
      })
      .catch(error => {
        Vue.console.log(error);
      })
    },

    removeFriend ({commit, getters}, payload) {
      const friendId = payload.id
      const user = getters.user
      Vue.console.log('[removeFriend] payload', payload);
      // We remove the friend from the user's pending list
      firebase.database().ref('/users/' + user.id + '/friends').child(payload.fbKey).remove()
      // We update the store
      commit('removeFriendFromUser', friendId)
      // We need to get the firebase key of the user in the friend's list to remove it from his database.
      firebase.database().ref('/users/' + friendId + '/friends').once('value')
      .then( data => {
        const dataPairs = data.val()
        Vue.console.log('[removeFriend] dataPairs', dataPairs);
        for (let key in dataPairs) {
          if (dataPairs[key] === user.id) {
            Vue.console.log('[removeFriend] dans le for if (dataPairs[key] === user.id)', key)
            firebase.database().ref('/users/' + friendId + '/friends').child(key).remove()
          }
        }
      })
    },
    refuseFriend ({commit, getters}, payload) {
      const friendId = payload.id
      const user = getters.user
      Vue.console.log('[refuseFriend] payload', payload);
      // We remove the friend from the user's pending list
      firebase.database().ref('/users/' + user.id + '/pendingFriends').child(friendId).remove()
      // We update the store
      commit('removePendingFriendFromUser', friendId)
    },

    // ****************** REMOVE ITEMS FROM LOCAL STORE *********************

    listenToInvitationRemoval ({commit, getters}) {
      const userId = getters.user.id
      // Vue.console.log('[listenToInvitationRemoval] avant d ecouter le child_removed');
      firebase.database().ref('/users/' + userId + '/pendingInvitations').on('child_removed', data => {
        const friendId = data.val()
        // Vue.console.log('[listenToInvitationRemoval] data.val() du .on(child_removed before the removePendingInvitationFromUser', data.val())
        commit('removePendingInvitationFromUser', friendId)
      })
    },
    listenToFriendRemoval ({commit, getters}) {
      const userId = getters.user.id
      // Vue.console.log('[listenToFriendRemoval] avant d ecouter le child_removed');
      firebase.database().ref('/users/' + userId + '/friends').on('child_removed', data => {
        const friendId = data.val()
        Vue.console.log('[listenToFriendRemoval] data.val() du .on(child_removed before the removePendingInvitationFromUser', data.val())
        commit('removeFriendFromUser', friendId)
      })
    }
  },

  getters: {
    pendingFriends: (state, getters) => {
      if (!state.user || !state.user.pendingFriends) return []
      return Object.keys(state.user.pendingFriends).map(uid => {
        return getters.person(uid)
      })
    },
    notification: state => evid => state.user.notifications[evid],
    friendIsPending: state => uid => state.user.pendingFriends[uid] || false,
    user (state) {
      return state.user
    },
    users (state) {
      return state.users
    },
    emails (state) {
      return state.emails
    },
    getUser (state) {
      return (userId) => {
        return state.users.find((user) => {
          // Vue.console.log('[getUser] user', user);
          return user.id === userId
        })
      }
    },
    getUserData (state) {
      return (userId) => {
        return state.users.find((user) => {
          return user.id === userId
        })
      }
    }
  }
}
