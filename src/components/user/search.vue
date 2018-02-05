<template>
  <v-container>
    <router-link
        :to="'/friends'"
        class="arrowBack"
        >
        <v-icon class="white--text">arrow_back</v-icon>
    </router-link>
    <v-layout id="inputSearch" >
      <v-text-field solo label="Search" append-icon="search" class="ml-5" v-model="search"></v-text-field>
    </v-layout>
    <v-tabs fixed centered>
      <v-tabs-bar color="primary--text">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tabs-item :href="'#allUsers'">
          App users
        </v-tabs-item>
        <v-tabs-item :href="'#friends'">
          My friends
        </v-tabs-item>
      </v-tabs-bar>
      <v-tabs-items>
        <v-tabs-content :id="'friends'">
          <friends-only :search="search"></friends-only>
        </v-tabs-content>
        <v-tabs-content :id="'allUsers'">
          <all-users :search="search"></all-users>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        search: ''
      }
    },
    computed: {
      // filteredUsers () {
      //   return this.users.filter((user) => {
      //     return user.userName.match(this.search)
      //   })
      // }
    }
  }
</script>

<style scoped>
.arrowBack {
  position: fixed;
  top: 56px;
  left: 24px;
  z-index: 3;
  }
  #inputSearch {
    position: fixed;
    top: 40px;
    right: 0px;
    width: 100%;
    height: 56px;
    padding: 8px;
    z-index: 2;
    background: #00695c;
    font-size: 20px;
  }
  input {
    height: 38px;
    width: 100%;
    margin-top: 3px;
    border-bottom: 1px solid grey;
  }
  .input-group.input-group--solo {
    min-height: 38px;
  }
  .container {
    padding: 0px;
  }
  .tabs {
    overflow: hidden;
    position: absolute;
    width: 100%;
    top: 120px;
    }
</style>
