<template>
  <v-layout v-if="userWasThere">
    <v-dialog v-model="picDialog" fullscreen full-width max-width="800px" hide-overlay>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon white @click="picDialog=false">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title>Upload pictures</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon right dark v-if="files.length>0"   @click="startUpload">cloud_upload</v-icon>
          <!-- <v-btn
            v-if="files.length > 0"
            color="white"
            @click="startUpload"
            class="white--text" ><v-icon right dark>cloud_upload</v-icon>
          </v-btn> -->
        </v-toolbar>
        <v-container grid-list-s fluid>
          <v-layout row wrap>

            <v-flex lg2 xs4 sm3 v-for="(file, index) in files" :key="file.id">
              <v-card v-if="file" flat tile>
                <v-btn flat icon small absolute right @click="deletePhoto(file, index)" class="closeButtonPic black"><v-icon color="white">close</v-icon></v-btn>
                <v-img :src="file.url" aspect-ratio="1" @click="selectFileForEdit(file)"></v-img>
              </v-card>
            </v-flex>
            <v-flex lg2 xs4 sm3>
              <input accept="image/*" type="file" id="selectphotos" multiple class="d-none" @change="addedPhoto()" ref="filesfield" />
              <!-- <v-flex class="uploadPicture" for="selectphotos" center tag="label">
                <v-icon class="pt-5">add_a_photo</v-icon>
              </v-flex> -->
              <v-btn for="selectphotos" center outline color="grey" class="mb-3 uploadPicture" tag="label">
                <v-icon>add_a_photo</v-icon>
              </v-btn>
            </v-flex>
            <file-upload
                  v-if="false"
                  class="flex grow align-self-center"
                  v-model="files"
                  input-id="uploadeventpictures"
                  extensions="jpg,jpeg,png"
                  :multiple="true"
                  @input-filter="inputFilter"
                  ref="upload" >
                  <v-btn color="orange" class="orange white--text mb-3" @click="picDialog=true">
                    <v-icon>add_a_photo</v-icon>
                  </v-btn>
            </file-upload>

          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-fab-transition>
      <v-btn  @click="picDialog=true" color="orange" ripple fixed bottom right fab class="addphoto white--text" >
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
      editFile: null,
      files: [],
      picDialog: false
    }
  },
  methods: {
    deletePhoto (file, index) {
      if (this.files[index].url === file.url) {
        const ttt = [...this.files]
        ttt.splice(index, 1)
        this.files = ttt
        // I know, but I'm in a hurry
      }
    },
    addedPhoto (filelist) {
      const files = this.$refs.filesfield.files
      if (files.length === 0) {
        return
      }
      Promise.all(
        [...files].map(file => {
          return new Promise((resolve, reject) => {
        // eslint-disable-next-line
            new Compressor(file, {
              mimeType: 'image/jpeg',
              maxWidth: 1500,
              maxHeight: 1500,
              success: resolve,
              error: reject
            })
          })
        })
      )
      .then(compressedfiles => {
        const files = [...this.files]
        for (let onefile of compressedfiles) {
          onefile.url = window.URL.createObjectURL(onefile)
          files.push(onefile)
        }
        this.files = files
      })
      .catch(this.$debug)
    },
    startUpload () {
      this.picDialog = false
      return this.$store.dispatch('uploadPictures', {files: this.files})
    },
    selectFileForEdit (file) {
      this.editFile = { ...file, show: true }
      this.$refs.upload.update(file.id, { error: 'editing' })
    }
  }
}
</script>
<style>
#app.size-xs .addphoto {
  bottom: 80px;
}
.uploadPicture {
  border-style: dashed;
  border-color: grey;
  border-width: thin;
  height: 120px;
  width: 100%;
  margin: 0 auto;
  padding: 42px;
}
.closeButtonPic{
  z-index: 2;
  right: 0px;
}

</style>
