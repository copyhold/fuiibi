<template >
  <v-container class="container">
    <v-tabs fixed grow>
      <v-tab href="#friends">Friends</v-tab>
      <v-tab href="#contacts">Contacts</v-tab>
      <v-tab href="#swarm">Search</v-tab>
      <v-tab-item :value="'friends'">
        <friends-only></friends-only>
      </v-tab-item>
      <v-tab-item :value="'contacts'">
        <my-contacts></my-contacts>
      </v-tab-item>
      <v-tab-item :value="'swarm'">
        <all-users></all-users>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        key: ''
      }
    },
    computed: {
      friends () {
        if (this.$store.getters.user) {
          if (this.$store.getters.user.friends.length > 0) {
            return this.$store.getters.user.friends
          }
        }
      },
      loading () {
        return this.$store.getters.loading
      },
      loggedInUserId () {
        return this.$store.getters.user.id
      },
      isFriend (friendId) {
        // The findIndex return us the place of the element in the array. So if we just want to check it exist, it should be bigger or equal to 0
        return this.$store.getters.user.friends.findIndex(userId => {
          return userId === friendId
        }) >= 0
      }
    },
    methods: {
      getUserPage (key) {
        this.$store.dispatch('getUserData', {userId: key.id})
        this.$router.push('/users/' + key.id)
      },
      messageFriend (userId) {
        console.log('userID from sendMessaget ', userId)
        // this.$store.dispatch('sendFriendRequest', userId)
      }
    }
  }
</script>

<style scoped>
.short{
  height: 40px;
}
.btn--bottom:not(.btn--absolute) {
    bottom: 72px;
}
  .container{
    margin-top: 0px;
    padding: 0px;
    margin-bottom: 56px;
    margin: 0px auto 56px auto;
  }
  .greyColors{
    background-color: #f6f7f9;
    border-color: #ced0d4;
    color: #4b4f56;
  }
  .card_actions{
    padding: 0px;
  }
  .btn_content{
    padding: 0px;
  }
  .btn__content {
    padding: 0px !important;
  }
  .card__actions {
    padding: 0px;
  }
  .card__title--primary {
    padding: 0px 0px;
  }
  .card__actions > *, .card__actions .btn {
    margin: 0 -8px;
  }
  p {
    margin-bottom: 4px;
  }
</style>
<style>
#app.size-xs .gotosearch {
  bottom: 80px;
}
</style>
