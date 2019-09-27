import Vue from 'vue'
import router from './../../router'
const firebase = window.firebase
/* eslint-disable */
export default {
  state: {
    signUpForm: {},
    creatingFromEmail: false,
    listeningToProfile: false,
    listeningToFeed: false,
    user: null,
    users: [],
    feed: [],
    emails: []
  },
  mutations: {
    AddNewNotification(state, payload) {
      Vue.console.log('addnewnoti', payload.d)
      const notifications = [...state.feed]
      notifications.push(payload)
      state.feed = notifications
    },
    removeEventFromUser(state, payload) {
      // @TODO remove me later - events sync
      const events = state.user.userEvents
      events.splice(events.findIndex(event => event.key === payload), 1)
      Reflect.deleteProperty(state.user.userEvents, payload)
    },
    addProfilePicture(state, payload) {
      const user = payload.user
      if (payload.imageUrl) {
        user.imageUrl = payload.imageUrl
      }
    },
    updateNotifications(state, payload) {
      if (!payload.key) return
      const noti = {}
      noti[payload.key] = payload
      state.user.notifications = {
        ...state.user.notifications || {},
        ...noti
      }
    },
    addNotification(state, payload) {
      state.user.notifications.push(payload)
      // I REMOVED THE SORT AS I SORT IT ALREADY WITH FIREBASE ORDERBYCHILD()!!!
      state.user.notifications.sort((notificationA, notificationB) => {
        // Vue.console.log('[mutations addNotification] notificationA, notificationB', notificationA, notificationB);
        return notificationA.dateToRank - notificationB.dateToRank
      })
    },
    updateNotification(state, payload) {
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
    updateProfile(state, payload) {
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
    updateUser(state, payload) {
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
    addEventToMyEvents(state, payload) {
      state.user.events = state.user.events || []
      state.user.events.push(payload)
      state.user.events.sort((eventA, eventB) => {
        return eventA.event.dateToRank - eventB.event.dateToRank
      })
    },
    setLoadedUsers(state, payload) {
      state.users = payload
      Vue.console.log('[setLoadedUsers] state.users', state.users);
    },
    addUser(state, payload) {
      if (state.users.findIndex(user => user.id === payload.id) < 0) {
        state.users.push(payload)
      }
    },
    addEmail(state, payload) {
      // Vue.console.log('[addEmail]');
      if (state.emails.findIndex(user => user.id === payload.id) < 0) {
        state.emails.push(payload)
        // Vue.console.log('[addEmail] state.emails', state.emails);
      }
    },
    createUser(state, payload) {
      state.users.push(payload)
      Vue.console.log('in mutation create user ', payload);
    },
    addPendingInvitations(state, fid) {
      if (state.user.pendingInvitations) {
        if (state.user.pendingInvitations && state.user.pendingInvitations[fid]) {
          Vue.console.log('Refused to add this friend as it already exist in the pendingInvitations list!!!');
          return
        }
        Vue.set(state.user.pendingInvitations, fid, true)
      }
    },
    addPendingFriendToUser(state, payload) {
      const newFriend = payload

      if (state.user.pendingFriends[newFriend.id]) {
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
      const pendingInvitations = {
        ...state.user.pendingInvitations
      }
      delete(pendingInvitations[fid])
      state.user.pendingInvitations = pendingInvitations
    },
    removeFriendFromUser(state, payload) {
      const friends = {
        ...state.user.friends
      }
      delete(friends[payload])
      Vue.set(state.user, 'friends', friends)
    },
    setUser(state, payload) {
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
    reloadMyEvents({ commit, state, getters }) {
      if (!getters.user) return
      firebase.database().ref(`users/${getters.user.id}/userEvents`).once('value')
      .then(snap => {
        if (!snap.exists()) return
        commit('setUser', {
          ...getters.user,
          userEvents: snap.val()
        })
      })
      .catch(this.$debug)
    },
    installApp() {
      if (window.installPromptEvent) {
        window.installPromptEvent.prompt()
      }
    },

    // ***************SINGIN********************
    signInWithGoogle({ commit, getters }) {
      Vue.console.log('[signInWithGoogle]');
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((result) => {
        var token = result.credential.accessToken;
        var user = result.user;
        Vue.console.log('[signInWithGoogle] user by google', user);
      }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
      });
    },

    signUserIn({ commit, dispatch }, payload) {
      commit('setLoading', true)
      commit('clearError')
      return firebase.auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        return Promise.resolve()
      })
      .catch(error => {
        commit('setError', error)
        return Promise.reject(error)
      })
      .finally(() => {
        commit('setLoading', false)
      })
    },
    async checkUserFromGoogle ({ commit, dispatch, state }, payload) {
      Vue.console.log('[checkUserFromGoogle]', payload)
      const user = await firebase.database().ref('users/' + payload.uid).once('value')
      dispatch('installApp')
      let userData = user.val()
      if (userData === null) { // I just signed up using password of oauth
        const provider = payload.providerData[0].providerId
        let newUser = {
          id: payload.uid,
          email: payload.email,
          events: [],
          friends: [],
          pendingFriends: {},
          pendingInvitations: {},
        }
        if (provider === 'password') {
          newUser = {
            ...newUser,
            firstName: state.signUpForm.firstName,
            lastName: state.signUpForm.lastName,
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/iwtapplication.appspot.com/o/default_avatar.png?alt=media&token=245e435c-c87b-4af3-8688-a6469500b7de'
          }
        } else if (provider === 'google.com') {
          const [firstName, ...lastName] = payload.displayName.split(' ')
          newUser = {
            ...newUser,
            firstName: firstName,
            lastName: lastName.join(' '),
            imageUrl: payload.photoURL
          }
        }
        const usersnap = await firebase.database().ref(`users/${newUser.id}`).set(newUser)
        commit('setUser', newUser)
        commit('setLoading', false)
        dispatch('iwtClicked', 'defaultevent')
     // dispatch('listenToMyFeed')
     // dispatch('listenToProfileUpdate')
     // dispatch('listenToEvents')
        const {return_to_event} = localStorage
        if (return_to_event) {
          localStorage.removeItem('return_to_event')
          await dispatch('iwtClicked',return_to_event)
          location.pathname = `/events/${return_to_event}`
        } else {
          location.pathname = '/welcome'
        }
      } else {
        const friends = {}
        for (let friendid of Object.values(userData.friends || {})) {
          friends[friendid] = friendid
        }
        commit('setUser', {
          ...userData,
          photoUrl: userData.imageURL,
          friends
        })
        Vue.console.log('[checkUserFromGoogle] this user is NOT new')
        const ids = new Set([...Object.keys(userData.pendingFriends || {}), ...Object.keys(userData.pendingInvitations || {}), ...Object.values(friends || {})])
        await dispatch('loadPersons', Array.from(ids))
        await dispatch('setupMessagingAndToken')
        await dispatch('listenToMyFeed')
        await dispatch('listenToProfileUpdate')
        await dispatch('listenToEvents')
        if (location.pathname==='/') {
          router.push('/notifications')
        }
      }
      return Promise.resolve()
    },
    async signUserUp({ commit, dispatch,state }, payload) { // this creates the user from sign up form
      commit('setLoading', true)
      commit('clearError')
      state.creatingFromEmail = true
      try {
        state.signUpForm = payload
        const user = await firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        return true
        // ------------------
        const newUser = {
          id: user.user.uid,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          events: [],
          friends: [],
          pendingFriends: {},
          pendingInvitations: {},
          imageUrl: 'https://firebasestorage.googleapis.com/v0/b/iwtapplication.appspot.com/o/default_avatar.png?alt=media&token=245e435c-c87b-4af3-8688-a6469500b7de'
        }
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error)
        Vue.console.log(error);
        return Promise.reject()
      }
    },

    //*****************************************************
    addProfilePicture({ commit, getters }, payload) {
      if (payload.image != "") {
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
          return firebase.database().ref('users').child(user.id).update({
            imageUrl: imageUrl
          })
        })
        .then(() => {
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
      } else {
        commit('setLoading', false)
      }
    },

    logout({ commit }) {
      firebase.auth()
      .signOut()
      .then(() => {
        commit('setUser', null)
        location.href = '/'
      })
      .catch(console.error)
    },

    fetchUsersEvents({ commit, getters }) {
      return
      const events = getters.user.userEvents
      if (!events) return
      for (let evid of Object.values(events)) {
        firebase.database()
          .ref(`/events/${evid}`)
          .once('value')
          .then(snap => {
            const newEvent = {
              event: snap.val(),
              key: snap.key,
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


    async getUserData({ commit, getters }, payload) {
      commit('setLoading', true)
      const newUserEvents = []
      const data = await firebase.database().ref('users/' + payload.userId).once('value')
      Vue.console.log('[getUserData] payload.userId', payload.userId);
      const userData = data.val()
      const userEventsList = userData.userEvents
      Vue.console.log('[getUserData] data', userData);
      // ATTENTION THE FB KEY BELOW IS THE USER FBKEY AND NOT THE EVENT AS SENT TO THE STORE BELOW!!!!!!!!!!!!!!!!!
      const fbKey = data.key
      // const userEvents = []
      for (let item in userEventsList) {
        let eventId = userEventsList[item]
        const eventData = (await firebase.database().ref('events/' + eventId).once('value')).val()
        const newEvent = {
          event: eventData,
          key: eventId,
          fbKey: eventId
        }
        newUserEvents.push(newEvent)
        commit('addEvent', newEvent)
      }
      Vue.console.log('[getUserData] userEvents', newUserEvents);
      const newUser = {
        id: payload.userId,
        userEvents: newUserEvents
      }
      Vue.console.log('[getUserData] data', newUser);
      // users.push(newFriend)
      commit('updateUser', newUser)
      commit('setLoading', false)
    },
    listenToMyFeed({ commit, getters, state }) {
      if (state.listeningToFeed) return
      state.listeningToFeed = true
      return firebase.firestore().collection(`/notifications/${getters.user.id}/list`)
      .orderBy('d', 'desc').limit(10)
      .onSnapshot(snap => {
        if (snap.empty) return;
        this.lastNotiSnap = snap
        snap.docChanges().forEach(change => {
          commit('AddNewNotification', change.doc.data())
        })
      })
    },
    listenToProfileUpdate({ commit, dispatch, getters, state }) {
      if (state.listeningToProfile) return
      state.listeningToProfile = true
      firebase.database().ref('users/' + getters.user.id).on('child_changed', (child_snap, prevChildKey) => {
        Vue.console.debug('[listenToProfileUpdate] ', child_snap.val(), child_snap.key)
        const copy = {
          ...state.user
        }
        copy[child_snap.key] = child_snap.val()
        commit('setUser', {
          ...state.user,
          [child_snap.key]: child_snap.val()
        })
      })
    },

    updateProfile({ commit, getters }, payload) {
      let imageUrl
      if (payload.image) {
        return firebase.storage().ref('users/' + payload.id + '.' + 'png').put(payload.image)
        .then(fileData => {
          this.imageUrl = fileData.metadata.downloadURLs[0]
          Vue.console.log('imageUrl', this.imageUrl);
          commit('updateProfile', {
            payload: payload,
            imageUrl: this.imageUrl
          })
          return firebase.database().ref('users/' + payload.id).update({
            imageUrl: this.imageUrl
          })
        })
        .then(_ => {
          return firebase.database().ref('users/' + payload.id).update({
              dateOfBirth: payload.dateOfBirth,
              livingIn: payload.livingIn,
              gender: payload.gender,
              email: payload.email,
              firstName: payload.firstName,
              lastName: payload.lastName
            })
        })
        .catch(console.error)
      } else {
        commit('updateProfile', { payload: payload })
        return firebase.database().ref('users/' + payload.id).update({
          dateOfBirth: payload.dateOfBirth,
          livingIn: payload.livingIn,
          gender: payload.gender,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName
        })
      }
    },

    // ************** FRIENDSACTIONS****************
    cancelInvitation({ commit, getters }, fid) {
      commit('cancelInvitation', fid)
      firebase.database().ref(`/users/${getters.user.id}/pendingInvitations/${fid}`).remove()
    },
    sendFriendRequest({ commit, dispatch, getters }, payload) {
      commit('setLoading', true)
      const friendId = payload
      const userId = getters.user.id
      // We check if the friend already exist on the pendingFriend list of the user
      if (getters.user.pendingFriends && getters.user.pendingFriends[friendId]) {
        Vue.console.log('Refused to add this friend as it already exist in the pendingFriends list!!!');
        commit('setLoading', false)
        return
      }
      return Promise.all([
          // Send the friend an invitation to accept the friendship in his pending friends.
          firebase.database().ref(`/users/${friendId}/pendingFriends/${userId}`).set(true),
          // Add the friend id in the pending invitation's user
          firebase.database().ref(`/users/${userId}/pendingInvitations/${friendId}`).set(true)
        ])
        .then(() => {
          commit('addPendingInvitations', friendId)
          commit('setLoading', false)
          return dispatch('loadPersons', [friendId])
        })
        .catch(Vue.console.error)
    },

    acceptFriendRequest({ commit, getters }, fid) {
      // Vue.console.log('[acceptFriendRequest] payload', payload);
      const user = getters.user
      commit('setLoading', true)
      firebase.database().ref(`/users/${fid}/pendingInvitations/${user.id}`).remove()
      firebase.database().ref(`/users/${user.id}/pendingFriends/${fid}`).remove()
      if (getters.user.friends[fid]) {
        Vue.console.log('Refused to add this friend as it already exist in the friends list!!!');
        commit('setLoading', false)
        commit('removePendingFriendFromUser', fid)
        return
      }
      return Promise.all([
          firebase.database().ref(`/users/${user.id}/friends/${fid}`).set(fid),
          firebase.database().ref(`/users/${fid}/friends/${user.id}`).set(user.id),
        ])
        .then(res => {
          commit('removePendingFriendFromUser', fid)
          Vue.console.debug('added friends')
        })
        .catch(error => {
          Vue.console.log(error);
        })
    },

    removeFriend({ commit, getters }, payload) {
      const friendId = payload.id
      const user = getters.user
      Vue.console.debug('[removeFriend] payload', payload);
      firebase.database().ref('/users/' + user.id + '/friends').child(friendId).remove()
      commit('removeFriendFromUser', friendId)
    },
    refuseFriend({ commit, getters }, friendId) {
      const user = getters.user
      Vue.console.log('[refuseFriend] payload', friendId);
      // We remove the friend from the user's pending list
      firebase.database().ref('/users/' + user.id + '/pendingFriends').child(friendId).remove()
      // We update the store
      commit('removePendingFriendFromUser', friendId)
    },

    // ****************** REMOVE ITEMS FROM LOCAL STORE *********************

    listenToFriendRemoval({ commit, getters }) {
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
    user(state) {
      return state.user
    },
    users(state) {
      return state.users
    },
    emails(state) {
      return state.emails
    },
    getUser(state) {
      return (userId) => {
        return state.users.find((user) => {
          // Vue.console.log('[getUser] user', user);
          return user.id === userId
        })
      }
    },
    getUserData(state) {
      return (userId) => {
        return state.users.find((user) => {
          return user.id === userId
        })
      }
    }
  }
}
