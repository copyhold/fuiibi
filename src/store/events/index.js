import Vue from 'vue'
import router from './../../router'
/* eslint-disable */
// Here we are not eporting anymore a store, it's done in the index.js of the all store, so we export a normal JS object
// export const store = new Vuex.Store({
const firebase = global.firebase
export default {
  state: {
    loadedNotifications: [],
    currentEvent: null,
    myevents: [],
    events: []
  },
  mutations: {
    add_event_to_collection (state, eventData) {
      const eventscopy  = [ ...state.myevents ]
      eventscopy.push(eventData)
      eventscopy.sort((a,b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime())
      state.myevents = eventscopy
    },
    remove_event_from_collection (state, eventData) {
    },
    my_events_updated (state, events) {
      state.myevents = events
    },
    emptyEvents () {
      state.events = []
    },
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
    load_my_events (store) {
      if (!store.getters.user) return
      const fb_function = firebase.functions().httpsCallable('loadUserEvents')
      fb_function({ uid: store.getters.user.id })
      .then(response => {
        store.commit('my_events_updated', response.data)
      })
      .catch(Vue.console.$error)
    },
    loadUserEvents (store, who) {
      Vue.console.log('loading events', who, store.getters.user)
      if (who==='current user') {
        if (store.getters.user) {
          store.commit('setLoading', false)
          who = store.getters.user.id
        } else {
          store.commit('setLoading', true)
          setTimeout(() => store.dispatch('loadUserEvents', who), 100)
          return
        }
      }
      store.commit('setLoading', true)
      const uid = who
      firebase.functions()
      .httpsCallable('loadUserEvents')({ uid })
      .then(response => {
        store.commit('updatePerson', { uid, userEvents: response.data })
        store.commit('setLoading', false)
      })
      .catch(err => {
        Vue.console.error('Can not loadUserEvents for:' , uid)
      })
    },
    setCurrentEvent (store, id) {
      firebase.database()
      .ref(`/events/${id}`)
      .once('value')
      .then(res => {
        const event = res.val()
        event.id = id
        store.dispatch('loadPersons', Object.values(event.users))
        store.commit('setCurrentEvent', event)
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
      const eventId = payload.id
      const user = getters.user
      commit('setLoading', true)
      // We remove the event from the user's list
      firebase.functions().httpsCallable('removeEventFromUser')({ evid: eventId, uid: user.id })
      commit('removeEventFromUser', eventId)
      commit('setLoading', false)
    },
    uploadPictures: async function (store, {files}) {
      const currentEvent = store.state.currentEvent
      if (!currentEvent) {
        return null
      }
      for (let file of files) {
        const storedFile = await firebase.storage().ref(`events/${Math.round(Math.random() * 10000)}-${file.name}`).put(file)
        const imageUrl = await storedFile.ref.getDownloadURL()
        await firebase.database().ref(`/events/${currentEvent.id}/pictures`).push({ uid: store.getters.user.id, imageUrl: imageUrl })
      }
      store.dispatch('setCurrentEvent', currentEvent.id)
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
      const noti = store.rootGetters.notification(evid)
      if (!noti) return
      firebase.database().ref(`/events/${evid}`).once('value')
      .then(data => {
        noti.event = data.val()
        commit('updateNotifications', noti)
      })
      .catch(Vue.console.error)
    },
    listenToEvents ({commit, getters, dispatch}) {
      const ref = firebase.database().ref(`users/${getters.user.id}/userEvents/`)
      ref.on('child_added', async snap => {
        const eventSnap = await firebase.database().ref(`events/${snap.val()}`).once('value')
        if (!eventSnap.exists()) return
        commit('add_event_to_collection', { ...eventSnap.val(), id: eventSnap.key })
        return Promise.resolve()
      })
      ref.on('child_removed', snap => {
        commit('remove_event_from_collection', snap.val())
      })
    },
    listenToNotifications ({commit, getters, dispatch}) {
      function updateNotifications(data) {
        const evid = data.key
        const notifData = data.val()
        if (data.empty) return
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
      const ref = firebase.database().ref(`users/${getters.user.id}/notifications/`).orderByChild('dateToRank')
      ref.on('child_added', updateNotifications)
      ref.on('child_changed', updateNotifications)
    },

    iwtClicked ({commit, getters, dispatch}, payload) {
      Vue.console.debug('[iwtClicked] notification - payload', payload);
      const key = payload.notification.id || payload.notification.key
      const userId = payload.userId
      Vue.console.debug('[iwtClicked] clickerId', userId);
      Promise.all([
        // I push the new event key in the events array of the clicker user
        firebase.database().ref(`users/${userId}/userEvents/${key}`).set(key),
        // Then I push the userId in the users array of the event
        firebase.database().ref(`events/${key}/users/${userId}`).set(getters.user.id)

      ])
      .then(res => {
      // dispatch('loadUserEvents', 'current user')
        dispatch('reloadMyEvents')
     // const LFKnow = firebase.functions().httpsCallable('letFriendsKnowMyNewEvent')
     // return LFKnow({
     //   evid: key,
     //   uid: getters.user.id
     // })
      })
      .catch(Vue.console.log)
      .finally(() => commit('setLoading', false))
    },

    createEvent: async function ({commit, getters, dispatch}, payload) {
      const eventData = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        duration: payload.duration,
        creatorId: getters.user.id,
        creationDate: Date(),
        users: {[getters.user.id]: getters.user.id},
        dateToRank: - payload.date.getTime()
      }
      let userEvents = []
      let users = [getters.user.id]
      let fbKey
      let pictures
      this.users = {[getters.user.id]: getters.user.id}
      // I stock the event's image in FB storage
      const filename = payload.filename
      // const ext = filename.slice(filename.lastIndexOf('.'))
      const fileData = await firebase.storage().ref('events').put(payload.image)
      eventData.imageUrl = await fileData.ref.getDownloadURL()
      eventData.pictures = [{uid: getters.user.id, imageUrl: eventData.imageUrl}] 
      Vue.console.log('[createEvent] eventData', eventData);

      //Reach out to firebase and store it
      const eventSnap = await firebase.database().ref('events').push(eventData)
      const key = eventData.id = this.fbkey = eventSnap.key

      // Here I'm getting the key of the new event created.
      // Push the new event key in the events array of the creator user
      await firebase.database().ref(`users/${getters.user.id}/userEvents/${key}`).set(key)
      firebase.functions().httpsCallable('letFriendsKnowMyNewEvent')({
        evid: key,
        uid: getters.user.id
      })
      Vue.console.log('newEventData', eventData);
      dispatch('load_my_events')
      commit('setLoading', false)
      router.push(`/events/${key}`)

      // I commit here in the addEvent only the events created here. The one already existing are fetched by the listenToNotifications child_added.
      // const newEvent = {
      //   event: eventData,
      //   key: key,
      //   fbKey: this.fbKey
      // }
      // commit('addEvent', newEvent)
      // commit('addEventToMyEvents', newEvent)
    },
  },
  getters: {
    events: state => state.events,
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
