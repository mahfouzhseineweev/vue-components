<template>
  <div class="mt-4">

    <div class="flex w-full justify-between pr-4">

      <div class="flex pl-16">
        <MainFilter :filters-query="filtersQuery" :add-filter-label="$t(mediaTranslationPrefix + 'table.addFilter')" :clear-filters-label="$t(mediaTranslationPrefix + 'table.clearFilters')" :apply-filter-label="$t(mediaTranslationPrefix + 'table.applyFilters')" :filtered-values-style="'color: white; background: #03B1C7; padding: 5px 15px; margin: 15px 5px 0 0; border-radius: 10px; position: relative; display: flex;'" :filter-icon-icomoon="'icon-filterIcon'" :filter-icon-style="''" :main-filter-style="'flex items-center pl-2 mr-6 ml-2 border border-FieldGray rounded-xl h-48px w-284px focus:outline-none'" :select-style="'h-35px w-220px ml-8'" :filter-select-default="$t(mediaTranslationPrefix + 'selectFilter')" :filter-by-text="$t(mediaTranslationPrefix + 'filterMedias')" :clear-filters="filterClear" :sub-filter-style="'flex items-center pl-2 mr-6 ml-2 border border-FieldGray rounded-xl h-48px w-244px focus:outline-none'" :input-style="'py-4 pl-6 ml-2 pr-3.5 border border-FieldGray rounded-xl h-48px w-220px focus:outline-none'" :filter-options="filterOptions" :filter_map="filterMap" :emit-all="false" :alter-value="updateFilterValues" :main-filter-options="mainFilterOptions" :multi-select-placeholder="multiSelectPlaceholder" :single-select-filter-options="singleSelectFilterOptions" :multi-select-filter-options="multiSelectFilterOptions" @getFilter = "getFilter" @remove_filter="removeFilter" @clearFilters="clearFilters" @apply_filter="filterMedias" />
      </div>
      <Buttons v-if="showCreateMediaButton" :button-text="$t(mediaTranslationPrefix + 'createNew')" :button-style="createButtonsStyle" :with-icon="false" :submit-function="openCreateMedia" />

    </div>

    <div v-if="mediaResponse.length !== 0">
      <div class="flex pl-16 py-8">
        <Folder :all="true" :medias="allMedias" :total-label="$t(mediaTranslationPrefix + 'total')" :category-label="$t(mediaTranslationPrefix + 'category')" :category-value="$t(mediaTranslationPrefix + 'all')" :all-text="$t(mediaTranslationPrefix + 'all')" :total-value="allMedias.length.toString()" folder-style="font-size: 185px" :media-style="'rounded-full ml-2 h-40px w-40px'" />
        <Folder v-if="imageMedias.length !== 0" :medias="imageMedias" :total-label="$t(mediaTranslationPrefix + 'total')" :category-label="$t(mediaTranslationPrefix + 'category')" :category-value="$t(mediaTranslationPrefix + 'images')" :total-value="imageMedias.length.toString()" class="px-16" folder-style="font-size: 185px" :media-style="'rounded-full ml-2 h-40px w-40px'" />
        <Folder v-if="videoMedias.length !== 0" :medias="videoMedias" :total-label="$t(mediaTranslationPrefix + 'total')" :category-label="$t(mediaTranslationPrefix + 'category')" :category-value="$t(mediaTranslationPrefix + 'videos')" :total-value="videoMedias.length.toString()" :category-icon="'icon-play pr-2'" folder-style="font-size: 185px" :media-style="'rounded-full ml-2 h-40px w-40px'" />
      </div>

      <div class="flex pl-16 text-FieldGray pt-2">
        {{ mediaResponse.length + ` ${$t(mediaTranslationPrefix + 'of')} ` + totalMedias + ` ${$t(mediaTranslationPrefix + 'medias')} ` }}
      </div>

      <div class="pl-16 py-8 flex flex-wrap">
        <div v-for="media in mediaResponse" :key="`media--${media.id}`" class="m-2">
          <Card :copy-link-label="$t(mediaTranslationPrefix + 'copyLink')" :size-label="$t(mediaTranslationPrefix + 'size')" :content-label="$t(mediaTranslationPrefix + 'contentUsing')" :locked="media.locked_status !== 'unlocked'" :hidden="media.private_status !== 'public'" :media-src="media.files[0].url" :media-title="media.title && media.title !== '' && media.title !== 'null' ? media.title : media.files[0].filename" :media-title-style="'w-200px overflow-hidden text-ellipsis white whitespace-nowrap'" :media-author="media.meta.author_name ? $t(mediaTranslationPrefix + 'by') + media.meta.author_name : ''" :contentvalue="media.number_of_contents.toString()" :hidden-media-src="'icon-alert text-4xl'" :hidden-container-style="'background: #EDEDED'" :hidden-message="$t(mediaTranslationPrefix + 'previewNotAvailable')" :is-author="media.author === sectionsUserId" :size-value="media.files[0].size > Math.pow(10, 6) ? `${(media.files[0].size * Math.pow(10, -6)).toFixed(2)} MB` : `${(media.files[0].size * Math.pow(10, -3)).toFixed(2)} KB`" :with-duration="media.type !== 'image'" :copy-link="() => copyMediaLink(media.files[0].url)" :open-media="() => openMedia(media.id)" />
        </div>
      </div>

      <a v-if="mediaResponse.length !== totalMedias" class="flex justify-center text-Blue underline mb-16 cursor-pointer" @click="seeMoreMedias">{{ $t(mediaTranslationPrefix + 'seeMore') }}</a>

    </div>
    <div v-else-if="!loading" class="text-FieldGray p-16">{{ $t(mediaTranslationPrefix + 'noMediasFound') }}</div>

    <AnimatedLoading :loading="loading" :animated-loading-icon="require('../../assets/images/loading_animated.svg')" />
  </div>
</template>

<script>
import MainFilter from "../MainFilter";
import AnimatedLoading from "../AnimatedLoading";
import Buttons from "../Buttons";
import Folder from "./Folder";
import Card from "./Card";
import {mediaHeader} from "./medias";

export default {
  name: "Medias",
  head() {
    return {
      title: "bo - Medias",
    }
  },
  components: {
    MainFilter,
    Folder,
    Card,
    AnimatedLoading,
    Buttons
  },
  props: {
    mediaUriProp: {
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
    mediaTranslationPrefix: {
      type: String,
      default: ""
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
    multiSelectPlaceholder: {
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
    mainFilterOptions: {
      type: Object,
      default() {
        return {
          selectWrapperStyle:  'w-max',
          selectStyle:  'default-select-style-chooser relative',
          labelStyle:  'text-md font-base mr-2 mb-1',
          labelInsideStyle:  'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
          labelInsideDefaultStyle:  'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
          labelPaddingWithIcon:  'left-12',
          labelPadding:  'left-3',
          selectErrorClass:  'select-error-class',
          selectIconClass:  'select-icon-class',
          labelInsideClass:  'label-inside-class',
          trackBy:  '',
          focused:  false,
          filterDisabled:  false,
          multiple:  false,
          closeOnSelect:  true,
          preserveSearch:  false,
          preselectFirst:  false,
          clearOnSelect:  false,
          multipleSelection:  false,
          labelOutside:  true,
          mainFilter:  '',
          selectPlaceholder:  '',
          filterLabelProp:  'value',
          filterIconIcomoon:  'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
          focusStyle:  'border border-Blue rounded-xl',
          focusMarginStyle:  'px-0.5 py-0.5',
          filterClearable:  false,
          filterSearchable:  false,
          errorOccurred:  false,
          withIcon:  true,
        }
      }
    },
    singleSelectFilterOptions: {
      type: Object,
      default() {
        return {
          selectLabel: '',
          selectWrapperStyle:  'w-max',
          selectStyle:  'default-select-style-chooser relative',
          labelStyle:  'text-md font-base mr-2 mb-1',
          labelInsideStyle:  'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
          labelInsideDefaultStyle:  'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
          labelPaddingWithIcon:  'left-12',
          labelPadding:  'left-3',
          selectErrorClass:  'select-error-class',
          selectIconClass:  'select-icon-class',
          labelInsideClass:  'label-inside-class',
          trackBy:  '',
          focused:  false,
          filterDisabled:  false,
          multiple:  false,
          closeOnSelect:  true,
          preserveSearch:  false,
          preselectFirst:  false,
          clearOnSelect:  false,
          multipleSelection:  false,
          labelOutside:  true,
          mainFilter:  '',
          selectPlaceholder:  '',
          filterLabelProp:  'translation',
          filterIconIcomoon:  'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
          focusStyle:  'border border-Blue rounded-xl',
          focusMarginStyle:  'px-0.5 py-0.5',
          filterClearable:  false,
          filterSearchable:  false,
          errorOccurred:  false,
          withIcon:  false,
        }
      }
    },
    multiSelectFilterOptions: {
      type: Object,
      default() {
        return {
          selectLabel: '',
          selectWrapperStyle:  'w-max',
          selectStyle:  'default-select-style-chooser relative',
          labelStyle:  'text-md font-base mr-2 mb-1',
          labelInsideStyle:  'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
          labelInsideDefaultStyle:  'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
          labelPaddingWithIcon:  'left-12',
          labelPadding:  'left-3',
          selectErrorClass:  'select-error-class',
          selectIconClass:  'select-icon-class',
          labelInsideClass:  'label-inside-class',
          trackBy:  '',
          focused:  false,
          filterDisabled:  false,
          multiple:  false,
          closeOnSelect:  true,
          preserveSearch:  true,
          preselectFirst:  true,
          clearOnSelect:  false,
          multipleSelection:  false,
          labelOutside:  true,
          mainFilter:  '',
          selectPlaceholder:  '',
          filterLabelProp:  'value',
          filterIconIcomoon:  'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
          focusStyle:  'border border-Blue rounded-xl',
          focusMarginStyle:  'px-0.5 py-0.5',
          filterClearable:  true,
          filterSearchable:  true,
          errorOccurred:  false,
          withIcon:  false,
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      mediaUri: '',
      authorsUri: '',
      projectId: '',
      token: '',
      mediaResponse: [],
      allMedias: [],
      imageMedias: [],
      videoMedias: [],
      showMoreIndex: 0,
      filterClear: false,
      filterOptions: [
        {key: 'All', value: this.$t(this.mediaTranslationPrefix + 'selectFilter')},
        {key: 'title', value: this.$t(this.mediaTranslationPrefix + 'filterOptions.title')},
        {key: 'author', value: this.$t(this.mediaTranslationPrefix + 'filterOptions.createdBy')},
        {key: 'number_of_contents', value: this.$t(this.mediaTranslationPrefix + 'filterOptions.contentsNumber')},
        {key: 'private_status', value: this.$t(this.mediaTranslationPrefix + 'filterOptions.privateStatus')},
        {key: 'locked_status', value: this.$t(this.mediaTranslationPrefix + 'filterOptions.lockedStatus')}
      ],
      filterMap: {
        All: { key: 'All', size: 3 },
        title: {
          title: this.$t(this.mediaTranslationPrefix + 'filterOptions.title'),
          key: 'title',
          size: 5,
          type: 'text'
        },
        author: {
          title: this.$t(this.mediaTranslationPrefix + 'filterOptions.createdBy'),
          key: 'author',
          size: 5,
          type: 'multiSelect',
          multiSelectLabel: 'translation',
          multiSelectKey: 'key',
          multipleSelect: false,
          selectPlaceholder: this.$t(this.mediaTranslationPrefix + 'selectUser'),
          filterOptions: []
        },
        number_of_contents: {
          title: this.$t(this.mediaTranslationPrefix + 'filterOptions.contentsNumber'),
          key: 'number_of_contents',
          size: 5,
          type: 'text'
        },
        private_status: {
          title: this.$t(this.mediaTranslationPrefix + 'filterOptions.privateStatus'),
          key: 'private_status',
          size: 5,
          type: 'select',
          selectPlaceholder: this.$t(this.mediaTranslationPrefix + 'filterOptions.selectStatus'),
          options: [{key: 'public', translation: this.$t(this.mediaTranslationPrefix + 'public')},{key: 'private', translation: this.$t(this.mediaTranslationPrefix + 'private')}]
        },
        locked_status: {
          title: this.$t(this.mediaTranslationPrefix + 'filterOptions.lockedStatus'),
          key: 'locked_status',
          size: 5,
          type: 'select',
          selectPlaceholder: this.$t(this.mediaTranslationPrefix + 'filterOptions.selectStatus'),
          options: [{key: 'locked', translation: this.$t(this.mediaTranslationPrefix + 'locked')},{key: 'unlocked', translation: this.$t(this.mediaTranslationPrefix + 'unlocked')}]
        }
      },
      createButtonsStyle: "h-53px py-3.5 px-8 text-white rounded-xl bg-Blue hover:bg-white hover:text-Blue border border-Blue hover:border-Blue",
      payloadData: {
        filters: [],
        sort: {
          inserted_at: "desc"
        },
        page: 1,
        per_page: 9
      },
      totalMedias: 0,
      currentPage: 1,
      pageNumber: 1,
      sectionsUserId: '',
      accessLimitedVal: false,
      filtersQuery: ''
    }
  },
  computed: {
    totalPages() {
      if (this.totalMedias === 0) {
        return 1
      } else {
        return Math.ceil(this.totalMedias / this.payloadData.per_page)
      }
    },
  },
  watch: {
    accessLimited: {
      handler() {
        this.accessLimitedVal = this.accessLimited
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
    mediaUriProp: {
      handler(val) {
        this.mediaUri = val
        if(this.$route.query.filters && this.$route.query.filters !== "") {
          this.filterMedias(JSON.parse(this.$route.query.filters))
        } else if (val) this.getAllMedias()
      },
      deep: true,
      immediate: true
    },
    authorsUriProp: {
      handler(val) {
        this.authorsUri = val
        if (val) this.getAuthors()
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
    mediaResponseProp: {
      handler(res) {
        if(res.result) {
          this.mediaResponse = res.result
          this.totalMedias = res.total

          this.allMedias = []
          this.imageMedias = []
          this.videoMedias = []
          res.result.forEach((media) => {
            this.allMedias.push(media.files[0])
            if(media.type === 'image') {
              this.imageMedias.push(media.files[0])
            } else if(media.type === 'video') {
              this.videoMedias.push(media.files[0])
            }
          })
        }
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    async getAllMedias() {
      this.loading = true
      const token = this.token
      const response = await this.$axios.post(this.mediaUri,
        this.payloadData,
        {
        headers: mediaHeader({token}, this.projectId)
      })

      this.mediaResponse = response.data.result
      this.totalMedias = response.data.total

      this.allMedias = []
      this.imageMedias = []
      this.videoMedias = []
      response.data.result.forEach((media) => {
        this.allMedias.push(media.files[0])
        if(media.type === 'image') {
          this.imageMedias.push(media.files[0])
        } else if(media.type === 'video') {
          this.videoMedias.push(media.files[0])
        }
      })
      this.$nuxt.$emit('setModel')
      this.loading = false
    },
    seeMoreMedias() {
      if(this.mediaUri !== '') {
        this.payloadData.per_page += 9
        this.getAllMedias()}
    },
    async getAuthors() {
      this.loading = true
      const token = this.token
      const response = await this.$axios.get(this.authorsUri,
        {
        headers: mediaHeader({token}, this.projectId)
      })
      response.data.data.forEach((project) => {
        this.filterMap.author.filterOptions.push(
          {
            key: project.id,
            translation: project.full_name ? project.full_name + ` (${project.id})` : `(${project.id})`
          }
        )
      })
      this.loading = false
    },
    copyMediaLink(link) {
      this.$copyText(link).then(function (e) {})
    },
    getFilter(filter) {

    },
    filterMedias(filter) {
      this.filtersQuery = JSON.stringify(filter)
      this.$router.push(this.localePath({path: this.mediasPath, query: {filters: this.filtersQuery}}))
      this.loading = true
      for(const i in filter) {
        if(this.payloadData.filters.findIndex(x => x.key === filter[i].key) === -1) {
          this.payloadData.filters.push({
            key: filter[i].key,
            value: filter[i].key === 'number_of_contents' ? parseInt(filter[i].value) : filter[i].key === "author" ? filter[i].value.substring(
              filter[i].value.indexOf("(") + 1,
              filter[i].value.lastIndexOf(")")
            ) : filter[i].value
          })
        } else {
          this.payloadData.filters[i].value = filter[i].key === 'number_of_contents' ? parseInt(filter[i].value) : filter[i].key === "author" ? filter[i].value.substring(
            filter[i].value.indexOf("(") + 1,
            filter[i].value.lastIndexOf(")")
          ) : filter[i].value
        }
      }
      if(this.mediaUri !== '') {
        this.getAllMedias()
      }
    },
    removeFilter(i, item){
      if (this.payloadData.filters.length !== 1) {
        this.payloadData.filters = this.payloadData.filters.filter(object => object.key !== this.payloadData.filters[i].key).slice()
        if(this.mediaUri !== '') {
          this.getAllMedias()
        }
      } else if(this.mediaUri !== '') {
        this.getAllMedias()
      }
      try {
        const filtersQuery = JSON.stringify(JSON.parse(this.filtersQuery).filter(filter => filter.key !== item.key))
        this.$router.push(this.localePath({ path: this.mediasPath , query: {filters: filtersQuery} }))
      } catch {}
    },
    clearFilters() {
      this.payloadData.filters.splice(0)
      this.filterClear === false ? this.filterClear = true : this.filterClear = false
      if(this.mediaUri !== '') {
        this.getAllMedias()
        this.$router.push(this.localePath({ path: this.mediasPath }))
      }
    },
    openMedia(mediaID) {
      if(this.editMediaPath) {
        this.$router.push(this.localePath({path: this.editMediaPath, query: {id: mediaID, filters: this.filtersQuery}}))
      } else {
        this.$emit('updateMediaComponent', {name: 'MediaEditMedia', mediaId: mediaID})
      }
    },
    setPage(pageNumber) {
      this.currentPage = pageNumber
      this.pageNumber = pageNumber
      this.payloadData.page = (pageNumber - 1) * this.payloadData.per_page
      this.getAllMedias()
    },
    handlePageChange(e) {
      if (e.key === 'Enter') {
        if(this.pageNumber >= 1 && this.pageNumber <= this.totalPages) {
          this.currentPage = this.pageNumber
          this.payloadData.page = (this.pageNumber - 1) * this.payloadData.per_page
          this.getAllMedias()
        }
      }
    },
    openCreateMedia() {
      if (this.createMediaPath) {
        this.$router.push(this.localePath({path: this.createMediaPath}))
      } else this.$emit('updateMediaComponent', {name: 'MediaCreateMedia'})
    },
    updateFilterValues(value) {
      if(value === 'public' || value === 'private' || value === 'locked' || value === 'unlocked') {
        return this.$t(value)
      } else return value
    }
  }
}
</script>

<style>
.text-ellipsis {
  text-overflow: ellipsis !important;
}
</style>
