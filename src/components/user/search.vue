<template>
  <v-container>
    <v-layout id="inputSearch" >
      <!-- <v-flex wrap xs11>
        <input type="text" name="" value="" autofocus="autofocus">
      </v-flex>
      <v-flex wrap xs1>
        <v-icon right>search</v-icon>
      </v-flex> -->

      <v-text-field solo label="Search" prepend-icon="search" append-icon="close"></v-text-field>


    </v-layout>
    <v-tabs fixed centered>
      <v-tabs-bar color="primary--text">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tabs-item :href="'#friends'">
          App users
        </v-tabs-item>
        <v-tabs-item :href="'#allUsers'">
          My friends
        </v-tabs-item>
      </v-tabs-bar>
      <v-tabs-items>
        <v-tabs-content :id="'friends'">
          <all-users></all-users>
        </v-tabs-content>
        <v-tabs-content :id="'allUsers'">
          <all-users></all-users>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>

<script>
  // export default {
  //   data () {
  //     return {
  //       tabs: ['My friends', 'All users'],
  //       contents: [`${<all-users></all-users>}`, `${<all-users></all-users>}`]
  //     }
  //   }
  // }
</script>

<style scoped>
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
