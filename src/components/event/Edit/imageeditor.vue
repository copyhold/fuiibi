<template>
  <v-card v-if="data.url" flat>
    <img :src="data.url" ref="image" @load="start" />
    <v-card-actions>
      <v-btn icon flat @click="cropper.setDragMode('crop')"><v-icon>crop</v-icon></v-btn>
      <v-btn icon flat @click="cropper.rotate(-90)"><v-icon>rotate_left</v-icon></v-btn>
      <v-btn icon flat @click="cropper.rotate(+90)"><v-icon>rotate_right</v-icon></v-btn>
      <v-btn icon flat @click="crop()"><v-icon>done</v-icon></v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  name: 'image-editor',
  data () {
    return {
      canvasData: null,
      cropBoxData: null,
      croppedData: null,
      url: null,
      cropper: null
    }
  },
  methods: {
    stop () {
      if (this.cropper) {
        this.cropper.destroy()
        this.cropper = null
      }
    },
    update (data) {
      Object.assign(this.data, data)
    },
    crop () {
      const { cropper, data } = this
      this.croppedData = cropper.getData()
      this.canvasData = cropper.getCanvasData()
      this.cropBoxData = cropper.getCropBoxData()
      const url = cropper.getCroppedCanvas({
        fillColor: '#fff'
      }).toDataURL(data.type)
      this.update({
        cropped: true,
        cropping: false,
        previousUrl: data.url,
        url
      })
    },
    start () {
      const { data } = this
      if (data.cropped) {
        return
      }
      this.cropper = new Cropper(this.$refs.image, {
        autoCrop: false,
        dragMode: 'crop',
        background: false,
        ready () {
          if (this.croppedData) {
            this.cropper
            .crop()
            .setData(this.croppedData)
            .setCanvasData(this.canvasData)
            .setCropBoxData(this.cropBoxData)
            this.croppedData = null
            this.canvasData = null
            this.cropBoxData = null
          }
        },
        crop: ({ detail }) => {
          if (detail.width > 0 && detail.height > 0 && !data.cropping) {
            this.update({
              cropping: true
            })
          }
        }
      })
    },
    commitEditFile () {
      let data = {
        name: this.image.name
      }
      if (this.image.cropper) {
        let binStr = atob(this.image.cropper.getCroppedCanvas().toDataURL(this.image.type).split(',')[1])
        let arr = new Uint8Array(binStr.length)
        for (let i = 0; i < binStr.length; i++) {
          arr[i] = binStr.charCodeAt(i)
        }
        data.file = new File([arr], data.name, { type: this.image.type })
        data.size = data.file.size
      }
      this.imagesready = false
      this.$refs.upload.update(this.image.id, data)
      setTimeout(() => {
        this.imagesready = true
      }, 100)
      this.image = null
    }
  }
}
</script>
