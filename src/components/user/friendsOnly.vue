<template >
  <div class="mt-2">
    <!-- <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="red" :witdh="7" :size="40" v-if="loading" class="mt-5"></v-progress-circular>
        </v-flex>
    </v-layout> -->
    <v-list subheader>
        <v-subheader>My Friends</v-subheader>
        <template v-for="user in friends" >
          <v-divider></v-divider>
          <v-list-tile avatar v-bind:key="user.id" @click="" v-if="!loading && user.id != loggedInUserId">
            <v-list-tile-avatar>
              <img :src="user.imageUrl"/>
            </v-list-tile-avatar>
            <v-list-tile-content @click="getUserPage(user)">
              <v-list-tile-title v-html="user.firstName + ' ' + user.lastName"></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn small flat class="greyColors" @click="removeFriend(user)">Remove</v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </template>
        <!-- <v-layout>
          <p>
            My friends
          </p>
        </v-layout>
        <template v-for="user in friends" >
          <v-card>
            <v-card-media :src="user.imageUrl" class="squaredVCard">
              <v-btn flat small class="greyColors" @click="removeFriend(user)" absolute><v-icon class="mr-1">close</v-icon></v-btn>
              <v-card-title class="white--text">
                {{ user.firstName }} {{ user.lastName }}
              </v-card-title>
            </v-card-media>
          </v-card>
        </template>-->
    </v-list>
  </div>
</template>

<script>
  export default {
    props: ['search'],
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
      // filteredFriends () {
      //   if (this.$store.getters.user) {
      //     if (this.$store.getters.user.friends) {
      //       if (this.$store.getters.user.friends.length > 0) {
      //         return this.friends.filter((user) => {
      //           // return user.firstName.match(this.search)
      //           return user.firstName.toLowerCase().match(this.search.toLowerCase()) || user.lastName.toLowerCase().match(this.search.toLowerCase())
      //         })
      //       }
      //     }
      //   }
      // },
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
