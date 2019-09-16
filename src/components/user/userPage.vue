<template lang="html">
  <v-container class="container">
    <v-layout row wrap v-if="loading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="darkgray" :width="1" :size="90" v-if="loading"></v-progress-circular>
        </v-flex>
    </v-layout>
    <div @click="back" class="arrowBack clickable">
        <v-icon class="secondaryDark--text">arrow_back</v-icon>
    </div>
    <v-layout row wrap v-if="!loading && user">
      <v-flex xs12>

        <v-card class="mb-1">
          <v-img :src="user.imageUrl" height="120px" >
          </v-img>
          <v-card-title class="eventTitle">
              <h2>{{ user.firstName }}</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <h4>{{ user.firstName }} {{ user.lastName }}</h4>
            <h4 v-if="userHasLocality">{{ user.livingIn.locality }} - {{ user.livingIn.country }}</h4>
          </v-card-text>
        </v-card>

      </v-flex>
    </v-layout>

    <v-layout row wrap v-for="(item,index) in events" :key="index" class="mb-1" v-if="!loading && user">
      <v-flex xs12 sm12 md12>
        <v-card height="120px">
          <v-container fluid>
            <v-layout col xs12>
              <v-flex xs4 sm2 md2>
                <v-img :src="item.imageUrl" height="112px" style="background-color: white"></v-img>
              </v-flex>
              <v-flex xs8 sm10 md10 class="ml-3">
                <v-layout>
                  <!-- <v-card-title primary-title > -->
                    <!-- <v-card-actions wrap> -->
                      <div @click="eventDetails(item.id)">
                        <h4 class="secondaryDark--text bold pt-3 pb-2"> {{ item.title }}</h4>
                      </div>
                    <!-- </v-card-actions> -->
                  <!-- </v-card-title> -->
                </v-layout>
                <v-layout v-if="item.location">
                  <div offset-xs3>
                    <p class="location">{{ item.location.locality }} - {{ item.location.country }}</p>
                    <p class="date">{{ item.date | date}}</p>
                  </div>
                </v-layout>
              </v-flex>
              <v-flex xs2 sm2 md2>
                <v-btn fab large class="iwt" center v-if="!wasThere(item.id)" @click="iwtClicked(item.id)">
                  <v-icon v-if="loadingEvent[item.id]">loop</v-icon>
                </v-btn>
                <span v-else>
                  <v-btn flat large class="iwt checked" center></v-btn>
                </span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import Vue from 'vue'
export default {
  props: ['id'],
  data () {
    return {
      events: [],
      loadingEvent: {},
      loadingEvents: true
    }
  },
  created () {
    this.fetchEvents()
  },
  computed: {
    userHasLocality () {
      if (this.user.livingIn) {
        if (this.user.livingIn.locality) {
          return true
        }
      }
    },
    user () {
      return this.$store.getters.person(this.id)
    },
    loading () {
      return this.$store.getters.loading
    },
    userWasThere () {
      return this.$store.getters.user.events.findIndex(event => {
        return event.key === this.id
      }) >= 0
    }
  },
  methods: {
    fetchEvents () {
      this.loadingEvents = true
      global.firebase.functions()
      .httpsCallable('loadUserEvents')({ uid: this.id })
      .then(response => {
        this.events = response.data
        this.loadingEvents = false
      })
      .catch(this.$error)
    },
    eventDetails (key) {
      this.$router.push('/events/' + key)
    },
    wasThere (key) {
      const {user} = this.$store.getters
      if (!user || !user.userEvents) return false
      return Object.values(user.userEvents).indexOf(key) > -1
    },
    back () {
      this.$router.go(-1)
    },
    iwtClicked (evid) {
      Vue.set(this.loadingEvent, evid, true)
      this.$store.dispatch('iwtClicked', evid)
      .then(() => {
        Vue.set(this.loadingEvent, evid, false)
      })
      .catch(this.$error)
    }
  }
}
</script>

<style scoped>

  h2 {
    padding-left: 10px;
  }
  .clickable {
    cursor: pointer;
  }
  .bold{
    font-weight: 500;
  }
  .container{
    margin-top: 0;
    padding: 4px;
    margin-bottom: 56px;
  }
  .application a {
    text-decoration: none;
  }
  .timer{
    position: absolute;
    right: 200px;
    color: grey;
  }
  .card__title--primary {
    padding: 0px 0px;
  }
  div.card_actions{
    padding: 8px 0px;
    margin: 0px;
  }
  div {
    margin: 0px;
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
  .btn--block {
    margin: 0;
  }
  .btn--bottom {
    bottom: 0px;
  }
  .profilePic{
    width: 250px;
  }
  .eventTitle{
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    text-align: left;
    color: white;
    position: absolute;
    top: 0px;
    font-size: 20px;
    font-weight: 200;
    min-height: 120px;
  }
  .checked{
    background: url("../img/iwtChecked.png") right/95% no-repeat;
  }
  @media only screen and (max-width: 599px) {
    .timer{
      right: 24px;
      font-size: 12px;
    }
    p {
      font-size: 13px;
    }
    .container {
      padding: 4;
    }
    .arrowBack {
      position: fixed;
      top: 14px;
      left: 8px;
      z-index: 3;
    }
    .iwt{
      height: 72px;
      width: 72px;
      background: url("../img/iwt3.png") center/95% no-repeat;
      position: absolute;
      right: 0px;
      bottom: 8px;
    }
    p {
      margin-bottom: 4px;
    }
    /* p.location {
          margin-bottom: 0px;
    } */
    .clicked{
      filter: opacity(50%);
    }
    span.vuBadge {
      bottom: 32px;
      right: 16px;
      position: absolute;
    }
    .checked{
      background: url("../img/iwtChecked.png") right/80% no-repeat;
    }
  }
</style>

<!-- // eventLenght () {
//   console.log(this.event)
//   console.log('this.event.event.users.__ob__.dep.subs.length', this.event.event.users.__ob__.dep.subs.length)
//   console.log('this.event.event.users.__ob__.value.__ob__.dep.subs.length', this.event.event.users.__ob__.value.__ob__.dep.subs.length)
//   return this.event.event.users.__ob__.dep.subs.length
// },
// galery () {
//   return this.$store.getters.getGalery()
// },
// userIsAuthenticated () {
//   return this.$store.getters.user !== null && this.$store.getters.user !== undefined
// },
// userIsCreator () {
//   if (!this.userIsAuthenticated) {
//     return false
//   }
//   return this.$store.getters.user.id === this.meetup.creatorId
// }, -->
