<template >
  <v-container class="container">
    <v-dialog v-model="welcome" fullscreen>
      <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="e1 > 1">See your friend's photos</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="e1 > 2">See yourself on others photos</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" :complete="e1 > 3">Share your events </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="4" :complete="e1 > 4">Add your profile picture</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="5">Let's look for friends</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items class="p-0">

        <v-stepper-content step="1" style="height: calc(100vh - 76px)" color="primary" class="py-0 px-0">
          <v-card align="center" justify="center" class="pt-5 mb-4" style="height: calc(100vh - 200px)">
            <v-img width="160px" src="/static/welcome/friendship.png" class="mb-5"/>
            <v-card-text class="text-center headline">See your friend's photos </v-card-text>
          </v-card>
          <v-btn color="primary" @click.native="e1 = 2">Next</v-btn>
        </v-stepper-content>

        <v-stepper-content step="2" style="height: calc(100vh - 76px)" color="primary" class="py-0 px-0">
          <v-card align="center" justify="center" class="pt-5 mb-4" style="height: calc(100vh - 200px)">
            <v-img width="160px" src="/static/welcome/selfie.png" class="mb-5"/>
            <v-card-text class="text-center headline">See yourself on others photos </v-card-text>
          </v-card>
          <v-btn color="primary" @click.native="e1 = 3">Next</v-btn>
        </v-stepper-content>


        <v-stepper-content step="3" style="height: calc(100vh - 76px)" color="primary" class="py-0 px-0">
          <v-card align="center" justify="center" class="pt-5 mb-4" style="height: calc(100vh - 200px)">
            <v-img width="160px" src="/static/welcome/sharing.png" class="mb-5"/>
            <v-card-text class="text-center headline">Share your events </v-card-text>
          </v-card>
          <v-btn color="primary" @click.native="e1 = 4">Next</v-btn>
        </v-stepper-content>

        <v-stepper-content step="4" style="height: calc(100vh - 76px)" color="primary" class="py-0 px-0">
          <v-card align="center" justify="center" class="pt-5 mb-4" style="height: calc(100vh - 200px)">
            <v-layout row v-if="imageUrl != ''">
              <v-btn @click="rotateLeft" flat class="mx-3 primary--text"><v-icon left class="rotateLeftIcon mx-1 pl-0">rotate_left</v-icon>rotate left</v-btn>
              <v-btn @click="rotateRight" flat class="mx-0 primary--text">rotate right<v-icon right class="mx-1">rotate_right</v-icon></v-btn>
            </v-layout>
            <v-layout row>
              <v-flex xs12 sm6 class="mt-3">
                <img :src="imageUrl" class="profilePic" ref="imageToCanvas" style="display: none">
                <canvas ref="canvas" class="fitScreen" v-if="showCanvas"></canvas>
                <v-btn flat v-if="showCanvas" absolute block outline @click="onPickFile2" class="primary--text mb-4">Choose another photo</v-btn>
                <input type="file" style="display: none" ref="fileInput2" accept="image/*" @change="onFilePicked" >
              </v-flex>
            </v-layout>
            <v-img width="160px" src="/static/welcome/camera.png" class="mb-2" v-if="showUploadImage" @click="onPickFile"/>
            <p v-if="showUploadImage" class="text-center blink_me">Click the camera</p>
            <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked" >
            <v-card-text v-if="showUploadImage" class="text-center headline">Add your profile picture</v-card-text>
            <!-- <v-layout row class="mb-2">
              <v-flex xs12 sm6 class="uploadPicture" v-if="showUploadImage">
                <v-btn block flat class="secondary--text" @click="onPickFile"><v-icon class="mr-2">file_upload</v-icon>Choose a picture </v-btn> -->
                <!-- We hide the button below because it's ugly and we use the button above instead. But it needs to be linked to the below input and for that we use ref
              the accept image is in order to accept image and nothing else-->
                <!-- <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked" >
              </v-flex>
            </v-layout> -->
          </v-card>
          <!-- <v-btn color="info" @click.native="e1 = 4" flat><v-icon></v-icon>Back</v-btn> -->
          <v-btn flat @click.native="e1 = 5" color="primary">Skip</v-btn>
          <v-btn color="primary" @click.native="e1 = 5">Next</v-btn>
        </v-stepper-content>

        <v-stepper-content step="5" style="height: calc(100vh - 76px)" color="primary" class="py-0 px-0">
          <v-card align="center" justify="center" class="pt-5 mb-4" style="height: calc(100vh - 200px)">
            <v-img width="160px" src="/static/welcome/toast.png" class="mb-5"/>
            <v-card-text class="text-center headline">Well done! You are all set</v-card-text>
          </v-card>
          <v-btn color="primary" @click.native="e1 = 4" flat><v-icon></v-icon>Back</v-btn>
          <v-btn @click.native="addProfilePicture" color="primary" to="/notifications" >Finish</v-btn>
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
      rotateRight () {
        let context = this.$refs.canvas.getContext('2d')
        let image = this.$refs.imageToCanvas
        // let screenWidth = window.screen.width
        let imageWidth = 700
        this.$refs.canvas.height = imageWidth
        this.$refs.canvas.width = imageWidth * image.height / image.width
        context.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
        context.save()
        context.translate(0, this.$refs.canvas.height)
        context.rotate(90 * Math.PI / 180)
        context.drawImage(image, -imageWidth, -this.$refs.canvas.width, imageWidth, imageWidth * image.height / image.width)
        context.restore()
        this.image = this.dataURItoBlob(this.$refs.canvas.toDataURL())
        image = this.dataURItoBlob(this.$refs.canvas.toDataURL())
      },
      rotateLeft () {
        let context = this.$refs.canvas.getContext('2d')
        let image = this.$refs.imageToCanvas
        // let screenWidth = window.screen.width
        let imageWidth = 700
        this.$refs.canvas.height = imageWidth
        this.$refs.canvas.width = imageWidth * image.height / image.width
        context.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
        context.save()
        context.translate(this.$refs.canvas.width / 2, this.$refs.canvas.height / 2)
        context.rotate(270 * Math.PI / 180)
        context.drawImage(image, -imageWidth / 2, -this.$refs.canvas.width / 2, imageWidth, imageWidth * image.height / image.width)
        context.restore()
        this.image = this.dataURItoBlob(this.$refs.canvas.toDataURL())
        image = this.dataURItoBlob(this.$refs.canvas.toDataURL())
      },
      addProfilePicture () {
        this.$store.dispatch('addProfilePicture', {image: this.image})
        this.$store.dispatch('updateUser', {isNew: false})
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
.blink_me {
  animation: blinker 1s linear infinite;
}
  .rotateLeftIcon {
    margin-top: 0 !important;
  }
  .uploadPicture {
    border-style: dashed;
    border-color: grey;
    border-width: thin;
    height: 144px;
    margin: 0 auto;
  }
  .uploadPicture .secondary--text {
    height: 100%;
    margin: 0;
    padding: 0;
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

  @keyframes blinker {
  50% {
    opacity: 0.3;
  }
  }

</style>
