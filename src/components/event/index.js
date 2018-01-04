import Vue from 'vue'
import Vuex from 'vuex'

import meetup from './meetup'
import user from './user'
import shared from './shared'

Vue.use(Vuex)
/* We merge the user and meetup that has been separetaed as the file was too long and unreadible */
export const store = new Vuex.Store({
  modules: {
    meetup: meetup,
    user: user,
    shared: shared
  }
})
