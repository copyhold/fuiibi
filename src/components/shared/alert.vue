<template>
  <v-alert error dismissible @input="onClose" :value="true">
    {{ text }}
  </v-alert>
</template>

<script>
  export default {
    props: ['text'],
    methods: {
      onClose () {
        console.log('[v-alert] alert closed')
        this.$emit('dismissed')
      }
    }
  }
</script>

<style lang="css">
</style>
