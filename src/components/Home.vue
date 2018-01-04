<template >
  <v-container class="container">
    <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular
          indeterminate
          color="red"
          :witdh="7"
          :size="40"
          v-if="loading"
          class="mt-5"
          ></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-layout row wrap v-for="meetup in meetups" :key="meetup.id" class="mb-1" v-if="!loading">
      <v-flex xs12 sm12 md10 offset-md2>
        <v-card height="120px">
          <v-container fluid>
            <v-layout col xs8>
              <v-flex xs3 sm4 md4>
                <v-card-media
                :src="meetup.imageUrl"
                height="100px"
                style="background-color: white">
                </v-card-media>
              </v-flex>
              <v-flex xs7 sm6 md5>
                <v-card-title primary-title >
                  <v-card-actions wrap>
                    <div>
                      <v-btn flat :to="'/meetups/' + meetup.id" class="">
                        <h3 class="primary--text mb0 mt0 pt0"> {{ meetup.title }}</h3>
                      </v-btn>
                    </div>
                  </v-card-actions>
                    <div>
                      {{ meetup.date | date}}
                    </div>
                </v-card-title>
                <!-- <v-card-actions>
                  <v-btn flat :to="'/meetups/' + meetup.id">
                    <v-icon left light>arrow_forward</v-icon>
                    View Meetup</v-btn>
                </v-card-actions> -->
              </v-flex>
              <v-flex xs2 sm2 md3 offset-md4 offset-sm2>
                <v-btn fab large class="iwt" center></v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-fab-transition >
      <v-btn router to="/meetup/new"
        color="orange"
        fixed
        bottom
        right
        fab
        class=" white--text"
        >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>

</template>

<script>
  export default {
    computed: {
      meetups () {
        return this.$store.getters.loadedMeetups
      },
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>

<style scoped>
  .container{
    margin-top: 0;
    padding: 8px;
  }
  .card__title--primary {
    padding: 0px 16px;
  }
  .card_actions{
    padding: 0px;
  }
  .btn_content{
    padding: 0px;
  }
  .iwt{
    height: 90px;
    width: 90px;
    background: url("./img/iwt2.png") center/95% no-repeat;
    background-color: red;
  }
</style>


<!-- <template >
    <v-container class="container">

        <v-layout row wrap class="mb-2">
            <v-flex xs12 sm6 class="text-xs-center text-sm-right">
                <v-btn large router to="/meetups" class="primary">Explore Meetups</v-btn>
            </v-flex>
            <v-flex xs12 sm6 class="text-xs-center text-sm-left">
                <v-btn large router to="/meetup/new" class="primary">Organise Meetup</v-btn>
            </v-flex>
        </v-layout>

        <v-layout row>
            <v-flex xs12 class="text-xs-center">
              <v-progress-circular
              indeterminate
              color="red"
              :witdh="7"
              :size="70"
              v-if="loading"
              ></v-progress-circular>
            </v-flex>
        </v-layout>

        <v-layout row wrap v-if="!loading">
            <v-flex xs12>
                <v-carousel style="cursor:pointer">
                    <v-carousel-item
                    v-for="meetup in meetups"
                    :src="meetup.imageUrl"
                    :key="meetup.id"
                    @click="onLoadMeetup(meetup.id)">
                    <div class="title">
                        {{ meetup.title }}
                    </div>
                    </v-carousel-item>
                </v-carousel>
            </v-flex>
        </v-layout>

        <v-layout row wrap class="mt-2">
            <v-flex xs12 class="text-xs-center">
                <p>Join our meetups</p>
            </v-flex>
        </v-layout>

    </v-container>
</template>


<script>
    export default {
      computed: {
        meetups () {
          return this.$store.getters.featuredMeetups
        },
        loading () {
          return this.$store.getters.loading
        }
      }, -->
      <!-- // data () {
      //   return {
      //     meetups: [
      //               {imageUrl: 'http://www.publicdomainpictures.net/pictures/180000/velka/affe-traurig.jpg', id: '1234', title: 'image test'},
      //               {imageUrl: 'http://made-in-togo.com/img/uploads/2014/07/singe2.jpg', id: '2345', title: 'image 2'},
      //               {imageUrl: 'https://www.google.ch/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwirusjfoPLXAhWB7BQKHSymByMQjRwIBw&url=http%3A%2F%2Fwww.maxisciences.com%2Fnasique%2Fle-nasique-cet-etonnant-singe-au-nez-demesure_art39603.html&psig=AOvVaw0AzDaAcSLa967rW9uTJRVq&ust=1512542084646845', id: '3456', title: 'image 3'}
      //     ]
      //   }
      // },
      methods: {
        onLoadMeetup (id) {
          this.$router.push('/meetups/' + id)
        }
      }
    }
</script>

<style scoped>
    .title{
        position: absolute;
        bottom: 50px;
        background-color: rgba(0,0,0,0.5);
        color: white;
        font-size: 2em;
        padding: 20px;
    }
    .container{
      margin-top: 0;
    }
</style> -->
