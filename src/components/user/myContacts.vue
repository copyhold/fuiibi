<template >
  <v-container>
    <v-layout v-if="!loading && emails.length===0" row>
      <v-flex text-xs-center xs10 offset-xs1 mt-3 pa-3>
        <p>We want to scan your Google contacts in order to check if you already have friends using Fuiibi.</p>
        <p>Don't worry, it will be fast and will cost you nothing.</p>
        <h3>So click the button and be patient.</h3>
        <v-btn color="info" @click="startSync"><v-icon>start</v-icon>Find my contacts in Fuiibi</v-btn>
        <v-alert v-if="alert">{{alert}}</v-alert>
      </v-flex>
    </v-layout>
    <v-list subheader v-else>
      <v-alert value="true" type="info" transition="fade-transition">Checked {{loadedGContacts.length}} of {{totalGcontacts}}</v-alert>
      <user-card v-for="user in emails" :user="user" :key="user.id" />
    </v-list>
  </v-container>
</template>

<script>
const gapi = window.gapi
export default {
  data () {
    return {
      loadedGContacts: [],
      totalGcontacts: 0,
      alert: false,
      emails: [],
      signedIn: false,
      loading: false
    }
  },
  methods: {
    startSync () {
      this.loadedGContacts = []
      this.totalGcontacts = 0
      this.emails = []
      this.loading = true
      gapi.load('client:auth2', {
        callback: this.authorizeContactsAccess,
        onerror: console.error
      })
    },
    authorizeContactsAccess () {
      const updateSigninStatus = (isSignedIn) => {
        this.signedIn = isSignedIn
        if (isSignedIn) {
          // not we request additional permissions to read contacts
          const me = gapi.auth2.getAuthInstance().currentUser.get()
          const options = new gapi.auth2.SigninOptionsBuilder({'scope': 'https://www.googleapis.com/auth/contacts.readonly'})
          me.grant(options).then(success => {
            this.loadGContacts()
          }, fail => {
            this.alert = "Sad to hear that you don't trust us"
            this.loading = false
          })
        }
      }
      const apiKey = 'AIzaSyATluUdkwWsyz3IJqfu74rAmo5yDnb94-M'
      const clientId = '208715939086-dneafckdpuqq4mb6buksum5u2q49rrqf.apps.googleusercontent.com'
      gapi.client.init({
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/people/v1/rest'],
        apiKey,
        clientId,
        scope: 'https://www.googleapis.com/auth/contacts.readonly'
      }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
      })
      .catch(err => {
        this.$debug('google contacts', err)
      })
    },
    loadGContacts (nextPageToken = null) {
      gapi.client.people.people.connections.list({
        resourceName: 'people/me',
        pageSize: 100,
        personFields: 'names,emailAddresses',
        pageToken: nextPageToken
      })
      .then(response => {
        if (response.result.nextPageToken) {
          this.loadGContacts(response.result.nextPageToken)
        }
        this.totalGcontacts = response.result.totalPeople
        this.loadedGContacts = this.loadedGContacts.concat(response.result.connections)
        // response.result: { totalItems, totalPeople?, nextPageToken, connections:[] }

        const emails = []
        for (let contact of response.result.connections) {
          const addresses = contact.emailAddresses
          if (typeof addresses === 'object' && addresses.length > 0 && addresses[0].value) {
            emails.push(addresses[0].value)
          }
        }
        const findFuiibiers = global.firebase.app().functions().httpsCallable('findFuiibiers')
        return findFuiibiers({ emails: emails })
      })
      .then(res => {
        this.emails = this.emails.concat(res.data)
        this.loading = false
      })
      .catch(err => {
        this.$error('load google contacts', err)
        this.loading = false
      })
    }
  }
}
</script>
