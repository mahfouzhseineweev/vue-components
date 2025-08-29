<template>
  <LazyGLottieAnimation
      v-if="computedType === 'lottie'"
      ref="lottieRef"
      v-bind="$attrs"
  />
  <NuxtImg
      v-else
      v-bind="$attrs"
  />
</template>

<script setup>
import { computed } from "#imports"
const props = defineProps({
  type: {
    type: String,
    required: true, // "image" | "lottie"
  }
})

const computedType = computed(() => {
  return props.type
})
</script>
