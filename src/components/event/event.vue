<template lang="html">
  <v-container class="container">
    <v-layout row wrap v-if="loading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="red" :witdh="7":size="70" v-if="loading"></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card>
          <v-card-media :src="event.event.imageUrl" height="300px">
          </v-card-media>
          <v-card-title class="eventTitle">
              <h2>{{ event.event.title }}</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <h3><v-icon class="mr-2">place</v-icon>{{ event.event.location.route }} {{ event.event.location.street_number }}, {{ event.event.location.locality }} - {{ event.event.location.country }}</h3>
            <p><v-icon class="mr-2">access_time</v-icon>{{ event.event.date | date }}</p>
            <div >
              {{ event.event.description }}
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout class="mt-2">
      <v-flex xs12 sm12>
        <v-card>
          <v-container fluid>
            <v-layout row wrap>
              <v-flex xs4 v-for="pic in event.event.pictures" :key="pic.id">
                <v-card flat tile>
                  <v-card-media :src="pic.imageUrl" height="150px">
                  </v-card-media>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row class="mb-2" justify-center fluid>
      <v-flex xs12>
          <v-btn bottom fixed large class="primary fullScreen" @click="onPickFile"  @click.native.stop="dialog = true">Add a picture</v-btn>
          <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked">
          <v-dialog v-model="dialog" max-width="310">
            <v-card>
              <v-card-title class="headline">Add this picture</v-card-title>
              <v-layout row>
                <v-flex xs12 sm6 class="ml-3">
                  <img :src="imageUrl" class="profilePic" >
                </v-flex>
              </v-layout>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Cancel</v-btn>
                <v-btn color="green darken-1" flat="flat" @click="addPicture">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<!-- Below I create a template because I want to show it only if the user is the creator of the meetup. -->
<!-- <template v-if="userIsCreator">
  <v-spacer></v-spacer>
  <!-- below I link my :meetup from the EditMeetupDetailsDialog.vue in the props to the meetup here that has been uploaded in this template -->
  <!-- <app-edit-meetup-details-dialog :meetup="meetup"></app-edit-meetup-details-dialog>
</template> -->
<!-- <div class="info--text">
   -
</div> -->
<!-- <div>
  <app-edit-meetup-date-dialog :event="event" v-if="userIsCreator"></app-edit-meetup-date-dialog>
</div> -->
<script>
export default {
  props: ['id'],
  data () {
    return {
      imageUrl: '',
      image: '',
      dialog: false
    }
  },
  computed: {
    event () {
      return this.$store.getters.getEventData(this.id)
    },
    galery () {
      return this.$store.getters.getGalery()
    },
    // userIsAuthenticated () {
    //   return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    // },
    // userIsCreator () {
    //   if (!this.userIsAuthenticated) {
    //     return false
    //   }
    //   return this.$store.getters.user.id === this.meetup.creatorId
    // },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
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
    },
    addPicture () {
      this.dialog = false
      // Vuex
      this.$store.dispatch('addPicture', {eventId: this.id, image: this.image})
    }
  }
}
</script>

<style scoped>
  .container{
    margin-top: 0;
  }
  .btn--block {
    margin: 0;
  }
  .btn--bottom {
    bottom: 0px;
  }
  .fullScreen {
    width: 868px;
  }
  .profilePic{
    width: 250px;
  }
  .eventTitle{
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    color: white;
    position: absolute;
    bottom: 142px;
    font-size: 20px;
    font-weight: 200;
  }
  @media only screen and (max-width: 599px) {
    .container {
      padding: 0;
    }
    .fullScreen {
      width: 100vw;
    }
  }

</style>
