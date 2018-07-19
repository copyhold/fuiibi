<template>
<!-- <v-container class="allPage"> -->
  <!-- <v-container class="container "> -->
  <v-container class="fullscreen-bg">

    <video playsinline loop muted autoplay class="fullscreen-bg__video">
      <!-- <source src="../../videos/mainPageVideo.mpeg" type="video/mpeg"> -->
      <source src="../../videos/mainPageVideo.mp4" type="video/mp4">
      <!-- <source src="../../videos/lacCalme.ogv" type="video/ogg"> -->
     </video>
     <v-layout row class="fuiibiHomePage white--text">
       <v-flex>
         <p class="fuiibiTextHomePage">Fuiibi</p>
       </v-flex>
     </v-layout>
     <v-layout row class="slogan white--text">
       <v-flex>
         <p class="keep">KEEP YOUR EVENTS</p>
         <p class="alive">ALIVE</p>
       </v-flex>
     </v-layout>
     <v-layout row class="signInGoogle">
       <v-flex xs12>
         <v-btn @click="signInWithGoogle" :disabled="loading" :loading="loading" class="blue white--text">
           Sign In With Google
           <span slot="loader" class="custom-loader">
             <v-icon light>cached</v-icon>
           </span>
         </v-btn>
       </v-flex>
     </v-layout>
    <!-- <v-layout row v-if="error">
      <v-flex sx12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout> -->

      <!-- <v-layout row>
      <v-flex xs12 sm6 offset-sm3>

        <v-card class="tranparency">





        <v-card-title primary-title>
            <h2>Signin</h2>
          </v-card-title>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignin">

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="email" label="Mail" id="email" v-model="email" type="email" required>
                    </v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="password" label="Password" id="password" v-model="password" type="password" required>
                    </v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-btn type="submit" :disabled="loading" :loading="loading" class="orange white--text">
                      Sign In
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-btn @click="signInWithGoogle" :disabled="loading" :loading="loading" class="blue white--text">
                      Sign In With Google
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout>

              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>-->
  <!-- <v-layout justify-center>
    <vue-typer text='Keep your events '
    class="slogan"
    :repeat='0'
    :re-type-delay='1000'
    :pre-type-delay='200'
    :type-delay='100'
    caret-animation='blink'
    ></vue-typer>
    <vue-typer :text='["active", "all live", "alive !!"]'
    class="slogan"
    :repeat='0'
    :re-type-delay='100'
    :pre-type-delay='1960'
    :type-delay='100'
    :erase-delay='200'
    :pre-erase-delay='500'
    caret-animation='blink'
    erase-style='backspace'
    :erase-on-complete='false'
    ></vue-typer>
  </v-layout> -->
</v-container>
</template>


<script>
  export default {
    data () {
      return {
        email: '',
        password: ''
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          this.$router.push('/notifications')
        }
      }
    },
    methods: {
      signInWithGoogle () {
        console.log('signInWithGoogle')
        this.$store.dispatch('signInWithGoogle')
      },
      onSignin () {
        // Vuex
        this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      }
    }
  }
</script>

<style scoped>
    .signInGoogle {
      position: absolute;
      bottom: 3vh;
      left: 2vw;
    }
    .slogan {
      position: absolute;
      top: 35vh;
      left: 2vw;
    }
    .fuiibiHomePage {
      position: absolute;
      top: 1vh;
      text-align: center;
      margin-left: 36%;
    }
    .fuiibiTextHomePage {
      font-size: 12vw;
      font-family: 'Marck Script', cursive;
    }
    .keep {
      font-size: 8vw;
      font-family: 'Raleway', sans-serif;
    }
    .alive {
      font-size: 27vw;
      top: -12vw;
      position: relative;
      font-family: 'Raleway', sans-serif;
    }
    .fullscreen-bg {
      position:absolute;
      height:100%;
      width:100%;
      overflow: hidden;
    }
    .fullscreen-bg video {
      min-width: 100%;
      min-height: 100%;
    }
    /* .slogan {
      font-weight: bold;
      font-size: 17px;
      font-family: 'PT Mono', monospace;
    } */

    .allPage{
      /* background: url('../../images/welcomeImage1.jpg') no-repeat; */
      background-size: auto 100%;
      -webkit-animation: slide 30s linear infinite;
      height: 100vh;
      width: 100vw;
    }
    @-webkit-keyframes slide {
      from { background-position: 0 0; }
      to { background-position: -650px 0; }
    }
    .container{
      margin-top: 0px;
      background-color: rgba(255, 255, 255, 0);



      padding: 0px;
    }
    .tranparency {
      background-color: rgba(255, 255, 255, 0.7);
    }
/*This is the code to make the spinner spin*/
      .custom-loader {
        animation: loader 1s infinite;
        display: flex;
      }
      @-moz-keyframes loader {
        from {
          transform: rotate(0);
        }
        to {
          transform: rotate(360deg);
        }
      }
      @-webkit-keyframes loader {
        from {
          transform: rotate(0);
        }
        to {
          transform: rotate(360deg);
        }
      }
      @-o-keyframes loader {
        from {
          transform: rotate(0);
        }
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes loader {
        from {
          transform: rotate(0);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @media only screen and (max-width: 599px) {
        ..toolbar .toolbar__content > .btn:last-child, .toolbar .toolbar__extension > .btn:last-child  {
          margin-top: 0px !important;
        }
      }


</style>
