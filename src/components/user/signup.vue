<template >
<v-container class="container">

  <v-layout row v-if="error">
    <v-flex sx12 sm6 offset-sm3>
      <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
    </v-flex>
  </v-layout>

  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-title primary-title>
          <h2>Signup</h2>
        </v-card-title>
        <v-card-text>
            <form @submit.prevent="onSignup">

              <v-layout row>
                <v-flex xs12>
                  <v-text-field name="userName" label="User name" id="userName" v-model="userName" type="text" required>
                  </v-text-field>
                </v-flex>
              </v-layout>

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
                  <v-text-field name="confirmPassword" label="Confirm password" id="confirmPassword" v-model="confirmPassword" type="password" :rules="[comparePasswords]">
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row class="mb-2">
                <v-flex xs12 sm6>
                  <v-btn raised class="primaryLight white--text" @click="onPickFile">Upload your profile's picture </v-btn>
                  <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked">
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12 sm6 >
                  <img :src="imageUrl" class="profilePic" >
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn type="submit" :disabled="loading" :loading="loading">
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
        confirmPassword: '',
        imageUrl: '',
        image: '',
        userName: ''
      }
    },
    computed: {
      comparePasswords () {
        return this.password !== this.confirmPassword ? 'Password do not match' : ''
      },
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
          console.log('dans watch du signup avant le push')
          this.$router.push('/welcome')
        }
      }
    },
    methods: {
      onSignup () {
        // Vuex
        this.$store.dispatch('signUserUp', {userName: this.userName, email: this.email, password: this.password, image: this.image})
      },
      onDismissed () {
        this.$store.dispatch('clearError')
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
      padding: 16px;
    }
    .profilePic{
      border-radius: 100px;
      height: 150px;
      width: 150px;
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

</style>
