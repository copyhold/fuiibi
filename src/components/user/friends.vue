<template >
  <v-container class="container">
    <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="red" :witdh="7" :size="40" v-if="loading" class="mt-5"></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-layout row wrap v-for="user in friends" :key="user.id" class="mb-1" v-if="!loading && user.id != loggedInUserId">
      <v-flex xs12 sm12 md12>
        <v-card height="120px">
          <v-container fluid>
            <v-layout col xs12>
              <v-flex xs3 sm2 md2>
                <v-card-media :src="user.imageUrl" height="100px" style="background-color: white, border-radius: 50px"></v-card-media>
              </v-flex>
              <v-flex xs7 sm6 md6 class="ml-3">
                <v-card-title primary-title >
                  <v-card-actions wrap>
                    <div>
                      <v-btn flat :to="'/friends/' + user.id" class="">
                        <h3 class="primary--text mb0 mt0 pt0"> {{ user.userName }}</h3>
                      </v-btn>
                    </div>
                  </v-card-actions>
                </v-card-title>
                <!-- <v-card-actions>
                  <v-btn flat :to="'/meetups/' + meetup.id">
                    <v-icon left light>arrow_forward</v-icon>
                    View Meetup</v-btn>
                </v-card-actions> -->
              </v-flex>
              <v-flex xs2 sm4 md4>
                <v-btn class="error white--text hidden-sm-and-up" fab small dark center @click="removeFriend(user.id)" alert >
                  <v-icon>close</v-icon>
                </v-btn>
                <v-btn class="info white--text hidden-sm-and-up" fab small dark center @click="messageFriend(user.id)">
                  <v-icon>message</v-icon>
                </v-btn>
                <v-btn class="info info--text hidden-xs-only" center @click="messageFriend(user.id)" alert outline>
                  <v-icon class="mr-2">message</v-icon>
                  Message
                </v-btn>
                <v-btn class="error error--text hidden-xs-only"  center outline @click="removeFriend(user.id)" alert>
                  <v-icon class="mr-2">close</v-icon>
                  Remove
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-fab-transition >
      <v-btn router to="/event/new" color="green" fixed bottom right fab class=" white--text">
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
        // this.$store.dispatch('sendFriendRequest', userId)
      },
      messageFriend (userId) {
        console.log('userID from sendMessaget ', userId)
        // this.$store.dispatch('sendFriendRequest', userId)
      }
    }
  }
</script>

<style scoped>
  .container{
    margin-top: 0;
    padding: 8px;
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
