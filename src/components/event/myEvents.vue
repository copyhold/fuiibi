<template >
  <v-container class="container">
    <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="darkgray" :width="1" :size="90" v-if="loading" class="mt-5"></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-layout row wrap v-for="item in events" :key="item.id" class="mb-1" v-if="!loading">
      <v-flex xs12 sm12 md12>
        <v-card height="120px">
          <v-container fluid>
            <v-layout col xs12>
              <v-flex xs4 sm2 md2>
                <v-card-media :src="item.event.imageUrl" height="112px" style="background-color: white"></v-card-media>
              </v-flex>
              <v-flex xs8 sm10 md10 class="ml-3">
                <v-layout>
                  <v-card-title primary-title >
                    <v-card-actions wrap>
                      <div>
                        <div @click="eventDetails(item.key)">
                          <h4 class="pl-2 secondaryDark--text bold"> {{ item.event.title }}</h4>
                        </div>
                      </div>
                    </v-card-actions>
                  </v-card-title>
                </v-layout>
                <v-layout>
                  <div offset-xs3>
                    <p class="location">{{ item.event.location.locality }} - {{ item.event.location.country }}</p>
                    <p class="date">{{ item.event.date | date}}</p>
                  </div>
                </v-layout>
                <v-layout>
                    <v-btn flat small class="greyColors" absolute @click="alertB4remove(item)">Remove</v-btn>
                    <!-- <v-btn flat small class="greyColors " absolute outline @click="alertB4remove(item)"><v-icon dark class="mr-1">delete_forever</v-icon>Remove</v-btn> -->
                    <!-- <v-btn fab small class="error mt-4" @click="alertB4remove(item)"><v-icon dark>delete_forever</v-icon></v-btn> -->
                </v-layout>
              </v-flex>
              <!-- <v-flex xs2 sm2 md2>
                <v-btn outline small class="greyColors" @click="alertB4remove(item)">Remove</v-btn>
                <v-btn fab small class="error mt-4" @click="alertB4remove(item)"><v-icon dark>delete_forever</v-icon></v-btn>
              </v-flex> -->
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-fab-transition >
      <v-btn @click="newEvent" color="orange" fixed bottom right fab class=" white--text">
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
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

<style scoped>
.btn--bottom:not(.btn--absolute) {
    bottom: 72px;
}
.bold{
  font-weight: 500;
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

</style>
