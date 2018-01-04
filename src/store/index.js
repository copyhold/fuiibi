import Vue from 'vue'
import Vuex from 'vuex'

// import meetup from './meetup'
import events from './events'
import user from './user'
import shared from './shared'

Vue.use(Vuex)
/* We merge the user and meetup that has been separetaed as the file was too long and unreadible */
export const store = new Vuex.Store({
  modules: {
    // meetup: meetup,
    events: events,
    user: user,
    shared: shared
  }
})
