<template lang="html">
  <v-container class="container" v-if="event">
    <div @click="back" class="arrowBack clickable hidden-sm-and-up" v-if="loggedInUserId">
        <v-icon class="secondaryDark--text">arrow_back</v-icon>
    </div>
    <v-btn style="z-index: 1" absolute class="ml-2 mt-4" v-if="loggedInUserId == event.creatorId && !loading" small v-model="fab" color="green" dark fab @click="onPickFile">
      <v-icon>create</v-icon>
    </v-btn>
    <v-speed-dial v-if="!loading" absolute top v-model="fab"  :top="top" :bottom="bottom" :right="right" :left="left" :direction="direction" :transition="transition" class="shareButton">
      <v-btn slot="activator" small v-model="fab" color="red darken-2" dark fab>
        <v-icon>share</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-btn fab dark small color="green" @click="openWhatsapp">
        <v-icon color="white--text">mdi-whatsapp</v-icon>
      </v-btn>
      <v-btn fab dark small color="indigo" data-layout="button" data-size="small" data-mobile-iframe="true" @click="openFacebook">
        <v-icon dark>mdi-facebook</v-icon>
      </v-btn>
    </v-speed-dial>
    <v-layout row wrap v-if="loading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="darkgray" :width="1" :size="90" v-if="loading"></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card>
          <v-img :src="event.imageUrl" height="250px" />
          <v-card-title class="eventTitle">
              <h2>{{ event.title }}</h2>
          </v-card-title>
          <v-divider class="mb-2"></v-divider>
          <v-card-text>
            <p v-if="event.location.street_number"><v-icon class="mr-1">place</v-icon>
              {{ event.location.route }}
              <!-- {{ event.location.street_number }}, -->
              {{ event.location.locality }} - {{ event.location.country }}
            </p>
            <p v-else>
              <v-icon class="mr-1">place</v-icon>
              {{ event.location.route }}
              {{ event.location.locality }} - {{ event.location.country }}
            </p>
            <p><v-icon class="mr-2">access_time</v-icon>{{ event.date | date }}</p>
            <v-layout row>
              <v-flex xs10>
                <p><v-icon class="mr-2">timelapse</v-icon>{{ event.duration }}</p>
                <template v-if="event.id==='defaultevent'">
                  <v-icon class="mr-2">supervisor_account</v-icon>
                  <b>{{userWasThere ? "You and  many others were here" : "Many others were here"}}</b>
                </template>
                <template v-else>
                  <div v-if="totalUserCount > 1" class="ml -2" @click="showUsers = true">
                    <v-icon class="mr-2">supervisor_account</v-icon><b>{{ totalUserCount }}</b> users were there
                  </div>
                  <div v-else class="ml-2" @click="showUsers = true">
                    <v-icon class="mr-2">supervisor_account</v-icon><b>{{ totalUserCount }}</b> user was there
                  </div>
                </template>
              </v-flex>
              <v-flex xs2 sm2 md2>

                  <v-tooltip v-model="showToolTips" top transition="scroll-x-transition" color="green" max-width="87px" style="top: 335px !important">
                    <template v-slot:activator="{ on }">
                      <!-- Here is the original element that I entered between tooltips. -->
                      <v-btn fab large class="iwt" center v-if="!userWasThere" @click="iwtClicked"></v-btn>
                      <span v-else>
                        <v-btn flat large class="iwt checked" center></v-btn>
                      </span>                    
                    </template>
                    <span @click="showToolTips = false">If you attended the event, click on the bellow button</span>
                  </v-tooltip>

              </v-flex>
            </v-layout>
              <v-divider class="mb-2"></v-divider>
              <p>{{ event.description }}</p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout class="mt-2">
      <v-container fluid grid-list-sm>
        <v-layout row wrap class="gallery">
          <v-flex v-if="loading">
            <v-progress-circular indeterminate color="grey"></v-progress-circular>
          </v-flex>
          <v-flex xs4 sm3 md2 v-for="pic,j in event.pictures" :key="pic.id">
            <v-card flat tile>
             <v-img :src="pic.imageUrl" aspect-ratio="1" @contextmenu.prevent="photoRightClick(j)" @click="checkPicSrc(pic.imageUrl)" :class="(selectedpictures[j] ? 'selected' : '') + ' clickable'"/>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>

    <add-pictures v-if="userWasThere && event.id!=='defaultevent'" :userWasThere="userWasThere" :evid="event.id"></add-pictures>

    <v-dialog dark :fullscreen="fullscreen_carousel || $vuetify.breakpoint.smAndDown" :scrollable="fullscreen_carousel" :hide-overlay="$vuetify.breakpoint.smAndDown" v-model="carousel" max-width="800px">
      <v-card>
        <v-toolbar v-if="$vuetify.breakpoint.mdAndUp">
          <v-icon class="mr-1 clickable" dark @click="closeDialog">close</v-icon>
          <v-spacer></v-spacer>
          <v-icon class="mr-1 clickable" dark large @click="fullscreen_carousel=!fullscreen_carousel">zoom_out_map</v-icon>
        </v-toolbar>
        <v-btn v-else absolute small fab icon color="#424242"><v-icon class="mr-1 clickable" dark @click="closeDialog">arrow_back</v-icon></v-btn>
        <!-- <v-btn v-else absolute small fab><v-icon class="mr-1 clickable" dark @click="closeDialog">close</v-icon></v-btn> -->
        <v-carousel hide-delimiters dark :cycle="false" height="100vh">
          <v-carousel-item :contain="true" class="picInCaroussel" v-for="(picture, key, index) in event.pictures" v-bind:src="index === 0 ? picToOpen : picture.imageUrl" :key="index"></v-carousel-item>
        </v-carousel>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showUsers" v-if="eventUsers()">
      <v-list subheader>
        <v-subheader>Who was here</v-subheader>
        <template v-for="user in eventUsers()">
          <v-divider></v-divider>
          <v-list-tile avatar v-bind:key="user.id" v-if="!loading && user && user.id != loggedInUserId">
            <v-list-tile-avatar class="avatarImg">
              <img :src="user.imageUrl"/>
            </v-list-tile-avatar>
            <v-list-tile-content v-if="loggedInUserId"  @click="getUserPage(user)" >
              <v-list-tile-title v-html="user.firstName + ' ' + user.lastName" ></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-content v-else>
              <v-list-tile-title v-html="user.firstName + ' ' + user.lastName" ></v-list-tile-title>
            </v-list-tile-content>

            <template v-if="loggedInUserId">
              <v-list-tile-action v-if="hasPendingInvitation(user) || isPendingFriend(user)">
                <v-btn small class="greyColors" flat left>Pending...</v-btn>
              </v-list-tile-action>
              <v-list-tile-action v-else>
                <v-btn v-if="!isFriend(user)" @click="sendFriendRequest(user.id)" flat small class="primary--text pl-1 pr-1"><v-icon class="pl-4">mdi-account-plus</v-icon></v-btn>
                <v-btn v-else flat small class="primary--text pl-3 pr-1"><v-icon color="green darken-2" class="pl-4">mdi-account-check</v-icon></v-btn>
              </v-list-tile-action>
            </template>
          </v-list-tile>
        </template>
      </v-list>
      </v-dialog>

  </v-container>
</template>

<script>
import AddPictures from './AddPictureDialog.vue'
export default {
  props: ['id'],
  components: {
    AddPictures
  },
  data () {
    return {
      showToolTips: false,
      fullscreen_carousel: false,
      eventurl: location.href,
      showUsers: false,
      imageUrl: '',
      image: this.$refs.imageToCanvas,
      dialog: false,
      carousel: false,
      cycle: false,
      picToOpen: '',
      direction: 'bottom',
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      top: true,
      right: true,
      bottom: false,
      left: false,
      contain: true,
      transition: 'slide-y-reverse-transition',
      selectedpictures: {}
    }
  },
  watch: {
    top (val) {
      this.bottom = !val
    },
    right (val) {
      this.left = !val
    },
    bottom (val) {
      this.top = !val
    },
    left (val) {
      this.right = !val
    }
  },
  created () {
    this.$store.dispatch('setCurrentEvent', this.$route.params.id)
  },
  beforeDestroy () {
    document.body.classList.remove('event-page')
  },
  mounted () {
    document.body.classList.add('event-page')
  },
  computed: {
    event () {
      return this.$store.getters.getCurrentEvent
    },
    activeFab () {
      switch (this.tabs) {
        case 'one': return { 'class': 'purple', icon: 'account_circle' }
        case 'two': return { 'class': 'red', icon: 'edit' }
        case 'three': return { 'class': 'green', icon: 'keyboard_arrow_up' }
        default: return {}
      }
    },
    loggedInUserId () {
      if (this.$store.getters.user) {
        return this.$store.getters.user.id
      }
      return null
    },
    loading () {
      return this.$store.getters.loading
    },
    totalUserCount () {
      if (this.event.title !== 'Your subscribtion') {
        let counter = 0
        for (let user in this.event.users) {
          this.$debug(user)
          counter++
        }
        return counter
      } else {
        return 2
      }
    },
    userWasThere () {
      const user = this.$store.getters.user
      if (!user) {
        return false
      }
      return Object.values(this.event.users).indexOf(user.id) > -1
    }
  },
  methods: {
    photoRightClick (i) {
      if (this.selectedpictures[i]) {
        this.$set(this.selectedpictures, i, null)
      } else {
        this.$set(this.selectedpictures, i, this.event.pictures[i])
      }
      this.$debug(this.selectedpictures)
    },
    eventUsers () {
      if (!this.event.users) {
        return []
      }
      return Object.values(this.event.users).map(uid => {
        return this.$store.getters.person(uid)
      })
    },
    getCarouselHeight () {
      var item = document.getElementsByClassName('v-image__image--cover')
      this.carouselHeight = item[0].clientHeight + 'px'
    },
    openWhatsapp () {
      this.$debug('[clicked open whatsapp] this.id', this.id)
      window.open(`whatsapp://send?text=Discover the event you have been invited to! Visit ${this.eventurl}`)
    },
    openFacebook () {
      this.$debug('[clicked open whatsapp]')
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${location.href}`)
    },
    openTheRightPic (index, picture) {
      this.$debug('[openTheRightPic] index, picture', index, picture)
    },
    checkPicSrc (imgUrl) {
      this.$debug(imgUrl)
      this.picToOpen = imgUrl
      this.carousel = true
    },
    removeFriend (user) {
      this.$store.dispatch('removeFriend', user)
    },
    sendFriendRequest (userId) {
      this.$store.dispatch('sendFriendRequest', userId)
    },
    isFriend (user) {
      if (!user) {
        return false
      }
      if (this.$store.getters.user) {
        return this.$store.getters.user.friends[user.id]
      }
    },
    getUserPage (key) {
      this.$debug('[getUserPage] clicked key', key)
      this.$store.dispatch('loadPersons', [key.id])
   // this.$store.dispatch('getUserData', {userId: key.id})
      this.$router.push('/users/' + key.id)
    },
    hasPendingInvitation (user) {
      if (!user) {
        return false
      }
      if (this.$store.getters.user && this.$store.getters.user.pendingInvitations) {
        return this.$store.getters.user.pendingInvitations[user.id]
      }
    },
    isPendingFriend (user) {
      if (!user) {
        return false
      }
      if (this.$store.getters.user && this.$store.getters.user.pendingFriends) {
        return this.$store.getters.user.pendingFriends[user.id]
      }
    },
    closeDialog () {
      this.carousel = false
      this.picToOpen = ''
    },
    back () {
      this.$router.go(-1)
    },
    iwtClicked () {
      if (this.$store.getters.user) {
        this.$store.dispatch('iwtClicked', this.event.id)
        .then(() => {
          this.$store.dispatch('setCurrentEvent', this.$route.params.id)
          this.$store.dispatch('reloadMyEvents') // this call probably not needed
        })
      } else {
        localStorage.return_to_event = this.event.id
        this.$router.push('/')
      }
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
      this.$debug('[onFilePicked] this dialog true?', this.dialog)
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
          let imageWidth = 700
          this.$refs.canvas.width = imageWidth
          this.$refs.canvas.height = imageWidth * image.height / image.width
          // Now I create the image - what?, top, left, width, height
          context.drawImage(image, 0, 0, imageWidth, imageWidth * image.height / image.width)

          this.image = this.dataURItoBlob(this.$refs.canvas.toDataURL())
          this.$debug('this.image', this.image)
        })
      })
      fileReader.readAsDataURL(files[0])
      // this.image = files[0]
    },
    rotateRight () {
      let context = this.$refs.canvas.getContext('2d')
      let image = this.$refs.imageToCanvas
      let screenWidth = window.screen.width
      let imageWidth = 700
      this.$refs.canvas.height = imageWidth
      this.$refs.canvas.width = imageWidth * image.height / image.width
      context.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
      context.save()
      if (screenWidth < 700) {
        // context.translate(0, screenWidth * 2 + ((screenWidth - this.$refs.canvas.width) / 4))
        context.translate(0, this.$refs.canvas.height)
      } else {
        context.translate(0, this.$refs.canvas.height)
      }
      context.rotate(90 * Math.PI / 180)
      context.drawImage(image, -imageWidth, -this.$refs.canvas.width, imageWidth, imageWidth * image.height / image.width)
      context.restore()
      this.image = this.dataURItoBlob(this.$refs.canvas.toDataURL())
      image = this.dataURItoBlob(this.$refs.canvas.toDataURL())
    },

    rotateLeft () {
      let context = this.$refs.canvas.getContext('2d')
      let image = this.$refs.imageToCanvas
      let screenWidth = window.screen.width
      let imageWidth = 700
      this.$refs.canvas.height = imageWidth
      this.$refs.canvas.width = imageWidth * image.height / image.width
      context.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
      context.save()
      if (screenWidth < 700) {
        // context.translate(this.$refs.canvas.height, screenWidth  + ((this.$refs.canvas.width - screenWidth) / 2))
        // context.translate(this.$refs.canvas.height, screenWidth / 2)
        context.translate(this.$refs.canvas.width / 2, this.$refs.canvas.height / 2)
      } else {
        context.translate(this.$refs.canvas.width / 2, this.$refs.canvas.height / 2)
      }
      context.rotate(270 * Math.PI / 180)
      if (screenWidth < 700) {
        // context.drawImage(image, -this.$refs.canvas.width, -imageWidth, imageWidth, imageWidth * image.height / image.width)
        context.drawImage(image, -imageWidth / 2, -this.$refs.canvas.width / 2, imageWidth, imageWidth * image.height / image.width)
      } else {
        context.drawImage(image, -imageWidth / 2, -this.$refs.canvas.width / 2, imageWidth, imageWidth * image.height / image.width)
      }
      context.restore()
      this.image = this.dataURItoBlob(this.$refs.canvas.toDataURL())
      image = this.dataURItoBlob(this.$refs.canvas.toDataURL())
    },

    addPicture () {
      this.dialog = false
      this.$debug('[onFilePicked] this dialog true?', this.dialog)
      // Vuex
      this.$store.dispatch('addPicture', {key: this.id, image: this.image})
    }
  }
}
</script>

<style>
.event-page #homepage, 
.event-page > footer { display: none; }
</style>
<style scoped>
.gallery .v-image.selected .v-image__image {
  box-shadow: 0 0 3px 2px rgba(20, 150, 10, .6) inset;
}
  .shareButton {
    /* position: absolute; */
    top: 88px !important;
    /* right: 0px; */
    z-index: 1;
  }
  .space60percent {
    width: 90%
  }
  .rotateLeftIcon {
    margin-top: 0 !important;
  }
  .rightIconx {
    right: 0px;
    position: absolute;
  }
  .clickable {
    cursor: pointer;
  }
  .arrowBack {
      position: fixed;
      top: 19px;
      left: 8px;
      z-index: 3;
  }
  .iwt{
    height: 72px;
    width: 72px;
    background: url("../img/iwt3.png") center/95% no-repeat;
    position: relative;
    right: 0px;
    bottom: 16px;
  }
  .divider {
    top: 0px;
    position: relative;
  }
  .carousel {
    min-height: 100%;
    max-height: 400px;
    max-width: 1200px;
    margin: 0 auto;
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
    /* background: rgba(0, 0, 0, 0.5); */
    text-align: left;
    color: rgba(0,0,0,0.54);
    position: relative;
    top: 0px;
    font-size: 15px;
    font-weight: 200;
    min-height: 70px;
  }
  .checked{
    background: url("../img/iwtChecked.png") left/80% no-repeat;
  }
  @media screen and (max-width: 1263px) {
    .carousel {
      min-height: 100%;
      width: 100vw;
    }
  }
  @media screen and (max-width: 600px) {
    .container {
      padding: 0;
    }
    .space60percent {
      width: 70%
    }
    .arrowBack {
      position: fixed;
      top: 14px;
      left: 8px;
      z-index: 3;
    }
    .carousel {
      min-height: 100%;
      width: 100vw;
    }
    .iwt{
      height: 72px;
      width: 72px;
      background: url("../img/iwt3.png") center/95% no-repeat;
      position: relative;
      right: 16px;
      bottom: 16px;
    }
    .checked{
      background: url("../img/iwtChecked.png") left/80% no-repeat;
    }
  }
</style>
