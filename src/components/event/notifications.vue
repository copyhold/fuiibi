<template>
  <v-container class="container pb-1">
    <v-container>
      <!-- <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate color="darkgray" :width="1" :size="90" v-if="loading" class="mt-5"></v-progress-circular>
      </v-flex> -->
      <v-layout row wrap v-if="notifications.length<1" class="mt-5">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="darkgray" :width="1" :size="90" v-if="notifications.length<1"></v-progress-circular>
        </v-flex>
      </v-layout>
      
      <v-container grid-list-sm fluid v-else style="background: white url('/src/images/icons/imageForBackground.png') repeat" >
        <v-layout row wrap >
            <v-flex xs12 sm6 md4 wrap v-for="notification in notifications" :key="notification.d" class="mb-1">
              <v-card v-if="notification.e">
                <v-img @click="eventDetails(notification.e[0])" :src="notification.e[1]" height="250px" style="background-color: white" />
                <mark v-if="notification.totalnotis>1" class="noti-group-counter"> {{notification.totalnotis}} </mark>
                <v-layout col align-end ml-3 mt-3>
                  <v-flex xs9 tag="h4" @click="eventDetails(notification.e[0])" class="secondaryDark--text bold bigger"> {{ notification.e[2] }}</v-flex>
                  <time class="xs3 flex timer text-xs-center">{{ timeStamp(notification) }} ago</time>
                </v-layout>
                <v-layout col align-end ml-3 pb-2>
                  <v-flex xs9>
                    <v-layout @click="eventDetails(notification.e[0])">
                      <div offset-xs3>
                        <p class="location">{{ notification.e[4] }}</p>
                        <p class="date">{{ notification.e[3] | date}}</p>
                      </div>
                    </v-layout>
                    <v-layout>
                      <div offset-xs3>
                        <p v-if="notification.e[5] === 1" @click="getUserPage(notification.u[0])"><span class="bold clickable">{{ notification.u[1] }}</span> was there!</p>
                        <p v-else-if="notification.e[5] === 2"><span class="bold clickable" @click="getUserPage(notification.u[0])">{{ notification.u[1] }}</span> & 1 friend were there!</p>
                        <p v-else><span class="bold clickable" @click="getUserPage(notification.u[0])">{{ notification.u[1] }}</span> &amp; {{ notification.e[5] - 1}} friends were there!</p>
                      </div>
                    </v-layout>
                  </v-flex>
                  <v-flex xs3 align-self-end text-xs-center v-if="!wasThere(notification.e[0])">
                    <v-btn fab large class="iwt" @click="iwtClicked(notification.e[0])"></v-btn>
                  </v-flex>
                  <v-flex xs3 align-self-end text-xs-center v-else>
                    <v-btn flat large class="iwt checked" center></v-btn>
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
    computed: mapState({
      notifications: state => {
        if (!state.user.feed) return []
        const idsmap = {}
        const result = []

        for (const noti of state.user.feed) {
          const sameeventnoti = idsmap[noti.e[0]]
          if (sameeventnoti >= 0) {
            noti.totalnotis = result[sameeventnoti].totalnotis + 1
            result[sameeventnoti] = null
          } else {
            noti.totalnotis = 1
          }
          result.push(noti)
          idsmap[noti.e[0]] = result.length - 1
        }
        return result.filter(noti => !!noti)
      },
      loading: state => state.loading
    }),
    methods: {
      newEvent () {
        this.$router.push('/event/new')
      },
      eventDetails (key) {
        this.$router.push('/events/' + key)
      },
      getUserPage (uid) {
        this.$log('[getUserPage] clicked key', uid)
        this.$store.dispatch('loadPersons', [uid])
     // this.$store.dispatch('getUserData', {userId: uid})
        this.$router.push('/users/' + uid)
      },
      /* eslint-disable */
      wasThere (evid) {
        if (!this.$store.getters.user.userEvents) return false
        const myevents = new Set(Object.keys(this.$store.getters.user.userEvents))
        return myevents.has(evid)
      },
      iwtClicked (evid) {
        this.$store.dispatch('iwtClicked', evid)
      },
      timeStamp (notification) {
        let diff = Math.round(Math.abs(Date.now() - notification.d) / 60 / 1000)
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
.noti-group-counter {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  z-index: 1;
  border-radius: 50%;
  color: #fff;
  background: #20b050;
  font-size: 11px;
  line-height: 20px;
  text-align: center;
}
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
  background: url("../img/iwtChecked.png") left/65% no-repeat;
}
/* .clicked{
  filter: opacity(50%);
} */
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
