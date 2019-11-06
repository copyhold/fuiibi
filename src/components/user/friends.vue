<template >
  <v-container>
    <v-list subheader  xs12>
      <v-subheader>
        <v-text-field hide-details placeholder="Search for Fuiibi users" single-line v-model="search" full-width />
        <v-btn icon flat @click="searchUsers" flat :disabled="loading">
          <v-progress-circular indeterminate color="darkgray" :width="1" :size="20" v-if="loading"></v-progress-circular>
          <v-icon v-if="!loading">search</v-icon>
        </v-btn>
      </v-subheader>
      <user-card v-for="user in users" :user="user" :key="user.id" />
      <v-divider></v-divider>

      <v-subheader v-if="pendingFriends.lenght>0">Invitations I received</v-subheader>
      <template v-for="(user,i) in pendingFriends" v-if="filterUser (user)">
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

      <v-subheader v-if="pendingInvitations.length>0">Invitations I sent</v-subheader>
      <template v-for="user in pendingInvitations" v-if="filterUser (user)">
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
      <v-subheader v-if="friends">My friends</v-subheader>
      <template v-for="user,i in friends" v-if="filterUser (user)">
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
  const firebase = global.firebase
  export default {
    props: [],
    data () {
      return {
        loading: false,
        users: [],
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
      loggedInUserId () {
        const {user} = this.$store.getters
        if (!user) return false
        return user.id
      }
    },
    methods: {
      searchUsers () {
        this.loading = true
        this.users = []
        firebase.functions().httpsCallable('findUsersBy')({
          s: this.search
        })
        .then(res => {
          if (res.data) {
            this.users = Object.values(res.data)
            this.$store.dispatch('loadPersons', Object.keys(res.data))
          }
        })
        .catch(this.$error)
        .finally(() => {
          this.loading = false
        })
      },
      filterUser (friend) {
        if (this.search.length < 3) return true
        return `${friend.firstName}${friend.lastName}`.match(new RegExp(this.search, 'i'))
      },
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
