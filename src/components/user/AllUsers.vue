<template >
  <v-container class="container">
    <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="red" :witdh="7" :size="40" v-if="loading" class="mt-5"></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-layout row wrap v-for="user in friends" :key="user.id" class="mb-1" v-if="!loading && user.id != loggedInUserId">
      <v-flex xs12 sm12 md10 offset-md2>
        <v-card height="120px">
          <v-container fluid>
            <v-layout col xs8>
              <v-flex xs3 sm4 md4>
                <v-card-media
                :src="user.imageUrl"
                height="100px"
                style="background-color: white">
                </v-card-media>
              </v-flex>
              <v-flex xs4 sm5 md5>
                <v-layout row>
                  <v-flex>
                    <v-card-title primary-title >
                      <v-card-actions wrap>
                        <div>
                          <v-btn flat :to="'/friends/' + user.id" class="">
                            <h3 class="primary--text mb0 mt0 pt0"> {{ user.userName }}</h3>
                          </v-btn>
                        </div>
                      </v-card-actions>
                    </v-card-title>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex v-if="!isFriend(user)">
                    <v-btn class="info info--text" outline @click="sendFriendRequest(user.id)"><v-icon>add</v-icon>Add friend</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
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
