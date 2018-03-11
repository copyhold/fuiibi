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
                      <!-- <router-link :to="'/events/' + notification.key">
                        <h4 class="pl-2 primaryDark--text"> {{ notification.event.title }}</h4>
                      </router-link> -->
                      <div @click="eventDetails(notification.key)">
                        <h4 class="pl-2 primaryDark--text"> {{ notification.event.title }}</h4>
                      </div>
                        <p class="timer">{{ timeStamp(notification) }}</p>
                    </v-card-actions>
                  </v-card-title>
                </v-layout>
                <v-layout>
                  <div offset-xs3>
                    <p class="location">{{ notification.event.location.locality }} - {{ notification.event.location.country }}</p>
                    <!-- <p class="location" v-if="locality(notification)">{{ notification.event.location.locality }} - {{ notification.event.location.country }}</p>
                    <p class="location" v-else>{{ notification.event.location.country }}</p> -->
                    <p class="date">{{ notification.event.date | date}}</p>
                  </div>
                </v-layout>
                <v-layout>
                  <div offset-xs3>
                    <!-- <p>{{ myFriends(notification) }} friends were there!</p> -->
                    <p><b>{{ notification.clickerName }}</b> was there!</p>
                    <!-- <p v-if="friendsCount(notification)"><b>{{ notification.clickerName }}</b> was there!</p>
                    <p else><b>{{ notification.clickerName }}</b> and {{ notification.friendsCount }} friends were there!</p> -->
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
      <v-btn @click="newEvent" color="orange" fixed bottom right fab class=" white--text">
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script>
  export default {
    computed: {
      notifications () {
        if (this.$store.getters.user.notifications) {
          // console.log('[notifications] this.$store.getters.user.notifications', this.$store.getters.user.notifications)
          return this.$store.getters.user.notifications
        }
      },
      loading () {
        return this.$store.getters.loading
      },
      locality (notification) {
        if (notification.event) {
          console.log('[locality] notification.event', notification.event)
          return true
        }
      }
    },
    methods: {
      newEvent () {
        this.$router.push('/event/new')
      },
      eventDetails (key) {
        this.$router.push('/events/' + key)
      },
      /* eslint-disable */
      wasThere (key) {
        return this.$store.getters.user.events.findIndex(event => {
          return event.key === key
        }) >= 0
      },
      // friendsCount (notification) {
      //   notification.friendsCount > 0
      // },
      iwtClicked (notification) {
        this.$store.dispatch('iwtClicked', {notification: notification, userId: this.$store.getters.user.id , userName: this.$store.getters.user.userName})
      },
      timeStamp (notification) {
        let diff = Math.round(Math.abs(Date.now() + notification.dateToRank) / 60 / 1000)
        // console.log('[timeStamp] notification', notification);
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
    background: url("../img/iwt3.png") center/95% no-repeat;
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
