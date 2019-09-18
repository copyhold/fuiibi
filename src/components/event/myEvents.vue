<template >
  <v-container class="container mb-5">
    <v-container grid-list-sm fluid>
    <v-layout row wrap >
      <v-flex xs12 sm6 md6 v-for="(item,index) in events" :key="index" class="mb-1">
        <v-card>
          <v-container fluid>
            <v-layout col xs12>
              <v-flex xs4 sm4 md4>
                <v-img :src="item.imageUrl" height="120px" />
              </v-flex>
              <v-flex xs8 sm8 md8 class="ml-3">
                <v-layout column full-height style="height: 100%;">
                  <p class="bold  mt-2" @click="eventDetails(item.id)">{{ item.title }}</p>
                  <p class="location" v-if="item.location">{{ item.location.locality }} - {{ item.location.country }}</p>
                  <p class="date">{{ item.date | date}}</p>
                  <v-btn  flat small class="greyColors align-self-end" @click="alertB4remove(index)" end>Remove</v-btn>
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
    activeFab () {
      switch (this.tabs) {
        case 'one': return { 'class': 'purple', icon: 'account_circle' }
        case 'two': return { 'class': 'red', icon: 'edit' }
        case 'three': return { 'class': 'green', icon: 'keyboard_arrow_up' }
        default: return {}
      }
    },
    events () {
      return this.$store.getters.myevents
    }
  },
  methods: {
    eventDetails (key) {
      this.$router.push('/events/' + key)
    },
    newEvent () {
      this.$router.push('/event/new')
    },
    alertB4remove (index) {
      const event = this.events[index]
      if (!confirm('Event remove you would like?')) return
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
