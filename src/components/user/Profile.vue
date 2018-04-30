<template lang="html">
  <v-container class="container">
    <div @click="back" class="arrowBack">
        <v-icon class="secondaryDark--text">arrow_back</v-icon>
    </div>
    <v-layout row wrap v-if="loading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="primary" :witdh="7":size="40" v-if="loading" class="mt-5"></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>

        <v-card>
          <v-card-media :src="user.imageUrl" height="300px">
          </v-card-media>
          <v-btn color="orange" dark absolute fab small class="camera">
            <v-icon>photo_camera</v-icon>
          </v-btn>
          <v-card-title class="eventTitle">
              <h2>{{ user.firstName }}</h2>
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
                  <h4 v-if="dateOfBirth" class="mb-1"> {{ user.dateOfBirth | date }}</h4>
                  <h4 v-else class="mb-1">unknown</h4>
                  <h4 v-if="livingIn" class="mb-1"> {{ user.livingIn.locality }} - {{ user.livingIn.country }}</h4>
                  <h4 v-else class="mb-1">unknown</h4>
                  <h4 v-if="gender" class="mb-1"> {{ user.gender }}</h4>
                  <h4 v-else class="mb-1">unknown</h4>
                  <h4 class="mb-1">{{ user.email }}</h4>
                </v-flex>
                <v-fab-transition>
                  <v-btn color="orange" fixed bottom right fab class=" white--text" @click="editMode = true">
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
                      <!-- <v-text-field name="dateOfBirth" label="Date of birth" id="dateOfBirth" v-model="dateOfBirth" type="text" >
                      </v-text-field> -->
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-icon class="mr-3">place</v-icon>

                      <vue-google-autocomplete id="autoComplete" classname="form-control" placeholder="Living in..." v-on:placechanged="getAddressData" prepend-icon="place">
                      </vue-google-autocomplete>
                      <!-- <vuetify-google-autocomplete
                          id="map"
                          append-icon="search"
                          classname="form-control"
                          placeholder="Start typing"
                          v-on:placechanged="getAddressData"
                      >
                      </vuetify-google-autocomplete> -->
                      <!-- <v-text-field name="livingIn" label="Living in" id="livingIn" v-model="livingIn" type="text" prepend-icon="place">
                      </v-text-field> -->
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-flex xs12 sm6 offset-sm3>
                      <v-flex xs12>
                        <v-select label="Gender"v-model="gender" :items="items" prepend-icon="wc"></v-select>
                      </v-flex>
                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field name="email" label="Email" id="email" v-model="email" type="text" required prepend-icon="email">
                      </v-text-field>
                    </v-flex>
                  </v-layout>

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
        address: '',
        date: '',
        modal: false,
        key: '',
        editMode: false,
        firstName: this.$store.getters.user.firstName,
        lastName: this.$store.getters.user.lastName,
        dateOfBirth: this.$store.getters.user.dateOfBirth,
        // livingIn: this.$store.getters.user.livingIn,
        email: this.$store.getters.user.email,
        gender: this.$store.getters.user.gender,
        items: [
          'Female', 'Male'
        ]
      }
    },
    computed: {
      livingIn () {
        if (this.$store.getters.user.livingIn) {
          return this.$store.getters.user.livingIn
        }
      },
      loading () {
        return this.$store.getters.loading
      },
      user () {
        if (this.$store.getters.user) {
          return this.$store.getters.user
        }
      },
      submittableDate () {
        const date = new Date(this.date).toISOString()
        return date
      }
    },
    methods: {
      getAddressData (addressData, placeResultData, id) {
        this.livingIn = addressData
      },
      saveUserDetails () {
        this.editMode = false
        console.log('[saveUserDetails]', this.submittableDate, this.livingIn)
        // if (!this.formIsValid) {
        //   return
        // }
        const updatedUser = {
          id: this.user.id,
          firstName: this.firstName,
          lastName: this.lastName,
          dateOfBirth: this.submittableDate,
          livingIn: this.livingIn,
          email: this.email,
          gender: this.gender
        }
        console.log('[saveUserDetails] updatedUser', updatedUser)

        this.$store.dispatch('updateUser', updatedUser)

        // // this.$store.dispatch('addNotifications', eventData)
        // this.$router.push('/myEvents')
      },
      back () {
        this.$router.go(-1)
      },
      sendFriendRequest (userId) {
        console.log('userID from sendFriendRequest ', userId)
        this.$store.dispatch('sendFriendRequest', userId)
      }
    }
  }
</script>

<style scoped>
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
    left: 24px;
    z-index: 3;
  }
</style>
