<template >
  <v-container class="container">
    <!-- <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="red" :witdh="7" :size="40" v-if="loading" class="mt-5"></v-progress-circular>
        </v-flex>
    </v-layout> -->
    <v-list subheader v-if="pendingFriends">
          <v-subheader>Pending friends request</v-subheader>
          <template v-for="user in pendingFriends" >
            <v-divider></v-divider>
            <v-list-tile avatar v-bind:key="user.id" @click="" v-if="!loading && user.id != loggedInUserId">
              <v-flex xs3>
                <v-list-tile-avatar>
                  <img :src="user.imageUrl"/>
                </v-list-tile-avatar>
              </v-flex>
              <v-flex xs9>
                <v-list-tile-content>
                  <v-list-tile-title v-html="user.userName"></v-list-tile-title>
                </v-list-tile-content>
              </v-flex>
              <!-- <v-flex xs3>
                <v-list-tile-action>
                  <v-btn outline small class="green--text mt-2" @click="addFriend(user.id)"><v-icon class="mr-1">person_add</v-icon>Accept</v-btn>
                  <v-btn outline small class="red--text mt-1" @click="refuseFriend(user.id)"><v-icon class="mr-1">close</v-icon>Refuse</v-btn>
                </v-list-tile-action>
              </v-flex> -->
              <!-- <v-flex xs3 class="ml-1">
                <v-list-tile-action>
                </v-list-tile-action>
              </v-flex> -->
            </v-list-tile>
            <v-list-tile>
              <v-flex xs6>
                <v-list-tile-action>
                  <v-btn outline small block class="green--text" @click="addFriend(user)"><v-icon class="mr-1">person_add</v-icon>Accept</v-btn>
                  <!-- <v-btn outline small block class="green--text" @click="addFriend(user.id)"><v-icon class="mr-1">person_add</v-icon>Accept</v-btn> -->
                </v-list-tile-action>
              </v-flex>
              <v-flex xs6>
                <v-list-tile-action>
                  <v-btn outline small block class="greyColors ml-1" @click="refuseFriend(user.id)"><v-icon class="mr-1">close</v-icon>Refuse</v-btn>
                </v-list-tile-action>
              </v-flex>
            </v-list-tile>
          </template>
      </v-list>
      <v-divider></v-divider>
      <friends-only></friends-only>
    <v-fab-transition >
      <v-btn router to="/search" color="orange" fixed bottom right fab class=" white--text">
        <v-icon>search</v-icon>
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
        if (this.$store.getters.user) {
          if (this.$store.getters.user.friends.length > 0) {
            return this.$store.getters.user.friends
          }
        }
      },
      pendingFriends () {
        if (this.$store.getters.user) {
          if (this.$store.getters.user.pendingFriends.length > 0) {
            // console.log('[pendingFriends] this.$store.getters.user.pendingFriends.length > 0')
            return this.$store.getters.user.pendingFriends
          }
        }
      },
      loading () {
        return this.$store.getters.loading
      },
      loggedInUserId () {
        return this.$store.getters.user.id
      },
      isFriend (friendId) {
        // The findIndex return us the place of the element in the array. So if we just want to check it exist, it should be bigger or equal to 0
        return this.$store.getters.user.friends.findIndex(userId => {
          return userId === friendId
        }) >= 0
      }
    },
    methods: {
      removeFriend (userId) {
        console.log('userID from removeFriendRequest ', userId)
        // this.$store.dispatch('acceptFriendRequest', userId)
      },
      messageFriend (userId) {
        console.log('userID from sendMessaget ', userId)
        // this.$store.dispatch('sendFriendRequest', userId)
      },
      // addFriend (userId) {
      //   this.$store.dispatch('acceptFriendRequest', userId)
      //   console.log('userID from addFriend ', userId)
      // },
      addFriend (friend) {
        this.$store.dispatch('acceptFriendRequest', friend)
        console.log('userID from addFriend ', friend)
      },
      refuseFriend (userId) {
        console.log('userID from refuseFriend ', userId)
      }
    }
  }
</script>

<style scoped>
  .container{
    margin-top: 0;
    padding: 8px;
  }
  .greyColors{
    background-color: #f6f7f9;
    border-color: #ced0d4;
    color: #4b4f56;
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
