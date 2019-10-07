<template >
  <v-container>
    <v-list subheader v-if="pendingFriends.length>0"  xs12>
      <v-subheader>Invitations I received</v-subheader>
      <template v-for="(user,i) in pendingFriends">
        <v-divider></v-divider>
        <v-list-tile :key="user.id" v-if="user.id != loggedInUserId" class="mt-2 mb-2">
            <v-list-tile-avatar>
              <img :src="user.imageUrl"/>
            </v-list-tile-avatar>
            <v-list-tile-content @click="getUserPage(user)">
              <v-list-tile-title v-html="user.firstName + ' ' + user.lastName"></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon flat @click="$store.dispatch('acceptFriendRequest', user.id)">
                <v-icon color="primary">mdi-account-plus</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-btn icon flat @click="$store.dispatch('refuseFriend', user.id)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </v-list-tile-action>
        </v-list-tile>
      </template>
    </v-list>
    <v-list subheader v-if="pendingInvitations.length>0"  xs12>
      <v-subheader>Invitations I sent</v-subheader>
      <template v-for="user in pendingInvitations">
        <v-divider></v-divider>
        <v-list-tile :key="user.id" v-if="user.id != loggedInUserId" class="mt-2 mb-2">
          <v-list-tile-avatar>
            <img :src="user.imageUrl"/>
          </v-list-tile-avatar>
          <v-list-tile-content @click="getUserPage(user)">
            <v-list-tile-title v-html="user.firstName + ' ' + user.lastName"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon flat @click="$store.dispatch('cancelInvitation', user.id)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider></v-divider>
      </template>
    </v-list>
    <v-list subheader>
      <v-list-tile>
        <v-list-tile-avatar>
          <v-icon class="pl-2">search</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-text-field hide-details placeholder="Search in you friends list" single-line v-model="search" full-width />
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-divider></v-divider>
      <template v-for="user,i in filteredFriends" >
        <v-list-tile avatar v-bind:key="i" @click="" v-if="user.id != loggedInUserId">
          <v-list-tile-avatar>
            <img :src="user.imageUrl"/>
          </v-list-tile-avatar>
          <v-list-tile-content @click="getUserPage(user)">
            <v-list-tile-title v-html="user.firstName + ' ' + user.lastName"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon flat @click="removeFriend(user)"><v-icon color="lightGrey darken-2">mdi-account-remove</v-icon></v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider></v-divider>
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
          if (!friend) return false
          if (this.search.length < 3) return true
          return `${friend.firstName}${friend.lastName}`.match(new RegExp(this.search, 'i'))
        })
      },
      pendingInvitations () {
        const user = this.$store.getters.user
        if (!user || !user.pendingInvitations) return []
        const friends = Object.keys(user.pendingInvitations).map(this.$store.getters.person).filter(fr => typeof fr !== 'undefined')
        return friends
      },
      pendingFriends () {
        const user = this.$store.getters.user
        if (!user || !user.pendingFriends) return []
        const friends = Object.keys(user.pendingFriends).map(this.$store.getters.person).filter(fr => typeof fr !== 'undefined')
        return friends
      },
      friends () {
        if (!this.$store.getters.user || !this.$store.getters.user.friends) {
          return []
        }
        const friends = Object.keys(this.$store.getters.user.friends)
        .map(k => {
          return this.$store.getters.person(k)
        })
        return friends
      },
      loading () {
        return this.$store.getters.loading
      },
      loggedInUserId () {
        const {user} = this.$store.getters
        if (!user) return false
        return user.id
      }
    },
    methods: {
      getUserPage (key) {
        this.$store.dispatch('getUserData', {userId: key.id})
        this.$router.push('/users/' + key.id)
      },
      removeFriend (user) {
        if (!confirm('Please, don`t remove me , I want be your friend. Sure?')) return
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
