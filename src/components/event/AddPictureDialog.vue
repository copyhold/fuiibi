<template>
  <v-layout v-if="userWasThere">
    <v-dialog v-model="picDialog" fullscreen full-width max-width="800px" hide-overlay>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon white @click="picDialog=false;imagesready=false;">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Upload pictures</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-layout justify-start row wrap>
          <v-flex v-if="imagesready" lg2 xs4 sm3 v-for="(file, index) in files" :key="file.id">
            <v-card v-if="file.thumb" flat tile>
              <v-btn flat icon small top right absolute color="red" @click="$refs.upload.remove(file)"><v-icon>close</v-icon></v-btn>
              <v-img :src="file.thumb" aspect-ratio="1" @click="selectFileForEdit(file)"></v-img>
            </v-card>
          </v-flex>
          <file-upload 
                class="flex grow align-self-center"
                v-model="files" 
                input-id="uploadeventpictures" 
                extensions="jpg,jpeg,png"
                :multiple="true" 
                @input-filter="inputFilter"
                ref="upload" >
                <v-btn color="orange" fab class="orange white--text mb-3" @click="picDialog=true">
                  <v-icon>add_a_photo</v-icon>
                </v-btn>
          </file-upload>
          <v-btn
            v-if="files.length>0"
            color="blue-grey"
            @click="startUpload"
            class="white--text" > begin upload <v-icon right dark>cloud_upload</v-icon> </v-btn>
        </v-layout>
      </v-card>
    </v-dialog>
    <v-fab-transition>
      <v-btn color="orange" fixed bottom right fab class="orange white--text mb-3" @click="picDialog=true">
        <v-icon>add_a_photo</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-layout>
</template>

<script>
import FileUpload from 'vue-upload-component'
import Compressor from 'compressorjs'
import ImageEditor from './Edit/imageeditor.vue'

export default {
  props: ['meetupId', 'userWasThere'],
  components: {FileUpload, ImageEditor},
  data () {
    return {
      imagesready: false,
      editFile: null,
      files: [],
      picDialog: false
    }
  },
  methods: {
    startUpload () {
      this.$store.dispatch('uploadPictures', {files: this.files})
    },
    selectFileForEdit (file) {
      this.editFile = { ...file, show: true }
      this.$refs.upload.update(file.id, { error: 'editing' })
    },
    inputFilter (newfile, oldfile, prevent) {
      if (!newfile && oldfile) { // remove file
        return true
      }
      if (newfile.file && newfile.type.substr(0, 6) !== 'image/') { // only images allowed
        return prevent()
      }
      if (newfile && oldfile) { // update file
        return prevent()
      }
      this.imagesready = false
      new Promise((resolve, reject) => {
        // eslint-disable-next-line
        new Compressor(newfile.file, {
          mimeType: 'image/jpeg',
          maxWidth: 1500,
          maxHeight: 1500,
          success: resolve,
          error: reject
        })
      })
      .then(file => {
        this.$refs.upload.update(newfile.id, { error: '', file, size: file.size, type: file.type })
        newfile.url = newfile.thumb = newfile.blob = window.URL.createObjectURL(file)
        // @TODO - please, fix me. timeout runs for each file
        newfile.error = 'compressing'
        setTimeout(() => {
          this.imagesready = true
        }, 100)
      })
      .catch(err => {
        this.$refs.upload.update(newfile, { error: err.message || 'compress' })
      })
    }
  }
}
</script>
