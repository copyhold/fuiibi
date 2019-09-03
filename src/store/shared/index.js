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
    loadPersons: async function (store, ids) {
      const notloaded = ids.filter(id => !store.getters.person(id))
      if (notloaded.length === 0) return
      try {
        const res = await window.firebase.functions().httpsCallable('loadPersons')(notloaded)
        for (let person of Object.values(res.data)) {
          store.commit('savePerson', person)
        }
      } catch (e) {
        Vue.console.error(e)
      }
    },
    updateFCMtoken (store) {
      const {user} = store.getters
      if (!user.id) {
        return false
      }
      const messaging = window.firebase.messaging()
      return messaging.getToken()
      .then(fcmtoken => {
        if (user.fcmtokens && user.fcmtokens[fcmtoken]) {
          return
        }
        return window.firebase.database().ref(`/users/${user.id}/fcmtokens/${fcmtoken}`).set(true)
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
      const messaging = window.firebase.messaging()
      messaging.usePublicVapidKey('BGMmgv-N2qcvFyT0Uek_21rxK1xpoRZOsUB4OnKNFxsHyETOYxv2x3YfhGqHnZQP55IJjgORd6-fn9he6JiOlVI')
      messaging.onMessage(message => {
        Vue.console.log(message)
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
    iam (state, getters) {
      const iam = getters.user
      if (!iam) return null
      return state.persons[iam.uid || iam.id]
    },
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
