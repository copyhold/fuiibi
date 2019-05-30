import * as firebase from 'firebase'
import Vue from 'vue'
export default {
  state: {
    loading: false,
    persons: {},
    error: null
  },
  mutations: {
    setMessaging (state, messaging) {
      state.messaging = messaging
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    savePerson (state, person) {
      Vue.set(state.persons, person.id, person)
    },
    updatePerson (state, payload) {
      const {uid, ...update} = payload
      const newperson = { ...state.persons[uid], ...update }
      this.commit('savePerson', newperson)
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    loadPersons (store, ids) {
      const notloaded = ids.filter(id => !store.getters.person(id))
      if (notloaded.length === 0) return
      firebase.functions().httpsCallable('loadPersons')(notloaded)
      .then(res => {
        for (let person of Object.values(res.data)) {
          store.commit('savePerson', person)
        }
      })
      .catch(console.error)
    },
    updateFCMtoken (store) {
      const {user} = store.getters
      if (!user.id) {
        return false
      }
      const messaging = firebase.messaging()
      return messaging.getToken()
      .then(fcmtoken => {
        if (user.fcmtokens && user.fcmtokens[fcmtoken]) {
          return
        }
        return firebase.database().ref(`/users/${user.id}/fcmtokens/${fcmtoken}`).set(true)
      })
      .catch(err => {
        console.error(err)
      })
    },
    setupMessagingAndToken (store) {
      const {user} = store.getters
      if (!user.id) {
        return false
      }
      const messaging = firebase.messaging()
      messaging.usePublicVapidKey('BGMmgv-N2qcvFyT0Uek_21rxK1xpoRZOsUB4OnKNFxsHyETOYxv2x3YfhGqHnZQP55IJjgORd6-fn9he6JiOlVI')
      messaging.onMessage(message => {
        Vue.console.log(message)
        // fires if app is in foreground
        // message[notification[body|title]|data]
        // here need to add notification to notifications store
        // or do nothing since notifications should be listened
      })
      messaging.requestPermission()
      .then(() => {
        messaging.onTokenRefresh(() => store.dispatch('updateFCMtoken'))
        store.dispatch('updateFCMtoken')
      })
      .catch(err => {
        Vue.console.debug(err)
      })
    },
    clearError ({commit}) {
      commit('clearError')
    }
  },
  getters: {
    person: (state) => id => {
      return state.persons[id]
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
}
