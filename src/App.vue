<template>
  <v-app>
    <v-toolbar class="primary" dark scroll-off-screen fixed>
      <v-toolbar-side-icon @click="sideNav = !sideNav">
      </v-toolbar-side-icon>
      <!-- <v-toolbar-title>
        <router-link to="/notifications" tag="span" style="cursor: pointer"><v-icon>home</v-icon></router-link>
      </v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat  v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-icon left>{{ item.icon }}</v-icon>
          <span class="hidden-xs-only">{{ item.title }}</span>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-navigation-drawer v-model="sideNav" fixed clipped>
      <v-list>
        <v-list-tile v-for="item in sideMenu" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{ item.title}}
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile  v-if="userIsAuthenticated" flat @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            Logout
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <main class="marginTop">
      <router-view>

      </router-view>
    </main>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false
      }
    },
    computed: {
      sideMenu () {
        let sideMenu = [
          {icon: 'face', title: 'Sign Up', link: '/signup'},
          {icon: 'lock_open', title: 'Sign In', link: '/signin'}
        ]
        if (this.userIsAuthenticated) {
          sideMenu = [
            {icon: 'person', title: 'Profile', link: '/profile'},
            {icon: 'settings', title: 'Settings', link: '/settings'}
          ]
        }
        return sideMenu
      },
      menuItems () {
        let menuItems = [
          {icon: 'face', title: 'Sign Up', link: '/signup'},
          {icon: 'lock_open', title: 'Sign In', link: '/signin'}
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
            {icon: 'home', title: 'Home', link: '/notifications'},
            {icon: 'supervisor_account', title: 'Friends', link: '/friends'},
            {icon: 'list', title: 'My events', link: '/myEvents'}
          ]
        }
        return menuItems
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }
    },
    methods: {
      onLogout () {
        this.$store.dispatch('logout')
        this.$router.push('/signin')
      }
    }
  }
</script>

<style media="screen">
  #app{
    background-color: rgb(239, 238, 236)
  }
  .marginTop {
    margin-top: 60px;
  }
  @media screen and (max-width: 600px) {
    .btn .icon--left {
      margin-right: 0px;
    }
  }
  .toolbar .toolbar__content > *:not(.btn):not(.menu):last-child, .toolbar .toolbar__extension > *:not(.btn):not(.menu):last-child {
     margin-right: 0px;
     width: 77%;
     justify-content: flex-end;
  }

</style>
