<template >
  <v-container class="container">
    <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="darkgray" :width="1" :size="90" v-if="loading" class="mt-5"></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-container grid-list-sm fluid>

    <v-layout row wrap >
      <v-flex xs12 sm6 md6 v-for="item in events" :key="item.id" class="mb-1" v-if="!loading">
        <v-card height="120px">
          <v-container fluid>
            <v-layout col xs12 @click="eventDetails(item.key)">
              <v-flex xs4 sm4 md4 >
                <v-img :src="item.event.imageUrl" height="112px" style="background-color: white" class="clickable" />
              </v-flex>
              <v-flex xs8 sm8 md8 class="ml-3">
                <v-layout column full-height style="height: 100%;">
                  <p class="bold  mt-2">{{ item.event.title }}</p>
                  <p class="location">{{ item.event.location.locality }} - {{ item.event.location.country }}</p>
                  <p class="date">{{ item.event.date | date}}</p>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-fab-transition >
      <v-btn @click="newEvent" color="orange" fixed bottom right fab class="addevent white--text">
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</v-container>

</template>

<script>
  export default {
    data: () => ({
      direction: 'left',
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: 'slide-y-reverse-transition'
    }),
    watch: {
      top (val) {
        this.bottom = !val
      },
      right (val) {
        this.left = !val
      },
      bottom (val) {
        this.top = !val
      },
      left (val) {
        this.right = !val
      }
    },

    computed: {
      events () {
        if (this.$store.getters.user) {
          return this.$store.getters.user.events
        }
      },
      loading () {
        return this.$store.getters.loading
      },
      activeFab () {
        switch (this.tabs) {
          case 'one': return { 'class': 'purple', icon: 'account_circle' }
          case 'two': return { 'class': 'red', icon: 'edit' }
          case 'three': return { 'class': 'green', icon: 'keyboard_arrow_up' }
          default: return {}
        }
      }
    },
    methods: {
      eventDetails (key) {
        this.$router.push('/events/' + key)
      },
      newEvent () {
        this.$router.push('/event/new')
      },
      alertB4remove (event) {
        // console.log('[alertB4remove] methods payload', event)
        this.$store.dispatch('removeEventFromUser', event)
      }
    }
  }
</script>

<style>
#app.size-xs .addevent {
  bottom: 80px;
}
</style>
<style scoped>
.btn--bottom:not(.btn--absolute) {
    bottom: 72px;
}
.bold{
  font-weight: 500;
  font-size: 1.2em;
}
.application a {
    text-decoration: none;
}
p {
  margin-bottom: 4px;
}
.greyColors{
  background-color: #f6f7f9;
  border-color: #ced0d4;
  color: #4b4f56;
  right: 0px;
  bottom: 8px;
}
.date {
  color: grey;
}
.container{
  margin-top: 0;
  padding: 4px;
  margin-bottom: 56px;
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
.btn--floating.btn--small {
    position: absolute;
    bottom: 5px;
}
@media screen and (max-width: 600px) {
  .container.grid-list-sm .layout .flex {
    padding: 0;
  }
}
</style>
