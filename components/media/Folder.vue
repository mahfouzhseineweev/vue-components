<template>
  <div class="cursor-pointer max-w-max" @click="folderClicked">
    <div class="relative">
      <div>
        <span :class="isSelected ? 'icon-folder' : 'icon-folderGrey'" :style="folderStyle"></span>
      </div>
      <div :class="containerStyle">
        <div class="flex">
          <div v-for="(media, i) in medias.slice(0, mediasNumber)" :key="i">
            <div v-if="!media.type.includes('image')" :class="[mediaStyle, documentClass]" :style="documentStyle">
              <span class="icon-mediaDocument text-xl"></span>
            </div>
            <div v-else>
              <img :src="media.url" :width="mediasWidth" :height="mediasHeight" :class="mediaStyle"/>
            </div>
          </div>
          <div class="self-end">...</div>
        </div>

        <div :class="categoryStyle">
          {{ categoryLabel }}
        </div>

        <div class="flex items-center pt-2 pl-3">
          <span v-if="!all" :class="categoryIcon"></span>
          <div :class="!all ? categoryValueStyle : allStyle">
            {{ !all ? categoryValue : allText }}
          </div>
        </div>

        <div :class="totalStyle">
          <div>
            {{ totalLabel }}
          </div>
          <div class="pl-1">
            {{ totalValue }}
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Folder",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    medias: {
      type: Array,
      default() {
        return [
          {
            url: require('../../assets/images/temp1.png')
          },
          {
            url: require('../../assets/images/temp1.png')
          },
          {
            url: require('../../assets/images/temp1.png')
          },
          {
            url: require('../../assets/images/temp1.png')
          },
          {
            url: require('../../assets/images/temp1.png')
          },
        ]
      }
    },
    mediasNumber: {
      type: Number,
      default: 5
    },
    categoryLabel: {
      type: String,
      default: 'CATEGORY:'
    },
    categoryStyle: {
      type: String,
      default: 'pt-3 pl-3 text-xs text-mediaGrey font-medium'
    },
    categoryValue: {
      type: String,
      default: 'IMAGES'
    },
    categoryValueStyle: {
      type: String,
      default: 'text-sm text-mediaGrey font-medium'
    },
    categoryIcon: {
      type: String,
      default: 'icon-images pr-2'
    },
    allText: {
      type: String,
      default: 'ALL'
    },
    totalLabel: {
      type: String,
      default: 'Total: '
    },
    totalValue: {
      type: String,
      default: '67'
    },
    totalStyle: {
      type: String,
      default: 'flex font-light items-center pt-1 pl-3 text-xs'
    },
    folderStyle: {
      type: String,
      default: 'font-size: 165px'
    },
    mediasWidth: {
      type: String,
      default: '38'
    },
    mediasHeight: {
      type: String,
      default: '38'
    },
    mediaStyle: {
      type: String,
      default: 'rounded-full ml-2'
    },
    documentClass: {
      type: String,
      default: 'flex justify-center items-center'
    },
    documentStyle: {
      type: String,
      default: 'background: #61035B'
    },
    allStyle: {
      type: String,
      default: 'text-xl text-Blue font-medium'
    },
    containerStyle: {
      type: String,
      default: 'absolute top-12 left-1'
    },
    all: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    folderClicked: {
      type: Function,
      default: (folder) => {}
    }
  }
}
</script>

<style scoped>
.text-mediaGrey {
  color: #6E6E6E;
}
</style>
