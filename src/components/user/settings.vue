<template lang="html">
  <v-container class="container">
    <div @click="back" class="arrowBack">
        <v-icon class="secondaryDark--text">arrow_back</v-icon>
    </div>
    <v-layout row wrap v-if="loading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="red" :witdh="7":size="70" v-if="loading"></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-expansion-panel class="mb-5">
          <v-expansion-panel-content>
            <div slot="header">Add Fuiibi's icon on your home srceen</div>
            <v-card>
              <v-card-text><p>If you are using Chrome, please process as follow.
                For the other browsers, this technology is not yet supported.
                We will update this tutorial as soon as it will be supported.</p>
                <p>So for chrome users:</p>
                <p>Click on the three dots on the right up corner of the browser.</p>
                <v-divider></v-divider>
                <img src="../../images/screenTop.png" class="mt-2 mb-2 image">
                <v-divider></v-divider>
                <p>Once the menu is opened, just click on the "Add to Home screen".</p>
                <v-divider></v-divider>
                <img src="../../images/menuOpen.png" class="mt-2 mb-2 image">
                <!-- <v-card-media src="../src/images/menuOpen.png" height="567px" class="mt-2 mb-2"></v-card-media> -->
                <v-divider></v-divider>

                <p>That's it, you can now find Fuiibi's icon on your desktop,
                  no need to enter and download from any store. And your app
                  will be always updated automaticly. Enjoy!</p>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- <v-card>
          <v-card-media :src="user.imageUrl" height="300px">
          </v-card-media>
          <v-card-title class="eventTitle">
              <h2>{{ user.firstName }}</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-container fluid>
            <v-layout col>
                <v-flex xs5 sm5 md5>
                  <h4 class="greyColor">First name:</h4>
                  <h4 class="greyColor">Last name:</h4>
                  <h4 v-if="dateOfBirth" class="greyColor">Date of birth:</h4>
                  <h4 else class="greyColor">Date of birth:</h4>
                  <h4 v-if="livingIn" class="greyColor">Living in:</h4>
                  <h4 else class="greyColor">Living in:</h4>
                  <h4 else class="greyColor">Gender:</h4>
                  <h4 else class="greyColor">Email:</h4>
                </v-flex>
                <v-flex xs7 sm7 md7>
                  <h4> {{ user.firstName }}</h4>
                  <h4> {{ user.lastName }}</h4>
                  <h4 v-if="dateOfBirth"> {{ user.dateOfBirth }}</h4>
                  <h4 else>unknown</h4>
                  <h4 v-if="livingIn"> {{ user.livingIn }}</h4>
                  <h4 else>unknown</h4>
                  <h4 v-if="gender"> {{ user.gender }}</h4>
                  <h4 else>unknown</h4>
                  <h4 else>{{ user.email }}</h4>
                </v-flex>
            </v-layout>
          </v-container>

        </v-card> -->
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
      livingIn () {
        if (this.$store.getters.user.livingIn) {
          console.log('[livingIn]')
          return this.$store.getters.user.livingIn
        }
      },
      dateOfBirth () {
        if (this.$store.getters.user.dateOfBirth) {
          console.log('[dateOfBirth]')
          return this.$store.getters.user.dateOfBirth
        }
      },
      gender () {
        if (this.$store.getters.user.gender) {
          console.log('[dateOfBirth]')
          return this.$store.getters.user.gender
        }
      },
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
      back () {
        this.$router.go(-1)
      },
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
  p {
    margin: 8px 0px;
  }
  .image {
    width: 100%;
  }
  .greyColor{
    color: grey;
  }
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
    top: 8px;
    left: 8px;
    z-index: 3;
  }
</style>
