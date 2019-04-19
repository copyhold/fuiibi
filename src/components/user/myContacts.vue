<template >
  <v-container>
    <v-list subheader>
      <v-subheader>
        <v-btn flat @click="startSync"><v-icon>start</v-icon>Find my contacts in Fuiibi</v-btn>
      </v-subheader>
      <user-card v-for="user in emails" :user="user" key="user.id" />
    </v-list>
  </v-container>
</template>

<script>
import * as firebase from 'firebase'
require('firebase/functions')
const gapi = window.gapi
export default {
  data () {
    return {
      emails: [],
      signedIn: false,
      googleContact: [],
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
      .catch(err => console.error(err))
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
        // response.result: { totalItems, totalPeople, nextPageToken?, connections:[] }
        // @todo: send emails to firebase in batch to check if exist
        // add to list those that exist and retrieve new batch from G.

        const emails = []
        for (let contact of response.result.connections) {
          const addresses = contact.emailAddresses
          if (typeof addresses === 'object' && addresses.length > 0 && addresses[0].value) {
            emails.push(addresses[0].value)
          }
        }
        const findFuiibiers = firebase.app().functions().httpsCallable('findFuiibiers')
        return findFuiibiers({ emails: emails })
      })
      .then(res => {
        this.emails = [ ...this.emails, ...res.data ]
      })
      .catch(console.error)
    }
  }
}
</script>
