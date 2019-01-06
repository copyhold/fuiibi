<template>
  <v-flex xs12>
    <file-upload model="files" input-id="uploadeventpictures" :multiple="true" ></file-upload>
    <v-fab-transition>
      <v-btn v-if="userWasThere" color="orange" fixed bottom right fab class="orange white--text mb-3" tag="label" for="uploadeventpictures">
        <v-icon>add_a_photo</v-icon>
      </v-btn>
      <v-btn v-else fixed bottom right fab class="greyColors darkgray--text mb-3"><v-icon>add_a_photo</v-icon></v-btn>
    </v-fab-transition>
  </v-flex>
</template>

<script>
  const Cropper = require('cropperjs')
  const Compressor = require('compressorjs')
  const FileUpload = require('vue-upload-component')

  export default {
    props: ['meetupId', 'userWasThere'],
    components: {Cropper, Compressor, FileUpload},
    data () {
      return {
        files: [],
        addPicDialog: false
      }
    }
  }
</script>
