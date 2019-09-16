<template >
  <v-container>
    <v-layout v-if="!loading" row>
      <v-flex text-xs-center xs10 offset-xs1 mt-3 pa-3>
          <p>we want to scan your Google contacts. we believe that we can find something interesting there</p>
          <p>Don't worry, it will be fast and will cost nothing to you.</p>
          <h3>so click the button and be patient</h3>
          <v-btn color="info" @click="startSync"><v-icon>start</v-icon>Find my contacts in Fuiibi</v-btn>
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
      emails: [],
      signedIn: false,
      loading: false
    }
  },
  created () {
    gapi.load('client:auth2', {
      callback: this.continueWithGoogle,
      onerror: console.error
    })
  },
  methods: {
    startSync () {
      this.loadedGContacts = []
      this.totalGcontacts = 0
      this.emails = []
      if (!this.signedIn) return
      this.loadGContacts()
    },
    continueWithGoogle () {
      const updateSigninStatus = (isSignedIn) => {
        this.signedIn = isSignedIn
      }
      // const clientId = '24686685442-e8ookfdde4dbc6fqqmjo3iajo9rc71ai.apps.googleusercontent.com'
      // const apiKey = 'AIzaSyACbBFnoaG5EVR7-IDGn8lsiTtPHxWQWB4'
      const clientId = '208715939086-dneafckdpuqq4mb6buksum5u2q49rrqf.apps.googleusercontent.com'
      gapi.client.init({
        discoveryDocs: ['https://people.googleapis.com/$discovery/rest?version=v1'],
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
      this.loading = true
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
      })
      .catch(err => {
        this.$error('load google contacts', err)
      })
    }
  }
}
</script>
