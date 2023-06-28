<template>
  <div v-show="loading || nuxtLoading">
    <div class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-Dark bg-opacity-50 flex flex-col items-center justify-center">
      <img :src="animatedLoadingIcon" width="80" alt="" class="opacity-100">

    </div>
  </div>
</template>

<script>
export default {
  name: "AnimatedLoading",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    animatedLoadingIcon: {
      type: String,
      default: "../../assets/images/loading_animated.svg"
    },
  },
  data: () => ({
    nuxtLoading: false
  }),
  methods: {
    start() {
      this.nuxtLoading = true
    },
    finish() {
      this.nuxtLoading = false
    }
  }
}
</script>

<style scoped>

</style>
