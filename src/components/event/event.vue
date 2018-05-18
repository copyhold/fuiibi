<template lang="html">
  <v-container class="container">
    <div @click="back" class="arrowBack">
        <v-icon class="secondaryDark--text">arrow_back</v-icon>
    </div>
    <v-layout row wrap v-if="loading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="primary" :witdh="7":size="70" v-if="loading"></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card>
          <v-card-media :src="event.event.imageUrl" height="120px">
          </v-card-media>
          <v-card-title class="eventTitle">
              <h2>{{ event.event.title }}</h2>
          </v-card-title>
          <v-card-text>
            <div class="mb-2">
              {{ event.event.description }}
            </div>
            <v-divider class="mb-2"></v-divider>
            <p><v-icon class="mr-1">place</v-icon>
              {{ event.event.location.route }}
              {{ event.event.location.street_number }},
              {{ event.event.location.locality }} - {{ event.event.location.country }}
            </p>
            <p><v-icon class="mr-2">access_time</v-icon>{{ event.event.date | date }}</p>
            <v-layout>
              <v-flex xs10>
                <p><v-icon class="mr-2">timelapse</v-icon>{{ event.event.duration }}</p>
                <div v-if="totalUserCount > 1" class="ml -2">
                  <b>{{ totalUserCount }}</b> users were there
                </div>
                <div v-else class="ml-2">
                  <b>{{ totalUserCount }}</b> user was there
                </div>
              </v-flex>
              <v-flex xs2 sm2 md2>
                <v-btn fab large class="iwt" center v-if="!userWasThere" @click="iwtClicked"></v-btn>
                <span v-else>
                  <v-btn fab flat large class="iwt clicked" center></v-btn>
                  <v-badge overlap overlay color="red" class="vuBadge">
                    <v-icon dark slot="badge">check</v-icon>
                  </v-badge>
                </span>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout class="mt-2">
      <v-flex xs12 sm12>
          <v-container fluid>
            <v-layout row wrap>
              <v-flex xs4 v-for="pic in event.event.pictures" :key="pic.id" class="hidden-sm-and-up">
                <v-card flat tile class="picInGallery">
                  <v-card-media :src="pic.imageUrl" height="120px" @click="carousel = true" >
                  </v-card-media>
                </v-card>
              </v-flex>
              <v-flex xs3 v-for="pic in event.event.pictures" :key="pic.id" class="hidden-xs-only">
                <v-card flat tile class="picInGallery">
                  <v-card-media :src="pic.imageUrl" height="150px" @click="carousel = true" >
                  </v-card-media>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
      </v-flex>
    </v-layout>
    <v-layout row class="mb-2" justify-center fluid>
      <v-flex xs12>
        <v-fab-transition >
          <v-btn v-if="userWasThere" color="orange" fixed bottom right fab class="orange white--text mb-3" @click="onPickFile"><v-icon>add_a_photo</v-icon></v-btn>
          <v-btn v-else fixed bottom right fab class="greyColors darkgray--text mb-3"><v-icon>add_a_photo</v-icon></v-btn>
        </v-fab-transition >
        <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked">
        <v-dialog v-model="dialog" fullscreen>
          <v-card>
            <v-card-title class="headline">Add this picture</v-card-title>
            <v-layout row>
              <v-flex xs12 sm6 class="ml-0">
                <img :src="imageUrl" class="profilePic" ref="imageToCanvas" style="display: none">
                <!-- <canvas ref="canvas" width="window.innerWidth * 0.9"></canvas> -->
                <canvas ref="canvas" class="fitScreen"></canvas>
              </v-flex>
            </v-layout>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="primary--text" flat="flat" @click.native="dialog = false">Cancel</v-btn>
              <v-btn raised class="primary" @click="addPicture">Add</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-dialog v-model="carousel" fullscreen id="carousel">
        <v-carousel hide-delimiters hide-controls :cycle="cycle" class="hidden-sm-and-up">
          <v-icon class="mr-1" dark large @click="closeDialog">close</v-icon>
          <v-carousel-item v-for="(picture,i) in event.event.pictures" v-bind:src="picture.imageUrl" :key="i"></v-carousel-item>
        </v-carousel>
        <v-carousel  hide-delimiters :cycle="cycle" class="hidden-xs-only">
          <v-icon class="mr-1" dark large @click="closeDialog">close</v-icon>
          <v-carousel-item v-for="(picture,i) in event.event.pictures" v-bind:src="picture.imageUrl" :key="i"></v-carousel-item>
        </v-carousel>
      </v-dialog>
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
    event () {
      console.log('[event] this.$store.getters.getEventData(this.id)', this.$store.getters.getEventData(this.id))
      return this.$store.getters.getEventData(this.id)
    },
    loading () {
      return this.$store.getters.loading
    },
    totalUserCount () {
      console.log('this.event.event.users.length', this.event.event.users.__ob__.dep.subs.length)
      return this.event.event.users.__ob__.dep.subs.length
    },
    userWasThere () {
      console.log('[userWasThere]')
      return this.$store.getters.user.events.findIndex(event => {
        return event.key === this.id
      }) >= 0
    }
  },
  methods: {

    closeDialog () {
      this.carousel = false
    },
    back () {
      this.$router.go(-1)
    },
    iwtClicked () {
      this.$store.dispatch('iwtClicked', {notification: this.event, userId: this.$store.getters.user.id, firstName: this.$store.getters.user.firstName})
    },
    onPickFile () {
      // the $refs below give us access to all the ref elements in the template of this component
      this.$refs.fileInput.click()
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
    },
    onFilePicked (event) {
      this.dialog = true
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
          // let imageWidth = window.outerWidth
          let imageWidth = window.outerWidth * 2
          this.$refs.canvas.width = imageWidth
          this.$refs.canvas.height = imageWidth * image.height / image.width
          // Now I create the image - what?, top, left, width, height
          context.drawImage(image, 0, 0, imageWidth, imageWidth * image.height / image.width)
          this.image = this.dataURItoBlob(this.$refs.canvas.toDataURL())
          console.log('this.image', this.image)
        })
      })
      fileReader.readAsDataURL(files[0])
      // this.image = files[0]
    },

    addPicture () {
      this.dialog = false
      // Vuex
      this.$store.dispatch('addPicture', {key: this.id, image: this.image})
    }
  }
}
</script>

<style scope>
  .carousel {
    min-height: 100%;
    max-height: 400px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .carousel__item {
    background-size: contain;
  }
  .fitScreen {
    max-width: 100vw;
  }
  div.dialog.dialog--active.dialog--fullscreen {
    background-color: black;
  }
  .btn--bottom:not(.btn--absolute) {
    bottom: 72px;
  }
  .picInGallery{
    padding: 1px;
  }
  .container{
    margin-top: 0;
    margin-bottom: 56px;
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
  /* @media screen and (orientation: portrait) {
      #carousel {
        width: 100%;
      }
    }

    @media screen and (orientation: landscape) {
      #carousel {
        height: 100%;
      }
    } */
  @media only screen and (max-width: 599px) {
    .container {
      padding: 0;
    }
    .arrowBack {
      position: fixed;
      top: 8px;
      left: 8px;
      z-index: 3;
    }
    .carousel {
      min-height: 100%;
      width: 100vw;
    }
    .carousel__item {
      background-size: contain;
    }
    /* .dialog {
      margin: 8px !important;
    } */
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
  @media only screen and (max-width: 1200px) {
    .carousel {
      min-height: 100%;
      width: 100vw;
    }
    .carousel__item {
      background-size: contain;
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
