<template>
  <div class="text-center">
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
  Vue.console.log('in overlay')
  export default {
    data: () => ({
      loading: false,
    }),
  }
</script>
