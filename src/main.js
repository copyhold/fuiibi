// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import vuelogger from 'vue-logger'

import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/shared/alert.vue'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'
import AllUsers from './components/user/AllUsers.vue'
import MyContacts from './components/user/myContacts.vue'
import UserCard from './components/user/userCard.vue'
import FriendsOnly from './components/user/friendsOnly.vue'
import FriendsSearch from './components/user/friendsSearch.vue'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
// import Typewriter from 'vue-typewriter'

// import Router from 'vue-router'
// import { routerHistory, writeHistory } from 'vue-router-back-button'

// eslint-disable-next-line
//************************ SERVICE WORKER *************************

if (!window.Promise) {
  window.Promise = Promise
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then(registration => {
    firebase.messaging().useServiceWorker(registration)
  })
  .catch(function (err) {
    console.error('ERROR WHILE REGISTERING SERVICE WORKER', err)
  })
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

Vue.use(Vuetify, { theme: {
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
}})

Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('vue-google-autocomplete', VueGoogleAutocomplete)
Vue.component('all-users', AllUsers)
Vue.component('my-contacts', MyContacts)
Vue.component('friends-only', FriendsOnly)
Vue.component('friends-search', FriendsSearch)
Vue.component('user-card', UserCard)

Vue.config.productionTip = false
// Vue.use(Typewriter)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyATluUdkwWsyz3IJqfu74rAmo5yDnb94-M',
      authDomain: 'iwtapplication.firebaseapp.com',
      databaseURL: 'https://fuiibi.firebaseio.com',
      projectId: 'iwtapplication',
      messagingSenderId: '208715939086',
      storageBucket: 'gs://iwtapplication.appspot.com'
    })
    // this.$debug('should load it now')
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$debug('[main.js] user', user)
        this.$store.dispatch('autoSignIn', user)

        // GOOGLE
        if (user.photoURL) {
          this.$store.dispatch('checkUserFromGoogle', user)
          // this.$store.dispatch('getUserContacts')
        } else {
          this.$store.dispatch('fetchUserData')
          this.$store.dispatch('fetchUsersEvents')
          this.$store.dispatch('listenToNotifications')
          this.$store.dispatch('listenToNotificationsChanges')
          this.$store.dispatch('listenToInvitationRemoval')
          this.$store.dispatch('listenToFriendRemoval')
        }
      }
    })
  }
})
