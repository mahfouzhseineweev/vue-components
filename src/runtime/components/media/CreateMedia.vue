<template>
  <div class="mr-8" :class="nuxtSections ? '' : 'ml-4'">
    <div
      class="cursor-pointer text-4xl text-Blue"
      :class="nuxtSections ? 'fixed top-3 left-12' : 'md:pl-8'"
      @click="backClicked"
    >
      {{ backLabel }}
    </div>

    <div class="text-mediaTextGray mt-8" :class="nuxtSections ? '' : 'md:ml-8'">
      {{ $t(mediaTranslationPrefix + 'dragDropMedia') }}
    </div>

    <div
      class="flex justify-center w-full md:w-auto items-center w-2/3 mt-8 md:ml-8"
      :class="nuxtSections ? '' : 'md:ml-8'"
      @drop.prevent="onFileSelected"
      @dragenter.prevent
      @dragover.prevent
    >
      <label
        for="dropzone-file"
        class="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-BorderGray border-dashed cursor-pointer bg-mediaUploadGray"
      >
        <div class="flex flex-col justify-center items-center pt-5 pb-6">
          <img src="../../assets/images/upload.svg" alt="" class="pb-4" width="100" />
          <div class="text-grayText">
            {{ $t(mediaTranslationPrefix + 'dragDrop') }}
            <a class="text-Blue underline">{{ $t(mediaTranslationPrefix + 'browse') }}</a>
            {{ $t(mediaTranslationPrefix + 'yourMedia') }}
          </div>
        </div>
        <input
          id="dropzone-file"
          ref="imageUploaded"
          type="file"
          :accept="mediaCategory === 'document' ? fileTypes : null"
          class="hidden"
          @change="onFileSelected"
        />
      </label>
    </div>

    <LazyGAnimatedLoading :loading="loading" />
  </div>
</template>

<script setup>
import { useI18n, ref, useRoute, navigateTo, useLocalePath, watch } from '#imports'

import { acceptedFileTypes, mediaHeader, showToast } from './medias'

const { t } = useI18n()

const props = defineProps({
  appliedFilters: {
    type: String,
    default: ''
  },
  folderType: {
    type: String,
    default: ''
  },
  mediaByIdUriProp: {
    type: String,
    default: ''
  },
  projectIdProp: {
    type: String,
    default: ''
  },
  authToken: {
    type: String,
    default: ''
  },
  mediaTranslationPrefix: {
    type: String,
    default: 'mediaT.'
  },
  editMediaPath: {
    type: String,
    default: ''
  },
  mediasPath: {
    type: String,
    default: ''
  },
  boUsage: {
    type: Boolean,
    default: true
  },
  nuxtSections: {
    type: Boolean,
    default: false
  },
  mediaCategory: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['updateMediaComponent'])

// Reactive state
const loading = ref(false)
const mediaByIdUri = ref('')
const projectId = ref('')
const token = ref('')
const backLabel = '<'
const fileTypes = acceptedFileTypes

// File input reference
const imageUploaded = ref(null)

// Watchers
watch(
  () => props.projectIdProp,
  (val) => {
    projectId.value = val
  },
  { immediate: true }
)

watch(
  () => props.authToken,
  (val) => {
    token.value = val
  },
  { immediate: true }
)

watch(
  () => props.mediaByIdUriProp,
  (val) => {
    mediaByIdUri.value = val
  },
  { immediate: true }
)

// Methods
async function onFileSelected(e) {
  let fileData = imageUploaded.value?.files[0]

  if (e.dataTransfer && e.dataTransfer.files) {
    fileData = e.dataTransfer.files[0]
  }

  if (!fileData) return
  loading.value = true
  const data = new FormData()

  data.append('files[1][platform_id]', '1')
  data.append('files[1][file]', fileData)
  data.append('type', fileData.type.includes('image') ? 'image' : 'document')
  data.append('private_status', 'public')
  data.append('locked_status', 'unlocked')


  try {
    // $fetch returns the response directly, not an object with .value properties
    const response = await $fetch(mediaByIdUri.value, {
      method: 'POST',
      headers: mediaHeader({ token: token.value }, projectId.value),
      body: data,
      // Add error handling to $fetch
      onRequestError({ request, error }) {
        throw error
      },
      onResponseError({ response, error }) {
        throw error
      }
    })

    // Direct handling of successful response
    if (props.nuxtSections) {
      showToast('', 'success', t(props.mediaTranslationPrefix + 'mediaCreated'))
    }

    if (props.editMediaPath) {
      navigateTo(useLocalePath({ path: props.editMediaPath, query: { id: response.id, isCreate: true } }))
    } else {
      emit('updateMediaComponent', {
        name: 'MediaEditMedia',
        mediaId: response.id,
        isCreateMedia: true,
        appliedFilters: props.appliedFilters,
        folderType: props.folderType
      })
    }
  } catch (e) {
    let errorMessage = ''
    // Comprehensive error handling
    if (e.request && !e.response) {
      // Network error or request couldn't be sent
      errorMessage = t('mediaTooLarge')
    } else if (e.response) {
      // Server responded with an error
      if (e.response._data?.options?.link) {
        const root = e.response._data.options.link.root || ''
        const path = e.response._data.options.link.path || ''
        errorMessage = `<a href='${root}${path}' target='_blank'>${e.response._data.error}, ${e.response._data.message}</a>`
      } else if (e.response._data?.errors?.files) {
        errorMessage = e.response._data.errors.files[0]
      } else if (e.response._data?.message) {
        errorMessage = e.response._data.message
      } else {
        errorMessage = e.message || 'An unknown error occurred'
      }
    } else {
      // Fallback error message
      errorMessage = e.message || 'An unexpected error occurred'
    }

    if (props.nuxtSections) {
      showToast('Error', 'error', errorMessage)
    }
  } finally {
    loading.value = false
  }
}

function backClicked() {
  if (props.mediasPath) {
    navigateTo(useLocalePath({ path: props.mediasPath, query: { filters: useRoute().query.filters } }))
  } else {
    emit('updateMediaComponent', {
      name: 'MediaListMedias',
      appliedFilters: props.appliedFilters,
      folderType: props.folderType
    })
  }
}
</script>

<style scoped>
/* Keep as-is */
</style>