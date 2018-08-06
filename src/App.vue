<template>
  <v-app>
    <v-toolbar class="primaryWhite" fixed app v-if="userIsAuthenticated">

      <v-toolbar-title absolute class="center">
        <router-link to="/notifications" tag="span" style="cursor: pointer" class="fuiibi">Fuiibi</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>


      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-icon left>{{ item.icon }}</v-icon>
          <span>{{ item.title }}</span>
        </v-btn>
      </v-toolbar-items>

      <v-btn icon right @click="sideNav = !sideNav" >
        <v-icon class="pl-4">more_vert</v-icon>
      </v-btn>


    </v-toolbar>

    <!-- <v-bottom-nav fixed shift class="bottomAtTop primaryWhite hidden-sm-and-up" v-if="userIsAuthenticated" >
      <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.link">
        <span>{{ item.title }}</span>
        <v-icon left>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-nav> -->

    <v-bottom-nav fixed shift class="bottomAtTop primaryWhite hidden-sm-and-up" v-if="userIsAuthenticated" >
      <v-btn flat :key="'Notifications'" :to="'/notifications'">
        <span>Notifications</span>
        <v-icon left>home</v-icon>
      </v-btn>
      <v-btn flat :key="'My events'" :to="'/myEvents'">
        <span>My events</span>
        <v-icon left>list</v-icon>
      </v-btn>
      <v-btn flat :key="'My friends'" :to="'/friends'">
        <span>My friends</span>
        <v-badge color="red" id="redBadge" v-if="user.pendingFriends != ''">
          <span slot="badge"></span>
        </v-badge>

        <v-icon left>supervisor_account</v-icon>
      </v-btn>
    </v-bottom-nav>

    <v-navigation-drawer v-model="sideNav" fixed clipped right >
      <v-list>
        <v-list-tile v-for="item in sideMenu" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{ item.title}}
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="userIsAuthenticated" @click="listenToProfileUpdate">
          <v-list-tile-action>
            <v-icon>person</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            My profile
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
    <main :class="{ marginTop: userLoggedIn }">
      <router-view>
      </router-view>
    </main>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false,
        userLoggedIn: false
      }
    },
    computed: {
      user () {
        if (this.$store.getters.user) {
          console.log('[user]', this.$store.getters.user)
          // console.log('[user]', this.$store.getters.users)
          return this.$store.getters.user
        }
      },
      sideMenu () {
        let sideMenu = [
          {icon: 'face', title: 'Sign Up', link: '/signup'},
          {icon: 'lock_open', title: 'Sign In', link: '/'}
        ]
        if (this.userIsAuthenticated) {
          sideMenu = [
            {icon: 'settings', title: 'Settings', link: '/settings'}
          ]
          this.userLoggedIn = true
          console.log('[this.userIsAuthenticated] this.marginTop', this.userLoggedIn)
        } else {
          this.userLoggedIn = false
        }
        // {icon: 'person', title: 'My profile', link: '/profile', click: 'listenToProfileUpdate'},

        return sideMenu
      },
      menuItems () {
        let menuItems = [
          {icon: 'face', title: 'Sign Up', link: '/signup'},
          {icon: 'lock_open', title: 'Sign In', link: '/'}
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
            {icon: 'home', title: 'Notifications', link: '/notifications'},
            {icon: 'list', title: 'My events', link: '/myEvents'},
            {icon: 'supervisor_account', title: 'My friends', link: '/friends'}
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
        this.$router.push('/')
      },
      listenToProfileUpdate () {
        console.log('[listenToProfileUpdate] triggered')
        this.$store.dispatch('listenToProfileUpdate')
        this.$router.push('/profile')
      }
    }
  }
</script>

<style media="screen">
  #redBadge span{
    height: 10px;
    width: 10px
  }
  .bottom-nav--shift .btn__content span {
    height: 35px;
    padding-top: 10px;
  }
  .toolbar .toolbar__content > .btn:last-child, .toolbar .toolbar__extension > .btn:last-child {
    margin-right: 0px;
  }
  .center {
    margin-left: 50%;
  }
  .bottom-nav {
      bottom: 4px;
    }
  .fuiibi {
    font-family: 'Marck Script', cursive;
    font-size: 33px;
  }
   #app{
    background-color: rgb(0, 0, 0)
  }/*
  #app .greyBackground {
    background-color: rgb(239, 238, 236)
  } */
  .bottomAtTop {
    bottom: 60px;
  }
  .clicked{
    filter: opacity(50%);
  }
  .marginTop {
    margin-top: 60px;
    background-color: rgb(239, 238, 236)
  }
  .toolbar .toolbar__content > *:not(.btn):not(.menu):first-child, .toolbar .toolbar__extension > *:not(.btn):not(.menu):first-child {
    margin-left: 5%;
  }
  @media screen and (max-width: 600px) {
    .marginTop {
      margin-top: 40px;
    }
    div.toolbar__content {
      height: 40px !important;
    }
    .btn .icon--left {
      margin-right: 0px;
      margin-top: 16px;
    }
    .toolbar .toolbar__content > *:not(.btn):not(.menu):first-child, .toolbar .toolbar__extension > *:not(.btn):not(.menu):first-child {
      margin-left: 40%;
    }
    /* .toolbar .toolbar__content > *:not(.btn):not(.menu):last-child, .toolbar .toolbar__extension > *:not(.btn):not(.menu):last-child {
       margin-right: 0px;
       width: 100%;
       -webkit-box-pack: end;
       -ms-flex-pack: end;
       justify-content: flex-end;
       position: absolute;
       top: -20px;
       right: 0px;
    } */
  }


</style>
