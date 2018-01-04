<template lang="html">
  <v-container class="container">
    <v-layout row wrap v-if="loading">
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
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h2 class="primary--text">{{ meetup.title }}</h2>
            <!-- Below I create a template because I want to show it only if the user is the creator of the meetup. -->
            <template v-if="userIsCreator">
              <v-spacer></v-spacer>
              <!-- below I link my :meetup from the EditMeetupDetailsDialog.vue in the props to the meetup here that has been uploaded in this template -->
              <app-edit-meetup-details-dialog :meetup="meetup"></app-edit-meetup-details-dialog>
            </template>

          </v-card-title>
          <v-card-media
          :src="meetup.imageUrl"
          height="400px">

          </v-card-media>
          <v-card-text>
            <div class="info--text">
              {{ meetup.date | date }} - {{ meetup.location }}
            </div>
            <div>
              <app-edit-meetup-date-dialog :meetup="meetup" v-if="userIsCreator"></app-edit-meetup-date-dialog>
            </div>
            <div >
              {{ meetup.description }}
             </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- We receive the meetup from our computed properties below that goes to the store to bring it. Then we can get the meetup.id which gives
          his value to the :meetupId below, which is given as props in the RegisterDialog component -->
            <app-meetup-register-dialog :meetupId="meetup.id" v-if="userIsAuthenticated && !userIsCreator"></app-meetup-register-dialog>
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
    meetup () {
      return this.$store.getters.loadedMeetup(this.id)
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
  .container{
    margin-top: 0;
  }
</style>
