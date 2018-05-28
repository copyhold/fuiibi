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
    <v-divider></v-divider>
    <v-layout>
      <v-flex xs12>
        <form @submit.prevent="onCreateEvent" v-model="valid">

          <v-layout row class="mb-2">
            <v-flex xs12 sm6 class="uploadPicture" v-if="showUploadImage">
              <v-btn block flat class="secondary--text pt-5" @click="onPickFile"><v-icon class="mr-2">file_upload</v-icon>Upload Image </v-btn>
              <!-- We hide the button below because it's ugly and we use the button above instead. But it needs to be linked to the below input and for that we use ref
            the accept image is in order to accept image and nothing else-->
              <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked" >
            </v-flex>
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

          <!-- <v-divider></v-divider> -->

          <v-layout row wrap>
            <v-flex xs12 sm12 offset-sm3>
              <!-- <v-btn xs12 sm12 offset-sm3 v-if="locationInNavigator && showLocationButton" raised outline class="primary secondary--text" @click="getLocation">Use current Location </v-btn> -->
              <!-- <v-icon v-if="locationInNavigator && showLocationButton" large @click="getLocation">my_location</v-icon><span>Use my current location</span> -->
              <v-chip color="secondary" outline justify-center v-if="locationInNavigator && showLocationButton" @click="getLocation">
                <v-avatar>
                  <v-icon>my_location</v-icon>
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

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <!-- <v-icon class="mr-3">place</v-icon> -->
                <!-- <vue-google-autocomplete id="autoComplete" classname="form-control" placeholder="Location*" v-on:placechanged="getAddressData" required>
                </vue-google-autocomplete> -->
                <vuetify-google-autocomplete
                    id="map"
                    prepend-icon="place"
                    placeholder="Location"
                    v-on:placechanged="getAddressData"
                    v-on:no-results-found="alertNoResultFound"
                    :rules="[v => !!v || 'Location is required']"
                    v-model="where"
                >
                </vuetify-google-autocomplete>
            </v-flex>
          </v-layout>

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
        <v-alert v-model="alert" type="success" class="alertGreen" transition="slide-y-transition">
          New event created!
        </v-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        alert: false,
        valid: true,
        nameRules: [
          v => !!v || 'Name is required'],
        showUploadImage: true,
        showCanvas: false,
        where: '',
        fetchedLocation: {lat: 0, lng: 0},
        showLocationButton: true,
        searchingForLocation: false,
        durationInput: '',
        ex11: true,
        modal2: false,
        modal: false,
        title: '',
        description: '',
        // location: '',
        imageUrl: '',
        // description: '',
        /* eslint-disable */
        date: new Date()﻿.toISOString(),
        date: null,
        // eslint-disable-next-line
        time: new Date()﻿.toLocaleTimeString(),
        image: null,
        address: '',
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
      formIsValid () {
        if (this.address) {
          if (this.address.country && this.address.locality && this.address.route) {
            console.log('[formIsValid] this.address', this.address);
            console.log('[formIsValid] this.where', this.where);
            return this.title !== '' && this.imageUrl !== '' && this.durationInput  !== ''
          } else {
            console.log('[formIsValid] INVALID!!!!!!!!!!!!!!!!!!!', this.address);
          }
        } else {
          console.log('no address yet');
        }

        // console.log('[formIsValid] this.address', this.address);
        // return this.title !== '' && this.address.country !== {} && this.imageUrl !== ''
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
        this.address = addressData;
        console.log('[getAddressData], this.address', this.address);
        if (this.address) {
          if (this.address.street_number) {
            setTimeout(_ => {
              this.where = this.address.route + ' ' + this.address.street_number + ', ' + this.address.locality + ', ' + this.address.country
              console.log('this.were', this.where);
            }, 1)
          } else {
            setTimeout(_ => {
              this.where = this.address.route + ', ' + this.address.locality + ', ' + this.address.country
              console.log('this.were', this.where);
            }, 1)
          }
        }
      },
      alertNoResultFound () {
        console.log('[alertNoResultFound], alertNoResultFound');
      },
      getLocation () {
        // console.log('getLocation')
        if (!navigator.geolocation) {
          console.log('no geolocation in browser');
          return;
        }
        // console.log('after if navigator');
        let sawAlert = false
        // We hide the button and show the spinner
        this.searchingForLocation = true;
        this.showLocationButton = false;
        // console.log('just before navigator.geolocation.getCurrentPosition');
        setTimeout( _=> {
          this.searchingForLocation = false;
          this.showLocationButton = true
          if (sawAlert === false && this.fetchedLocation === {lat: 0, lng: 0}) {
            alert('Couldn\'t load location, please try mannually')
            sawAlert = true
          }
          this.fetchedLocation = {lat: 0, lng: 0}
        }, 7000);
        navigator.geolocation.getCurrentPosition( position => {
          console.log('in navigator.geolocation.getCurrentPosition');
          this.fetchedLocation = {lat: position.coords.latitude, lng: position.coords.longitude}
          // console.log('[getLocation] this.fetchedLocation', this.fetchedLocation);

          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;
          var geocoder = new google.maps.Geocoder;
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
          console.log('this.were', this.where);
          // document.getElementById('autoComplete').value = this.where
          // document.getElementById('map').value = this.where
          // this.$refs.autoCompleteInput.value = this.where
          // document.getElementById('map').value = this.where
          console.log('document.getElementById(map).value', document.getElementById('map').value);
          });
          this.searchingForLocation = false;
          this.showLocationButton = true

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
          duration: this.durationInput,
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
  .fitScreen {
    max-width: 100vw;
  }
  .alertGreen {
    position: absolute;
    bottom: 60px;
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
    margin-bottom: 56px;
  }
  @media screen and (max-width: 600px) {
    .chip {
      margin-left: 20vw;
    }
    .container {
      padding: 8px;
      background-color: #fff;
      margin-bottom: 56px;
    }
    .arrowBack {
      position: fixed;
      top: 8px;
      left: 8px;
      z-index: 3;
    }
  }
  /* #autoComplete{
    min-height: 30px;
    margin: 15px 0px;
    width: 85%;
    font-size: 17px;
    border-bottom: solid 1px grey;
    background-color: #fff;
  }
  #autoComplete:selected {
    border-bottom: solid 1px grey;
  } */
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
