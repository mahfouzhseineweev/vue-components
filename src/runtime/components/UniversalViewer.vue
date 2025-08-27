<template>
  <LazyGLottieAnimation
      v-if="type === 'lottie'"
      ref="lottieRef"
      v-bind="$attrs"
  />
  <NuxtImg
      v-else
      v-bind="$attrs"
  />
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true, // "image" | "lottie"
  }
})
</script>
