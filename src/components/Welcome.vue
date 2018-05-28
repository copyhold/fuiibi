white<template >
  <v-container class="container">
    <v-dialog v-model="welcome" fullscreen>
      <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="e1 > 1">Welcome message</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="e1 > 2">Choose a profile picture</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">Let's look for friends</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card color="white lighten-3" class="mb-5" height="380">
            <v-card-title class="primary--text title">Welcome to Fuiibi!</v-card-title>
            <v-card-text>Store your and your friend's pictures around the events you will create.
              One single place for all the pictures sorted in a time line.
              <br><br>

              Let's try it and enjoy! </v-card-text>
          </v-card>
          <v-btn color="primary" @click.native="e1 = 2">Next</v-btn>
          <!-- <v-btn flat>Skip</v-btn> -->
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-card color="white lighten-3" class="mb-5" height="auto">
            <v-card-title class="primary--text title">Add your profile picture</v-card-title>

            <v-layout row class="mb-2">
              <v-flex xs12 sm6 class="uploadPicture" v-if="showUploadImage">
                <!-- <v-btn raised class="primary primary--text" @click="onPickFile" left outline>Upload</v-btn>
                <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked"> -->
                <v-btn block flat class="secondary--text pt-5" @click="onPickFile"><v-icon class="mr-2">file_upload</v-icon>Choose a picture </v-btn>
                <!-- We hide the button below because it's ugly and we use the button above instead. But it needs to be linked to the below input and for that we use ref
              the accept image is in order to accept image and nothing else-->
                <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked" >
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs12 sm6 class="mt-3">
                <img :src="imageUrl" class="profilePic" ref="imageToCanvas" style="display: none">
                <canvas ref="canvas" class="fitScreen" v-if="showCanvas"></canvas>
                <v-btn flat v-if="showCanvas" absolute right @click="onPickFile2" class="above">Change</v-btn>
                <input type="file" style="display: none" ref="fileInput2" accept="image/*" @change="onFilePicked" >
              </v-flex>
            </v-layout>
          </v-card>
          <v-btn color="info" @click.native="e1 = 1" flat><v-icon></v-icon>Back</v-btn>
          <v-btn color="primary" @click.native="e1 = 3">Next</v-btn>
          <!-- <v-btn flat>Skip</v-btn> -->
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card color="white lighten-3" class="mb-5" height="300px">
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
        image: '',
        showUploadImage: true,
        showCanvas: false
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
          description: 'Congratulations for your first event! This event has been created automatically and will be deleted at your next login. But go and open your fist personal event and it will be automatically shared with all your friends.',
          totalUserCount: 2,
          creationDate: Date(),
          location: {
            administrative_area_level_1: 'My room',
            country: 'Planet earth',
            latitude: 1,
            longitude: 1,
            locality: 'Home',
            postal_code: '4747',
            street_number: '47'
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

        var deferredPrompt
        console.log('[addProfilePicture] dans welcome, b4 window.addEventListener(beforeinstallprompt, function (event)')
        window.addEventListener('beforeinstallprompt', function (event) {
          console.log('beforeinstallprompt fired')
          event.preventDefault()
          deferredPrompt = event
          return false
        })
        if (deferredPrompt) {
          deferredPrompt.prompt()
          deferredPrompt.userChoice.then(function (choiceResult) {
            console.log(choiceResult.outcome)

            if (choiceResult.outcome === 'dismissed') {
              console.log('User cancelled installation')
            } else {
              console.log('User added to home screen')
            }
          })
          deferredPrompt = null
        }
      },
      onPickFile () {
        this.$refs.fileInput.click()
      },
      onPickFile2 () {
        // the $refs below give us access to all the ref elements in the template of this component
        this.$refs.fileInput2.click()
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
          var img = new Image()
          img.src = this.imageUrl
          img.addEventListener('load', _ => {
            let context = this.$refs.canvas.getContext('2d')
            let image = this.$refs.imageToCanvas
            // let imageWidth = window.outerWidth * 2
            let imageWidth = 500
            this.$refs.canvas.width = imageWidth
            this.$refs.canvas.height = imageWidth * image.height / image.width
            // Now I create the image - what?, top, left, width, height
            context.drawImage(image, 0, 0, imageWidth, imageWidth * image.height / image.width)
            this.image = this.dataURItoBlob(this.$refs.canvas.toDataURL())
            console.log('this.image', this.image)
          })
        })
        fileReader.readAsDataURL(files[0])
        this.showCanvas = true
        this.showUploadImage = false
      },
      dataURItoBlob (dataURI) {
        var byteString = atob(dataURI.split(',')[1])
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length)
        var ia = new Uint8Array(ab)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        var blob = new Blob([ab], {type: mimeString})
        return blob
      }
    }
  }
</script>

<style scoped>
  .uploadPicture {
    border-style: dashed;
    border-color: grey;
    border-width: thin;
    height: 144px;
    margin: 0 auto;
  }
  .fitScreen {
    max-width: calc(100vw - 16px);
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
  .btn{
    margin: 0px;
  }
  .profilePic{
    border-radius: 100px;
    height: 150px;
    width: 150px;
  }

</style>
