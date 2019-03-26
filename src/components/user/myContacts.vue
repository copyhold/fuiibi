<template >
  <v-container>
    <v-list subheader v-if="signedIn">
      <v-subheader v-if="!loading">My Google Contacts</v-subheader>
    </v-list>
    <v-btn @click="signIn" color="orange" v-if="!signedIn" fixed bottom right fab ripple class=" white--text">
      <v-icon>autorenew</v-icon>
    </v-btn>

    <v-dialog v-model="showGoogleContact" max-width="96%">
      <v-list subheader>
        <template v-for="user in googleContact">
          <v-divider></v-divider>
          <v-list-tile avatar v-bind:key="user.id" v-if="!loading && user.id != loggedInUserId">
            <v-list-tile-avatar class="avatarImg">
              <img :src="user.imageUrl"/>
            </v-list-tile-avatar>
            <v-list-tile-content  @click="getUserPage(user)" >
              <v-list-tile-title v-html="user.firstName + ' ' + user.lastName" ></v-list-tile-title>
            </v-list-tile-content>
              <v-list-tile-action v-if="hasPendingInvitation(user) || isPendingFriend(user)">
                <v-btn small class="greyColors" flat left>Pending...</v-btn>
              </v-list-tile-action>
              <v-list-tile-action v-else>
                <v-list-tile-action v-if="!isFriend(user)">
                  <v-btn @click="sendFriendRequest(user.id)" flat small class="primary--text pl-1 pr-1"><v-icon class="pl-4">person_add</v-icon></v-btn>
                </v-list-tile-action>
                <v-list-tile-action v-else>
                  <v-btn @click="removeFriend(user)" flat small class="greyColors" left>Remove</v-btn>
                </v-list-tile-action>
              </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
    </v-dialog>
  </v-container>
</template>

<script>
const gapi = window.gapi
export default {
  data () {
    return {
      signedIn: false,
      googleContact: [],
      loading: false,
      showGoogleContact: false
    }
  },
  created () {
    gapi.load('client:auth2', {
      callback: this.continueWithGoogle,
      onerror: console.error
    })
  },
  methods: {
    continueWithGoogle () {
      const updateSigninStatus = (isSignedIn) => {
        if (!this.signedIn && isSignedIn) {
          this.loadGContacts()
        }
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
    loadGContacts () {
      gapi.client.people.people.connections.list({
        resourceName: 'people/me',
        pageSize: 50,
        personFields: 'names,emailAddresses'
     // pageToken: nextPageToken
      })
      .then(response => {
        // response.result: { totalItems, totalPeople, nextPageToken?, connections:[] }
        // @todo: send emails to firebase in batch to check if exist
        // add to list those that exist and retrieve new batch from G.
      })
      .catch(console.error)
    },
    signIn () {
      gapi.auth2.getAuthInstance().signIn()
    },
    gapiLoad () {
      alert('called')
      var clientId = '24686685442-e8ookfdde4dbc6fqqmjo3iajo9rc71ai.apps.googleusercontent.com'
      var apiKey = 'AIzaSyACbBFnoaG5EVR7-IDGn8lsiTtPHxWQWB4'
      var scopes = 'https://www.googleapis.com/auth/contacts.readonly'
      gapi.client.setApiKey(apiKey)
      window.setTimeout(this.authorize(clientId, scopes))
    },
    authorize (clientId, scopes) {
      gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, this.handleAuthorization)
    }
  }
}
</script>
