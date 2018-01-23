<template >
  <v-container class="container">
    <router-link
        v-if="$routerHistory.hasHistory()"
        :to="{ path: $routerHistory.previous().path }"
        class="arrowBack"
        >
        <v-icon class="white--text">arrow_back</v-icon>
    </router-link>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h2>Create a new event </h2>
        <v-switch v-bind:label="`Public`" v-model="ex11"></v-switch>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout>
      <v-flex xs12>
        <form @submit.prevent="onCreateEvent">

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field name="title" label="Event Name" id="title" v-model="title" required>
              </v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field name="description" label="Description" id="description" v-model="description">
              </v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row class="mb-2">
            <v-flex xs12 sm6 offset-sm3>
              <!-- In order to load an image to Firebase -->
              <v-btn raised outline class="primaryLight primaryLight--text" @click="onPickFile">Upload Image </v-btn>
              <!-- We hide the button below because it's ugly and we use the button above instead. But it needs to be linked to the below input and for that we use ref
            the accept image is in order to accept image and nothing else-->
              <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked">
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <img :src="imageUrl" height="150px">
            </v-flex>
          </v-layout>

          <v-divider></v-divider>

          <v-layout row wrap>
            <v-flex xs12 sm12 offset-sm3>
              <v-btn raised outline class="primaryLight primaryLight--text" @click="getLocation">Current Location </v-btn>
              <v-btn raised outline class="primaryLight primaryLight--text" @click="showMap">Map </v-btn>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <v-icon class="mr-3">place</v-icon>
                <vue-google-autocomplete
                id="autoComplete"
                classname="form-control"
                placeholder="Location*"
                v-on:placechanged="getAddressData"
                >
                </vue-google-autocomplete>
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
                      <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                      <v-btn flat color="primary" @click="save">OK</v-btn>
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
                      <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                      <v-btn flat color="primary" @click="save">Save</v-btn>
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
                  single-line
                  auto
                  prepend-icon="history"
                  hide-details
                  required
                ></v-select>
              </v-flex>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn class="orange white--text" :disabled="!formIsValid" type="submit" block>Create Event</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  // import VueGoogleAutocomplete from 'vue-google-autocomplete'
  //
  // Vue.component('vue-google-autocomplete', VueGoogleAutocomplete)

  export default {
    data () {
      return {
        durationInput: '2 hours',
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
        // eslint-disable-next-line
        time: new Date()﻿.toLocaleTimeString(),
        image: null,
        address: {},
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
    // mounted() {
    // // To demonstrate functionality of exposed component functions
    // // Here we make focus on the user input
    // this.$refs.address.focus();
    // },
    computed: {
      formIsValid () {
        return this.title !== '' && this.address !== '' && this.imageUrl !== ''
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
      /**
      * When the location found
      * @param {Object} addressData Data of the found location
      * @param {Object} placeResultData PlaceResult object
      * @param {String} id Input container ID
      */
      getAddressData: function (addressData, placeResultData, id) {
          this.address = addressData;
      },
      getLocation () {
        console.log('getLocation')
        console.log('durationInput', this.durationInput);
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
        this.$router.push('/myEvents')
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
      }
    }
  }
</script>


<style scoped>
  .container{
    margin-top: 0;
  }
  @media screen and (max-width: 600px) {
    .container {
      padding: 8px;
    }
    .arrowBack {
      position: fixed;
      top: 64px;
      left: 24px;
      z-index: 3;
    }
  }
  #autoComplete{
    min-height: 30px;
    margin: 15px 0px;
    width: 87%;
    font-size: 17px;
    border-bottom: solid 1px grey;
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
