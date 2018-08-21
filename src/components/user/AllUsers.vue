<template >
  <v-container class="container">
    <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="darkgray" :width="1" :size="90" v-if="loading" class="mt-5"></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-list subheader>
      <v-layout class="getContactButton">
        <v-btn @click="gapiLoad" flat class="blue--text">google contacts</v-btn>
      </v-layout>
        <v-subheader>All users</v-subheader>
        <!-- <template v-for="user in users" > -->
        <template v-for="user in filteredUsers">
          <v-divider></v-divider>
          <v-list-tile avatar v-bind:key="user.id" v-if="!loading && user.id != loggedInUserId">
            <v-list-tile-avatar class="avatarImg">
              <img :src="user.imageUrl"/>
            </v-list-tile-avatar>
            <v-list-tile-content  @click="getUserPage(user)" >
              <v-list-tile-title v-html="user.firstName + ' ' + user.lastName" ></v-list-tile-title>
              <!-- <v-list-tile-title v-html="user.lastName"></v-list-tile-title> -->
            </v-list-tile-content>
            <v-list-tile-action v-if="hasPendingInvitation(user) || isPendingFriend(user)">
                <v-btn small class="greyColors" flat left>Pending...</v-btn>
            </v-list-tile-action>
            <v-list-tile-action v-else>
              <v-list-tile-action v-if="!isFriend(user)">
                <v-btn @click="sendFriendRequest(user.id)" flat small class="primary--text pl-1 pr-1"><v-icon class="pl-4">person_add</v-icon></v-btn>
              </v-list-tile-action>
              <v-list-tile-action v-else>
                <!-- <v-btn @click="removeFriend(user)" outline small class="greyColors"><v-icon class="mr-1">delete_forever</v-icon>Remove</v-btn> -->
                <v-btn @click="removeFriend(user)" flat small class="greyColors" left>Remove</v-btn>
              </v-list-tile-action>
            </v-list-tile-action>
          </v-list-tile>
        </template>
    </v-list>
    <v-layout>
      <v-fab-transition >
        <v-btn @click="refresh" color="orange" fixed bottom right fab ripple class=" white--text">
          <v-icon>autorenew</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
  export default {
    props: ['search'],
    data () {
      return {
        key: ''
      }
    },
    computed: {
      users () {
        return this.$store.getters.users
      },
      filteredUsers () {
        return this.users.filter((user) => {
          return user.firstName.toLowerCase().concat(user.lastName.toLowerCase()).trim().replace(' ', '').includes(this.search.toLowerCase().trim().replace(' ', '')) || user.lastName.toLowerCase().concat(user.firstName.toLowerCase()).trim().replace(' ', '').includes(this.search.toLowerCase().trim().replace(' ', ''))
        })
      },
      loading () {
        return this.$store.getters.loading
      },
      loggedInUserId () {
        if (this.$store.getters.user) {
          return this.$store.getters.user.id
        }
      }
    },
    methods: {
    gapiLoad () {
        var clientId = '24686685442-e8ookfdde4dbc6fqqmjo3iajo9rc71ai.apps.googleusercontent.com'
        var apiKey = 'AIzaSyACbBFnoaG5EVR7-IDGn8lsiTtPHxWQWB4'
        var scopes = 'https://www.googleapis.com/auth/contacts.readonly'
        console.log('in gapiLoad')
        gapi.client.setApiKey(apiKey)
        window.setTimeout(this.authorize(clientId, scopes))
      },
      authorize(clientId, scopes) {
        console.log('in autorize')
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, this.handleAuthorization)
      },
      handleAuthorization(authorizationResult) {
        console.log('in handleAuthorization => authorizationResult', authorizationResult)
        if (authorizationResult && !authorizationResult.error) {
          console.log('if (authorizationResult && !authorizationResult.error)')
          this.$http.get("https://www.google.com/m8/feeds/contacts/default/thin?alt=json&access_token=" + authorizationResult.access_token + "&max-results=500&v=3.0")
            .then(response => {
              console.log(response.body.feed.entry)
              let emailList = response.body.feed.entry
              for (let email in emailList) {
                let googleEmail = emailList[email].gd$email[0].address
                console.log('emailList[email].gd$email', emailList[email].gd$email[0].address);
              }
            })
        } else {
          console.log('ERROR IN GETTING PERMISSION');
        }
      },
      getUserPage (key) {
        console.log('[getUserPage] clicked key', key)
        this.$store.dispatch('getUserData', {userId: key.id})
        this.$router.push('/users/' + key.id)
      },
      removeFriend (user) {
        console.log('removeFriend', user)
        this.$store.dispatch('removeFriend', user)
      },
      refresh () {
        this.$store.dispatch('loadUsers')
      },
      sendFriendRequest (userId) {
        this.$store.dispatch('sendFriendRequest', userId)
      },
      isFriend (user) {
        if (this.$store.getters.user) {
          // The findIndex return us the place of the element in the array. So if we just want to check it exist, it should be bigger or equal to 0
          return this.$store.getters.user.friends.findIndex(friend => {
            return friend.id === user.id
          }) >= 0
        }
      },
      hasPendingInvitation (user) {
        if (this.$store.getters.user) {
          // The findIndex return us the place of the element in the array. So if we just want to check it exist, it should be bigger or equal to 0
          if (this.$store.getters.user.pendingInvitations) {
            return this.$store.getters.user.pendingInvitations.findIndex(friend => {
              return friend.id === user.id
            }) >= 0
          }
        }
      },
      isPendingFriend (user) {
        if (this.$store.getters.user) {
          // The findIndex return us the place of the element in the array. So if we just want to check it exist, it should be bigger or equal to 0
          return this.$store.getters.user.pendingFriends.findIndex(friend => {
            return friend.id === user.id
          }) >= 0
        }
      }
    }
  }
</script>

<style scoped>
  .getContactButton {
    position: absolute;
    top: 2px;
    right: -10px;
  }
  .theme--light .list .divider, .application .theme--light.list .divider{
    top: 0px;
  }
  div.tabs {
    top: 88px !important;
  }
  .btn--bottom:not(.btn--absolute) {
      bottom: 72px;
  }
  .greyColors{
    background-color: #f6f7f9;
    border-color: #ced0d4;
    color: #4b4f56;
  }

  #inputSearch {
    position: fixed;
    top: 50px;
    right: 0px;
    width: 100%;
    height: 64px;
    padding: 8px;
    z-index: 2;
    background: #3F51B5;
    font-size: 20px;
  }
  input {
    width: 100%;
    margin-top: 3px;
    border-bottom: 1px solid grey;
  }
  .tabs {
    overflow: hidden;
    position: absolute;
    width: 100%;
    top: 88px;
    }
  .container{
    margin: 0px auto 56px auto;
  }
  .card__title--primary {
     padding-top: 0px;
  }
  .btn__content {
    justify-content: flex-start;

  }
</style>
