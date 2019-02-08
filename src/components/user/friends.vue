<template >
  <v-container class="container">
    <!-- <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="red" :witdh="7" :size="40" v-if="loading" class="mt-5"></v-progress-circular>
        </v-flex>
    </v-layout> -->
    <v-list subheader v-if="pendingFriends"  xs12>
          <v-subheader>Friends invitations</v-subheader>
          <template v-for="user in pendingFriends">
            <v-divider></v-divider>
            <v-list-tile :key="user.id" v-if="!loading && user.id != loggedInUserId" class="mt-2 mb-2">
              <v-flex xs2 >
                <v-list-tile-avatar>
                  <img :src="user.imageUrl"/>
                </v-list-tile-avatar>
                <!-- <v-list-tile-content>
                  <v-list-tile-title v-html="user.firstName + ' ' + user.lastName" @click="getUserPage(user)"></v-list-tile-title>
                  <v-list-tile-sub-title>
                    <v-list-tile-action>
                      <v-btn small flat class="greyColors ml-1" @click="refuseFriend(user)">Ignore</v-btn>
                      <v-btn small class="primary--text" outline @click="addFriend(user)"><v-icon class="mr-1">person_add</v-icon>Accept</v-btn>
                    </v-list-tile-action>
                  </v-list-tile-sub-title>
                </v-list-tile-content> -->
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
      <v-divider></v-divider>
      <friends-only></friends-only>
    <v-fab-transition >
      <v-btn router to="/search" color="orange" ripple fixed bottom right fab class="gotosearch white--text">
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
          if (this.$store.getters.user.pendingFriends) {
            if (this.$store.getters.user.pendingFriends.length > 0) {
              // console.log('[pendingFriends] this.$store.getters.user.pendingFriends.length > 0')
              return this.$store.getters.user.pendingFriends
            }
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
      getUserPage (key) {
        console.log('[getUserPage] clicked key', key)
        this.$store.dispatch('getUserData', {userId: key.id})
        this.$router.push('/users/' + key.id)
      },
      messageFriend (userId) {
        console.log('userID from sendMessaget ', userId)
        // this.$store.dispatch('sendFriendRequest', userId)
      },
      addFriend (friend) {
        this.$store.dispatch('acceptFriendRequest', friend)
        console.log('userID from addFriend ', friend)
      },
      refuseFriend (user) {
        this.$store.dispatch('refuseFriend', user)
      }
    }
  }
</script>

<style scoped>
.short{
  height: 40px;
}
.btn--bottom:not(.btn--absolute) {
    bottom: 72px;
}
  .container{
    margin-top: 0px;
    padding: 0px;
    margin-bottom: 56px;
    margin: 0px auto 56px auto;
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
<style>
#app.size-xs .gotosearch {
  bottom: 80px;
}
</style>
