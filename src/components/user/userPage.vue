<template lang="html">
  <v-container class="container">
    <v-layout row wrap v-if="loading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="darkgray" :width="1" :size="90" v-if="loading"></v-progress-circular>
        </v-flex>
    </v-layout>
    <div @click="back" class="arrowBack">
        <v-icon class="secondaryDark--text">arrow_back</v-icon>
    </div>
    <v-layout row wrap>
      <v-flex xs12>

        <v-card class="mb-1">
          <v-card-media :src="user.imageUrl" height="120px" >
          </v-card-media>
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

    <v-layout row wrap v-for="item in userEvents" :key="item.id" class="mb-1" v-if="!loading">
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
                      <div @click="eventDetails(item.key)">
                        <h4 class="secondaryDark--text bold"> {{ item.event.title }}</h4>
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
              </v-flex>
              <v-flex xs2 sm2 md2>
                <v-btn fab large class="iwt" center v-if="!wasThere(item.key)" @click="iwtClicked(item)"></v-btn>
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
  </v-container>
</template>
<script>
export default {
  props: ['id'],
  data () {
    return {
      imageUrl: '',
      image: '',
      dialog: false,
      carousel: false,
      cycle: false
    }
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
      console.log('[user] id', this.id)
      // console.log('[user] user', user)
      console.log('[user] this.$store.getters.getEventData(this.id)', this.$store.getters.getUser(this.id))
      return this.$store.getters.getUser(this.id)
    },
    userEvents () {
      return this.user.userEvents
    },
    events () {
      console.log('myEvents', this.user.userEvents)
      return this.user.userEvents
    },
    loading () {
      return this.$store.getters.loading
    },
    userWasThere () {
      console.log('[userWasThere]')
      return this.$store.getters.user.events.findIndex(event => {
        return event.key === this.id
      }) >= 0
    }
  },
  methods: {
    eventDetails (key) {
      this.$router.push('/events/' + key)
    },
    wasThere (key) {
      return this.$store.getters.user.events.findIndex(event => {
        return event.key === key
      }) >= 0
    },
    back () {
      this.$router.go(-1)
    },
    // iwtClicked () {
    //   console.log('[iwtClicked]')
    //   this.$store.dispatch('iwtClicked', {key: this.id})
    // }
    iwtClicked (notification) {
      this.$store.dispatch('iwtClicked', {notification: notification, userId: this.$store.getters.user.id, firstName: this.$store.getters.user.firstName})
    }
  }
}
</script>

<style scoped>
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
      top: 8px;
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
