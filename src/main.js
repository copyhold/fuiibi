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
import AllUsers from './components/user/AllUsers.vue'
import FriendsOnly from './components/user/friendsOnly.vue'
import Router from 'vue-router'
import { routerHistory, writeHistory } from 'vue-router-back-button'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then(function () {
    console.log('serviceWorker registered')
  })
}

Vue.use(Router)
Vue.use(routerHistory)

router.afterEach(writeHistory)

Vue.use(Vuetify, { theme: {
  // primary: '#006064',
  primary: '#1A237E',
  secondary: '#424242',
  accent: '#82B1FF',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107',
  grey: '#A8A8A8',
  darkgray: '#424242',
  // primaryLight: '#009688',
  primaryLight: '#3F51B5',
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
Vue.component('all-users', AllUsers)
Vue.component('friends-only', FriendsOnly)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
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
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
        this.$store.dispatch('fetchUsersEvents')
        this.$store.dispatch('listenToNotifications')
        console.log('user info from firebase', user)
        console.log('user info from main', this.$store.getters.user)
      }
    })
    // Here we load all the users of the app for TEST only, so that I can test friends requests
    this.$store.dispatch('loadUsers')
    // this.$store.dispatch('loadNotifications')
  }
})
