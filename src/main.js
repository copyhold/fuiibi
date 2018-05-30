// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/shared/alert.vue'
import EditMeetupDialog from './components/event/Edit/EditMeetupDetailsDialog.vue'
import EditMeetupDateDialog from './components/event/Edit/EditMeetupDateDialog.vue'
import RegisterDialog from './components/event/Registration/RegisterDialog.vue'
import AddPictureDialog from './components/event/AddPic/AddPictureDialog.vue'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'
import AllUsers from './components/user/AllUsers.vue'
import FriendsOnly from './components/user/friendsOnly.vue'
import { VueTyper } from 'vue-typer'
import FriendsSearch from './components/user/friendsSearch.vue'
// import Typewriter from 'vue-typewriter'

// import Router from 'vue-router'
// import { routerHistory, writeHistory } from 'vue-router-back-button'

// eslint-disable-next-line
//************************ SERVICE WORKER *****************************

if (!window.Promise) {
  window.Promise = Promise
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then(function () {
    console.log('serviceWorker registered')
  })
  .catch(function (err) {
    console.log(err)
  })
}

// Below we don't want chrome to propose to install the banner only if the user visit our page twice within 5 minutes, but we
// want as well to propose it after the user click the add picture button

// eslint-disable-next-line
var deferredPrompt

window.addEventListener('beforeinstallprompt', function (event) {
  console.log('beforeinstallprompt fired')
  event.preventDefault()
  deferredPrompt = event
  return false
})

// eslint-disable-next-line
//***************************************************************************************************************
Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: 'AIzaSyCv2i8Das8W3j2xw5cj7VN7-dcJJVekbiY' // Can also be an object. E.g, for Google Maps Premium API, pass `{ client: <YOUR-CLIENT-ID> }`
  // apiKey: 'AIzaSyAJS653Q-dx8Qs49NVmnVVmeEuT3hXSIYU'
  // version: '...', // Optional
})

Vue.use(Vuetify, { theme: {
  primaryDark: '#F5F5F5',
  primary: '#0E1E51',
  primaryWhite: '#fff',
  // primaryDark: '#01021E',
  // primary: '#0E1E51',
  // primary: '#00695c',
  // primaryDark: '#003d33',
  primaryLight: '#439889',
  secondary: '#0E1E51',
  secondaryDark: '#01021E',
  // secondary: '#004d40',
  accent: '#82B1FF',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107',
  grey: '#A8A8A8',
  darkgray: '#424242',
  orange: '#E65100',
  white: '#FFFFFF'
}})

Vue.filter('date', DateFilter)
// Here are the components I want to have globaly in order to reuse them in different places in my app.
// the first argument in the parenthese is the selector
Vue.component('app-edit-meetup-details-dialog', EditMeetupDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-alert', AlertCmp)
Vue.component('app-meetup-register-dialog', RegisterDialog)
Vue.component('app-event-addpicture-dialog', AddPictureDialog)
Vue.component('vue-google-autocomplete', VueGoogleAutocomplete)
// Vue.component('vuetify-google-autocomplete', VuetifyGoogleAutocomplete)
Vue.component('all-users', AllUsers)
Vue.component('friends-only', FriendsOnly)
Vue.component('friends-search', FriendsSearch)

Vue.component('vue-typer', VueTyper)

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
      databaseURL: 'https://iwtapplication.firebaseio.com',
      projectId: 'iwtapplication',
      // the below link address is from firebase storage
      storageBucket: 'gs://iwtapplication.appspot.com'
      // storageBucket: 'iwtvueapp.appspot.com'
    })
    // console.log('should load it now')
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('[main.js] user', user)
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
        this.$store.dispatch('fetchUsersEvents')
        this.$store.dispatch('listenToNotifications')
        this.$store.dispatch('listenToNotificationsChanges')
        this.$store.dispatch('listenToInvitationRemoval')
        this.$store.dispatch('listenToFriendRemoval')
        this.$store.dispatch('loadUsers')
        // this.$store.dispatch('onEventChanged')
      }
    })
    // Here we load all the users of the app for TEST only, so that I can test friends requests
    // this.$store.dispatch('loadUsers')
    // this.$store.dispatch('loadNotifications')
  }
})
