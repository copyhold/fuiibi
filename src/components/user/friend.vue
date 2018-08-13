<template lang="html">
  <v-container class="container">
    <!-- <v-layout row wrap v-if="loading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular
          indeterminate
          color="red"
          :witdh="7"

          :size="70"
          v-if="loading"
          ></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-layout row wrap v-else>-->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h2 class="primary--text">{{ user.firstName }}</h2>
          </v-card-title>
          <v-card-media :src="user.imageUrl" height="400px">
          </v-card-media>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- We receive the meetup from our computed properties below that goes to the store to bring it. Then we can get the meetup.id which gives
          his value to the :meetupId below, which is given as props in the RegisterDialog component -->
            <v-btn class="info" center @click="sendFriendRequest">Send friend request</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ['id'],
  computed: {
    user () {
      return this.$store.getters.getUser(this.id)
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
    userIsCreator () {
      if (!this.userIsAuthenticated) {
        return false
      }
      return this.$store.getters.user.id === this.meetup.creatorId
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

<style scoped>
  .btn--bottom:not(.btn--absolute) {
      bottom: 72px;
  }
  .container{
    margin-top: 0;
    margin-bottom: 56px;
  }
</style>
