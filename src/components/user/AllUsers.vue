<template >
  <v-container class="container">
    <v-list subheader>
      <v-subheader>
        <v-text-field hide-details placeholder="start typing" :change="loading=false" single-line v-model="search" full-width />
        <v-btn @click="searchUsers" flat :disabled="loading"><v-icon>search</v-icon></v-btn>
      </v-subheader>
      <user-card v-for="user in users" :user="user" key="user.id" />
    </v-list>
  </v-container>
</template>

<script>
  const firebase = require('firebase')
  export default {
    props: [],
    data () {
      return {
        loading: false,
        search: '',
        users: []
      }
    },
    methods: {
      searchUsers () {
        this.loading = true
        this.users = []
        firebase.database().ref('/users')
        .orderByChild('email')
        .startAt(this.search)
        .endAt(this.search + 'z')
        .on('child_added', snap => {
          this.users.push(snap.val())
          this.loading = false
        })
      },
    },
    computed: {
      loggedInUserId () {
        if (this.$store.getters.user) {
          return this.$store.getters.user.id
        }
      }
    },
  }
</script>

<style scoped>
  .getContactButton {
    position: relative;
    top: 2px;
    right: -10px;
  }
  .theme--light .list .divider, .application .theme--light.list .divider{
    top: 0px;
  }
  div.tabs {
    top: 88px !important;
  }
  .btn--bottom:not(.btn--absolute) {
      bottom: 72px;
  }
  .greyColors{
    background-color: #f6f7f9;
    border-color: #ced0d4;
    color: #4b4f56;
  }

  #inputSearch {
    position: fixed;
    top: 50px;
    right: 0px;
    width: 100%;
    height: 64px;
    padding: 8px;
    z-index: 2;
    background: #3F51B5;
    font-size: 20px;
  }
  input {
    width: 100%;
    margin-top: 3px;
    border-bottom: 1px solid grey;
  }
  .tabs {
    overflow: hidden;
    position: absolute;
    width: 100%;
    top: 88px;
    }
  .container{
    margin: 0px auto 56px auto;
    margin: 0px;
  }
  .card__title--primary {
     padding-top: 0px;
  }
  .btn__content {
    justify-content: flex-start;
  }
    @media screen and (max-width: 600px) {
      .getContactButton {
        position: absolute;
        top: 2px;
        right: -10px;
    }
  }
</style>
