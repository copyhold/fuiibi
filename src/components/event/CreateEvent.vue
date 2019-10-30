<template >
  <v-container class="container">
    <div @click="$router.go(-1)" class="arrowBack">
        <v-icon class="secondary--text">arrow_back</v-icon>
    </div>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3 class="mt-2">
        <h2 class="mb-2">Create a new event </h2>
        <!-- <v-switch v-bind:label="`Public`" v-model="ex11"></v-switch> -->
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <form @submit.prevent="onCreateEvent" v-model="valid">

          <v-layout row class="mb-2">
            <v-flex xs12 sm6 class="uploadPicture" v-if="showUploadImage">
              <v-btn tag="label" block flat class="secondary--text" style="height: 100%; margin: 0;" >
                <v-icon class="mr-2">file_upload</v-icon>Upload Image
                <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked" >
              </v-btn>
            </v-flex>
          </v-layout>

          <v-layout row v-if="imageUrl != ''">
            <v-btn @click="rotateLeft" flat><v-icon left class="rotateLeftIcon">rotate_left</v-icon>rotate left</v-btn>
            <v-btn @click="rotateRight" flat>rotate right<v-icon right>rotate_right</v-icon></v-btn>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <img :src="imageUrl" ref="imageToCanvas" style="display: none">
              <canvas ref="canvas" v-if="showCanvas" class="fitScreen"></canvas>
              <v-btn block v-if="showCanvas" @click="onPickFile2" class="above secondary">Change the main photo of the event</v-btn>
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
              <div class="text-xs-center my-3" >
                <v-chip color="secondary" outline justify-center v-if="locationInNavigator && showLocationButton" @click="getLocation">
                  <v-avatar>
                    <v-icon v-if="!gettingLocation">my_location</v-icon>
                    <v-progress-circular v-else indeterminate color="darkgray" :width="1" :size="10"></v-progress-circular>
                  </v-avatar>
                  Use my current location
                </v-chip>
              </div>

              <v-flex xs12 class="text-xs-center">
                <v-progress-circular indeterminate color="primary" :witdh="7" :size="30" v-if="searchingForLocation" class="mt-1"></v-progress-circular>
              </v-flex>
              <div class="mdl-spinner mdl-js-spinner is-active" id="location-loader"></div>
            </v-flex>
          </v-layout>

          <!-- <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
              <div class="text-xs-center mb-3" >
                <v-chip color="secondary" outline justify-center v-if="!showVueAutoComplete && !showLocationButton && !searchingForLocation" @click="hideChangeButton">
                  <v-avatar>
                    <v-icon >my_location</v-icon>
                  </v-avatar>
                  Change event location
                </v-chip>
              </div>
            </v-flex>
          </v-layout> -->

          <v-layout row v-if="showVueAutoComplete">
              <v-flex xs1>
                <v-icon >place</v-icon>
              </v-flex>
              <v-flex xs11>
                <vue-google-autocomplete
                  id="create-event-google-autocomplete"
                  ref="map"
                  placeholder="Location*"
                  v-on:no-results-found="alertNoResultFound"
                  v-on:placechanged="getAddressData"
                  v-on:inputChange="updateWhereFromInput"
                  v-model="where"
                  types=''
                  class="vueGoogleInput">
                </vue-google-autocomplete>
              </v-flex>
          </v-layout>

          <v-flex xs12 sm12 offset-sm3 v-else>
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
                <v-date-picker v-model="selectingDate" scrollable actions :max="getEndDate">
                  <template slot-scope="{ save, cancel }">
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat color="secondaryDark" @click="modal=false">Cancel</v-btn>
                      <v-btn flat color="secondaryDark" @click="date=selectingDate;modal=false">OK</v-btn>
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
                <v-time-picker v-model="selectingTime" format="24hr" actions>
                  <template slot-scope="{ save, cancel }">
                    <v-card-actions>
                      <v-btn flat color="secondaryDark" @click="modal2=false">Cancel</v-btn>
                      <v-btn flat color="secondaryDark" @click="time=selectingTime;modal2=false">Save</v-btn>
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
                  single-line menu-props="auto"
                  prepend-icon="timelapse"
                  required
                  :rules="[v => !!v || 'Duration is required']"
                ></v-select>
              </v-flex>
            </v-flex>
          </v-layout>

          <v-dialog v-model="validationAlerts" lazy full-width width="290px" v-if="!formIsValid">
            <v-btn class="lightGrey white--text" block type="submit" flat slot="activator" @click="openAlertValidation">Create Event</v-btn>
            <v-card>
              <v-card-text v-if="this.title === ''">
                * Event name is required
              </v-card-text>
              <v-card-text v-if="this.where === ''">
                * Location is required
              </v-card-text>
              <v-card-text v-if="this.durationInput === ''">
                * Duration is required
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  flat
                  @click="validationAlerts = false"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-layout row v-else>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn class="orange white--text" type="submit" block @click="showAlert">Create Event</v-btn>
              <!-- :disabled="!formIsValid" -->
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
  const exifparser = require('exif-parser')

  export default {
    data () {
      return {
        maxDate: new Date(),
        gettingLocation: false,
        filename: null,
        usedDeviceLocation: false,
        showVueAutoComplete: true,
        alert: false,
        valid: true,
        validationAlerts: false,
        // rules: {
        //   required: value => !!value || 'Location is required.',
        //   locationRules: value => !!value.locality || 'Locality is missing, a full address is required'
        // },
        locationRules: [
          v => !!v || 'A full address is required',
          v => v.locality === undefined || 'Locality is missing, a full address is required'
          // v => !!v.locality || 'Locality is missing, a full address is required'
          // v => !!v.route || 'Route is missing, a full address is required'
        ],
        nameRules: [
          v => !!v || 'Name is required'],
        showUploadImage: true,
        showCanvas: false,
        where: null,
        lat: null,
        lng: null,
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
        selectingDate: new Date().toISOString().substring(0, 10),
        selectingTime: this.format_time(new Date()),
        date: new Date().toISOString().substring(0, 10),
        time: this.format_time(new Date()),
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
        states: [
          'Les than one hour', '1 hour', '2 Hours','Half day','Full day','More than one day'
        ]
      }
    },

    computed: {
      getEndDate () {
        var endDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), this.maxDate.getUTCDate() + 1)
        return endDate.toISOString().slice(0, 10)
      },
      formIsValid () {
        const location_valid = this.lat && this.lng && this.where
        return location_valid && this.title !== '' && this.imageUrl !== '' && this.durationInput  !== ''
      },
      locationInNavigator() {
        if (!navigator.geolocation && !this.showLocationButton) {
          this.$log(' no geolocation in navigator');
          // We dont show this button it there is no access to the geolocation
          return false;
        }
          return true;
      },
      submittableDateTime () {
        const date = new Date(this.date)
        this.$log('[submittableDateTime] date', date);
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
      updateWhereFromInput ({newVal,oldVal}) {
        this.where = newVal 
      },
      closeAlertValidation () {
        this.$log('[closeAlertValidation]');
      },
      openAlertValidation () {
        this.validationAlerts = true
        this.$log('[openAlertValidation]');
      },
      hideChangeButton () {
        this.showVueAutoComplete = true
        this.showLocationButton = true
        this.$log('[hideChangeButton] clicked');
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
        this.alert = true
        setTimeout ( _=> {
          this.alert = false
        }, 2000)
      },
      /**
      * When the location found
      * @param {Object} addressData Data of the found location
      * @param {Object} placeResultData PlaceResult object
      * @param {String} id Input container ID
      */
      // getAddressData (addressData, placeResultData, id) {
      getAddressData (addressData, placeResultData) {
        this.lat = addressData.latitude, this.lng = addressData.longitude
        this.where = placeResultData.formatted_address
      },
      alertNoResultFound () {
        this.$log('[alertNoResultFound], alertNoResultFound');
      },
      getLocation () {
        this.gettingLocation = true
        console.log("getting location", this.gettingLocation)
        navigator.geolocation.getCurrentPosition(position => {
          const {latitude: lat, longitude: lng} = position.coords
          this.lat = lat
          this.lng = lng
          const geocoder = new global.google.maps.Geocoder()
          geocoder.geocode({location: {lat, lng}}, (results, status) => {
            this.$log('results ', results)
            this.where = results[0].formatted_address
            this.$refs.map.update(this.where)
          })
        }, err => {
          this.$debug(err)
          this.usedDeviceLocation = false
        })
        this.gettingLocation = false
        console.log("getting location", this.gettingLocation)
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
          location: {
            locality: this.where,
            latitude: this.lat,
            longitude: this.lng
          },
          image: this.image,
          filename: this.filename,
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
      format_time (date) {
        const twodigits = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 })
        return twodigits.format(date.getHours()) + ':' + twodigits.format(date.getMinutes())
      },
      fillEventDataFromImage(file) {
        if ('image/jpeg' !== file.type) {
          return
        }
        const file_reader = new FileReader()
        const component = this
        file_reader.addEventListener('load', e => {
          const parser = exifparser.create(file_reader.result)
          try {
            const imagemeta = parser.parse()
            this.$debug(imagemeta)
            const date_tag = imagemeta.tags.CreateDate || imagemeta.tags.ModifyDate
            if (date_tag) {
              const create_date = new Date(date_tag * 1000)
              component.date = component.selectingDate = create_date.toISOString().substring(0, 10)
              component.time = component.selectingTime = this.format_time(create_date)
            }
            const {GPSLongitude,GPSLatitude} = imagemeta.tags
            if (GPSLongitude) {
              this.lat = GPSLatitude, this.lng = GPSLongitude
              this.$refs.map.updateCoordinates({lat: GPSLatitude, lng: GPSLongitude})
              const geocoder = new global.google.maps.Geocoder()
              geocoder.geocode({location: {lat: this.lat, lng: this.lng}}, (results, status) => {
                this.where = results[0].formatted_address
                this.$refs.map.update(this.where)
              })
            }
          } catch (err) {
            component.$error(err)
          }
        })
        file_reader.readAsArrayBuffer(file)
      },
      onFilePicked (event) {
        // We get the wanted file
        const files = event.target.files
        this.fillEventDataFromImage(files[0])
        // As we can choose only one file, we take the first one in the array
        this.filename = files[0].name
        // Simple chack if the file is valid
        if (this.filename.lastIndexOf('.') <= 0) {
          return alert('Please enter a valid image')
        }
        // Turn it into base64
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          // the result here is a base64 image
          this.imageUrl = fileReader.result
          var img = new Image()
          img.src = this.imageUrl
          img.addEventListener('load', dataurl => {
            let context = this.$refs.canvas.getContext('2d')
            let image = this.$refs.imageToCanvas
            // let imageWidth = window.outerWidth - 16
            let imageWidth = 500
            this.$refs.canvas.width = imageWidth
            this.$refs.canvas.height = imageWidth * image.height / image.width
            // Now I create the image - what?, top, left, width, height
            context.drawImage(image, 0, 0, imageWidth, imageWidth * image.height / image.width)
            this.image = this.dataURItoBlob(this.$refs.canvas.toDataURL())
            this.$log('this.image', this.image)
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
    max-width: 100%;
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
    left: 0;
  }
  .above {
    z-index: 1;
    /* left: 1vw; */
    position: relative;
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
