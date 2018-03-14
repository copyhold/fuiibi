<template lang="html">
  <v-container class="container">
    <v-layout row wrap v-if="loading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="primary" :witdh="7":size="70" v-if="loading"></v-progress-circular>
        </v-flex>
    </v-layout>
    <div @click="back" class="arrowBack">
        <v-icon class="white--text">arrow_back</v-icon>
    </div>
    <v-layout row wrap>
      <v-flex xs12>

        <v-card>
          <v-card-media :src="user.imageUrl" height="300px">
          </v-card-media>
          <v-card-title class="eventTitle">
              <h2>{{ user.userName }}</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <h3> some more info about the user</h3>
          </v-card-text>
        </v-card>

      </v-flex>
    </v-layout>

    <v-layout row wrap v-for="item in userEvents" :key="item.id" class="mb-1" v-if="!loading">
      <v-flex xs12 sm12 md12>
        <v-card height="120px">
          <v-container fluid>
            <v-layout col xs12>
              <v-flex xs3 sm2 md2>
                <v-card-media :src="item.event.imageUrl" height="100px" style="background-color: white"></v-card-media>
              </v-flex>
              <v-flex xs9 sm10 md10 class="ml-3">
                <v-layout>
                  <v-card-title primary-title >
                    <v-card-actions wrap>
                      <div>
                        <div @click="eventDetails(item.key)">
                          <h4 class="pl-2 primaryDark--text bold"> {{ item.event.title }}</h4>
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
    user () {
      console.log('[user] id', this.id)
      // console.log('[user] user', user)
      console.log('[user] this.$store.getters.getEventData(this.id)', this.$store.getters.getUser(this.id))
      return this.$store.getters.getUser(this.id)
    },
    userEvents () {
      console.log('[user] id', this.id)
      // console.log('[user] user', user)
      console.log('[user] this.user.userEvents', this.user.userEvents)
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
    back () {
      this.$router.go(-1)
    },
    iwtClicked () {
      console.log('[iwtClicked]')
      this.$store.dispatch('iwtClicked', {key: this.id})
    },
    onPickFile () {
      // the $refs below give us access to all the ref elements in the template of this component
      this.$refs.fileInput.click()
    },
    onFilePicked (event) {
      // We get the wanted file
      const files = event.target.files
      // As we can choose only one file, we take the first one in the array
      let filename = files[0].name
      // Simple chack if the file is valid
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Please enter a valid image')
      }
      // Turn it into base64
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        // the result here is a base64 image
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    },
    addPicture () {
      this.dialog = false
      // Vuex
      this.$store.dispatch('addPicture', {key: this.id, image: this.image})
    }
  }
}
</script>

<style scoped>
  .picInGallery{
    padding: 1px;
  }
  .container{
    margin-top: 0;
  }
  .btn--block {
    margin: 0;
  }
  .btn--bottom {
    bottom: 0px;
  }
  .fullScreen {
    width: 868px;
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
    .container {
      padding: 0;
    }
    .fullScreen {
      width: 100vw;
    }
    .arrowBack {
      position: fixed;
      top: 56px;
      left: 24px;
      z-index: 3;
    }
    .carousel {
      min-height: 100%;
      width: 100vw;
    }
    .carousel__item {
      background-size: contain;
    }
    .dialog {
      margin: 8px !important;
    }
    .iwt{
      height: 72px;
      width: 72px;
      background: url("../img/iwt3.png") center/95% no-repeat;
      position: absolute;
      right: 0px;
      bottom: 8px;
    }
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
