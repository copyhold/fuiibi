<template>
<!-- <v-container class="allPage"> -->
  <!-- <v-container class="container "> -->
  <v-container class="fullscreen-bg">

    <video playsinline loop muted autoplay class="hidden-sm-and-up">
      <source src="../../videos/Media4.mp4" type="video/mp4">
      <source src="../../videos/Media4.webm" type="video/webm">
      <!-- <source src="../../videos/Media4.ogv" type="video/ogg"> -->
    </video>

     <video playsinline loop muted autoplay class="hidden-xs-only">
       <source src="../../videos/videoFullScreen.mp4" type="video/mp4">
       <!-- <source src="../../videos/Media4.webm" type="video/webm"> -->
       <!-- <source src="../../videos/Media4.ogv" type="video/ogg"> -->
     </video>

   <v-layout row class="fuiibiHomePage white--text">
     <v-flex>
       <p class="fuiibiTextHomePage">Fuiibi</p>
     </v-flex>
   </v-layout>
   <v-layout row class="slogan white--text">
     <v-flex xs12 sm12 md12>
       <p class="keep">KEEP YOUR EVENTS</p>
       <p class="alive">ALIVE</p>
     </v-flex>
   </v-layout>

   <v-dialog v-model="showError" persistent max-width="96%">
     <v-layout row v-if="error">
       <v-flex sx12 sm6 offset-sm3>
         <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
       </v-flex>
     </v-layout>
   </v-dialog>


     <v-layout class="textAboveButtons" xs12>
       <p class="oneClick">Get started with just one click</p>
     </v-layout>
     <v-layout row>
       <v-flex xs12 class="signInGoogle">
         <v-btn @click="signInWithGoogle" :disabled="loading" :loading="loading" class="red white--text" block>
           <v-icon dark class="leftIcon" small>mdi-google</v-icon>
           S<span class="lowercase pr-1">ign in with</span>G<span class="lowercase">oogle</span>
           <span slot="loader" class="custom-loader">
             <v-icon light>cached</v-icon>
           </span>
         </v-btn>
       </v-flex>
      </v-layout>
      <v-layout row class="continueEmail">
        <p class="withEmail">Or continue with email</p>
      </v-layout>
      <v-layout row>


       <v-dialog v-model="signUpForm" persistent max-width="96%" lazy width="400px">
        <v-btn flat slot="activator" class="simpleSignUp">Sign Up</v-btn>
        <v-card>
          <v-card-text>
              <v-container grid-list-md>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="firstName" label="First name" id="firstNameSignUp" v-model="firstName" type="text" required>
                    </v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="lastName" label="Last name" id="lastNameSignUp" v-model="lastName" type="text" required>
                    </v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="email" label="Mail" id="emailSignUp" v-model="email" type="email" required>
                    </v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="password" label="Password" id="passwordSignUp" v-model="password" type="password" required>
                    </v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="confirmPassword" label="Confirm password" id="confirmPassword" v-model="confirmPassword" type="password" :rules="[comparePasswords]">
                    </v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-btn @click="onSignup" @click.native="signUpForm = false" :disabled="loading || !signUpFormIsValid" :loading="loading" class="orange white--text" block>
                      Sign up
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                  <v-flex xs12>
                    <v-btn @click.native="signUpForm = false" :disabled="loading" :loading="loading" flat class="black--text" block>
                      Cancel
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
              <!-- </form> -->
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="signInForm" persistent max-width="96%" lazy width="400px">
       <v-btn flat slot="activator" class="simpleSignIn">Log in</v-btn>
       <v-card>
         <v-card-text>
             <v-container grid-list-md>

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
                   <v-btn @click="onSignin" @click.native="signInForm = false" :disabled="loading || !signInFormIsValid" :loading="loading" class="orange white--text" block>
                     Log in
                     <span slot="loader" class="custom-loader">
                       <v-icon light>cached</v-icon>
                     </span>
                   </v-btn>
                 </v-flex>
                 <v-flex xs12>
                   <v-btn @click.native="signInForm = false" :disabled="loading" :loading="loading" flat class="black--text" block>
                     Cancel
                     <span slot="loader" class="custom-loader">
                       <v-icon light>cached</v-icon>
                     </span>
                   </v-btn>
                 </v-flex>
               </v-layout>
             </v-container>
             <!-- </form> -->
         </v-card-text>
       </v-card>
     </v-dialog>

       <v-flex xs2 class="separation">
         <p>|</p>
       </v-flex>

     </v-layout>
</v-container>
</template>


<script>
  export default {
    data () {
      return {
        email: '',
        password: '',
        // showSignInForm: true,
        // SignInIsHidden: true,
        // SignUpIsHidden: true,
        confirmPassword: '',
        imageUrl: '',
        image: '',
        firstName: '',
        lastName: '',
        signInForm: false,
        signUpForm: false,
        showError: false
      }
    },
    computed: {
      signInFormIsValid () {
        if (this.email && this.password) {
          return this.email && this.password
        } else {
          this.$log('this form is not valid!')
        }
      },
      signUpFormIsValid () {
        if (this.email && this.password && this.firstName && this.lastName && this.password === this.confirmPassword) {
          return this.email && this.password && this.firstName && this.lastName
        } else {
          this.$log('this form is not valid!')
        }
      },
      comparePasswords () {
        return this.password !== this.confirmPassword ? 'Password do not match' : ''
      },
      error () {
        if (this.$store.getters.error) {
          this.showError = true
          return this.$store.getters.error
        } else {
          this.showError = false
        }
      },
      user () {
        this.$log('SignInIsHidden', this.SignInIsHidden)
        return this.$store.getters.user
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
        this.$log('signInWithGoogle')
        this.$store.dispatch('signInWithGoogle')
      },
      onSignin () {
        // Vuex
        this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      },
      onSignup () {
        // Vuex
        // this.$store.dispatch('signUserUp', {firstName: this.firstName, email: this.email, password: this.password, image: this.image})
        this.$store.dispatch('signUserUp', {firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.password})
      }
    }
  }
</script>

<style scoped>
    .lowercase {
      text-transform: lowercase;
    }
/* CA NE MARCHE PAS LES DEUX SUIVANTS, JE NE SAIS PAS POURQUOI */
    #email:-webkit-autofill {
      background-color: rgb(255, 255, 255) !important;
    }
    input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px white inset;
    }
    .leftIcon{
      left: -49px;
      position: relative;
    }
    .continueEmail{
      position: fixed;
      bottom: 10vh;
      left: 2vw;
      color: #fff;
      text-align: center;
      width: 100vw;
    }
    .textAboveButtons{
      position: fixed;
      bottom: 22vh;
      left: 2vw;
      color: #fff;
      text-align: center;
      width: 100vw;
    }
    .getStarted{
      font-size: 8vw;
      margin-bottom: 14vw;
      text-align: center;
      width: 100%;
    }
    .oneClick{
      font-size: 24px;
      /* margin-bottom: 9vw; */
      text-align: center;
      width: 100%;
    }
    .withEmail{
      font-size: 24px;
      /* margin-bottom: 5vw; */
      text-align: center;
      width: 100%;
    }
    .signInGoogle {
      position: absolute;
      bottom: 18vh;
      left: 20vw;
      width: 60vw;
    }
    .simpleSignIn {
      position: fixed;
      bottom: 3vh;
      left: 20vw;
      color: #fff;
    }
    .separation{
      position: fixed;
      font-size: 54px;
      font-weight: 100;
      left: 50vw;
      color: #fff;
      bottom: 0px;
    }
    .simpleSignUp {
      position: fixed;
      bottom: 3vh;
      right: 20vw;
      color: #fff;
    }
    .slogan {
      position: absolute;
      top: 24vh;
      left: 23vw;
      font-family: 'Nunito', sans-serif;
    }
    .fuiibiHomePage {
      position: absolute;
      top: 1vh;
      text-align: center;
      margin-left: calc(50vw - 124px);
    }
    .fuiibiTextHomePage {
      font-size: 80px;
      font-family: 'Marck Script', cursive;
    }
    .keep {
      font-size: 5.8vw;
      margin-bottom: 56px;
      font-family: 'Raleway', sans-serif;
      font-family: 'Nunito', sans-serif;
    }
    .alive {
      font-size: 20vw;
      top: -12vw;
      position: relative;
      font-family: 'Raleway', sans-serif;
      font-family: 'Nunito', sans-serif;
    }
    .fullscreen-bg {
      position:fixed;
      height:100%;
      width:100%;
      /* overflow: hidden; */
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
    .shown {
      bottom: -150vw !important;
    }
    .hideSignUp {
      bottom: -140vw !important;
    }
    .transparency {
      z-index: 5;
      position: absolute;
      bottom: 22vw;
      width: 94%;
      margin: 0 3%;
      height: 34vh !important;
      -webkit-transition: 2000ms; /* Safari */
      transition: 1000ms;
      background-color: rgba(255, 255, 255, 0.9);
    }
    .transparencySignUp {
      z-index: 5;
      position: absolute;
      bottom: 22vw;
      margin: 0 3%;
      width: 94%;
      -webkit-transition: 2000ms; /* Safari */
      transition: 1000ms;
      background-color: rgba(255, 255, 255, 0.9);
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
        .keep {
          font-size: 8vw;
          font-family: 'Raleway', sans-serif;
          font-family: 'Nunito', sans-serif;
        }
        .alive {
          font-size: 27vw;
          top: -12vw;
          position: relative;
          font-family: 'Raleway', sans-serif;
          font-family: 'Nunito', sans-serif;
        }
        .leftIcon{
          left: -49px;
          position: relative;
        }
        .continueEmail{
          position: fixed;
          bottom: 10vh;
          left: 2vw;
          color: #fff;
          text-align: center;
          width: 100vw;
        }
        .textAboveButtons{
          position: fixed;
          bottom: 22vh;
          left: 2vw;
          color: #fff;
          text-align: center;
          width: 100vw;
        }
        .getStarted{
          font-size: 8vw;
          margin-bottom: 14vw;
          text-align: center;
          width: 100%;
        }
        .oneClick{
          font-size: 4vw;
          margin-bottom: 9vw;
          text-align: center;
          width: 100%;
        }
        .withEmail{
          font-size: 4vw;
          margin-bottom: 5vw;
          text-align: center;
          width: 100%;
        }
        .signInGoogle {
          position: absolute;
          bottom: 18vh;
          left: 10vw;
          width: 80%;
        }
        .simpleSignIn {
          position: fixed;
          bottom: 29px;
          left: 10vw;
          color: #fff;
        }
        .separation{
          position: fixed;
          bottom: 1vh;
          font-size: 9vw;
          font-weight: 100;
          left: 50vw;
          color: #fff;
        }
        .simpleSignUp {
          position: fixed;
          bottom: 29px;
          right: 10vw;
          color: #fff;
        }
        .slogan {
          position: absolute;
          top: 24vh;
          left: 14vw;
          font-family: 'Nunito', sans-serif;
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
      }
</style>
