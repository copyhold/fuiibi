<template >
  <v-container class="container">
    <v-list subheader>
      <v-subheader>
        <v-text-field hide-details placeholder="start typing" :change="loading=false" single-line v-model="search" full-width />
        <v-btn @click="searchUsers" :disabled="loading"><v-icon>search</v-icon></v-btn>
      </v-subheader>
      <template v-for="user in users">
        <v-divider></v-divider>
        <v-list-tile avatar v-bind:key="user.id">
          <v-list-tile-avatar class="avatarImg">
            <img :src="user.imageUrl"/>
          </v-list-tile-avatar>
          <v-list-tile-content  @click="getUserPage(user)" >
            <v-list-tile-title v-html="user.firstName + ' ' + user.lastName" ></v-list-tile-title>
          </v-list-tile-content>
            <v-list-tile-action v-if="hasPendingInvitation(user) || isPendingFriend(user)">
              <v-btn small class="greyColors" flat left>Pending...</v-btn>
            </v-list-tile-action>
            <v-list-tile-action v-else>
              <v-list-tile-action v-if="!isFriend(user)">
                <v-btn @click="sendFriendRequest(user.id)" flat small class="primary--text pl-1 pr-1"><v-icon class="pl-4">person_add</v-icon></v-btn>
              </v-list-tile-action>
              <v-list-tile-action v-else>
                <v-btn @click="removeFriend(user)" flat small class="greyColors" left>Remove</v-btn>
              </v-list-tile-action>
            </v-list-tile-action>
        </v-list-tile>
      </template>
    </v-list>
  </v-container>
</template>

<script>
  const firebase = require('firebase')
  export default {
    props: [],
    data () {
      return {
        loading: false,
        search: '',
        users: []
      }
    },
    computed: {
      loggedInUserId () {
        if (this.$store.getters.user) {
          return this.$store.getters.user.id
        }
      }
    },
    methods: {
      searchUsers () {
        this.loading = true
        this.users = []
        firebase.database().ref('/users')
        .orderByChild('email')
        .startAt(this.search)
        .endAt(this.search + 'z')
        .on('child_added', snap => {
          this.users.push(snap.val())
          this.loading = false
        })
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
    position: relative;
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
    margin: 0px;
  }
  .card__title--primary {
     padding-top: 0px;
  }
  .btn__content {
    justify-content: flex-start;
  }
    @media screen and (max-width: 600px) {
      .getContactButton {
        position: absolute;
        top: 2px;
        right: -10px;
    }
  }
</style>
