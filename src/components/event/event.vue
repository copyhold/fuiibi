<template lang="html">
  <v-container class="container" v-if="event">
    <div @click="back" class="arrowBack clickable">
        <v-icon class="secondaryDark--text">arrow_back</v-icon>
    </div>
    <v-btn absolute class="ml-2 mt-3" v-if="loggedInUserId == event.creatorId" small v-model="fab" color="green" dark fab @click="onPickFile">
      <v-icon>create</v-icon>
    </v-btn>
    <v-speed-dial v-model="fab"  :top="top" :bottom="bottom" :right="right" :left="left" :direction="direction" :transition="transition" class="shareButton">
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
            <p v-else><v-icon class="mr-1">place</v-icon>
              {{ event.location.route }}
              {{ event.location.locality }} - {{ event.location.country }}
            </p>
            <p><v-icon class="mr-2">access_time</v-icon>{{ event.date | date }}</p>
            <v-layout row>
              <v-flex xs10>
                <p><v-icon class="mr-2">timelapse</v-icon>{{ event.duration }}</p>
                <div v-if="totalUserCount > 1" class="ml -2" @click="showUsers = true">
                  <v-icon class="mr-2">supervisor_account</v-icon><b>{{ totalUserCount }}</b> users were there
                </div>
                <div v-else class="ml-2" @click="showUsers = true">
                  <v-icon class="mr-2">supervisor_account</v-icon><b>{{ totalUserCount }}</b> user was there
                </div>
              </v-flex>
              <!-- <a href="whatsapp://send" data-text="Take a look at this awesome website:" data-href="" class="wa_btn wa_btn_s" style="display:block">Share</a> -->
              <v-flex xs2 sm2 md2>
                <v-btn fab large class="iwt" center v-if="!userWasThere" @click="iwtClicked"></v-btn>
                <span v-else>
                  <v-btn flat large class="iwt checked" center></v-btn>
                  <!-- <v-badge overlap overlay color="red" class="vuBadge">
                    <v-icon dark slot="badge">check</v-icon>
                  </v-badge> -->
                </span>
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
        <v-layout row wrap>
          <v-flex xs4 sm3 md2 v-for="pic in event.pictures" :key="pic.id">
            <v-card flat tile class="">
              <v-img :src="pic.imageUrl" aspect-ratio="1" @click="checkPicSrc(pic.imageUrl)" class="clickable"/>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>

    <add-pictures v-if="userWasThere" :userWasThere="userWasThere" :evid="event.id"></add-pictures>

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

    <v-dialog v-model="showUsers" max-width="96%" v-if="eventUsers()">
      <v-list subheader>
          <template v-for="user in eventUsers()">
            <v-divider></v-divider>
            <v-list-tile avatar v-bind:key="user.id" v-if="!loading && user && user.id != loggedInUserId">
              <v-list-tile-avatar class="avatarImg">
                <img :src="user.imageUrl"/>
              </v-list-tile-avatar>
              <v-list-tile-content  @click="getUserPage(user)" >
                <v-list-tile-title v-html="user.firstName + ' ' + user.lastName" ></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action v-if="hasPendingInvitation(user) || isPendingFriend(user)">
                  <v-btn small class="greyColors" flat left>Pending...</v-btn>
              </v-list-tile-action>
              <v-list-tile-action v-else>
                <v-list-tile-action v-if="!isFriend(user)">
                  <v-btn @click="sendFriendRequest(user.id)" flat small class="primary--text pl-1 pr-1"><v-icon class="pl-4">mdi-account-plus</v-icon></v-btn>
                </v-list-tile-action>
                <!-- <v-list-tile-action v-else>
                  <v-btn @click="removeFriend(user)" flat small class="greyColors" left>Remove</v-btn>
                </v-list-tile-action> -->
                <v-btn v-else flat small class="primary--text pl-3 pr-1"><v-icon color="green darken-2" class="pl-4">mdi-account-check</v-icon></v-btn>

              </v-list-tile-action>
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
      transition: 'slide-y-reverse-transition'
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
          this.$store.dispatch('reloadMyEvents')
        })
      } else {
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
  .shareButton {
    position: absolute;
    top: 64px !important;
    right: 0px;
    z-index: 1;
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
  span.vuBadge {
    bottom: 100px;
    right: 130px;
    position: absolute;
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
  @media screen and (max-width: 1263px) {
    span.vuBadge {
      bottom: 100px;
      right: 82px;
      position: absolute;
    }
    .carousel {
      min-height: 100%;
      width: 100vw;
    }
  }
  @media screen and (max-width: 960px) {
    span.vuBadge {
      bottom: 100px;
      right: 82px;
      position: absolute;
    }
  }
  @media screen and (max-width: 600px) {
    .container {
      padding: 0;
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
