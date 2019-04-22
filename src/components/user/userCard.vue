<template>
  <v-list-tile avatar v-bind:key="user.id">
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
          <v-btn @click="sendFriendRequest()" flat small class="primary--text pl-1 pr-1"><v-icon class="pl-4">person_add</v-icon></v-btn>
        </v-list-tile-action>
        <v-list-tile-action v-else>
          <v-btn @click="removeFriend(user)" flat small class="greyColors" left>Remove</v-btn>
        </v-list-tile-action>
      </v-list-tile-action>
  </v-list-tile>
</template>

<script>
export default {
  props: ['user'],
  data () {
    return {
    }
  },
  methods: {
    getUserPage (key) {
      console.log('[getUserPage] clicked key', key)
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
      if (this.$store.getters.user) {
        // The findIndex return us the place of the element in the array. So if we just want to check it exist, it should be bigger or equal to 0
        return this.$store.getters.user.friends.findIndex(friend => {
          return friend.id === user.id
        }) >= 0
      }
    },
    hasPendingInvitation (user) {
      if (this.$store.getters.user) {
        // The findIndex return us the place of the element in the array. So if we just want to check it exist, it should be bigger or equal to 0
        if (this.$store.getters.user.pendingInvitations) {
          return this.$store.getters.user.pendingInvitations.findIndex(friend => {
            return friend.id === user.id
          }) >= 0
        }
      }
    },
    isPendingFriend (user) {
      if (this.$store.getters.user) {
        // The findIndex return us the place of the element in the array. So if we just want to check it exist, it should be bigger or equal to 0
        return this.$store.getters.user.pendingFriends.findIndex(friend => {
          return friend.id === user.id
        }) >= 0
      }
    }
  }
}
</script>
