<template >
  <v-container class="container">
    <div @click="back" class="arrowBack">
        <v-icon class="secondary--text">arrow_back</v-icon>
    </div>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3 class="mt-2">
        <h3 class="mb-2">Create a new event </h3>
        <!-- <v-switch v-bind:label="`Public`" v-model="ex11"></v-switch> -->
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <form @submit.prevent="onCreateEvent" v-model="valid">

          <v-layout row class="mb-2">
            <v-flex xs12 sm6 class="uploadPicture" v-if="showUploadImage">
              <v-btn block flat class="secondary--text pt-5" @click="onPickFile"><v-icon class="mr-2">file_upload</v-icon>Upload Image</v-btn>
              <!-- We hide the button below because it's ugly and we use the button above instead. But it needs to be linked to the below input and for that we use ref
            the accept image is in order to accept image and nothing else-->
              <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked" >
            </v-flex>
          </v-layout>

          <v-layout row v-if="imageUrl != ''">
            <v-btn @click="rotateLeft" ><v-icon left class="rotateLeftIcon pr-3">rotate_left</v-icon>rotate left</v-btn>
            <v-btn @click="rotateRight">rotate right<v-icon right>rotate_right</v-icon></v-btn>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <img :src="imageUrl" ref="imageToCanvas" style="display: none">
              <canvas ref="canvas" v-if="showCanvas" class="fitScreen"></canvas>
              <v-btn flat v-if="showCanvas" absolute right @click="onPickFile2" class="pb-5 above">Change</v-btn>
              <input type="file" style="display: none" ref="fileInput2" accept="image/*" @change="onFilePicked" >
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field name="title" label="Event Name" id="title" v-model="title" :rules="nameRules" required>
              </v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field name="description" label="Description" id="description" v-model="description">
              </v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
              <v-chip color="secondary" outline justify-center v-if="locationInNavigator && showLocationButton" @click="getLocation">
                <v-avatar>
                  <v-icon >my_location</v-icon>
                </v-avatar>
                Use my current location
              </v-chip>
              <v-flex xs12 class="text-xs-center">
                <v-progress-circular indeterminate color="primary" :witdh="7" :size="30" v-if="searchingForLocation" class="mt-1"></v-progress-circular>
              </v-flex>
              <div class="mdl-spinner mdl-js-spinner is-active" id="location-loader"></div>
              </div>
              <!-- <v-btn raised outline class="primaryLight primaryLight--text" @click="showMap">Map </v-btn> -->
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
              <v-chip color="secondary" outline justify-center v-if="!showVueAutoComplete && !showLocationButton && !searchingForLocation" @click="showChangeButton">
                <v-avatar>
                  <v-icon >my_location</v-icon>
                </v-avatar>
                Change location
              </v-chip>
              <!-- <v-flex xs12 class="text-xs-center">
                <v-progress-circular indeterminate color="primary" :witdh="7" :size="30" v-if="searchingForLocation" class="mt-1"></v-progress-circular>
              </v-flex> -->
              <div class="mdl-spinner mdl-js-spinner is-active" id="location-loader"></div>
              </div>
              <!-- <v-btn raised outline class="primaryLight primaryLight--text" @click="showMap">Map </v-btn> -->
            </v-flex>
          </v-layout>

          <v-layout row v-if="showVueAutoComplete">
              <v-flex xs1>
                <v-icon >place</v-icon>
              </v-flex>
              <v-flex xs11>
                <vue-google-autocomplete
                    id="map"
                    placeholder="Location*"
                    v-on:no-results-found="alertNoResultFound"
                    v-on:placechanged="getAddressData"
                    v-model="where"
                    types= ''
                    v-on:where="where"
                    class="vueGoogleInput"
                    :rules="locationRules"
                >
                </vue-google-autocomplete>
              </v-flex>
          </v-layout>

          <v-flex xs12 sm12 offset-sm3 v-else>
            <!-- <vuetify-google-autocomplete
                id="map"
                prepend-icon="place"
                placeholder="Location"
                v-on:no-results-found="alertNoResultFound"
                v-on:placechanged="getAddressData"
                v-model="where"
                types= ''
                :rules="locationRules"
                :required="true"
            >
            </vuetify-google-autocomplete> -->
            <v-flex xs12>
              <v-text-field
                prepend-icon="place"
                placeholder="Location"
                v-model="where"
                :rules="locationRules"
                :required="true"
                :readonly="true"
              ></v-text-field>
            </v-flex>
          </v-flex>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-dialog persistent v-model="modal" lazy full-width width="290px">
                <v-text-field slot="activator" label="When?" v-model="date" prepend-icon="event" readonly></v-text-field>
                <v-date-picker v-model="date" scrollable actions>
                  <template slot-scope="{ save, cancel }">
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat color="secondaryDark" @click="cancel">Cancel</v-btn>
                      <v-btn flat color="secondaryDark" @click="save">OK</v-btn>
                    </v-card-actions>
                  </template>
                </v-date-picker>
              </v-dialog>
            </v-flex>
          </v-layout>

          <v-layout>
            <v-flex xs12 sm6 offset-sm3>
              <v-dialog persistent v-model="modal2" lazy full-width width="290px">
                <v-text-field slot="activator" label="What time?" v-model="time" prepend-icon="access_time" readonly></v-text-field>
                <v-time-picker v-model="time" format="24hr" actions>
                  <template slot-scope="{ save, cancel }">
                    <v-card-actions>
                      <v-btn flat color="secondaryDark" @click="cancel">Cancel</v-btn>
                      <v-btn flat color="secondaryDark" @click="save">Save</v-btn>
                    </v-card-actions>
                  </template>
                </v-time-picker>
              </v-dialog>
            </v-flex>
          </v-layout>

          <v-layout>
            <v-flex xs12 sm6 offset-sm3>
              <v-flex xs12>
                <v-select
                  v-bind:items="states"
                  v-model="durationInput"
                  label="Duration"
                  single-line auto
                  prepend-icon="timelapse"
                  required
                  :rules="[v => !!v || 'Duration is required']"
                ></v-select>
              </v-flex>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn class="orange white--text" :disabled="!formIsValid" type="submit" block @click="showAlert">Create Event</v-btn>
            </v-flex>
          </v-layout>
        </form>
        <v-layout row>
          <v-alert v-model="alert" type="success" class="alertGreen" transition="slide-y-transition">
            New event created!
          </v-alert>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        showVueAutoComplete: true,
        alert: false,
        valid: true,
        locationRules: [
          v => !!v || 'A full address is required'
          // v => !!v.locality || 'Locality is missing, a full address is required'
          // v => !!v.route || 'Route is missing, a full address is required'
        ],
        nameRules: [
          v => !!v || 'Name is required'],
        showUploadImage: true,
        showCanvas: false,
        where: '',
        fetchedLocation: {lat: 0, lng: 0},
        showLocationButton: true,
        searchingForLocation: false,
        durationInput: '2 Hours',
        ex11: true,
        modal2: false,
        modal: false,
        title: '',
        description: '',
        imageUrl: '',
        /* eslint-disable */
        // date: new Date().toLocaleDateString(),
        // date: new Date().toISOString(),
        date: new Date().toISOString().substring(0, 10),
        time: new Date()﻿.toLocaleTimeString(),
        image: null,
        address: {
          country: '',
          locality: '',
          route: 'Unnamed road',
          administrative_area_level_1: '',
          latitude: null,
          longitude: null,
          postal_code: '',
          street_number: '-'
        },
        items: [
          { text: 'State 1' },
          { text: 'State 2' },
          { text: 'State 3' },
          { text: 'State 4' },
          { text: 'State 5' },
          { text: 'State 6' },
        ],
        states: [
          'Les than one hour', '1 hour', '2 Hours','Half day','Full day','More than one day'
        ]
      }
    },
    computed: {
      // submittableDate () {
      //   if (this.modal === false) {
      //     console.log('[submittableDate] this.modal === false');
      //     return new Date().toLocaleDateString()
      //   } else {
      //     return new Date().toISOString()
      //   }
      // },
      // submittableDate () {
      //   const date = new Date(this.date)
      //   console.log('[submittableDate] date', date);
      //   if (typeof this.date === 'string') {
      //     const day = this.time.match(/^(\d+)/)[1]
      //     const month = this.time.match(/:(\d+)/)[1]
      //     const year = this.time.match(/:(\d+)/)[1]
      //     date.setYear(hours)
      //     date.setMonth(month)
      //     date.setDate(day)
      //   } else {
      //     date.setYear(this.date.getYear())
      //     date.setMonth(this.date.getMonth())
      //     date.setDate(this.date.getDate())
      //   }
      //   return date
      // }
      formIsValid () {
        if (this.address) {
          // if (this.address.country && this.address.locality && this.address.route) {
          //   console.log('[formIsValid] this.address', this.address);
          //   console.log('[formIsValid] this.where', this.where);
          //   return this.title !== '' && this.imageUrl !== '' && this.durationInput  !== ''
          // } else {
          //   console.log('[formIsValid] INVALID!!!!!!!!!!!!!!!!!!!', this.address);
          // }
          if (this.address.country && this.address.locality && this.address.route && this.address.longitude && this.address.latitude) {
            console.log('[formIsValid] this.address', this.address);
            console.log('[formIsValid] this.where', this.where);
            return this.title !== '' && this.imageUrl !== '' && this.durationInput  !== ''
          } else {
            console.log('[formIsValid] INVALID!!!!!!!!!!!!!!!!!!!', this.address);
          }
        } else {
          console.log('no address yet');
        }
      },
      locationInNavigator() {
        if (!navigator.geolocation && !this.showLocationButton) {
          console.log(' no geolocation in navigator');
          // We dont show this button it there is no access to the geolocation
          return false;
        }
          return true;
      },
      submittableDateTime () {
        const date = new Date(this.date)
        console.log('[submittableDateTime] date', date);
        if (typeof this.time === 'string') {
          const hours = this.time.match(/^(\d+)/)[1]
          const minutes = this.time.match(/:(\d+)/)[1]
          date.setHours(hours)
          date.setMinutes(minutes)
        } else {
          date.setHours(this.time.getHours())
          date.setMinutes(this.time.getMinutes())
        }
        return date
      }
    },
    methods: {
      showChangeButton () {
        this.showVueAutoComplete = true
        this.showLocationButton = true
        console.log('[showchangeButton] clicked');
      },
      // gotFocused () {
      //   // setTimeout( _ => {
      //     this.showVueAutoComplete = false
      //     console.log('[gotFocused] this.showVueAutoComplete', this.showVueAutoComplete);
      //   // }, 10000)
      // },
      rotateRight () {
        let context = this.$refs.canvas.getContext('2d')
        let image = this.$refs.imageToCanvas
        let screenWidth = window.screen.width
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
        let screenWidth = window.screen.width
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
      showAlert () {
        console.log('showing alert');
        this.alert = true
        setTimeout ( _=> {
          console.log('closing alert');
          this.alert = false
        }, 2000)
      },
      back () {
        this.$router.go(-1)
      },
      /**
      * When the location found
      * @param {Object} addressData Data of the found location
      * @param {Object} placeResultData PlaceResult object
      * @param {String} id Input container ID
      */
      // getAddressData (addressData, placeResultData, id) {
      getAddressData (addressData) {
        console.log('[getAddressData] => addressData', addressData);
        if (addressData) {
          if (addressData.route) {
            this.address = {
              country: addressData.country,
              locality: addressData.locality,
              route: addressData.route,
              administrative_area_level_1: addressData.administrative_area_level_1,
              latitude: addressData.latitude,
              longitude: addressData.longitude,
              // postal_code: addressData.postal_code,
              street_number: addressData.street_number
            }
            // this.address = addressData;
          } else {
            this.address = {
              country: addressData.country,
              locality: addressData.locality,
              route: 'Unnamed road',
              administrative_area_level_1: addressData.administrative_area_level_1,
              latitude: addressData.latitude,
              longitude: addressData.longitude,
              // postal_code: addressData.postal_code,
              street_number: addressData.street_number
            }
          }
        }
        console.log('[getAddressData], this.address', this.address);
        if (addressData) {
          if (this.address.street_number && this.address.route && this.address.route != 'Unnamed road') {
            setTimeout(_ => {
              this.where = this.address.route + ' ' + this.address.street_number + ', ' + this.address.locality + ', ' + this.address.country
              console.log('this.were this.address.street_number && this.address.route', this.where);
            }, 1)
          } else if (this.address.route && this.address.route != 'Unnamed road') {
            setTimeout(_ => {
              this.where = this.address.route + ', ' + this.address.locality + ', ' + this.address.country
              console.log('this.were this.address.route', this.where);
            }, 1)
          } else {
            setTimeout(_ => {
              this.where = this.address.locality + ', ' + this.address.country
              console.log('this.were', this.where);
            }, 1)
          }
        }
      },
      alertNoResultFound () {
        console.log('[alertNoResultFound], alertNoResultFound');
      },
      getLocation () {
        console.log('[getLocation] this.showVueAutoComplete', this.showVueAutoComplete);
        console.log('getLocation')
        if (!navigator.geolocation) {
          console.log('no geolocation in browser');
          return;
        }
        // console.log('after if navigator');
        this.where = ''
        let sawAlert = false
        // We hide the button and show the spinner
        this.searchingForLocation = true;
        this.showLocationButton = false;
        // console.log('just before navigator.geolocation.getCurrentPosition');
        setTimeout( _=> {
          this.searchingForLocation = false;
          // this.showLocationButton = true
          if (sawAlert === false && this.fetchedLocation === {lat: 0, lng: 0}) {
            alert('Couldn\'t load location, please try mannually')
            sawAlert = true
          }
          this.fetchedLocation = {lat: 0, lng: 0}
        }, 7000);
        navigator.geolocation.getCurrentPosition( position => {
          console.log('in navigator.geolocation.getCurrentPosition');
          this.fetchedLocation = {lat: position.coords.latitude, lng: position.coords.longitude}
          console.log('[getLocation] this.fetchedLocation', this.fetchedLocation);
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;
          var geocoder = new google.maps.Geocoder();
          let myPlace = new google.maps.LatLng(this.lat,this.lon);
          let geopos = `${this.lat},${this.lon}`;
          let latlngStr = geopos.split(',', 2);
          var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
          // console.log(latlng)
          geocoder.geocode({'location': latlng}, (results, status) => {
          console.log('results ', results);
          this.address = {
            administrative_area_level_1: results[4].address_components["0"].long_name,
            country: results[4].address_components[1].long_name,
            latitude: this.lat,
            longitude: this.lon,
            locality: results["0"].address_components[1].long_name,
            route: results["0"].address_components["0"].long_name,
            street_number: results["0"].address_components["0"].long_name
          }
          console.log('[this address nvo object]', this.address);
          this.where = results[0].formatted_address
          setTimeout(_ => {
            this.where = results[0].formatted_address
            console.log('[getLocation] in the setTimeout this.where', this.where);
          }, 1)
          });
          this.showVueAutoComplete = false
          this.searchingForLocation = false;
          // this.showLocationButton = true

        }), err => {
          console.log(err);
          this.searchingForLocation = false;
          this.showLocationButton = true
          if (!sawAlert) {
            alert('Couldn\'t load location, please try mannually')
            sawAlert = true
          }
          this.fetchedLocation = {lat: 0, lng: 0}
        }, {setTimeout: 7000}
      },
      showMap () {
        console.log('showMap')
      },
      onCreateEvent () {
        if (!this.formIsValid) {
          return
        }
        if (!this.image) {
          return
        }
        const eventData = {
          title: this.title,
          location: this.address,
          image: this.image,
          description: this.description,
          date: this.submittableDateTime,
          users: [],
          duration: this.durationInput
          // dateToRank: this.date.getTime()
        }
        this.$store.dispatch('createEvent', eventData)
        // this.$store.dispatch('addNotifications', eventData)
        setTimeout( _=> {
          this.$router.push('/myEvents')
        }, 2000)
      },
      onPickFile () {
        // the $refs below give us access to all the ref elements in the template of this component
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
            // let imageWidth = window.outerWidth - 16
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
      },
    }
  }
</script>


<style scoped>
  .rotateLeftIcon {
    margin-top: 0 !important;
  }
  .fitScreen {
    max-width: 100vw;
  }
  .vueGoogleInput{
    width: 96%;
    border-bottom: 1px solid grey;
    margin-left: 4%;
    /* margin-top: 10px; */
    font-size: 16px;
    color: rgba(0,0,0,0.8);
    margin-bottom: 20px;
  }
  input {
    background-color: white !important;
  }
  input.vueGoogleInput:focus {
    border: none !important;
    border-bottom: black 2px solid !important;
    border-top: white 2px solid;
    outline: none;
  }
  .arrowBack {
    position: fixed;
    top: 16px;
    left: 8px;
    z-index: 3;
    cursor: pointer;
  }
  .alertGreen {
    position: fixed;
    bottom: 54px;
    width: 100vw;
  }
  .above {
    z-index: 50;
  }
  .centered {
    margin-top: 75px;
    margin-left: 22vw;
  }
  .uploadPicture {
    border-style: dashed;
    border-color: grey;
    border-width: thin;
    height: 144px;
    margin: 0 auto;
  }
  .container {
    margin-top: 0;
    background-color: #fff;
    margin-bottom: 56px;
  }
  @media screen and (max-width: 600px) {
    .chip {
      margin-left: 20vw;
      margin-bottom: 20px;
    }
    .container {
      padding: 8px;
      background-color: #fff;
      margin-bottom: 56px;
      max-width: 1900px;
    }
    .arrowBack {
      position: fixed;
      top: 8px;
      left: 8px;
      z-index: 3;
      cursor: pointer;
    }
  }
  input {
    -moz-appearance: none;
    -webkit-appearance: none;
  }
  input:focus{
    background-color: rgb(250, 255, 189);
    border-color: white;
  }
  .material-icons {
    text-rendering: optimizeLegibility;
  }
  h3 {
    color: grey;
  }
</style>
