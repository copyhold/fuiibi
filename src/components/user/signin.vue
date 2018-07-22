<template>
<!-- <v-container class="allPage"> -->
  <!-- <v-container class="container "> -->
  <v-container class="fullscreen-bg">

    <video playsinline loop muted autoplay>
      <source src="../../videos/Media3.mp4" type="video/mp4">
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

     <v-card class="transparency" :class="{ shown: SignInIsHidden }">
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

           </form>
         </v-container>
       </v-card-text>
     </v-card>

     <v-card class="transparencySignUp" :class="{ hideSignUp: SignUpIsHidden }">
       <v-card-text>
           <form @submit.prevent="onSignup">

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
                 <v-btn type="submit" :disabled="loading" :loading="loading" class="orange white--text">
                   Sign up
                   <span slot="loader" class="custom-loader">
                     <v-icon light>cached</v-icon>
                   </span>
                 </v-btn>
               </v-flex>
             </v-layout>

           </form>
       </v-card-text>
     </v-card>



     <v-layout row>
       <v-flex xs4 class="signInGoogle">
         <v-btn @click="signInWithGoogle" :disabled="loading" :loading="loading" class="blue white--text">
           Google Sign In
           <span slot="loader" class="custom-loader">
             <v-icon light>cached</v-icon>
           </span>
         </v-btn>
       </v-flex>
       <v-flex xs4 class="simpleSignIn">
         <!-- <v-btn outline flat @click="showSignInForm = true" :disabled="loading" :loading="loading" class="white--text"> -->
         <v-btn outline flat @click="SignInIsHidden = !SignInIsHidden, SignUpIsHidden = true " :disabled="loading" :loading="loading" class="white--text">
           {{ SignInIsHidden ? 'SIGN IN' : 'CANCEL'}}
           <span slot="loader" class="custom-loader">
             <v-icon light>cached</v-icon>
           </span>
         </v-btn>
       </v-flex>
       <v-flex xs4 class="simpleSignUp">
         <!-- <v-btn outline flat @click="showSignInForm = true" :disabled="loading" :loading="loading" class="white--text"> -->
         <v-btn outline flat @click="SignUpIsHidden = !SignUpIsHidden, SignInIsHidden = true" :disabled="loading" :loading="loading" class="white--text">
           {{ SignUpIsHidden ? 'SIGN UP' : 'CANCEL'}}
           <span slot="loader" class="custom-loader">
             <v-icon light>cached</v-icon>
           </span>
         </v-btn>
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
        showSignInForm: true,
        SignInIsHidden: true,
        SignUpIsHidden: true,
        confirmPassword: '',
        imageUrl: '',
        image: '',
        firstName: '',
        lastName: ''
      }
    },
    computed: {
      comparePasswords () {
        return this.password !== this.confirmPassword ? 'Password do not match' : ''
      },
      error () {
        return this.$store.getters.error
      },
      user () {
        console.log('SignInIsHidden', this.SignInIsHidden)
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
        console.log('signInWithGoogle')
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
    .signInGoogle {
      position: absolute;
      bottom: 3vh;
      left: 2vw;
    }
    .simpleSignIn {
      position: absolute;
      bottom: 3vh;
      right: 2vw;
    }
    .simpleSignUp {
      position: absolute;
      bottom: 3vh;
      right: 29vw;
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
      bottom: -100vw !important;
    }
    .hideSignUp {
      bottom: -120vw !important;
    }
    .transparency {
      position: relative;
      bottom: 133vw;
      width: 100%;
      -webkit-transition: 2000ms; /* Safari */
      transition: 1000ms;
      background-color: rgba(255, 255, 255, 0.9);
    }
    .transparencySignUp {
      position: relative;
      bottom: 225vw;
      width: 100%;
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
      }
</style>

<!-- <v-layout row v-if="error">
  <v-flex sx12 sm6 offset-sm3>
    <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
  </v-flex>
</v-layout> -->

  <!-- <v-layout row>
  <v-flex xs12 sm6 offset-sm3>

    <v-card class="transparency">





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
