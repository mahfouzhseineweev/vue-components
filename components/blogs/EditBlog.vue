<template>
  <div class="flex flex-col h-full justify-start">

    <div class="flex flex-row gap-4 items-center">
      <div class="cursor-pointer text-4xl text-Blue" :class="nuxtSections ? 'fixed top-3 left-12' : 'pl-8'" @click="backClicked">
        {{ backLabel }}
      </div>
      <div class="text-2xl">
        {{ computedDraft }}
      </div>
    </div>

    <MediaComponent ref="sectionsMediaComponent" :auth-token="token" :server-url="serverUrl" :project-id="projectId" :sections-user-id="blogsUserId" :selected-media-id="$route.query.id" @emittedMedia="(media) => selectedMedia = media"></MediaComponent>

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
        <div>
          <Inputs
            id="article-type"
            :input-model="article.type"
            :tout-appareil="false"
            :active="true"
            :placeholder="$t(mediaTranslationPrefix + 'blogs.type')"
            @input="(newVal) => {article.type = newVal}"
          />
          <span v-if="errors.type && errors.type[0]" class="text-center text-error text-sm pt-4">{{ errors.type[0] }}</span>
        </div>
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
                :active="false"
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
        <div v-if="isCreateBlog !== true">
          <Inputs
            id="article-author"
            :input-model="authorName"
            :tout-appareil="false"
            :active="false"
            :placeholder="$t(mediaTranslationPrefix + 'blogs.authorName')"
          />
        </div>
<!--        <div id="article-tags" class="flex flex-col gap-2">-->
<!--          <div class="text-sm">{{ $t(mediaTranslationPrefix + 'blogs.tags') }}</div>-->
<!--          <div v-for="(tag,k) in article.tags" :key="k" class="flex flex-col mb-4">-->
<!--            <div class="flex">-->
<!--              <Inputs-->
<!--                  :id="`article-tag-${k}`"-->
<!--                  :input-model="tag"-->
<!--                  :tout-appareil="false"-->
<!--                  :active="true"-->
<!--                  :placeholder="`${$t(mediaTranslationPrefix + 'blogs.tag')} #${k+1}`"-->
<!--                  @input="(newVal) => {$set(article.tags, k, newVal);}"-->
<!--              />-->
<!--              <span class="flex flex-row pl-2 items-center">-->
<!--              <span v-show="k || ( !k && article.tags.length > 1)" id="remove-project-url" class="icon-remove cursor-pointer text-2xl" @click="removeTag(k)"></span>-->
<!--              <span v-show="k === article.tags.length-1" id="add-project-url" class="icon-add cursor-pointer text-2xl" @click="addTag()"></span>-->
<!--            </span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
        <fieldset class="fieldSetStyle border border-solid border-gray-300 p-3 mt-2">
          <legend class="w-auto px-16">{{ $t(mediaTranslationPrefix + 'blogs.medias') }}</legend>
          <div v-for="(object, index) in article.medias" :key="`media-upload-${index}`" class="mb-4">
            <div class="flex flex-row items-center">
              <UploadMedia :media-label="$t(mediaTranslationPrefix + 'blogs.media')" :upload-text="$t(mediaTranslationPrefix + 'blogs.uploadMedia')" :change-text="$t(mediaTranslationPrefix + 'blogs.changeMedia')" :seo-tag="$t(mediaTranslationPrefix + 'blogs.seoTag')" :media="object && Object.keys(object).length > 0 && object.files && object.files[0] ? [{...object, url: object.files[0].url}] : []" @uploadContainerClicked="selectedMediaIndex = index; $refs.sectionsMediaComponent.openModal(object && Object.keys(object).length > 0 ? object.id : null)" @removeUploadedImage="removeMedia(index)" />
              <div @click="removeMedia(index)">
                <IconsCross v-if="Object.keys(object).length === 0 || (object.files && object.files[0] && object.files[0].url === '')" alt="" class="section-module-upload-media-cross"/>
              </div>
            </div>
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
        <div>
          <div class="text-sm mb-2">{{ $t(mediaTranslationPrefix + 'blogs.categories') }}</div>
          <AutoComplete
            :main-filter="article.categories"
            :select-placeholder="$t(mediaTranslationPrefix + 'blogs.selectCategories')"
            :filter-label-prop="'translation'"
            :reduce="(option) => option.key"
            :filter-options="filterMap.categories"
            :filter-searchable="false"
            :close-on-select="false"
            :track-by="'key'"
            :preselect-first="true"
            :multiple="true"
            @itemSelected="(val) => {article.categories = val}"
          ></AutoComplete>
        </div>
        <div>
          <div class="text-sm mb-2">{{ $t(mediaTranslationPrefix + 'blogs.suggestedArticles') }}</div>
          <AutoComplete
            :main-filter="article.suggested"
            :select-placeholder="$t(mediaTranslationPrefix + 'blogs.selectArticles')"
            :filter-label-prop="'translation'"
            :reduce="(option) => option.key"
            :filter-options="filterMap.suggested"
            :filter-searchable="false"
            :close-on-select="false"
            :track-by="'key'"
            :preselect-first="true"
            :multiple="true"
            @itemSelected="(val) => {article.suggested = val}"
          ></AutoComplete>
        </div>
        <div v-if="blogsUri !== '' && isCreateBlog !== true" class="flex flex-row gap-2 text-sm">
          <div>{{ $t(mediaTranslationPrefix + 'filterOptions.publishedStatus') }}: </div>
          <div>{{ article.published ? $t(mediaTranslationPrefix + 'published') : $t(mediaTranslationPrefix + 'notPublished') }} </div>
        </div>


      </div>

    </div>

    <div class="sticky bottom-0 py-2 m-4 rounded-md shadow">

      <div class="flex w-full items-center justify-end">
        <div v-if="blogsUri !== '' && isCreateBlog !== true" class="cursor-pointer flex items-center" @click="showPopup = true">
          <div class="text-error text-sm md:text-lg">{{ $t(mediaTranslationPrefix + 'blogs.deleteArticle') }}</div>
          <span class="icon-trashCan2 text-md pb-1 px-2"></span>
        </div>
        <div v-if="blogsUri !== '' && isCreateBlog !== true && (blogsUserRoleProp === 'publisher' || (blogsUserRoleProp === 'admin' && article.published === false))" @click.stop.prevent="publishBlogByID(article.published)">
          <Buttons :button-text="article.published ? $t(mediaTranslationPrefix + 'blogs.unpublish') : $t(mediaTranslationPrefix + 'blogs.publish')" :button-style="saveButtonStyle" class="ml-12" :with-icon="false" />
        </div>
        <div @click.stop.prevent="blogsUri !== '' && isCreateBlog !== true ? updateBlogByID() : createArticle()">
          <Buttons :button-text="$t(mediaTranslationPrefix + 'save')" :button-style="saveButtonStyle" :with-icon="false" />
        </div>
        <div @click.stop.prevent="$emit('onBlogSelected', article)">
          <Buttons v-if="withSelectBlogButton" :button-text="$t(mediaTranslationPrefix + 'selectMedia')" :button-style="selectMediaButtonStyle" :with-icon="false" />
        </div>
      </div>

    </div>

    <AlertPopup :errors-container-style="'mt-10 mb-14 self-center h-auto max-h-72 overflow-y-auto'" :apply-button-text="$t(mediaTranslationPrefix + 'blogs.deleteArticle')" :cancel-button-text="$t(mediaTranslationPrefix + 'blogs.cancel')" :title-delete="$t(mediaTranslationPrefix + 'blogs.deleteArticleMsg')" :show-popup-code="showPopup" :can-be-deleted="true" @cancel="showPopup = false" @apply="deleteBlogByID" />

    <AnimatedLoading :loading="loading" :animated-loading-icon="require('../../assets/images/loading_animated.svg')" />

  </div>
</template>

<script>
import AlertPopup from "../AlertPopup";
import AutoComplete from "../AutoComplete";
import Inputs from "../Inputs";
import Buttons from "../Buttons";
import AnimatedLoading from "../AnimatedLoading";
import HeaderContainer from "../HeaderContainer";
import MediaComponent from "../MediaComponent";
import UploadMedia from "../UploadMedia";
import IconsCross from "../icons/cross.vue";
import {mediaHeader, showSectionsToast} from "../media/medias";
import {scrollToFirstError} from "../../utils/constants";

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
    AutoComplete,
    Inputs,
    Buttons,
    AlertPopup,
    AnimatedLoading,
    MediaComponent,
    UploadMedia,
    IconsCross
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
    blogsUserNameProp: {
      type: String,
      default: ""
    },
    blogsUserRoleProp: {
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
      saveButtonStyle: "py-2.5 px-12 ml-2 mr-2 text-white rounded-xl bg-Blue hover:bg-white hover:text-Blue border border-Blue hover:border-Blue",
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
          unit: "s",
          duration: ""
        },
        // tags: [
        //     ''
        // ],
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
      selectedCategories: [],
      selectedSuggested: [],
      selectedMedia: {},
      selectedMediaIndex: 0,
      errors: {},
      showPopup: false,
      popupContent: '',
      backLabel: '<'
    }
  },
  computed: {
    computedDraft() {
      try {
        if (this.article.draft_of) {
          return this.$t(this.mediaTranslationPrefix + 'blogs.draftOf', {name: `${this.filterMap.suggested.find(bl => bl.key === this.article.draft_of.toString()).translation}`, id: `${this.filterMap.suggested.find(bl => bl.key === this.article.draft_of.toString()).key}`})
        } else {
          return ''
        }
      } catch {
        return ''
      }
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
    blogsUserNameProp: {
      handler(val) {
        this.authorName = val
      },
      deep: true,
      immediate: true
    },
    selectedMedia(mediaObject) {
      this.$set(this.article.medias, this.selectedMediaIndex, mediaObject)
      this.$refs['sectionsMediaComponent'].closeModal()
    }
  },
  mounted() {
    if(this.blogsUri !== '' && this.isCreateBlog !== true) {
      this.getBlogByID()
    }
  },
  methods: {
    addMedia() {
      this.article.medias.push({});
    },
    removeMedia(idx) {
      this.article.medias[idx] = {}
      this.article.medias.splice(idx, 1)
    },
    // addTag() {
    //   this.article.tags.push('')
    // },
    // removeTag(index) {
    //   this.article.tags.splice(index, 1);
    // },
    async createArticle() {
      this.errors = {}
      this.loading = true
      const token = this.token

      const { metadata, author_id, created, draft_of, id, promo_image, promo_video, published, published_date, updated, viewing_time, views, ...articlePayload } = this.article
      const response = await this.$axios.post(this.blogsUri,
        {
          ...articlePayload,
          metadata: {
            ...metadata,
            duration: Number(metadata.duration)
          },
          // tags: articlePayload.tags ? articlePayload.tags.filter(str => str && str.trim()) : []
        },
          {
            headers: mediaHeader({token}, this.projectId)
          }).catch((e) => {
        this.loading = false
        if (e.response.data.errors) {
          this.errors = e.response.data.errors
          scrollToFirstError(this.errors, 'article-')
        }
        let errorMessage = e.response.data.error ? `${e.response.data.error}` : e.response.data.message
        if (this.nuxtSections) {
          showSectionsToast(this.$toast, 'error', `${e.response.data.error}`)
        } else if (errorMessage) {
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
          showSectionsToast(this.$toast, 'success', this.$t(this.mediaTranslationPrefix + 'blogs.articleCreated'))
        } else {
          this.backClicked()
          this.$toast.show(
              {
                message: this.$t(this.mediaTranslationPrefix + 'blogs.articleCreated'),
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
      const response = await this.$axios.get(`${this.blogsUri}/${this.blogId}`,
        {
          headers: mediaHeader({token}, this.projectId)
        }).catch((e) => {
        this.loading = false
        if (this.nuxtSections) {
          showSectionsToast(this.$toast, 'error', e.response.data.message ? e.response.data.message : this.$t(this.mediaTranslationPrefix + 'blogs.articleNotFound'))
        } else {
          this.$toast.show(
            {
              message: e.response.data.message ? e.response.data.message : this.$t(this.mediaTranslationPrefix + 'blogs.articleNotFound'),
              timeout: 5,
              classToast: 'bg-error',
              classMessage: 'text-white',
            }
          )
        }
        this.backClicked()
      })
      if(response && response.data) {
        this.article = [response.data].map(article => {
          article.suggested = article.suggested.map(sug => sug.id.toString())
          article.categories = article.categories.map(cat => cat.id.toString())
          // if (!article.tags || article.tags.length === 0) {
          //   article.tags = [""]
          // }
          if (article.metadata && article.metadata.duration !== null) {
            article.metadata.duration = article.metadata.duration.toString()
          }
          if (article.metadata === null) {
            article.metadata = {
              label: "",
              unit: "s",
              duration: ""
            }
          }
          return article
        })[0]
        this.selectedSuggested = this.article.suggested
        this.selectedCategories = this.article.categories
        if (this.isCreateBlog !== true) {
          this.authorName = response.data.author_id
        }
      }
      this.loading = false
    },
    async updateBlogByID() {
      this.loading = true
      await this.checkCategoriesAndSuggested()
      const token = this.token

      if (this.article.metadata.unit) {
        this.article.metadata.unit = "s"
      }
      const { metadata, categories, suggested, author_id, created, draft_of, id, promo_image, promo_video, published, published_date, updated, viewing_time, views, ...articlePayload } = this.article
      const response = await this.$axios.put(`${this.blogsUri}/${this.blogId}`,
          {
            ...articlePayload,
            metadata: {
              ...metadata,
              duration: Number(metadata.duration)
            },
            categories: categories.filter(item => !this.selectedCategories.includes(item)),
            suggested: suggested.filter(item => !this.selectedSuggested.includes(item)),
            // tags: articlePayload.tags ? articlePayload.tags.filter(str => str && str.trim()) : []
          },
        {
          headers: mediaHeader({token}, this.projectId)
        }).catch((e) => {
        this.loading = false
        if (e.response.data.errors) {
          this.errors = e.response.data.errors
          scrollToFirstError(this.errors, 'article-')
        }
        let errorMessage = e.response.data.error ? `${e.response.data.error}` : e.response.data.message
        if (this.nuxtSections) {
          showSectionsToast(this.$toast, 'error', `${e.response.data.error}`)
        } else if (errorMessage) {
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
          showSectionsToast(this.$toast, 'success', this.$t(this.mediaTranslationPrefix + 'blogs.articleUpdated'))
        } else {
          this.backClicked()
          this.$toast.show(
            {
              message: this.article.published === true ? this.$t(this.mediaTranslationPrefix + 'blogs.draftUpdated', {name: `${this.article.title}`}) : this.$t(this.mediaTranslationPrefix + 'blogs.articleUpdated'),
              classToast: 'bg-Blue',
              classMessage: 'text-white',
            }
          )
        }
      }
      this.loading = false
    },
    async checkCategoriesAndSuggested() {
      const token = this.token
      const removedSuggested = this.selectedSuggested.filter(item => !this.article.suggested.includes(item))
      if (removedSuggested && removedSuggested.length > 0) {
       await this.$axios.delete(`${this.blogsUri}/${this.blogId}/suggested`,
           {
             data: {
            suggested: removedSuggested.map(Number)
          },
             headers: mediaHeader({token}, this.projectId)
           }
        ).catch(() => {
      })
      }
      const removedCategories = this.selectedCategories.filter(item => !this.article.categories.includes(item))
      if (removedCategories && removedCategories.length > 0) {
       await this.$axios.delete(`${this.blogsUri}/${this.blogId}/categories`,
           {
             data: {
            categories: removedCategories.map(Number)
          },
             headers: mediaHeader({token}, this.projectId)
           }
        ).catch(() => {
      })
      }
    },
    async publishBlogByID(status) {
      this.loading = true
      const token = this.token

      const response = await this.$axios.put(status && status === true ? `${this.blogsUri}/${this.blogId}/unpublish` : `${this.blogsUri}/${this.blogId}/publish`,
          {},
        {
          headers: mediaHeader({token}, this.projectId)
        }).catch((e) => {
        this.loading = false
        let errorMessage = ''
        if (e.response.data.errors) {
          errorMessage = e.response.data.errors.files[0]
        } else {
          errorMessage = e.response.data.error ? `${e.response.data.error}` : e.response.data.message
        }
          if (this.nuxtSections) {
            showSectionsToast(this.$toast, 'error', `${e.response.data.error}`)
          } else if (errorMessage) {
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
        this.article.published = response.data.published
        if (this.nuxtSections) {
          showSectionsToast(this.$toast, 'success', this.$t(this.mediaTranslationPrefix + 'blogs.articlePublished'))
        } else {
          this.backClicked()
          this.$toast.show(
            {
              message: this.$t(this.mediaTranslationPrefix + 'blogs.articlePublished'),
              classToast: 'bg-Blue',
              classMessage: 'text-white',
            }
          )
        }
      }
      this.loading = false
    },
    async deleteBlogByID() {
      if(this.blogsUri !== '') {
        this.loading = true
        const token = this.token
        const response = await this.$axios.delete(`${this.blogsUri}/${this.blogId}`,
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
      if (this.blogsPath) {
        this.$router.push(this.localePath({path: this.blogsPath, query: {filters: this.$route.query.filters}}))
      } else this.$emit('updateBlogsComponent', {name: 'BlogsListBlogs', appliedFilters: this.appliedFilters})
    },
    async getAllArticles() {
      this.loading = true
      const token = this.token

      const response = await this.$axios.get(`${this.blogsUri}/author`,
          {
            headers: mediaHeader({token}, this.projectId)
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
