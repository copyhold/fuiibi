<template>
  <v-container class="fullscreen-bg">
    <v-dialog v-model="signUpForm" persistent max-width="96%" lazy width="400px">
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
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="signInForm" persistent max-width="96%" lazy width="400px">
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
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
export default {
  data () {
    return {
      email: '',
      password: '',
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
  created () {
    document.querySelector('#homepage .googlesign').addEventListener('click', evt => this.signInWithGoogle())
    document.querySelector('#homepage .signin').addEventListener('click', evt => {
      this.signInForm = true
    })
    document.querySelector('#homepage .signup').addEventListener('click', evt => {
      this.signUpForm = true
    })
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
    },
    signUpForm (value) {
      if (value === true) document.body.classList.add('popup-show')
      else document.body.classList.remove('popup-show')
    },
    signInForm (value) {
      if (value === true) document.body.classList.add('popup-show')
      else document.body.classList.remove('popup-show')
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
      .then(() => {
        document.body.classList.remove('not-signed', 'popup-show')
        document.body.classList.add('signed-in')
      })
      .catch(this.$error)
    },
    onDismissed () {
      this.$store.dispatch('clearError')
    },
    onSignup () {
      this.$store.dispatch('signUserUp', {firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.password})
    }
  }
}
</script>

