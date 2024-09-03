<template>
  <div class="flex flex-col h-full justify-start">

    <div class="cursor-pointer text-4xl text-Blue" :class="nuxtSections ? 'fixed top-3 left-12' : 'pl-8'" @click="backClicked">
      {{ backLabel }}
    </div>

    <MediaComponent ref="sectionsMediaComponent" :auth-token="token" :server-url="serverUrl" :project-id="projectId" :blogs-user-id="blogsUserId" :selected-media-id="$route.query.id" @emittedMedia="(media) => selectedMedia = media"></MediaComponent>

    <div class="flex flex-col md:flex-row mt-4 w-full gap-4 md:gap-0 mb-16" :class="nuxtSections ? '' : 'md:pl-6'">

      <div class="flex flex-col w-full gap-4 pl-2 pr-4 md:pr-0 md:mx-4">

        <div>
          <Inputs
              id="article-title"
              :input-model="article.title"
              :tout-appareil="false"
              :active="true"
              :placeholder="$t(mediaTranslationPrefix + 'blogs.title')"
              @input="(newVal) => {article.title = newVal}"
          />
          <span v-if="errors.title && errors.title[0]" class="text-center text-error text-sm pt-4">{{ errors.title[0] }}</span>
        </div>
        <div>
          <Inputs
              id="article-path"
              :input-model="article.path"
              :tout-appareil="false"
              :active="true"
              :placeholder="$t(mediaTranslationPrefix + 'blogs.path')"
              @input="(newVal) => {article.path = newVal}"
          />
          <span v-if="errors.path && errors.path[0]" class="text-center text-error text-sm pt-4">{{ errors.path[0] }}</span>
        </div>
        <Inputs
            id="article-type"
            :input-model="article.type"
            :tout-appareil="false"
            :active="true"
            :placeholder="$t(mediaTranslationPrefix + 'blogs.type')"
            @input="(newVal) => {article.type = newVal}"
        />
        <fieldset class="fieldSetStyle border border-solid border-gray-300 p-3 mt-2">
          <legend class="w-auto px-16">{{ $t(mediaTranslationPrefix + 'blogs.metadata') }}</legend>
          <div class="flex flex-col gap-4">
            <Inputs
                id="article-label"
                :input-model="article.metadata.label"
                :tout-appareil="false"
                :active="true"
                :placeholder="$t(mediaTranslationPrefix + 'blogs.label')"
                @input="(newVal) => {article.metadata.label = newVal}"
            />
            <Inputs
                id="article-unit"
                :input-model="article.metadata.unit"
                :tout-appareil="false"
                :active="true"
                :placeholder="$t(mediaTranslationPrefix + 'blogs.unit')"
                @input="(newVal) => {article.metadata.unit = newVal}"
            />
            <Inputs
                id="article-duration"
                :input-model="article.metadata.duration"
                :tout-appareil="false"
                :active="true"
                :placeholder="$t(mediaTranslationPrefix + 'blogs.duration')"
                @input="(newVal) => {article.metadata.duration = newVal}"
            />
          </div>
        </fieldset>
        <Inputs
            id="article-author"
            :input-model="authorName"
            :tout-appareil="false"
            :active="false"
            :placeholder="$t(mediaTranslationPrefix + 'blogs.authorName')"
        />
        <div id="article-tags" class="flex flex-col gap-2">
          <div class="text-sm">{{ $t(mediaTranslationPrefix + 'blogs.tags') }}</div>
          <div v-for="(tag,k) in article.tags" :key="k" class="flex flex-col mb-4">
            <div class="flex">
              <Inputs
                  :id="`article-tag-${k}`"
                  :input-model="tag"
                  :tout-appareil="false"
                  :active="true"
                  :placeholder="`${$t(mediaTranslationPrefix + 'blogs.tag')} #${k+1}`"
                  @input="(newVal) => {tag = newVal;}"
              />
              <span class="flex flex-row pl-2 items-center">
              <span v-show="k || ( !k && article.tags.length > 1)" id="remove-project-url" class="icon-remove cursor-pointer text-2xl" @click="removeTag(k)"></span>
              <span v-show="k === article.tags.length-1" id="add-project-url" class="icon-add cursor-pointer text-2xl" @click="addTag()"></span>
            </span>
            </div>
          </div>
        </div>
        <fieldset class="fieldSetStyle border border-solid border-gray-300 p-3 mt-2">
          <legend class="w-auto px-16">{{ $t(mediaTranslationPrefix + 'blogs.medias') }}</legend>
          <div v-for="(object, index) in article.medias" :key="`media-upload-${index}`" class="mb-4">
            <UploadMedia :media-label="$t(mediaTranslationPrefix + 'blogs.media') + '*'" :upload-text="$t(mediaTranslationPrefix + 'blogs.uploadMedia')" :change-text="$t(mediaTranslationPrefix + 'blogs.changeMedia')" :seo-tag="$t(mediaTranslationPrefix + 'blogs.seoTag')" :media="object && Object.keys(object).length > 0 && object.files && object.files[0] ? [{...object, url: object.files[0].url}] : []" @uploadContainerClicked="selectedMediaIndex = index; $refs.sectionsMediaComponent.openModal(object && Object.keys(object).length > 0 ? object.id : null)" @removeUploadedImage="removeMedia(index)" />
          </div>
          <div
              class="add-button underline cursor-pointer mt-2"
              @click="addMedia()"
          >
            <div class="p3 bold text">{{ $t(mediaTranslationPrefix + 'blogs.addMedia') }}</div>
          </div>
        </fieldset>
        <div id="article-body">
          <div class="text-sm mb-2">{{ $t(mediaTranslationPrefix + 'blogs.body') }}</div>
          <quill-editor class="wyzywig" v-model="article.body" />
        </div>
        <div id="article-body">
          <div class="text-sm mb-2">{{ $t(mediaTranslationPrefix + 'blogs.description') }}</div>
          <quill-editor class="wyzywig" v-model="article.description" />
        </div>
        <AutoComplete
            :main-filter="article.categories"
            :select-placeholder="$t(mediaTranslationPrefix + 'blogs.selectCategories')"
            :filter-label-prop="'translation'"
            :reduce="(option) => option.key"
            :filter-options="filterMap.categories"
            :filter-searchable="false"
            :track-by="'key'"
            :preselect-first="true"
            :multiple="true"
            @itemSelected="(val) => {article.categories = val}"
        ></AutoComplete>
        <AutoComplete
            :main-filter="article.suggested"
            :select-placeholder="$t(mediaTranslationPrefix + 'blogs.selectArticles')"
            :filter-label-prop="'translation'"
            :reduce="(option) => option.key"
            :filter-options="filterMap.suggested"
            :filter-searchable="false"
            :track-by="'key'"
            :preselect-first="true"
            :multiple="true"
            @itemSelected="(val) => {article.suggested = val}"
        ></AutoComplete>


      </div>

    </div>

    <div class="sticky bottom-0 py-2 m-4 rounded-md shadow">

      <div class="flex w-full items-center justify-end">
<!--        <div class="cursor-pointer flex items-center" @click="showPopup = true">-->
<!--          <div class="text-error text-sm md:text-lg">{{ $t(mediaTranslationPrefix + 'EditMedia.deleteMedia') }}</div>-->
<!--          <span class="icon-trashCan2 text-md pb-1 px-2"></span>-->
<!--        </div>-->
        <div @click.stop.prevent="blogByIdUri !== '' && isCreateBlog !== true ? updateMediaByID() : createArticle()">
          <Buttons :button-text="$t(mediaTranslationPrefix + 'save')" :button-style="saveButtonStyle" :with-icon="false" />
        </div>
        <div @click.stop.prevent="(privateStatus === 'private' && media.author !== sectionsUserIdProp) ? null : $emit('onBlogSelected', article)">
          <Buttons v-if="withSelectBlogButton" :active="!(privateStatus === 'private' && media.author !== sectionsUserIdProp)" :button-text="$t(mediaTranslationPrefix + 'selectMedia')" :button-style="selectMediaButtonStyle" :with-icon="false" />
        </div>
      </div>

    </div>

<!--    <AlertPopup :errors-container-style="'mt-10 mb-14 self-center h-auto max-h-72 overflow-y-auto'" :apply-button-text="$t(mediaTranslationPrefix + 'EditMedia.deleteMedia')" :cancel-button-text="$t(mediaTranslationPrefix + 'EditMedia.cancel')" :title-delete="$t(mediaTranslationPrefix + 'EditMedia.deleteMediaMsg')" :title-no-delete="$t(mediaTranslationPrefix + 'EditMedia.cannotDelete')" :sub-title-no-delete="$t(mediaTranslationPrefix + 'EditMedia.cannotDeleteExtra')" :show-popup-code="showPopup" :can-be-deleted="media.meta ? !(media.meta.content && media.meta.content.length > 0) : false" :errors="noDeleteErrors" @cancel="showPopup = false" @apply="deleteMediaByID" />-->

    <AnimatedLoading :loading="loading" :animated-loading-icon="require('../../assets/images/loading_animated.svg')" />

  </div>
</template>

<script>
import AlertPopup from "../AlertPopup";
import Buttons from "../Buttons";
import AnimatedLoading from "../AnimatedLoading";
import HeaderContainer from "../HeaderContainer";
import {mediaHeader, showSectionsToast} from "../media/medias";

/* eslint-disable vue/return-in-computed-property */
export default {
  name: "EditBlog",
  head() {
    return {
      title: "bo - EditBlog",
    }
  },
  components: {
    HeaderContainer,
    Buttons,
    AlertPopup,
    AnimatedLoading
  },
  props: {
    appliedFilters: {
      type: String,
      default: ""
    },
    blogByIdUriProp: {
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
    blogIdProp: {
      type: String,
      default: ""
    },
    mediaTranslationPrefix: {
      type: String,
      default: "mediaT."
    },
    serverUrl: {
      type: String,
      default: ""
    },
    blogsPath: {
      type: String,
      default: ""
    },
    hiddenContainerStyle: {
      type: String,
      default: "background: #61035B"
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
    isCreateBlog: {
      type: Boolean,
      default: false
    },
    withSelectBlogButton: {
      type: Boolean,
      default: false
    },
    nuxtSections: {
      type: Boolean,
      default: false
    },
    mediaIdEditing: {
      type: String,
      default: ""
    },
    categories: {
      type: Array,
      default() {
        return []
      }
    },
    blogsUriProp: {
      type: String,
      default: ""
    },
    blogsUserIdProp: {
      type: String,
      default: ""
    },
    createBlogUriProp: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      saveButtonStyle: "py-2.5 px-12 ml-12 mr-2 text-white rounded-xl bg-Blue hover:bg-white hover:text-Blue border border-Blue hover:border-Blue",
      selectMediaButtonStyle: "py-2.5 px-12 ml-2 mr-2 text-white rounded-xl bg-Blue hover:bg-white hover:text-Blue border border-Blue hover:border-Blue",
      blogsUserId: '',
      blogId: '',
      createBlogUri: '',
      blogsUri: '',
      blogByIdUri: '',
      projectId: '',
      token: '',
      authorName: '',
      article: {
        title: "",
        body: "",
        path: "",
        type: "",
        metadata: {
          label: "",
          unit: "",
          duration: ""
        },
        tags: [
            ''
        ],
        medias: [],
        description: "",
        categories: [],
        suggested: [],
        published: false,
        views: 0
      },
      filterMap: {
        categories: [],
        suggested: []
      },
      selectedMedia: {},
      selectedMediaIndex: 0,
      errors: {},
      showPopup: false,
      popupContent: '',
      backLabel: '<',
      isEditingMedia: false
    }
  },
  watch: {
    blogIdProp: {
      handler(val) {
        this.blogId = val
      },
      deep: true,
      immediate: true
    },
    projectIdProp: {
      handler(val) {
        this.projectId = val
      },
      deep: true,
      immediate: true
    },
    authToken: {
      handler(val) {
        this.token = val
      },
      deep: true,
      immediate: true
    },
    blogByIdUriProp: {
      handler(val) {
        this.blogByIdUri = val
      },
      deep: true,
      immediate: true
    },
    sectionsUserIdProp: {
      handler(val) {
        this.sectionsUserId = val
      },
      deep: true,
      immediate: true
    },
    mediaByIdResponseProp: {
      handler(res) {
        if (res) {
          this.media = res
          if(this.media.title === "null") this.media.title = ""
          if(this.media.seo_tag === "null") this.media.seo_tag = ""
          this.privateStatus = this.media.private_status
          this.lockedStatus = this.media.locked_status
          this.popupContent = this.media.meta
        }
      },
      deep: true,
      immediate: true
    },
    categories: {
      handler(val) {
        this.filterMap.categories = val
      },
      deep: true,
      immediate: true
    },
    blogsUriProp: {
      handler(val) {
        this.blogsUri = val
        this.getAllArticles()
      },
      deep: true,
      immediate: true
    },
    createBlogUriProp: {
      handler(val) {
        this.createBlogUri = val
      },
      deep: true,
      immediate: true
    },
    blogsUserIdProp: {
      handler(val) {
        this.blogsUserId = val
      },
      deep: true,
      immediate: true
    },
    selectedMedia(mediaObject) {
      this.$set(this.article.medias, this.selectedMediaIndex, mediaObject)
      this.$emit('closeMediaModal')
    }
  },
  mounted() {
    if(this.blogByIdUri !== '' && this.isCreateBlog !== true) {
      this.getBlogByID()
    }
  },
  methods: {
    addMedia() {
      this.article.medias.push({});
    },
    removeMedia(idx) {
      this.article.medias[idx] = {}
    },
    addTag() {
      this.article.tags.push('')
    },
    removeTag(index) {
      this.article.tags.splice(index, 1);
    },
    async createArticle() {
      this.errors = {}
      this.loading = true
      const token = this.token

      const response = await this.$axios.post(this.createBlogUri,
          this.article,
          {
            headers: mediaHeader({token}, this.projectId)
          }).catch((e) => {
        this.loading = false
        if (e.response.data.errors) {
          this.errors = e.response.data.errors
        }
        let errorMessage = e.response.data.error ? `${e.response.data.error}, ${e.response.data.message}` : e.response.data.message
        if (this.nuxtSections) {
          showSectionsToast(this.$toast, 'error', `${e.response.data.error}, ${e.response.data.message}`, e.response.data.options)
        } else {
          this.$toast.show(
              {
                message: errorMessage,
                timeout: 5,
                classToast: 'bg-error',
                classMessage: 'text-white',
              }
          )
        }
      })
      if(response) {
        if (this.nuxtSections) {
          await this.getBlogByID()
          if (this.isEditingMedia) {
            this.$emit('onBlogSelected', this.article)
          }
          showSectionsToast(this.$toast, 'success', this.$t(this.mediaTranslationPrefix + 'blogs.blogCreated'))
        } else {
          this.$toast.show(
              {
                message: this.$t(this.mediaTranslationPrefix + 'blogs.blogCreated'),
                classToast: 'bg-Blue',
                classMessage: 'text-white',
              }
          )
        }
      }
      this.loading = false
    },
    async getBlogByID() {
      this.loading = true
      const token = this.token
      const response = await this.$axios.get(this.blogByIdUri + this.blogId,
        {
          headers: mediaHeader({token}, this.projectId)
        }).catch((e) => {
        this.loading = false
        if (this.nuxtSections) {
          showSectionsToast(this.$toast, 'error', e.response.data.message)
        } else {
          this.$toast.show(
            {
              message: e.response.data.message,
              timeout: 5,
              classToast: 'bg-error',
              classMessage: 'text-white',
            }
          )
        }
        this.backClicked()
      })
      if(response && response.data) {
        this.media = response.data
        if(this.media.title === "null") this.media.title = ""
        if(this.media.seo_tag === "null") this.media.seo_tag = ""
        this.privateStatus = this.media.private_status
        this.lockedStatus = this.media.locked_status
        this.popupContent = this.media.meta
        if (this.privateStatus === 'private' && this.media.author === this.sectionsUserIdProp) {
          this.getMediaImage(this.media.files[0].url)
        }
        if (this.nuxtSections && this.mediaIdEditing && this.mediaIdEditing !== '' && this.mediaIdEditing === this.media.id) {
          this.isEditingMedia = true
        }
      }
      this.loading = false
    },
    async updateMediaByID() {
      this.loading = true
      const token = this.token

      const data = new FormData();
      if(this.file) {
        data.append('files[1][file]', this.file);
        data.append('type', this.file.type && this.file.type.includes('image') ? 'image' : 'document');
      }
      if(this.media.title && this.media.title !== '') data.append('title', this.media.title);
      if(this.media.seo_tag && this.media.seo_tag !== '') data.append('seo_tag', this.media.seo_tag);
      data.append('private_status', this.media.private_status);
      data.append('locked_status', this.media.locked_status);

      const response = await this.$axios.put(this.blogByIdUri + this.blogId,
        data,
        {
          headers: mediaHeader({token}, this.projectId)
        }).catch((e) => {
        this.loading = false
        let errorMessage = ''
        if (e.response.data.options) {
          if (this.boUsage === true) {
            errorMessage = `<a href='/admin${e.response.data.options.link.path}' >${e.response.data.error}, ${e.response.data.message}</a>`
          } else {
            errorMessage = `<a href='${e.response.data.options.link.root}${e.response.data.options.link.path}' target=\\'_blank\\'>${e.response.data.error}, ${e.response.data.message}</a>`
          }
        } else if (e.response.data.errors) {
          errorMessage = e.response.data.errors.files[0]
        } else {
          errorMessage = e.response.data.error ? `${e.response.data.error}, ${e.response.data.message}` : e.response.data.message
        }
          if (this.nuxtSections) {
            showSectionsToast(this.$toast, 'error', `${e.response.data.error}, ${e.response.data.message}`, e.response.data.options)
          } else {
            this.$toast.show(
              {
                message: errorMessage,
                timeout: 5,
                classToast: 'bg-error',
                classMessage: 'text-white',
              }
            )
          }
      })
      if(response) {
        if (this.nuxtSections) {
          await this.getBlogByID()
          if (this.isEditingMedia) {
            this.$emit('onBlogSelected', this.media)
          }
          showSectionsToast(this.$toast, 'success', this.$t(this.mediaTranslationPrefix + 'mediaUpdated'))
        } else {
          this.$toast.show(
            {
              message: this.$t(this.mediaTranslationPrefix + 'mediaUpdated'),
              classToast: 'bg-Blue',
              classMessage: 'text-white',
            }
          )
        }
      }
      this.loading = false
    },
    async deleteMediaByID() {
      if(this.blogByIdUri !== '') {
        this.loading = true
        const token = this.token
        const response = await this.$axios.delete(this.blogByIdUri + this.blogId,
          {
            headers: mediaHeader({token}, this.projectId)
          })
        if (this.nuxtSections) {
          showSectionsToast(this.$toast, 'success', response.data.message)
        } else {
          this.$toast.show(
            {
              message: response.data.message,
              classToast: 'bg-Blue',
              classMessage: 'text-white',
            }
          )
        }
        this.loading = false
        if (this.blogsPath) {
          this.$router.push(this.localePath({path: this.blogsPath}))
        } else this.$emit('updateBlogsComponent', {name: 'BlogsListBlogs', appliedFilters: this.appliedFilters})
      }
    },
    backClicked() {
      this.isEditingMedia = false
      if (this.blogsPath) {
        this.$router.push(this.localePath({path: this.blogsPath, query: {filters: this.$route.query.filters}}))
      } else this.$emit('updateBlogsComponent', {name: 'BlogsListBlogs', appliedFilters: this.appliedFilters})
    },
    async getAllArticles() {
      this.loading = true
      const token = this.token

      const response = await this.$axios.post(this.blogsUri,
          {},
          {
            headers: mediaHeader({}, this.projectId)
          })
      this.filterMap.suggested = []
      response.data.data.forEach((article) => {
        this.filterMap.suggested.push(
            {
              key: article.id.toString(),
              translation: article.title
            }
        )
      })
      this.loading = false
    }
  }
}
</script>

<style scoped>
.bg-mediaUnLocked {
  background-color: #DDEBFF;
}
.bg-mediaLocked {
  background-color: #FFE5DD;
}
</style>
