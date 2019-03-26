import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/Home'
import CreateEvent from '@/components/event/CreateEvent'
import event from '@/components/event/event'
import myEvents from '@/components/event/myEvents'
import Profile from '@/components/user/Profile'
import signin from '@/components/user/signin'
import signup from '@/components/user/signup'
import AuthGard from './auth-guard'
import friends from '@/components/user/friends'
import settings from '@/components/user/settings'
import Notifications from '@/components/event/notifications'
import Welcome from '@/components/Welcome'
import Search from '@/components/user/search'
import userPage from '@/components/user/userPage'
import { store } from '../store'

const redirectSignedIn = (to, from, next) => {
  if (to.path === '/' && store.getters.user) {
    next('/notifications')
  } else {
    next()
  }
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/myEvents',
      name: 'My Events',
      component: myEvents
    },
    {
      path: '/notifications',
      name: 'Notifications',
      component: Notifications,
      beforeEnter: AuthGard
    },
    {
      path: '/friends',
      name: 'Friends',
      component: friends
    },
    {
      path: '/settings',
      name: 'Settings',
      component: settings
    },
    {
      path: '/event/new',
      name: 'CreateEvent',
      component: CreateEvent,
      // Here below, we check that the auth-gard allow to enter this page, that the user is authenticated
      beforeEnter: AuthGard
    },
    {
      path: '/events/:id',
      name: 'Event',
      props: true,
      component: event
    },
    {
      path: '/users/:id',
      name: 'UserPage',
      props: true,
      component: userPage
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: AuthGard
    },
    {
      path: '/signup',
      name: 'signup',
      component: signup
    },
    {
      path: '/',
      name: 'signin',
      component: signin,
      beforeEnter: redirectSignedIn
    }
  ]
})
