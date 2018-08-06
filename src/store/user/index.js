import * as firebase from 'firebase'
import router from './../../router'

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
      // console.log('[removeEventFromUser] mutation payload', payload);
    },
    addProfilePicture (state, payload) {
      const user = payload.user
      if (payload.imageUrl) {
        user.imageUrl = payload.imageUrl
      }
    },
    addNotification (state, payload) {
      state.user.notifications.push(payload)
      // I REMOVED THE SORT AS I SORT IT ALREADY WITH FIREBASE ORDERBYCHILD()!!!
      // state.user.notifications.sort((notificationA, notificationB) => {
      //   // console.log('[mutations addNotification] notificationA, notificationB', notificationA, notificationB);
      //   return notificationA.dateToRank > notificationB.dateToRank
      // })
    },
    updateNotification (state, payload) {
      console.log('[updateNotification] check the payload', payload)
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
        return notificationA.dateToRank > notificationB.dateToRank
      })
      console.log('[updateNotification] notification', notification);
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
        // Vue.set(state.users[indexOfItem], 'imageUrl', payload.imageUrl)
        // state.users[indexOfItem] = Object.assign({}, state.users[indexOfItem], {imageUrl: payload.imageUrl})
        // state.users[indexOfItem].imageUrl = payload.imageUrl
      }
      if (payload.payload.gender) {
        state.user.gender = payload.payload.gender
        // state.users[indexOfItem].gender.splice(0, 1, payload.payload.gender)
      }
      if (payload.payload.livingIn) {
        state.user.livingIn = payload.payload.livingIn
        // state.users[indexOfItem].livingIn.splice(0, 1, payload.payload.livingIn)
        // console.log('[updateUser] payload.payload.livingIn');
      }
      if (payload.payload.dateOfBirth) {
        state.user.dateOfBirth = payload.payload.dateOfBirth
        // state.users[indexOfItem].livingIn.splice(0, 1, payload.payload.livingIn)
      }
    },
    updateUser (state, payload) {
      console.log('[updateUser] check the payload', payload)
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
      console.log('[updateuser] user', user);
    },
    addEventToMyEvents (state, payload) {
      state.user.events.push(payload)
      state.user.events.sort((eventA, eventB) => {
        return eventA.event.dateToRank > eventB.event.dateToRank
      })
    },
    setLoadedUsers (state, payload) {
      state.users = payload
    },
    addUser (state, payload) {
      if (state.users.findIndex(user => user.id === payload.id) < 0) {
        state.users.push(payload)
      }
    },
    createUser (state, payload) {
      state.users.push(payload)
      console.log('in mutation create user ', payload);
    },
    addPendingInvitations(state, payload) {
      const newFriend = payload
      const id = newFriend.id
      if (state.user.pendingInvitations) {
        if(state.user.pendingInvitations.findIndex(friend => friend.id === payload.id) >= 0) {
          console.log('Refused to add this friend as it already exist in the pendingInvitations list!!!');
          return
        }
        console.log('[addPendingInvitations] b4 pushing it => state.user.pendingInvitations', state.user.pendingInvitations);
        state.user.pendingInvitations.push(payload)
        console.log('[addPendingInvitations] after pushing it => state.user.pendingInvitations', state.user.pendingInvitations);

      }
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
    signInWithGoogle ({commit, getters}) {
      console.log('[signInWithGoogle]');
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log('[signInWithGoogle] user by google', user);
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
          console.log('[signUserIn] userData', userData);
          console.log('[signUserIn] userData.firstName', userData.firstName);

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
          console.log('[signUserIn] newUser b4 commit(setUser, newUser)', newUser);
          commit('setUser', newUser)
          commit('setLoading', false)
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
    checkUserFromGoogle ({commit, dispatch}, payload) {
      console.log('[checkUserFromGoogle] payload', payload)
      firebase.database().ref('users/' + payload.uid).once('value')
       .then( user =>{
         console.log('[checkUserFromGoogle] user', user.val());
         let userData = user.val()
         if (userData === null) {
           console.log('[checkUserFromGoogle] this user is new => userData === null', userData)
           dispatch('createUserFromGoogle', payload)
         } else {
           console.log('[checkUserFromGoogle] this user is NOT new')
           dispatch('fetchUserData')
           dispatch('fetchUsersEvents')
           dispatch('listenToNotifications')
           dispatch('listenToNotificationsChanges')
           dispatch('listenToInvitationRemoval')
           dispatch('listenToFriendRemoval')
         }
       })
    },
    createUserFromGoogle ({commit}, payload) {
        console.log('let create a user from google', payload);
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
        console.log('[signUserUpWithGoogle] setUser - newUser', newUser);
        commit('setUser', newUser)
        let id = payload.uid
        commit('setLoading', false)
        // Here below I create the user in the database of Firebase, not only Firebase's authentification as above
        firebase.database().ref('users/' + id).set(newUser)
        router.push('/welcome')
    },
    // getUserContacts () {
    //   gapi.load('client', this.start());
    // },
    // start () {
    //   var client = payload.user
    //   console.log('gapi.client', gapi.client);
    //   // 2. Initialize the JavaScript client library.
    //   gapi.client.init({
    //     'apiKey': 'AIzaSyCv2i8Das8W3j2xw5cj7VN7-dcJJVekbiY',
    //     // Your API key will be automatically added to the Discovery Document URLs.
    //     'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
    //     // clientId and scope are optional if auth is not required.
    //     'clientId':'1059834656960-8573une98ud5of3cb66iolj2c7gtuvbc.apps.googleusercontent.com',
    //     'scope': 'profile',
    //   }).then(function() {
    //     // 3. Initialize and make the API request.
    //     return gapi.client.people.people.get({
    //       'resourceName': 'people/me',
    //       'requestMask.includeField': 'person.names'
    //     });
    //   }).then(function(response) {
    //     console.log(response.result);
    //   }, function(reason) {
    //     console.log('Error: ' + reason.result.error.message);
    //   });
    // },
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

    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      let events = []
      let friends = []
      let notifications = []
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
        // console.log('[fetchUserData] userData', userData);
        if (!getters.user.imageUrl) {
          this.imageUrl = userData.imageUrl
        }
        else {
          // console.log('[fetchUserData] image prise est this.imageUrl = getters.user.imageUrl');
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

        console.log('[fetchUserData] this.email', this.email);
      })
      .then( _=>{
        // Fetch the user's ****FRIENDS**** from Firebase and store it in the local store
        firebase.database().ref('/users/' + getters.user.id + '/friends/').on('child_added', data => {
          const userId = data.val()
          const fbKey = data.key
          firebase.database().ref('/users/' + userId).once('value').then(data =>{
              const friendData = data.val()
              const newFriend = {
                id: friendData.id,
                imageUrl: friendData.imageUrl,
                firstName: friendData.firstName,
                lastName: friendData.lastName,
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
              firstName: friendData.firstName,
              lastName: friendData.lastName,
              fbKey: fbKey
              }
            pendingFriends.push(newFriend)
            })
          })
        })
        .then(_=> {
          firebase.database().ref('/users/' + getters.user.id + '/pendingInvitations/').on('child_added', data => {
            // Fetch the user's ****PENDINGINVITAITONS**** from Firebase and store it in the local store
            // console.log('[fetchUserData] onChildAdded pour pendingInvitations => data.val()',  data.val());
            const userId = data.val()
            const fbKey = data.key
            firebase.database().ref('/users/' + userId).once('value').then(data =>{
              const friendData = data.val()
              const newFriend = {
                id: friendData.id,
                fbKey: fbKey
                }
              // commit('addPendingInvitations', newFriend)
              pendingInvitations.push(newFriend)

              })
            })
        })
        .then( _=> {
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
            notifications: notifications,
            pendingFriends: pendingFriends,
            pendingInvitations: pendingInvitations
          }
          console.log('[fetchUserData] updatedUser b4 commit(setUser, updatedUser)', updatedUser);
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
      firebase.database().ref('/users/' + getters.user.id + '/userEvents/').on('child_added', data => {
        const key = data.val()
        const fbKey = data.key
        // console.log('[fetchUsersEvents] fbKey - key', fbKey, key);
        firebase.database().ref('/events/' + key).once('value').then(data =>{
          const eventData = data.val()
          const newEvent = {
            event: eventData,
            key: key,
            fbKey: fbKey
          }
          if (newEvent.event.imageUrl) {
            //console.log('[fetchUsersEvents] b4 commit add event => newEvent', newEvent);
            commit('addEventToMyEvents', newEvent)
            // I add the event already with a pic event so the new one created will come from the createEvent
            // console.log('[fetchUsersEvents] b4 commit addevent => newEvent', newEvent);
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
        const newUser = {
          id: userData.id,
          imageUrl: userData.imageUrl,
          firstName: userData.firstName,
          lastName: userData.lastName,
          fbKey: fbKey,
          userEvents: userData.userEvents
        }
        // users.push(newFriend)
        commit('addUser', newUser)
        commit('setLoading', false)
        })
    },

    getUserData ({commit, getters}, payload) {
      commit('setLoading', true)
      const newUserEvents = []
      firebase.database().ref('users/' + payload.userId).once('value')
      .then( data => {
        console.log('[getUserData] payload.userId', payload.userId);
        const userData = data.val()
        const userEventsList = userData.userEvents
        console.log('[getUserData] data', userData);
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
        console.log('[getUserData] userEvents', newUserEvents);
        const newUser = {
          id: payload.userId,
          userEvents: newUserEvents
        }
        console.log('[getUserData] data', newUser);
        // users.push(newFriend)
        commit('updateUser', newUser)
        commit('setLoading', false)
      })
    },

    listenToProfileUpdate ({commit, getters}) {
      firebase.database().ref('users/' + getters.user.id).on('child_changed', data => {
        console.log('[listenToProfileUpdate] child_changed => data', data)

      })
    },

    updateProfile ({commit, getters}, payload) {
      let imageUrl
      if (payload.image) {
        firebase.storage().ref('users/' + payload.id + '.' + 'png').put(payload.image)
          .then( fileData => {
            this.imageUrl = fileData.metadata.downloadURLs[0]
            firebase.database().ref('users/' + payload.id).update({imageUrl: this.imageUrl})
            console.log('imageUrl', this.imageUrl);
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
      console.log('**********!!!!!!!!! adding friend to user');
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
      // We need to get the firebase key of the user in the friend's list to remove it from his database.
      firebase.database().ref('/users/' + friendId + '/friends').once('value')
      .then( data => {
        const dataPairs = data.val()
        console.log('[removeFriend] dataPairs', dataPairs);
        for (let key in dataPairs) {
          if (dataPairs[key] === user.id) {
            console.log('[removeFriend] dans le for if (dataPairs[key] === user.id)', key)
            firebase.database().ref('/users/' + friendId + '/friends').child(key).remove()
          }
        }
      })
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
      // console.log('[listenToInvitationRemoval] avant d ecouter le child_removed');
      firebase.database().ref('/users/' + userId + '/pendingInvitations').on('child_removed', data => {
        const friendId = data.val()
        // console.log('[listenToInvitationRemoval] data.val() du .on(child_removed before the removePendingInvitationFromUser', data.val())
        commit('removePendingInvitationFromUser', friendId)
      })
    },
    listenToFriendRemoval ({commit, getters}) {
      const userId = getters.user.id
      // console.log('[listenToFriendRemoval] avant d ecouter le child_removed');
      firebase.database().ref('/users/' + userId + '/friends').on('child_removed', data => {
        const friendId = data.val()
        console.log('[listenToFriendRemoval] data.val() du .on(child_removed before the removePendingInvitationFromUser', data.val())
        commit('removeFriendFromUser', friendId)
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
