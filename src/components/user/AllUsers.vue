<template >
  <v-container class="container">
    <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="red" :witdh="7" :size="40" v-if="loading" class="mt-5"></v-progress-circular>
        </v-flex>
    </v-layout>

    <v-list subheader>
        <v-subheader>All users</v-subheader>
        <template v-for="user in users" >
          <v-divider></v-divider>
          <v-list-tile avatar v-bind:key="user.id" @click="" v-if="!loading && user.id != loggedInUserId">
            <v-list-tile-avatar>
              <img :src="user.imageUrl"/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="user.userName"></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="!isFriend(user)">
              <!-- <span class="hidden-xs-only">Add friend</span> -->
              <v-btn @click="sendFriendRequest(user.id)" outline small class="green--text"><v-icon class="mr-1">person_add</v-icon>Add friend</v-btn>
              <!-- <v-icon class="green white--text mt-2" @click="sendFriendRequest(user.id)">add</v-icon> -->
            </v-list-tile-action>
            <v-list-tile-action v-else>
              <!-- <span class="hidden-xs-only">Add friend</span> -->
              <v-btn @click="sendFriendRequest(user.id)" outline small class="red--text"><v-icon class="mr-1">close</v-icon>Remove</v-btn>
              <!-- <v-icon class="green white--text mt-2" @click="sendFriendRequest(user.id)">add</v-icon> -->
            </v-list-tile-action>
          </v-list-tile>
        </template>
    </v-list>
  </v-container>

</template>

<script>
  export default {
    data () {
      return {
        key: ''
      }
    },
    computed: {
      users () {
        return this.$store.getters.users
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
      sendFriendRequest (userId) {
        console.log('userID from sendFriendRequest ', userId)
        this.$store.dispatch('sendFriendRequest', userId)
      },
      isFriend (user) {
        if (this.$store.getters.user) {
          // The findIndex return us the place of the element in the array. So if we just want to check it exist, it should be bigger or equal to 0
          return this.$store.getters.user.friends.findIndex(friend => {
            return friend.id === user.id
          }) >= 0
        }
      }
    }
  }
</script>

<style scoped>
  .container{
    margin-top: 0;
    padding: 8px;
  }
  .card__title--primary {
     padding-top: 0px;
  }
  .btn__content {
    justify-content: flex-start;

  }
</style>
