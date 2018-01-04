<template>
  <v-app>
    <v-toolbar class="primary" dark scroll-off-screen fixed>
      <v-toolbar-side-icon
        @click="sideNav = !sideNav"
        class="hidden-sm-and-up hidden-md-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/notifications" tag="span" style="cursor: pointer">IWT</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat  v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-icon left>
            {{ item.icon }}
          </v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn v-if="userIsAuthenticated" flat @click="onLogout">
          <v-icon>exit_to_app</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-navigation-drawer v-model="sideNav" fixed clipped>
      <v-list>
        <v-list-tile v-for="item in menuItems"
        :key="item.title"
        :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{ item.title}}
          </v-list-tile-content>
        </v-list-tile>
<!--
        <v-list-tile>
          <v-list-tile-avatar>
              <img src="/assets/logo.jpg" alt="John">
          </v-list-tile-avatar>
        </v-list-tile> -->

        <v-list-tile v-if="userIsAuthenticated" @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
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
      menuItems () {
        let menuItems = [
          {icon: 'face', title: 'Sign Up', link: '/signup'},
          {icon: 'lock_open', title: 'Sign In', link: '/signin'}
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
            {icon: 'supervisor_account', title: 'Friends', link: '/friends'},
            {icon: 'home', title: 'My events', link: '/myEvents'},
            {icon: 'person', title: 'Profile', link: '/profile'}
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
</style>
