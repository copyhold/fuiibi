<template >
  <v-container class="container">
    <v-dialog persistent v-model="welcome">
      <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="e1 > 1">Welcome message</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="e1 > 2">Choose a profile picture</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">Be ready to look for friends</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card color="grey lighten-3" class="mb-5" height="300px">
            <v-card-title class="primary--text title">Welcome to Fuiibi!</v-card-title>
            <v-card-text>Store your and your friend's pictures around the events you will create.
              One single place for all the pictures sorted in a time line.
              Let's try it and enjoy! </v-card-text>
          </v-card>
          <v-btn color="primary" @click.native="e1 = 2">Next</v-btn>
          <!-- <v-btn flat>Skip</v-btn> -->
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-card color="grey lighten-3" class="mb-5" height="300px">
            <v-card-title class="primary--text title">Add your profile picture</v-card-title>

            <v-layout row class="mb-2">
              <v-flex xs12 sm6>
                <v-btn raised class="primary primary--text" @click="onPickFile" left outline>Upload</v-btn>
                <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked">
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs12 sm6 class="mt-3">
                <img :src="imageUrl" class="profilePic" >
              </v-flex>
            </v-layout>
          </v-card>
          <v-btn color="info" @click.native="e1 = 1" flat><v-icon></v-icon>Back</v-btn>
          <v-btn color="primary" @click.native="e1 = 3">Next</v-btn>
          <!-- <v-btn flat>Skip</v-btn> -->
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card color="grey lighten-3" class="mb-5" height="300px">
            <v-card-text>Now that your account has been set up, you are ready to look for your friends using the app!
              We will redicect you to the search page so that you can contact your friends. If you would like to have Fuiibi's icon on your
              mobile, you should accept when it will be proposed to you, otherwise, just go to setting and check how to do it! Enjoy!
            </v-card-text>
          </v-card>
          <v-btn color="info" @click.native="e1 = 2" flat><v-icon></v-icon>Back</v-btn>
          <v-btn @click.native="addProfilePicture" color="primary" :to="'/search'" >Finish</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    </v-dialog>

  </v-container>

</template>

<script>
  export default {
    data () {
      return {
        welcome: true,
        e1: 0,
        imageUrl: '',
        image: ''
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      addProfilePicture () {
        console.log('[addProfilePicture] clicked - this.image', this.image)
        this.$store.dispatch('addProfilePicture', {image: this.image})

        var date = new Date()
        var fbKey = 'welcomeEvent'
        var key = 'welcomeEvent'
        var event = {
          imageUrl: 'https://firebasestorage.googleapis.com/v0/b/iwtapplication.appspot.com/o/homero-con-iphoneLight.jpg?alt=media&token=241c26b9-e086-4f03-ad49-63ead90c87d9',
          title: 'Your subscribtion',
          description: 'Congratulations for your first event! This event has been created automatically and will be deleted soon. But go and open your fist personal event and it will be automatically shared with all your friends.',
          counter: 2,
          creationDate: Date(),
          location: {
            administrative_area_level_1: 'My room',
            country: 'Planet earth',
            latitude: 1,
            longitude: 1,
            locality: 'Home',
            postal_code: '4747'
          },
          date: date.toISOString(),
          duration: '2 minutes',
          creatorId: this.$store.getters.user.id,
          dateToRank: -Date.now()
        }
        var clickerName = 'Fuiibi team'

        const newNotif = {
          event: event,
          key: key,
          clickerName: clickerName,
          dateToRank: event.dateToRank,
          friendsCount: this.counter
        }
        const newEvent = {
          event: event,
          key: key,
          fbKey: fbKey
        }

        this.$store.commit('addEventToMyEvents', newEvent)
        this.$store.commit('addNotification', newNotif)
        this.$store.commit('addEvent', newEvent)

        // var deferredPrompt
        // window.addEventListener('beforeinstallprompt', function (event) {
        //   console.log('beforeinstallprompt fired')
        //   event.preventDefault()
        //   deferredPrompt = event
        //   return false
        // })
        // if (deferredPrompt) {
        //   deferredPrompt.prompt()
        //   deferredPrompt.userChoice.then(function (choiceResult) {
        //     console.log(choiceResult.outcome)
        //
        //     if (choiceResult.outcome === 'dismissed') {
        //       console.log('User cancelled installation')
        //     } else {
        //       console.log('User added to home screen')
        //     }
        //   })
        //   deferredPrompt = null
        // }
      },
      onPickFile () {
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
      }
    }
  }
</script>

<style scoped>
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
  .btn{
    margin: 0px;
  }
  .profilePic{
    border-radius: 100px;
    height: 150px;
    width: 150px;
  }

</style>


<!-- <v-layout row>
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="red" :witdh="7" :size="20" v-if="loading" class="mt-5"></v-progress-circular>
    </v-flex>
</v-layout>
<v-layout row wrap v-for="meetup in meetups" :key="meetup.id" class="mb-1" v-if="!loading">
  <v-flex xs12 sm12 md10 offset-md2>
    <v-card height="120px">
      <v-container fluid>
        <v-layout col xs8>
          <v-flex xs3 sm4 md4>
            <v-card-media
            :src="meetup.imageUrl"
            height="100px"
            style="background-color: white">
            </v-card-media>
          </v-flex>
          <v-flex xs7 sm6 md5>
            <v-card-title primary-title >
              <v-card-actions wrap>
                <div>
                  <v-btn flat :to="'/meetups/' + meetup.id" class="">
                    <h3 class="primary--text mb0 mt0 pt0"> {{ meetup.title }}</h3>
                  </v-btn>
                </div>
              </v-card-actions>
                <div>
                  {{ meetup.date | date}}
                </div>
            </v-card-title>
            <!-- <v-card-actions>
              <v-btn flat :to="'/meetups/' + meetup.id">
                <v-icon left light>arrow_forward</v-icon>
                View Meetup</v-btn>
            </v-card-actions>
          </v-flex>
          <v-flex xs2 sm2 md3 offset-md4 offset-sm2>
            <v-btn fab large class="iwt" center></v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-flex>
</v-layout>
<v-fab-transition >
  <v-btn router to="/meetup/new"
    color="orange"
    fixed
    bottom
    right
    fab
    class=" white--text"
    >
    <v-icon>add</v-icon>
  </v-btn>
</v-fab-transition> -->
