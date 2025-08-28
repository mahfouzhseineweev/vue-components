<template>
  <div ref="lottieContainer" :style="{ width, height }"></div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  inject
} from '#imports'

const props = defineProps({
  src: {type: String, required: true}, // JSON path (public folder or remote URL)
  type: {type: String, default: 'lottie'},
  loop: {type: Boolean, default: true},
  autoplay: {type: Boolean, default: true},
  width: {type: String, default: '200px'},
  height: {type: String, default: '200px'},
})

const lottieContainer = ref(null)
const animation = ref(null)

/** Public methods for parent components */
function play() {
  animation.value?.play()
}

function pause() {
  animation.value?.pause()
}

function stop() {
  animation.value?.stop()
}

function setSpeed(speed = 1) {
  animation.value?.setSpeed(speed)
}

// Expose methods to parent via ref
defineExpose({play, pause, stop, setSpeed})

const loadScript = inject('loadScript')
onMounted(async () => {
  if (!loadScript || props.type !== 'lottie') return

  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.13.0/lottie.min.js', true)

  if (window.lottie) {
    animation.value = window.lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: props.loop,
      autoplay: props.autoplay,
      path: props.src,
    })
  }
})

onBeforeUnmount(() => {
  animation.value?.destroy()
})
</script>
