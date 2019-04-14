import * as firebase from 'firebase'
import Vue from 'vue'
export default {
  state: {
    loading: false,
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
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    updateFCMtoken (store) {
      const {user} = store.getters
      if (!user.id) {
        return false
      }
      const messaging = firebase.messaging()
      return messaging.getToken()
      .then(fcmtoken => {
        if (user.fcmtokens && Object.values(user.fcmtokens).indexOf(fcmtoken) >= 0) {
          return
        }
        return firebase.database().ref(`/users/${user.id}/fcmtokens`).push(fcmtoken)
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
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
}
