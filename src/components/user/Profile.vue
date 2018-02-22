<template lang="html">
  <v-container class="container">
    <!-- <router-link
        v-if="$routerHistory.hasHistory()"
        :to="{ path: $routerHistory.previous().path }"
        class="arrowBack"
        > -->
    <router-link
        :to="'/notifications'"
        class="arrowBack"
        >
        <v-icon class="white--text">arrow_back</v-icon>
    </router-link>
    <v-layout row wrap v-if="loading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="red" :witdh="7":size="70" v-if="loading"></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>

        <v-card>
          <v-card-media :src="user.imageUrl" height="300px">
          </v-card-media>
          <v-card-title class="eventTitle">
              <h2>{{ user.userName }}</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <h3> some more info about the user</h3>
          </v-card-text>
        </v-card>

      </v-flex>
    </v-layout>
    <v-fab-transition >
      <v-btn router to="/event/new" color="green" fixed bottom right fab class=" white--text">
        <v-icon>edit</v-icon>
      </v-btn>
    </v-fab-transition>
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
      friends () {
        return this.$store.getters.users
      },
      loading () {
        return this.$store.getters.loading
      },
      user () {
        if (this.$store.getters.user) {
          return this.$store.getters.user
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
  .arrowBack {
    position: fixed;
    top: 56px;
    left: 24px;
    z-index: 3;
  }
</style>
