<template>
  <component :is="componentsPrefix + componentName" :media-uri-prop="mediaUriProp" :authors-uri-prop="authorsUriProp" :project-id-prop="projectIdProp" :auth-token="authToken" :sections-user-id-prop="sectionsUserIdProp" :media-translation-prefix="mediaTranslationPrefix" :show-create-media-button="showCreateMediaButton" :media-response-prop="mediaResponseProp" :media-by-id-uri-prop="mediaByIdUriProp" :media-by-id-response-prop="mediaByIdResponseProp" :media-id-prop="mediaId" :create-media-path="createMediaPath" :edit-media-path="editMediaPath" :medias-path="mediasPath" :bo-usage="boUsage" :access-limited="accessLimited" @updateMediaComponent="onMediaComponentUpdate" :with-select-media-button="withSelectMediaButton" :nuxt-sections="nuxtSections" @onMediaSelected="(media) => $emit('getSelectedMedia', media)"  />
</template>

<script>

export default {
  name: "Media",
  data() {
    return {
      componentName: 'MediaListMedias',
      mediaId: ''
    }
  },
  props: {
    componentsPrefix: {
      type: String,
      default: ""
    },
    mediaUriProp: {
      type: String,
      default: ""
    },
    mediaByIdUriProp: {
      type: String,
      default: ""
    },
    authorsUriProp: {
      type: String,
      default: ""
    },
    projectIdProp: {
      type: String,
      default: ""
    },
    authToken: {
      type: String,
      default: ""
    },
    sectionsUserIdProp: {
      type: String,
      default: ""
    },
    mediaIdProp: {
      type: String,
      default: ""
    },
    mediaTranslationPrefix: {
      type: String,
      default: "mediaT."
    },
    createMediaPath: {
      type: String,
      default: ""
    },
    editMediaPath: {
      type: String,
      default: ""
    },
    mediasPath: {
      type: String,
      default: ""
    },
    showCreateMediaButton: {
      type: Boolean,
      default: false
    },
    accessLimited: {
      type: Boolean,
      default: false
    },
    mediaResponseProp: {
      type: Object,
      default() {
        return {}
      }
    },
    mediaByIdResponseProp: {
      type: Object,
      default() {
        return {}
      }
    },
    boUsage: {
      type: Boolean,
      default: true
    },
    withSelectMediaButton: {
      type: Boolean,
      default: false
    },
    selectedMedia: {
      type: Object,
      default() {
        return {}
      }
    },
    nuxtSections: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isMediasPath() {
      if (this.$route.params && this.$route.params.pathMatch) {
        return this.$route.params.pathMatch.includes('medias')
      } else return false
    },
    isEditMediaPath() {
      if (this.$route.params && this.$route.params.pathMatch) {
        return this.$route.params.pathMatch.includes('EditMedia')
      } else return false
    },
    isCreateMediaPath() {
      if (this.$route.params && this.$route.params.pathMatch) {
        return this.$route.params.pathMatch.includes('CreateMedia')
      } else return false
    }
  },
  created() {
    if (this.isMediasPath) {
      this.componentName = 'MediaListMedias'
    } else if (this.isEditMediaPath) {
      this.mediaId = this.$route.query.id
      this.componentName = 'MediaEditMedia'
    } else if (this.isCreateMediaPath) {
      this.componentName = 'MediaCreateMedia'
    }
  },
  methods: {
    onMediaComponentUpdate(component) {
      this.$emit('mediaComponentUpdated', component)
      this.componentName = component.name
      this.mediaId = component.mediaId
    }
  }
}
</script>

<style scoped>

</style>
