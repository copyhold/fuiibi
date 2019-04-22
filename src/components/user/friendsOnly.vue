<template >
  <v-container>
    <v-list subheader v-if="pendingFriends"  xs12>
      <v-subheader>Friends invitations</v-subheader>
      <template v-for="user in pendingFriends">
        <v-divider></v-divider>
        <v-list-tile :key="user.id" v-if="!loading && user.id != loggedInUserId" class="mt-2 mb-2">
          <v-flex xs2 >
            <v-list-tile-avatar>
              <img :src="user.imageUrl"/>
            </v-list-tile-avatar>
          </v-flex>
          <v-flex xs8 class="ml-3">
            <v-list-tile-content @click="getUserPage(user)">
              <v-list-tile-title v-html="user.firstName + ' ' + user.lastName"></v-list-tile-title>
            </v-list-tile-content>
          </v-flex>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile class="short">
          <v-flex xs6 >
            <v-list-tile-action>
              <v-btn small flat class="greyColors ml-1" @click="refuseFriend(user)">Ignore</v-btn>
            </v-list-tile-action>
          </v-flex>
          <v-flex xs6>
            <v-list-tile-action>
              <v-btn small class="primary--text" outline @click="addFriend(user)"><v-icon class="mr-1">person_add</v-icon>Accept</v-btn>
            </v-list-tile-action>
          </v-flex>
        </v-list-tile>
      </template>
    </v-list>
    <v-list subheader>
      <v-subheader><v-text-field hide-details placeholder="start typing" single-line v-model="search" full-width append-icon="search" /></v-subheader>
      <template v-for="user in filteredFriends" >
        <v-divider></v-divider>
        <v-list-tile avatar v-bind:key="user.id" @click="" v-if="!loading && user.id != loggedInUserId">
          <v-list-tile-avatar>
            <img :src="user.imageUrl"/>
          </v-list-tile-avatar>
          <v-list-tile-content @click="getUserPage(user)">
            <v-list-tile-title v-html="user.firstName + ' ' + user.lastName"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn small flat class="greyColors" @click="removeFriend(user)"><v-icon color="lightGrey darken-2" class="pl-4">mdi-account-remove</v-icon></v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </template>
    </v-list>
  </v-container>
</template>

<script>
  export default {
    props: [],
    data () {
      return {
        search: '',
        key: ''
      }
    },
    computed: {
      filteredFriends () {
        return this.friends.filter(friend => {
          if (this.search.length < 3) return true
          return `${friend.firstName}${friend.lastName}`.match(new RegExp(this.search, 'i'))
        })
      },
      pendingFriends () {
        if (!this.$store.getters.user || !this.$store.getters.user.pendingFriends) return []
        if (this.$store.getters.user.pendingFriends.length > 0) {
          return this.$store.getters.user.pendingFriends
        }
      },
      friends () {
        if (!this.$store.getters.user || !this.$store.getters.user.friends) {
          return []
        }
        if (this.$store.getters.user.friends.length > 0) {
          return this.$store.getters.user.friends
        }
        return []
      },
      loading () {
        return this.$store.getters.loading
      },
      loggedInUserId () {
        return this.$store.getters.user.id
      }
    },
    methods: {
      getUserPage (key) {
        console.log('[getUserPage] clicked key', key)
        this.$store.dispatch('getUserData', {userId: key.id})
        this.$router.push('/users/' + key.id)
      },
      removeFriend (user) {
        console.log('removeFriend', user)
        this.$store.dispatch('removeFriend', user)
      },
      messageFriend (userId) {
        console.log('userID from sendMessaget ', userId)
        // this.$store.dispatch('sendFriendRequest', userId)
      }
    }
  }
</script>

<style scoped>
  .tabs__items {
    margin-bottom: 56px;
  }
  .squaredVCard{
    height: 50vw !important;
    width: 50vw;
  }
  .greyColors{
    background-color: #f6f7f9;
    border-color: #ced0d4;
    color: #4b4f56;
    left: 16px;
  }
  .container{
    margin-top: 0;
    padding: 8px;
    margin: 0px auto 56px auto;
  }
  .card_actions{
    padding: 0px;
  }
  .btn_content{
    padding: 0px;
  }
  .btn__content {
    padding: 0px !important;
  }
  .card__actions {
    padding: 0px;
  }
  .card__title--primary {
    padding: 0px 0px;
  }
  .card__actions > *, .card__actions .btn {
    margin: 0 -8px;
  }
  p {
    margin-bottom: 4px;
  }
</style>
