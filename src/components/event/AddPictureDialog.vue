<template>
  <v-layout v-if="userWasThere">
    <v-dialog v-model="picDialog" fullscreen full-width max-width="800px" hide-overlay>
      <v-btn slot="activator" dark>Show images</v-btn>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click="picDialog=false;imagesready=false;">
            <v-icon>Close</v-icon>
          </v-btn>
          <v-toolbar-title>Upload pictures</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card v-if="editFile">
          <v-card-actions>
            <v-btn icon flat @click="crop"><v-icon>crop</v-icon></v-btn>
            <v-btn icon flat @click="rotateleft"><v-icon>rotate_left</v-icon></v-btn>
            <v-btn icon flat @click="rotaterite"><v-icon>rotate_right</v-icon></v-btn>
          </v-card-actions>
          <img :src="editFile.blob" ref="editImage" />
        </v-card>
        <v-layout justify-start row wrap>
          <v-flex v-if="imagesready" lg2 xs4 sm3 v-for="(file, index) in files" :key="file.id">
            <v-card v-if="file.thumb" flat tile>
              <v-btn flat icon small top right absolute color="red" @click="$refs.upload.remove(file)"><v-icon>close</v-icon></v-btn>
              <v-img :src="file.thumb" aspect-ratio="1" @click="editFile=file"></v-img>
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
                <v-btn
                  color="blue-grey"
                  class="white--text" > Upload <v-icon right dark>cloud_upload</v-icon> </v-btn>
          </file-upload>
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
import Cropper from 'cropperjs'
import FileUpload from 'vue-upload-component'
import Compressor from 'compressorjs'

export default {
  props: ['meetupId', 'userWasThere'],
  components: {Cropper, Compressor, FileUpload},
  data () {
    return {
      imagesready: false,
      editFile: null,
      files: [],
      picDialog: false
    }
  },
  watch: {
    editFile (newValue, oldValue) {
      if (!newValue && oldValue) {
        this.$refs.upload.update(this.editFile.id, { error: this.editFile.error || '' })
      }
      if (newValue) {
        this.$nextTick(() => {
          if (!this.editFile) {
            return
          }
          let cropper = new Cropper(this.$refs.editImage, {
            autoCrop: false
          })
          this.editFile = { ...this.editFile, cropper }
        })
      }
    }
  },
  methods: {
    crop () {
    },
    rotateleft () {
    },
    rotaterite () {
    },
    inputFilter (newfile, oldfile, prevent) {
      if (newfile.file && newfile.type.substr(0, 6) !== 'image/') { // only images allowed
        return prevent()
      }
      if (!newfile && oldfile) { // remove file
        return true
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
        newfile.blob = window.URL.createObjectURL(file)
        newfile.thumb = newfile.blob
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
