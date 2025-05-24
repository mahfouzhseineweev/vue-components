<template>
  <div class="max-w-max">
    <div :class="props.containerStyle">

      <div class="flex p-3 justify-between items-center w-full">

        <div class="flex">
          <div :class="props.locked ? 'rounded-full bg-mediaLocked flex items-center justify-center' : 'rounded-full bg-mediaUnLocked flex items-center justify-center'">
            <span v-if="props.locked" :class="props.iconLocked"></span>
            <span v-else :class="props.iconUnlocked"></span>
          </div>

          <div class="pl-4">
            <span v-if="props.hidden" :class="props.iconHidden"></span>
            <span v-else :class="props.iconSeen"></span>
          </div>
        </div>

        <div class="flex items-center cursor-pointer" @click="props.copyLink">
          <span :class="props.iconAttach"></span>
          <div :class="props.copyLinkStyle">
            {{ props.copyLinkLabel }}
          </div>
        </div>

      </div>

      <div v-if="!props.hidden || (props.hidden &amp;&amp; props.isAuthor)" class="w-[350px] cursor-pointer" @click="props.openMedia">
        <div v-if="props.mediaType === 'document'">
          <div class="flex w-full h-[200px] justify-center items-center object-cover" :style="props.hiddenContainerStyle">
            <div class="flex flex-col items-center gap-4">
              <span class="icon-mediaDocument text-6xl"></span>
            </div>
          </div>
        </div>
        <div v-else-if="props.hidden &amp;&amp; props.isAuthor">
          <div class="flex w-full h-[200px] justify-center items-center object-cover" :style="props.hiddenContainerStyle">
            <div class="flex flex-col items-center gap-4">
              <span class="icon-photograpg text-8xl"></span> <!-- Assuming icon-photograph is correct -->
            </div>
          </div>
        </div>
        <div v-else>
          <img :src="props.mediaSrc" class="w-full h-[200px] object-cover" />
        </div>
      </div>
      <div v-else class="w-[350px] cursor-pointer" :style="props.hiddenContainerStyle" @click="props.openMedia">
        <div class="flex w-full h-[200px] justify-center items-center object-cover">
          <div class="flex flex-col items-center gap-4">
            <span :class="props.hiddenMediaSrc"></span>
            <div class="text-center font-light">
              {{ props.hiddenMessage }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap w-[350px] items-center pt-3 pr-3 pl-3">
        <div :class="props.mediaTitleStyle">
          {{ props.mediaTitle }}
        </div>
        <div :class="props.mediaAuthorStyle">
          {{ props.mediaAuthor }}
        </div>
      </div>

      <div class="flex items-center pt-1 pl-3 pr-3">
        <div :class="props.contentStyle">
          {{ props.contentvalue }}
        </div>
        <div :class="props.contentStyle">
          {{ props.contentLabel }}
        </div>
      </div>

      <div class="flex items-center pt-1 pl-3 pr-3" :class="props.withDuration ? '' : 'pb-3'">
        <div :class="props.sizeStyle">
          {{ props.sizeLabel }}
        </div>
        <div :class="props.sizeValueStyle">
          {{ props.sizeValue }}
        </div>
      </div>

      <div v-if="props.withDuration" class="flex items-center pt-1 pl-3 pr-3 pb-3">
        <div :class="props.durationStyle">
          {{ props.durationLabel }}
        </div>
        <div :class="props.mobileDesktopLabelStyle">
          {{ props.mobileLabel }}
        </div>
        <div :class="props.mobileDesktopValueStyle">
          {{ props.mobileValue }}
        </div>
        <div :class="props.mobileDesktopLabelStyle">
          {{ props.desktopLabel }}
        </div>
        <div :class="props.mobileDesktopValueStyle">
          {{ props.desktopValue }}
        </div>

        <div :class="props.seeMoreStyle" @click="props.seeMoreClicked">
          {{ props.seeMoreLabel }}
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.bg-mediaUnLocked {
  background-color: #DDEBFF;
}
.bg-mediaLocked {
  background-color: #FFE5DD;
}
</style>
