<template>
  <v-container class="container">
    <v-container>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate color="darkgray" :width="1" :size="90" v-if="loading" class="mt-5"></v-progress-circular>
      </v-flex>
      <v-container grid-list-sm fluid>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 wrap v-for="notification in notifications" :key="notification.key" class="mb-1" v-if="!loading">
              <v-card v-if="notification.event">
                <v-img @click="eventDetails(notification.key)" :src="notification.event.imageUrl" height="212px" style="background-color: white" />
                <v-layout col align-end ml-3 mt-3>
                  <v-flex xs9 tag="h4" @click="eventDetails(notification.key)" class="secondaryDark--text bold bigger"> {{ notification.event.title }}</v-flex>
                  <time class="xs3 flex timer text-xs-center">{{ timeStamp(notification) }} ago</time>
                </v-layout>
                <v-layout col align-end ml-3 pb-2>
                  <v-flex xs9>
                    <v-layout @click="eventDetails(notification.key)">
                      <div offset-xs3>
                        <p class="location">{{ notification.event.location.locality }} - {{ notification.event.location.country }}</p>
                        <p class="date">{{ notification.event.date | date}}</p>
                      </div>
                    </v-layout>
                    <v-layout>
                      <div offset-xs3>
                        <!-- <p>{{ myFriends(notification) }} friends were there!</p> -->
                        <!-- <p><b>{{ notification.clickerName }}</b> was there!</p> -->
                        <p v-if="notification.friendsCount === 1" @click="getUserPage(notification)"><span class="bold clickable">{{ notification.clickerName }}</span> was there!</p>
                        <p v-else-if="notification.friendsCount === 2"><span class="bold clickable" @click="getUserPage(notification)">{{ notification.clickerName }}</span> & 1 friend were there!</p>
                        <p v-else><span class="bold clickable" @click="getUserPage(notification)">{{ notification.clickerName }}</span> & {{ notification.friendsCount - 1}} friends were there!</p>
                      </div>
                    </v-layout>
                  </v-flex>
                  <v-flex xs3 align-self-end text-xs-center v-if="!wasThere(notification.key)">
                    <v-btn fab large class="iwt" @click="iwtClicked(notification)"></v-btn>
                  </v-flex>
                  <v-flex xs3 align-self-end text-xs-center v-else>
                    <v-btn flat large class="iwt checked" center></v-btn>
                    <!-- <v-badge bottom overlap overlay color="red" class="vuBadge"><v-icon dark slot="badge">check</v-icon></v-badge> -->
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
        </v-layout>
      </v-container>

      <v-fab-transition >
        <v-btn @click="newEvent" color="orange" ripple fixed bottom right fab class="addevent white--text" >
          <v-icon>add</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-container>
  </v-container>

</template>

<script>
  const {mapState} = require('vuex')
  export default {
    data () {
      return {
        marginTop: true
      }
    },
    created () {
      this.$log(this.$vuetify.breakpoint)
    },
    computed: mapState({
      notifications: state => {
        const {notifications} = state.user.user
        if (!notifications) return []
        return Object.values(notifications).sort((a, b) => a.dateToRank - b.dateToRank)
      },
      loading: state => state.loading
    }),
    methods: {
      newEvent () {
        this.$router.push('/event/new')
      },
      eventDetails (key) {
        console.log('[eventDetails] key', key)
        this.$router.push('/events/' + key)
      },
      getUserPage (key) {
        console.log('[getUserPage] clicked key', key)
        this.$store.dispatch('getUserData', {userId: key.userId})
        this.$router.push('/users/' + key.userId)
      },
      /* eslint-disable */
      wasThere (key) {
        return this.$store.getters.user.events.findIndex(event => {
          return event.key === key
        }) >= 0
      },
      iwtClicked (notification) {
        this.$store.dispatch('iwtClicked', {notification: notification, userId: this.$store.getters.user.id , firstName: this.$store.getters.user.firstName})
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
<style>
#app.size-xs .addevent {
  bottom: 80px;
}
</style>
<style scoped>
.container.grid-list-sm .layout .flex {
  padding: 2px;
}
span.vuBadge {
  position: absolute;
  bottom: 17px;
  right: 26px;
}
.clickable {
  cursor: pointer;
}
.btn--bottom:not(.btn--absolute) {
    bottom: 72px;
}
.bold{
  font-weight: 500;
}
.bigger {
  font-size: 1.2em;
}
.application a {
    text-decoration: none;
}
.timer{
  color: grey;
}
.container{
  margin-top: 0;
  padding: 0px;
  margin-bottom: 56px;
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
  height: 60px;
  width: 60px;
  background: url("../img/iwt3.png") center/95% no-repeat;
  right: unset;
  bottom: unset;
  filter: none;
}
.iwt .v-badge .v-icon {
  font-size: 15px;
}
.checked{
  background: url("../img/iwtChecked.png") center/65% no-repeat;
}
.clicked{
  filter: opacity(50%);
}
.btn__content {
  padding: 0px !important;
}
.card__actions {
  padding: 0px;
}
.card__title--primary {
  padding: 0px 0px;
  margin-top: 8px;
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
  }
  .timer{
    font-size: 12px;
  }
  p {
    font-size: 13px;
  }
}
</style>
