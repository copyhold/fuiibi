<template >
  <v-container class="container">
    <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="red" :witdh="7" :size="40" v-if="loading" class="mt-5"></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-layout row wrap v-for="notification in notifications" :key="notification.key" class="mb-1" v-if="!loading">
      <v-flex xs12 sm12 md12>
        <v-card height="120px">
          <v-container fluid>
            <v-layout col xs12>
              <v-flex xs3 sm2 md2>
                <v-card-media :src="notification.event.imageUrl" height="100px" style="background-color: white"></v-card-media>
              </v-flex>
              <v-flex xs7 sm8 md8 class="ml-3">
                <v-layout>
                  <v-card-title primary-title >
                    <v-card-actions wrap>
                      <router-link :to="'/events/' + notification.key">
                        <h3 class="pl-2 darkgray--text"> {{ notification.event.title }}</h3>
                      </router-link>
                        <!-- <v-btn flat right :to="'/events/' + notification.key">
                          <h3 class="primary--text pl-2"> {{ notification.event.title }}</h3>
                        </v-btn> -->
                        <p class="timer">{{ timeStamp(notification) }}</p>
                    </v-card-actions>
                  </v-card-title>
                </v-layout>
                <v-layout>
                  <div offset-xs3>
                    <p class="location">{{ notification.event.location.locality }}</p>
                    <p class="date">{{ notification.event.date | date}}</p>
                  </div>
                </v-layout>
                <v-layout>
                  <div offset-xs3>
                    <p>{{ notification.counter }} friends were there!</p>
                  </div>
                </v-layout>
              </v-flex>
              <v-flex xs2 sm2 md2>
                <v-btn fab large class="iwt" center v-if="!wasThere(notification.key)" @click="iwtClicked(notification)"></v-btn>
                <span v-else>
                  <v-btn fab flat large class="iwt clicked" center></v-btn>
                  <v-badge overlap overlay color="red" class="vuBadge">
                    <v-icon dark slot="badge">check</v-icon>
                  </v-badge>
                </span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-fab-transition >
      <v-btn router to="/event/new" color="orange" fixed bottom right fab class=" white--text">
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>

</template>

<script>
  export default {
    computed: {
      notifications () {
        return this.$store.getters.user.notifications
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      /* eslint-disable */
      wasThere (eventId) {
        return this.$store.getters.user.events.findIndex(event => {
          return event.eventId === eventId
        }) >= 0
      },
      iwtClicked (notification) {
        this.$store.dispatch('iwtClicked', notification)
      },
      timeStamp (notification) {
        let diff = Math.round(Math.abs(Date.now() + notification.event.dateToRank) / 60 / 1000)
        if (diff < 60) {
          return diff + 'min'
        }
        else if (diff >= 60 && diff <= 1440) {
          return Math.round(diff / 60) + 'h'
        }
        else {
          return Math.round(diff / 60 / 24) + 'd'
        }
      }
    }
  }
</script>

<style scoped>
.application a {
    text-decoration: none;
  }
  .timer{
    position: absolute;
    right: 200px;
    color: grey;
  }
  .container{
    margin-top: 0;
    padding: 8px;
  }
  .card__title--primary {
    padding: 0px 16px;
  }
  .card_actions{
    padding: 0px;
  }
  .btn_content{
    padding: 0px;
  }
  .iwt{
    height: 90px;
    width: 90px;
    background: url("../img/iwt2.png") center/95% no-repeat;
    position: absolute;
    right: 0px;
  }
  .clicked{
    filter: opacity(50%);
  }
  span.vuBadge {
      bottom: 36px;
      right: 24px;
      position: absolute;
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
  .date {
    color: grey;
  }
  p.location {
        margin-bottom: 0px;
  }
  @media screen and (max-width: 600px) {
    .iwt{
      height: 60px;
      width: 60px;
      margin-top: 40px;
    }
    .timer{
      right: 24px;
      font-size: 12px;
    }
    p {
      font-size: 13px;
    }
    span.vuBadge {
        bottom: 28px;
        right: 20px;
        position: absolute;
    }
  }
</style>
