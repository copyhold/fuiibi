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
      const user = state.users.find(user => {
        return user.id === payload.id
      })
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
    addPendingInvitations(state, payload) {
      const newFriend = payload
      const id = newFriend.id
      if (state.user.pendingInvitations) {
        if(state.user.pendingInvitations.findIndex(friend => friend.id === payload.id) >= 0) {
          Vue.console.log('Refused to add this friend as it already exist in the pendingInvitations list!!!');
          return
        }
        Vue.console.log('[addPendingInvitations] b4 pushing it => state.user.pendingInvitations', state.user.pendingInvitations);
        state.user.pendingInvitations.push(payload)
        Vue.console.log('[addPendingInvitations] after pushing it => state.user.pendingInvitations', state.user.pendingInvitations);

      }
    },
    addPendingFriendToUser(state, payload) {
      const newFriend = payload
      if(state.user.pendingFriends.findIndex(user => user.id === newFriend.id) >= 0) {
        Vue.console.log('Refused to add this friend as it already exist in the pendingFriends list!!!');
        return
      }
      Vue.console.log('[addPendingFriendToUser] state.user', state.user)
      state.user.pendingFriends.push(newFriend)
      // Below we use the fbKey created by firebase to give an id of the element on our store, so that it's then easy to unregister if needed.
      // state.user.fbKeysPendingFriends[newFriend.id] = payload.fbKey
    },
    removePendingFriendFromUser(state, payload) {
      const pendingFriends = state.user.pendingFriends
      // Below we check if we can find the friend that need to be removed from the pendingfriends. We check in the list of pendingfriends of the user if we can find it
      // With the splice, we get back a numer of element, here only the friend.id that need to be removed
      // Vue.console.log('[removePendingFriendFromUser] BEFORE REMOVAL pendingFriends', pendingFriends);
      pendingFriends.splice(pendingFriends.findIndex(friend => friend.id === payload), 1)
      // To erase this meetup from the list in the store, we need to use the reflect.deleteProperty from JS,
      // passing where? state.user.fbKeys and what? the payload as it's the user.id
      Reflect.deleteProperty(state.user.pendingFriends, payload)
      // Vue.console.log('[removePendingFriendFromUser] AFTER REMOVAL pendingFriends', pendingFriends);
    },
    removePendingInvitationFromUser(state, payload) {
      const pendingInvitations = state.user.pendingInvitations
      pendingInvitations.splice(pendingInvitations.findIndex(friend => friend.id === payload), 1)
      Reflect.deleteProperty(state.user.pendingInvitations, payload)
    },
    removeFriendFromUser(state, payload) {
      console.log("[removeFriendFromUser] friend should be removed from user...");
      const friends = state.user.friends
      friends.splice(friends.findIndex(friend => friend.id === payload), 1)
      Reflect.deleteProperty(state.user.friends, payload)
    },
    setUser (state, payload) {
      state.user = payload
      if (payload != null) {
        state.email = payload.email
        Vue.console.debug('state.email', state.email);
        Vue.console.debug('payload of the state.user in the setUser', payload);
      }
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
      .then(
        user => {
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
          commit('setLoading', false)
        }
      )
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          Vue.console.log(error);
        }
      )
    },
    checkUserFromGoogle ({commit, dispatch}, payload) {
      Vue.console.log('[checkUserFromGoogle] payload', payload)
      firebase.database().ref('users/' + payload.uid).once('value')
       .then( user =>{
         Vue.console.log('[checkUserFromGoogle] user', user.val());
         let userData = user.val()
         if (userData === null) {
           Vue.console.log('[checkUserFromGoogle] this user is new => userData === null', userData)
           dispatch('createUserFromGoogle', payload)
         } else {
           Vue.console.log('[checkUserFromGoogle] this user is NOT new')
           dispatch('fetchUserData')
           dispatch('fetchUsersEvents')
           dispatch('listenToNotificationsChanges')
           dispatch('listenToInvitationRemoval')
           dispatch('listenToFriendRemoval')
         }
       })
    },
    createUserFromGoogle ({commit}, payload) {
        Vue.console.log('let create a user from google', payload);
        let firstName = payload.displayName.substr(0,payload.displayName.indexOf(' '));
        let lastName = payload.displayName.substr(payload.displayName.indexOf(' ')+1);
        commit('setLoading', true)
        const newUser = {
          id: payload.uid,
          email: payload.email,
          firstName: firstName,
          lastName: lastName,
          notifications: [],
          events: [],
          friends: [],
          pendingFriends: [],

          //*********************************************************
          imageUrl: payload.photoURL
        }
        Vue.console.log('[signUserUpWithGoogle] setUser - newUser', newUser);
        commit('setUser', newUser)
        let id = payload.uid
        commit('setLoading', false)
        // Here below I create the user in the database of Firebase, not only Firebase's authentification as above
        firebase.database().ref('users/' + id).set(newUser)
        router.push('/welcome')
    },
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
      firebase.auth().signOut()
      commit('setUser', null)
    },

    // ***********FETCHUSERDATA************************
    fetchUserData ({commit, getters, dispatch}) {
      commit('setLoading', true)
      let events = []
      let friends = []
      let firstName = ''
      let email = ''
      let lastName = ''
      let imageUrl = ''
      let dateOfBirth = ''
      let gender = ''
      let livingIn = {}
      let pendingFriends = []
      let pendingInvitations = []

      // Here below we use promise to get the info one after the other and send everything to the local storage once everything has been received
      // Fetch the firstName and userImage
      firebase.database().ref('/users/' + getters.user.id).once('value')
      .then(data => {
        const userData = data.val()
        if (!getters.user.imageUrl) {
          this.imageUrl = userData.imageUrl
        }
        else {
          this.imageUrl = getters.user.imageUrl
        }
        this.firstName = userData.firstName
        this.lastName = userData.lastName
        this.email = userData.email
        if (!getters.user.livingIn) {
          this.livingIn = userData.livingIn
        }
        if (!getters.user.gender) {
          this.gender = userData.gender
        }
        if (!getters.user.gender) {
          this.dateOfBirth = userData.dateOfBirth
        }

        const promises = [
          firebase.database().ref('/users/' + getters.user.id + '/friends/').once('value'),
          firebase.database().ref('/users/' + getters.user.id + '/pendingFriends/').once('value'),
          firebase.database().ref('/users/' + getters.user.id + '/pendingInvitations/').once('value')
        ]
        return Promise.all(promises)
      })
      .then(data => {
        return Promise.all(data.map(snap  => {
          if (!snap.exists()) return []
          return Promise.all( Object.values(snap.val()).filter(val => val!==true).map( id => firebase.database().ref(`/users/${id}`).once('value')))
        }))
      })
      .then(([fr, pfr, pinv]) => {
        friends = fr.map(snap => {
          return {
            id:        snap.val().id,
            imageUrl:  snap.val().imageUrl,
            firstName: snap.val().firstName,
            lastName:  snap.val().lastName,
            fbKey:     'friends'
          }
        })
        pendingFriends = pfr.map(snap => {
          return {
            id:        snap.val().id,
            imageUrl:  snap.val().imageUrl,
            firstName: snap.val().firstName,
            lastName:  snap.val().lastName,
            fbKey:     'friends'
          }
        })
        pendingInvitations = pinv.map(fr => {
          return {
            id:        fr.val().id,
            imageUrl:  fr.val().imageUrl,
            firstName: fr.val().firstName,
            lastName:  fr.val().lastName,
            fbKey:     'friends'
          }
        })
        const updatedUser = {
          id: getters.user.id,
          imageUrl: this.imageUrl,
          firstName: this.firstName,
          email: this.email,
          dateOfBirth: this.dateOfBirth,
          gender: this.gender,
          livingIn: this.livingIn,
          lastName: this.lastName,
          events: events,
          friends: friends,
          notifications: {},
          pendingFriends: pendingFriends,
          pendingInvitations: pendingInvitations
        }
        Vue.console.log('[fetchUserData] updatedUser b4 commit(setUser, updatedUser)', updatedUser);
        commit('setUser', updatedUser)
        dispatch('setupMessagingAndToken')
        dispatch('listenToNotifications')
      })
      .catch(error => {
        Vue.console.log(error)
      })
      .finally(() => commit('setLoading', false))
    },

    fetchUsersEvents ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/userEvents/').on('child_added', data => {
        const key = data.val()
        const fbKey = data.key
        // Vue.console.log('[fetchUsersEvents] fbKey - key', fbKey, key);
        firebase.database().ref('/events/' + key).once('value').then(data =>{
          const eventData = data.val()
          const newEvent = {
            event: eventData,
            key: key,
            fbKey: fbKey
          }
          if (newEvent.event.imageUrl) {
            //Vue.console.log('[fetchUsersEvents] b4 commit add event => newEvent', newEvent);
            commit('addEventToMyEvents', newEvent)
            // I add the event already with a pic event so the new one created will come from the createEvent
            // Vue.console.log('[fetchUsersEvents] b4 commit addevent => newEvent', newEvent);
            commit('addEvent', newEvent)
          }
          commit('setLoading', false)
        })
        .catch(error => {
          Vue.console.log(error)
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

    // **************ACTIONS****************

    sendFriendRequest ({commit, getters}, payload) {
      commit('setLoading', true)
      const friendId = payload
      const userId = getters.user.id
      // We check if the friend already exist on the pendingFriend list of the user
      if(getters.user.pendingFriends.findIndex(user => userId === payload) >= 0) {
        Vue.console.log('Refused to add this friend as it already exist in the pendingFriends list!!!');
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
      // Vue.console.log('[acceptFriendRequest] payload', payload);
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
        // Vue.console.log('[acceptFriendRequest] dataPairs', dataPairs);
        for (let key in dataPairs) {
          if (dataPairs[key] === user.id) {
            // Vue.console.log('[acceptFriendRequest] dans le for if (dataPairs[key] === user.id)', key)
            firebase.database().ref('/users/' + friendId + '/pendingInvitations').child(key).remove()
          }
        }
        commit('setLoading', false)
      })
      // We check if the friend already exist on the friend list of the user
      if(getters.user.friends.findIndex(user => user.id === payload) >= 0) {
        Vue.console.log('Refused to add this friend as it already exist in the friends list!!!');
        commit('setLoading', false)
        return
      }
      // We push the friendID to the user's friend list
      Vue.console.log('**********!!!!!!!!! adding friend to user');
      Promise.all([
        firebase.database().ref('/users/' + user.id + '/friends/' + friendId).set(true),
        firebase.database().ref('/users/' + user.id + '/friends').push(friendId),
        // Add user to friend
        firebase.database().ref('/users/' + friendId + '/friends').push(user.id),
        firebase.database().ref('/users/' + friendId + '/friends/' + user.id).set(true)
      ])
      .then(res => console.debug('added friends'))
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
      firebase.database().ref('/users/' + user.id + '/pendingFriends').child(payload.fbKey).remove()
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
    notification: state => evid => state.user.notifications[evid],
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
