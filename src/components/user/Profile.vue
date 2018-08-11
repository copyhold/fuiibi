<template lang="html">
  <v-container class="container">
    <div @click="back" class="arrowBack">
        <v-icon class="secondaryDark--text">arrow_back</v-icon>
    </div>
    <v-layout row wrap v-if="loading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="darkgray" :width="1" :size="90" v-if="loading" class="mt-5"></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>

        <v-card>
          <v-card-media :src="user.imageUrl" height="300px" v-if="!showCanvas"></v-card-media>
          <img :src="imageUrl" ref="imageToCanvas" style="display: none">
          <canvas ref="canvas" v-if="showCanvas" class="fitScreen"></canvas>
          <v-layout v-if="editMode">
            <v-btn flat absolute right @click="onPickFile2" class="pb-1 above">Change</v-btn>
            <input type="file" style="display: none" ref="fileInput2" accept="image/*" @change="onFilePicked" >
          </v-layout>
          <v-card-title>
              <h2 v-if="!editMode">{{ user.firstName }}</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-container fluid v-if="!editMode">
            <v-layout col>
                <v-flex xs5 sm5 md5>
                  <h4 class="greyColor mb-1 bold">First name:</h4>
                  <h4 class="greyColor mb-1 bold">Last name:</h4>
                  <h4 class="greyColor mb-1 bold">Date of birth:</h4>
                  <h4 class="greyColor mb-1 bold">Living in:</h4>
                  <h4 else class="greyColor mb-1 bold">Gender:</h4>
                  <h4 else class="greyColor mb-1 bold">Email:</h4>
                </v-flex>
                <v-flex xs7 sm7 md7>
                  <h4 class="mb-1"> {{ user.firstName }}</h4>
                  <h4 class="mb-1"> {{ user.lastName }}</h4>
                  <h4 v-if="user.dateOfBirth" class="mb-1"> {{ user.dateOfBirth | date }}</h4>
                  <h4 v-else class="mb-1">To be edited</h4>
                  <h4 v-if="user.livingIn != null" class="mb-1"> {{ user.livingIn.locality }} - {{ user.livingIn.country }}</h4>
                  <h4 v-else class="mb-1">To be edited</h4>
                  <!-- <h4 class="mb-1">unknown</h4> -->
                  <h4 v-if="gender" class="mb-1"> {{ user.gender }}</h4>
                  <h4 v-else class="mb-1">To be edited</h4>
                  <h4 class="mb-1">{{ user.email }}</h4>
                </v-flex>
                <v-fab-transition>
                  <v-btn color="orange" fixed bottom right fab class=" white--text" @click="turnOnEditMode">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </v-fab-transition>
            </v-layout>
          </v-container>
          <v-container fluid v-else>
            <v-layout>
              <v-flex xs12 sm12 md12>
                <form @submit.prevent="saveUserDetails">
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field name="firstName" label="First name" id="firstName" v-model="firstName" type="text" required>
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field name="lastName" label="Last name" id="lastName" v-model="lastName" type="text" required>
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-dialog persistent v-model="modal" lazy full-width width="290px">
                        <v-text-field slot="activator" label="Date of birth" v-model="date" prepend-icon="event" readonly></v-text-field>
                        <v-date-picker v-model="date" scrollable actions>
                          <template slot-scope="{ save, cancel }">
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="save">OK</v-btn>
                            </v-card-actions>
                          </template>
                        </v-date-picker>
                      </v-dialog>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <vuetify-google-autocomplete
                          v-model="where"
                          id="map"
                          prepend-icon="place"
                          placeholder="Living in..."
                          v-on:placechanged="getAddressData"
                          v-on:no-results-found="alertNoResultFound"
                          :rules="[v => !!v || 'Location is required']"
                          types= ''
                      >
                      <!-- to be added above to get only the city -->
                      <!-- types= '(cities)' -->
                      </vuetify-google-autocomplete>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-flex xs12 sm6 offset-sm3>
                      <v-flex xs12>
                        <v-select label="Gender" v-model="gender" :items="items" prepend-icon="wc"></v-select>
                      </v-flex>
                    </v-flex>
                  </v-layout>

                  <!-- <v-layout row>
                    <v-flex xs12>
                      <v-text-field name="email" label="Email" id="email" v-model="email" type="text" required prepend-icon="email">
                      </v-text-field>
                    </v-flex>
                  </v-layout> -->

                  <v-fab-transition>
                    <v-btn type="submit" color="green" fixed bottom right fab class=" white--text">
                      <v-icon>done</v-icon>
                    </v-btn>
                  </v-fab-transition>
                </form>
              </v-flex>
            </v-layout>
          </v-container>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
  export default {
    data () {
      return {
        image: null,
        imageUrl: '',
        showCanvas: false,
        // where: this.$store.getters.user.livingIn.locality + ', ' + this.$store.getters.user.livingIn.country,
        // where: this.livingInExist,
        where: '',
        address: '',
        date: this.$store.getters.user.dateOfBirth,
        modal: false,
        key: '',
        editMode: false,
        firstName: this.$store.getters.user.firstName,
        lastName: this.$store.getters.user.lastName,
        dateOfBirth: this.$store.getters.user.dateOfBirth,
        // livingIn: this.$store.getters.user.livingIn,
        livingIn: '',
        email: this.$store.getters.user.email,
        // gender: this.$store.getters.user.gender,
        gender: '',
        items: [
          'Female', 'Male'
        ]
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      },
      user () {
        if (this.$store.getters.user) {
          console.log('[user]', this.$store.getters.user)
          // console.log('[user]', this.$store.getters.users)
          return this.$store.getters.user
        }
      },
      submittableDate () {
        // const date = new Date(this.date).toISOString()
        const date = new Date(this.date)

        return date
      }
    },
    methods: {
      turnOnEditMode () {
        this.editMode = true
        console.log('[turnOnEditMode]')
        if (this.user.livingIn != null) {
          console.log('[turnOnEditMode] this.user.livingIn != null   => this.where', this.where)
          this.where = this.user.livingIn.locality + ', ' + this.user.livingIn.country
          this.livingIn = this.$store.getters.user.livingIn
          console.log('[turnOnEditMode] this.livingIn', this.livingIn)
        } else {
          this.livingIn = ''
        }
        if (this.user.gender != null) {
          this.gender = this.$store.getters.user.gender
        } else {
          this.gender = ''
        }
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
            console.log('[onFilePicked] this.$refs.canvas.width', this.$refs.canvas.width)
            this.$refs.canvas.height = imageWidth * image.height / image.width
            // Now I create the image - what?, top, left, width, height
            context.drawImage(image, 0, 0, imageWidth, imageWidth * image.height / image.width)
            this.image = this.dataURItoBlob(this.$refs.canvas.toDataURL())
            console.log('this.image', this.image)
          })
        })
        fileReader.readAsDataURL(files[0])
        this.showCanvas = true
        // this.showUploadImage = false
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
      onPickFile2 () {
        // the $refs below give us access to all the ref elements in the template of this component
        this.$refs.fileInput2.click()
      },
      alertNoResultFound () {
        console.log('[alertNoResultFound], alertNoResultFound')
      },
      getAddressData (addressData) {
        console.log('[getAddressData] addressData', addressData)
        this.livingIn = addressData
        if (this.livingIn) {
          console.log('[getAddressData   if (this.livingIn)] this.livingIn.locality + ', ' + this.livingIn.country', this.livingIn.locality + ', ' + this.livingIn.country)
          setTimeout(_ => {
            this.where = this.livingIn.locality + ', ' + this.livingIn.country
          }, 1)
        }
      },
      // getAddressData (addressData, placeResultData, id) {
      //   this.livingIn = addressData
      // },
      saveUserDetails () {
        this.editMode = false
        console.log('[saveUserDetails] this.submittableDate, this.livingIn.country', this.submittableDate, this.livingIn.country)
        // if (!this.formIsValid) {
        //   return
        // }
        const updatedUser = {
          id: this.user.id,
          firstName: this.firstName,
          lastName: this.lastName,
          dateOfBirth: this.submittableDate,
          livingIn: {
            country: this.livingIn.country,
            locality: this.livingIn.locality
          },
          email: this.email,
          gender: this.gender,
          image: this.image
        }
        console.log('[saveUserDetails] updatedUser', updatedUser)

        this.$store.dispatch('updateProfile', updatedUser)
        // // this.$store.dispatch('addNotifications', eventData)
        // this.$router.push('/myEvents')
      },
      back () {
        this.$router.go(-1)
      }
      // sendFriendRequest (userId) {
      //   console.log('userID from sendFriendRequest ', userId)
      //   this.$store.dispatch('sendFriendRequest', userId)
      // }
    }
  }
</script>

<style scoped>
  .arrowBack {
      position: fixed;
      top: 19px;
      left: 8px;
      z-index: 3;
      cursor: pointer;
  }
  .fitScreen {
    max-width: calc(100vw - 16px);
  }
  .above {
    z-index: 4;
  }
  .btn--bottom:not(.btn--absolute) {
      bottom: 72px;
  }
  #autoComplete{
    min-height: 30px;
    margin: 15px 0px;
    width: 84%;
    font-size: 17px;
    border-bottom: solid 1px grey;
  }
  .camera{
    top: 281px;
    right: 10px;
    z-index: 1000;
  },
  .greyColor{
    color: grey;
  }
  .bold{
    font-weight: 500;
  }
  .container{
    margin-top: 0;
    padding: 8px;
    margin-bottom: 32px;
  }
  .card__title--primary {
     padding-top: 0px;
  }
  .btn__content {
    justify-content: flex-start;

  }
  .arrowBack {
    position: fixed;
    top: 8px;
    left: 8px;
    z-index: 3;
  }
</style>
