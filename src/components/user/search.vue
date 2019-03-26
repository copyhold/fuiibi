<template>
  <v-container>
    <router-link :to="'/friends'" class="arrowBack">
        <v-icon class="secondaryDark--text">arrow_back</v-icon>
    </router-link>
    <v-tabs fixed grow >
      <v-tab :href="'#friends'">My friends</v-tab>
      <v-tab :href="'#friends'">My contacts</v-tab>
      <v-tab>Swarm</v-tab>
      <v-tab-item :id="'friends'">
        <friends-search :search="search.trim()"></friends-search>
      </v-tab-item>
      <v-tab-item :id="'allUsers'">
        <all-users :search="search.trim()"></all-users>
      </v-tab-item>
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
    }
  }
</script>

<style scoped>
.v-icon {
  display: -webkit-inline-box;
}
.btn--bottom:not(.btn--absolute) {
  bottom: 72px;
}
.arrowBack {
  position: fixed;
  top: 14px;
  left: 8px;
  z-index: 3;
  }
  #inputSearch {
    width: 100%;
    height: 42px;
    padding: 0px;
    z-index: 2;
    border: solid 1px;
    /* background: #0E1E51;
    background: #fff; */
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
    margin-bottom: 56px;
    /* margin: 0 auto; */
  }
  .tabs {
    overflow: hidden;
    position: absolute;
    width: 100%;
    top: 106px;
    }
  @media screen and (max-width: 599px) {
    #inputSearch {
      top: 42px;
      border: 0px;
    }
    .tabs {
      top: 88px;
    }
  }
</style>
