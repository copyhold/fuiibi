<template>
  <v-layout v-if="userWasThere">
    <v-dialog v-model="picDialog" fullscreen full-width max-width="800px" hide-overlay >
      <v-card style="background: white url('/src/images/icons/imageForBackground.png') repeat" >
        <v-toolbar dark color="primary">
          <v-btn icon white @click="picDialog=false">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title>Upload pictures</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- <v-icon right dark v-if="files.length>0"   @click="startUpload">cloud_upload</v-icon> -->
          <v-btn right color="white" small absolute class="text--primary" v-if="files.length>0"   @click="startUpload">Done</v-btn>
        </v-toolbar>
        <v-container grid-list-s fluid>
          <v-layout row wrap>
            <v-flex lg2 xs4 sm3 px-1 py-1 full-height v-for="(file, index) in files" :key="file.id" :loadingPictures='loadingPictures=false'>
              <v-card v-if="file" flat tile>
                <v-btn flat icon small absolute right @click="deletePhoto(file, index)" class="closeButtonPic">
                  <v-icon color="black">close</v-icon>
                </v-btn>
                <v-img :src="file.url" aspect-ratio="1" @click="selectFileForEdit(file)"></v-img>
              </v-card>
            </v-flex>
            <v-flex lg2 xs4 sm3 px-1 py-1>
              <input accept="image/*" type="file" id="selectphotos" multiple class="d-none" @change="addedPhoto()" ref="filesfield" />
              <v-btn for="selectphotos" center outline color="grey" class="uploadPicture" tag="label" v-if="!loadingPictures">
                <v-icon>add_a_photo</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout row wrap v-if="loadingPictures">
              <v-flex xs12 class="text-xs-center">
                <v-progress-circular indeterminate color="darkgray" :width="1" :size="90" v-if="loadingPictures"></v-progress-circular>
              </v-flex>
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
import Compressor from 'compressorjs'
import ImageEditor from './Edit/imageeditor.vue'

export default {
  props: ['evid', 'userWasThere'],
  components: {ImageEditor},
  data () {
    return {
      editFile: null,
      files: [],
      picDialog: false,
      loadingPictures: false
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
      if (files.length === 0) return
      Array.from(files).forEach(file => {
        // eslint-disable-next-line
        new Compressor(file, {
          mimeType: 'image/jpeg',
          maxWidth: 1500,
          maxHeight: 1500,
          success: compressedfile => {
            compressedfile.url = window.URL.createObjectURL(compressedfile)
            this.files.push(compressedfile)
          },
          error: err => {
            this.$error(err)
          }
        })
      })
      this.loadingPictures = true
    },
    startUpload () {
      Array.from(this.files).forEach(file => this.$store.dispatch('uploadPicture', {file, evid: this.evid}))
      this.picDialog = false
      this.files = []
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
  height: 100%;
  width: 100%;
  min-height: 29vw;
  margin: 0 auto;
}
.closeButtonPic{
  z-index: 2;
  right: 0px;
}

</style>
