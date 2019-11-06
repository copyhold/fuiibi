<template>
  <v-list-tile avatar>
    <v-list-tile-avatar class="avatarImg">
      <img :src="user.imageUrl"/>
    </v-list-tile-avatar>
    <v-list-tile-content  @click="getUserPage(user)" >
      <v-list-tile-title v-html="user.firstName + ' ' + user.lastName" ></v-list-tile-title>
    </v-list-tile-content>
      <v-list-tile-action v-if="hasPendingInvitation(user) || isPendingFriend(user)">
        <v-btn class="greyColors" flat left>Pending...</v-btn>
      </v-list-tile-action>
      <v-list-tile-action v-else>
        <v-btn @click="sendFriendRequest()" v-if="!isFriend(user)" flat icon><v-icon>person_add</v-icon></v-btn>
        <v-btn v-else @click="removeFriend(user)" flat class="greyColors">Remove</v-btn>
      </v-list-tile-action>
  </v-list-tile>
</template>

<script>
export default {
  props: ['user'],
  methods: {
    getUserPage (key) {
      this.$store.dispatch('getUserData', {userId: key.id})
      this.$router.push('/users/' + key.id)
    },
    removeFriend (user) {
      console.log('removeFriend', user)
      this.$store.dispatch('removeFriend', user)
    },
    sendFriendRequest () {
      this.$store.dispatch('sendFriendRequest', this.user.id)
    },
    isFriend (user) {
      if (this.$store.getters.user && this.$store.getters.user.friends) {
        return Object.values(this.$store.getters.user.friends).indexOf(user.id) > -1
      }
    },
    hasPendingInvitation (user) {
      if (this.$store.getters.user && this.$store.getters.user.pendingInvitations) {
        return this.$store.getters.user.pendingInvitations[user.id]
      }
    },
    isPendingFriend (user) {
      if (this.$store.getters.user && this.$store.getters.user.pendingFriends) {
        return this.$store.getters.user.pendingFriends[user.id]
      }
    }
  }
}
</script>
