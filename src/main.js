// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import vuelogger from 'vue-logger'
import VueZoomer from 'vue-zoomer'

import App from './App'
import router from './router'
import {
  store
} from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/shared/alert.vue'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'
import AllUsers from './components/user/AllUsers.vue'
import MyContacts from './components/user/myContacts.vue'
import UserCard from './components/user/userCard.vue'
import FriendsOnly from './components/user/friendsOnly.vue'
import '@mdi/font/css/materialdesignicons.css'

if (!window.Promise) {
  window.Promise = Promise
}

// Below we don't want chrome to propose to install the banner only if the user visit our page twice within 5 minutes, but we
// want as well to propose it after the user click the add picture button

// eslint-disable-next-line
// var deferredPrompt
// console.log('[addProfilePicture] dans welcome, b4 window.addEventListener(beforeinstallprompt, function (event)')
//
// window.addEventListener('beforeinstallprompt', (event) => {
//   console.log('beforeinstallprompt fired')
//   event.preventDefault()
//   deferredPrompt = event
//   return false
// })

// eslint-disable-next-line
//***************************************************************************************************************
Vue.use(vuelogger, {
  dev: process.env.NODE_ENV === 'development'
})
Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: 'AIzaSyACbBFnoaG5EVR7-IDGn8lsiTtPHxWQWB4'
})

Vue.use(Vuetify, {
  theme: {
    primaryDark: '#F5F5F5',
    primary: '#0E1E51',
    primaryWhite: '#fff',
    primaryLight: '#439889',
    secondary: '#0E1E51',
    secondaryDark: '#01021E',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    grey: '#A8A8A8',
    darkgray: '#424242',
    orange: '#E65100',
    white: '#FFFFFF',
    lightGrey: '#C8C8C8'
  }
})
Vue.use(VueZoomer)
Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('vue-google-autocomplete', VueGoogleAutocomplete)
Vue.component('all-users', AllUsers)
Vue.component('my-contacts', MyContacts)
Vue.component('friends-only', FriendsOnly)
Vue.component('user-card', UserCard)

Vue.config.productionTip = false

router.afterEach((to, from) => {
  const path = to.path || to
  const gtag = window.gtag
  gtag('config', 'UA-149004256-1', {page_path: path})
})
// Vue.use(Typewriter)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App
  },
  // eslint-disable-next-line
  created() {
    document.body.classList.add('appinitialized')
    window.firebase.initializeApp({
      apiKey: 'AIzaSyATluUdkwWsyz3IJqfu74rAmo5yDnb94-M',
      authDomain: 'iwtapplication.firebaseapp.com',
      databaseURL: 'https://fuiibi.firebaseio.com',
      // databaseURL: 'ws://localhost:5000',
      projectId: 'iwtapplication',
      messagingSenderId: '208715939086',
      storageBucket: 'gs://iwtapplication.appspot.com'
    })
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        window.firebase.messaging().useServiceWorker(registration)
      })
      .catch(function (err) {
        console.error('ERROR WHILE REGISTERING SERVICE WORKER', err)
      })
    }
    this.$debug('we are here in vue')
    window.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        document.cookie = 'authuser=true'
        if (document.getElementById('homepage')) document.getElementById('homepage').remove()
        this.$store.commit('setUser', {
          id: user.uid,
          email: user.email
        })

        this.$store.dispatch('checkUserFromGoogle', user)
      } else {
        // this.$router.push('/')
      }
    })
  }
})
