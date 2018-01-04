import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/Home'
import CreateEvent from '@/components/event/CreateEvent'
import Meetups from '@/components/event/Meetups'
import meetup from '@/components/event/meetup'
import event from '@/components/event/event'
import myEvents from '@/components/event/myEvents'
import Profile from '@/components/user/Profile'
import signin from '@/components/user/signin'
import signup from '@/components/user/signup'
import AuthGard from './auth-guard'
import friends from '@/components/user/friends'
import friend from '@/components/user/friend'
import Notifications from '@/components/event/notifications'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Notifications',
      component: Notifications
    },
    {
      path: '/myEvents',
      name: 'My Events',
      component: myEvents
    },
    {
      path: '/meetups',
      name: 'Meetups',
      component: Meetups
    },
    {
      path: '/notifications',
      name: 'Notifications',
      component: Notifications
    },
    {
      path: '/friends',
      name: 'Friends',
      component: friends
    },
    {
      path: '/event/new',
      name: 'CreateEvent',
      component: CreateEvent,
      // Here below, we check that the auth-gard allow to enter this page, that the user is authenticated
      beforeEnter: AuthGard
    },
    {
      path: '/meetups/:id',
      name: 'Meetup',
      props: true,
      component: meetup
    },
    {
      path: '/events/:id',
      name: 'Event',
      props: true,
      component: event
    },
    {
      path: '/friends/:id',
      name: 'Friend',
      props: true,
      component: friend
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
      path: '/signin',
      name: 'signin',
      component: signin
    }
  ]
})
