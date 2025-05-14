<template>
  <div>
    <div class="flex flex-col sm:flex-row" :class="props.filterContainerStyle">
      <div class="flex-col self-start sm:self-end">
        <LazyGAutoComplete
          :main-filter="mainFilter"
          :select-label="props.filterByText"
          :reduce="val => {return val['key']}"
          :filter-options="props.filterOptions"
          :selectWrapperStyle="props.mainFilterOptions.selectWrapperStyle"
          :selectStyle="props.mainFilterOptions.selectStyle"
          :labelStyle="props.mainFilterOptions.labelStyle"
          :labelInsideStyle="props.mainFilterOptions.labelInsideStyle"
          :labelInsideDefaultStyle="props.mainFilterOptions.labelInsideDefaultStyle"
          :labelPaddingWithIcon="props.mainFilterOptions.labelPaddingWithIcon"
          :labelPadding="props.mainFilterOptions.labelPadding"
          :selectErrorClass="props.mainFilterOptions.selectErrorClass"
          :selectIconClass="props.mainFilterOptions.selectIconClass"
          :labelInsideClass="props.mainFilterOptions.labelInsideClass"
          :trackBy="props.mainFilterOptions.trackBy"
          :focused="props.mainFilterOptions.focused"
          :filterDisabled="filter_val[mainFilter] ? true : props.mainFilterOptions.filterDisabled"
          :multiple="props.mainFilterOptions.multiple"
          :closeOnSelect="props.mainFilterOptions.closeOnSelect"
          :preserveSearch="props.mainFilterOptions.preserveSearch"
          :preselectFirst="props.mainFilterOptions.preselectFirst"
          :clearOnSelect="props.mainFilterOptions.clearOnSelect"
          :multipleSelection="props.mainFilterOptions.multipleSelection"
          :labelOutside="props.mainFilterOptions.labelOutside"
          :selectPlaceholder="props.mainFilterOptions.selectPlaceholder"
          :filterLabelProp="props.mainFilterOptions.filterLabelProp"
          :filterIconIcomoon="props.mainFilterOptions.filterIconIcomoon"
          :focusStyle="props.mainFilterOptions.focusStyle"
          :focusMarginStyle="props.mainFilterOptions.focusMarginStyle"
          :filterClearable="props.mainFilterOptions.filterClearable"
          :filterSearchable="props.mainFilterOptions.filterSearchable"
          :errorOccurred="props.mainFilterOptions.errorOccurred"
          :withIcon="props.mainFilterOptions.withIcon"
          @itemSelected="(item) => {emitFilter(item)}"
        />
      </div>
      <div class="flex-col self-start sm:self-end">
        <div v-if="props.filter_map[mainFilter].type === 'text'">
          <input v-model = "filter_val[mainFilter]"
            type = "text"
            :placeholder = "props.filter_map[mainFilter].placeholder ? props.filter_map[mainFilter].placeholder : capitalize(props.filter_map[mainFilter].title)" :class = "props.inputStyle" @input="emitFilter()" />
          <div v-if="props.filter_map[mainFilter].description" :class="props.filter_map[mainFilter].descriptionStyle ? props.filter_map[mainFilter].descriptionStyle : ''">
            {{ props.filter_map[mainFilter].description }}
          </div>
        </div>

        <div v-if="props.filter_map[mainFilter].type === 'select'">
          <LazyGAutoComplete
            :main-filter="filter_val[mainFilter]"
            :reduce="val => {return val['key']}"
            :filter-options="props.filter_map[mainFilter].options"
            :selectLabel="props.singleSelectFilterOptions.selectLabel"
            :selectWrapperStyle="props.singleSelectFilterOptions.selectWrapperStyle"
            :selectStyle="props.singleSelectFilterOptions.selectStyle"
            :labelStyle="props.singleSelectFilterOptions.labelStyle"
            :labelInsideStyle="props.singleSelectFilterOptions.labelInsideStyle"
            :labelInsideDefaultStyle="props.singleSelectFilterOptions.labelInsideDefaultStyle"
            :labelPaddingWithIcon="props.singleSelectFilterOptions.labelPaddingWithIcon"
            :labelPadding="props.singleSelectFilterOptions.labelPadding"
            :selectErrorClass="props.singleSelectFilterOptions.selectErrorClass"
            :selectIconClass="props.singleSelectFilterOptions.selectIconClass"
            :labelInsideClass="props.singleSelectFilterOptions.labelInsideClass"
            :trackBy="props.singleSelectFilterOptions.trackBy"
            :focused="props.singleSelectFilterOptions.focused"
            :filterDisabled="props.singleSelectFilterOptions.filterDisabled"
            :multiple="props.singleSelectFilterOptions.multiple"
            :closeOnSelect="props.singleSelectFilterOptions.closeOnSelect"
            :preserveSearch="props.singleSelectFilterOptions.preserveSearch"
            :preselectFirst="props.singleSelectFilterOptions.preselectFirst"
            :clearOnSelect="props.singleSelectFilterOptions.clearOnSelect"
            :multipleSelection="props.singleSelectFilterOptions.multipleSelection"
            :labelOutside="props.singleSelectFilterOptions.labelOutside"
            :selectPlaceholder="props.filter_map[mainFilter].selectPlaceholder ? props.filter_map[mainFilter].selectPlaceholder : props.singleSelectFilterOptions.selectPlaceholder"
            :filterLabelProp="props.singleSelectFilterOptions.filterLabelProp"
            :filterIconIcomoon="props.singleSelectFilterOptions.filterIconIcomoon"
            :focusStyle="props.singleSelectFilterOptions.focusStyle"
            :focusMarginStyle="props.singleSelectFilterOptions.focusMarginStyle"
            :filterClearable="props.singleSelectFilterOptions.filterClearable"
            :filterSearchable="props.singleSelectFilterOptions.filterSearchable"
            :errorOccurred="props.singleSelectFilterOptions.errorOccurred"
            :withIcon="props.singleSelectFilterOptions.withIcon"
            @itemSelected="item => {updateFilterValue(item); props.emitAll ? emitFilter() : emit('getFilter', updateFilter())}"
          />
          <div v-if="props.filter_map[mainFilter].description" :class="props.filter_map[mainFilter].descriptionStyle ? props.filter_map[mainFilter].descriptionStyle : ''">
            {{ props.filter_map[mainFilter].description }}
          </div>
        </div>

        <div v-if="props.filter_map[mainFilter].type === 'multiSelect'">
          <LazyGAutoComplete
            :select-style="props.multiSelectStyle"
            :main-filter="filter_val[mainFilter]"
            :selectPlaceholder="props.filter_map[mainFilter].selectPlaceholder ? props.filter_map[mainFilter].selectPlaceholder : props.multiSelectPlaceholder"
            :filter-label-prop="props.filter_map[mainFilter].multiSelectLabel"
            :reduce="props.filter_map[mainFilter].multipleSelect === false ? val => val[props.filter_map[mainFilter].multiSelectLabel] : val => val"
            :filter-options="props.filter_map[mainFilter].filterOptions"
            :multiple="props.filter_map[mainFilter].multipleSelect === false ? false : true"
            :track-by="props.filter_map[mainFilter].multiSelectKey"
            :selectLabel="props.multiSelectFilterOptions.selectLabel"
            :selectWrapperStyle="props.multiSelectFilterOptions.selectWrapperStyle"
            :selectStyle="props.multiSelectFilterOptions.selectStyle"
            :labelStyle="props.multiSelectFilterOptions.labelStyle"
            :labelInsideStyle="props.multiSelectFilterOptions.labelInsideStyle"
            :labelInsideDefaultStyle="props.multiSelectFilterOptions.labelInsideDefaultStyle"
            :labelPaddingWithIcon="props.multiSelectFilterOptions.labelPaddingWithIcon"
            :labelPadding="props.multiSelectFilterOptions.labelPadding"
            :selectErrorClass="props.multiSelectFilterOptions.selectErrorClass"
            :selectIconClass="props.multiSelectFilterOptions.selectIconClass"
            :labelInsideClass="props.multiSelectFilterOptions.labelInsideClass"
            :trackBy="props.multiSelectFilterOptions.trackBy"
            :focused="props.multiSelectFilterOptions.focused"
            :filterDisabled="props.multiSelectFilterOptions.filterDisabled"
            :closeOnSelect="props.multiSelectFilterOptions.closeOnSelect"
            :preserveSearch="props.multiSelectFilterOptions.preserveSearch"
            :preselectFirst="props.multiSelectFilterOptions.preselectFirst"
            :clearOnSelect="props.multiSelectFilterOptions.clearOnSelect"
            :multipleSelection="props.multiSelectFilterOptions.multipleSelection"
            :labelOutside="props.multiSelectFilterOptions.labelOutside"
            :filterIconIcomoon="props.multiSelectFilterOptions.filterIconIcomoon"
            :focusStyle="props.multiSelectFilterOptions.focusStyle"
            :focusMarginStyle="props.multiSelectFilterOptions.focusMarginStyle"
            :filterClearable="props.multiSelectFilterOptions.filterClearable"
            :filterSearchable="props.multiSelectFilterOptions.filterSearchable"
            :errorOccurred="props.multiSelectFilterOptions.errorOccurred"
            :withIcon="props.multiSelectFilterOptions.withIcon"
            @itemSelected="item => {updateFilterValue(item); emit('getFilter', updateFilter()); emit('itemsSelected', filter_val[mainFilter])}"
          />
          <div v-if="props.filter_map[mainFilter].description" :class="props.filter_map[mainFilter].descriptionStyle ? props.filter_map[mainFilter].descriptionStyle : ''">
            {{ props.filter_map[mainFilter].description }}
          </div>
        </div>

        <div v-if="props.filter_map[mainFilter].type === 'range'" class="flex flex-col md:flex-row gap-4 md:gap-0">
          <div>
            <input v-model = "filter_val[props.filter_map[mainFilter].key1]"
                   type = "text"
                   :placeholder = "capitalize(props.filter_map[mainFilter].subTitle1)" :class = "props.inputStyle" @input="emitFilter()" />
            <div v-if="props.filter_map[mainFilter].description1" :class="props.filter_map[mainFilter].descriptionStyle1 ? props.filter_map[mainFilter].descriptionStyle1 : ''">
              {{ props.filter_map[mainFilter].description1 }}
            </div>
          </div>
          <div>
            <input v-model = "filter_val[props.filter_map[mainFilter].key2]"
                   type = "text"
                   :placeholder = "capitalize(props.filter_map[mainFilter].subTitle2)" :class = "props.inputStyle" @input="emitFilter()" />
            <div v-if="props.filter_map[mainFilter].description2" :class="props.filter_map[mainFilter].descriptionStyle2 ? props.filter_map[mainFilter].descriptionStyle2 : ''">
              {{ props.filter_map[mainFilter].description2 }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick ,watch, watchEffect } from '#imports'

const props = defineProps({
  filterOptions: {
    type: Array,
    default() {
      return [
        {
          key: 'All',
          value: 'All'
        },
        {
          key: 'id',
          value: 'ID'
        },
        {
          key: 'name',
          value: 'Name'
        },
        {
          key: 'title',
          value: 'Title'
        },
        {
          key: 'status',
          value: 'Status'
        },
        {
          key: 'statuses',
          value: 'Statuses'
        },
        {
          key: 'role',
          value: 'Role'
        }
      ]
    }
  },
  // eslint-disable-next-line vue/prop-name-casing
  filter_map: {
    type: Object,
    default() {
      return {
        All: { key: 'All', size: 3 },
        id: {
          title: 'ID',
          key: 'id',
          size: 5,
          type: 'text',
        },
        name: {
          title: 'Name',
          key: 'name',
          size: 5,
          type: 'text',
        },
        title: {
          title: 'Title',
          key: 'title',
          size: 5,
          type: 'text',
        },
        status: {
          title: 'Status',
          key: 'status',
          size: 5,
          type: 'text',
        },
        statuses: {
          title: 'Statuses',
          key: 'statuses',
          size: 5,
          type: 'multiSelect',
          multiSelectLabel: 'translation',
          multiSelectKey: 'key',
          multipleSelect: true,
          filterOptions: [
            {
              key: 'id',
              translation: 'ID'
            },
            {
              key: 'name',
              translation: 'Name'
            },
            {
              key: 'title',
              translation: 'Title'
            },
            {
              key: 'status',
              translation: 'Status'
            },
            {
              key: 'role',
              translation: 'Role'
            }
          ]
        },
        role: {
          title: 'Role',
          key: 'role',
          size: 5,
          type: 'text',
        },
      }
    }
  },
  filterByText: {
    type: String,
    default: 'Filter By: '
  },
  filterContainerStyle: {
    type: String,
    default: 'md:items-end gap-4'
  },
  filterByStyle: {
    type: String,
    default: 'pt-3 pr-2'
  },
  filterSelectDefault: {
    type: String,
    default: 'Select Filter'
  },
  filterIconIcomoon: {
    type: String,
    default: 'icon-filterIcon'
  },
  filterIcon: {
    type: String,
    default: ''
  },
  filterIconStyle: {
    type: String,
    default: ''
  },
  mainFilterStyle: {
    type: String,
    default: 'flex items-center pl-2 mr-6 md:ml-2 border border-FieldGray rounded-xl h-[49px] w-[244px] focus:outline-none mb-6'
  },
  inputStyle: {
    type: String,
    default: 'py-4 pl-6 mr-1 border border-FieldGray rounded-xl h-[49px] md:w-[300px] w-[220px] focus:outline-none'
  },
  subFilterStyle: {
    type: String,
    default: 'pl-6 mb-6 mr-6 border border-FieldGray rounded-xl h-[49px] w-full focus:outline-none'
  },
  selectStyle: {
    type: String,
    default: 'h-35px w-180px ml-12'
  },
  multiSelectStyle: {
    type: String,
    default: 'default-select-style-chooser relative'
  },
  multiSelectPlaceholder: {
    type: String,
    default: ''
  },
  emitAll: {
    type: Boolean,
    default: false
  },
  clearFilters: {
    type: Boolean,
    default: false
  },
  mainFilterValue: {
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
        closeOnSelect:  false,
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
        filterClearable:  false,
        filterSearchable:  true,
        errorOccurred:  false,
        withIcon:  false,
      }
    }
  }
})

const emit = defineEmits(['getFilter', 'removeFilter'])

// Reactive state
const filters = ref([{ value: '' }])
const selectedType = ref('')
const mainFilter = ref('All')
const filter_val = ref({})
const value2 = ref('')
const toggleValue = ref('')

const capitalize = (value) => {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Watchers
watch(() => props.clearFilters, () => {
  mainFilter.value = 'All'
  filter_val.value = {}
})

watch(() => props.mainFilterValue, (newValue) => {
  if(newValue.key && newValue.value && newValue.key !== '' && !newValue.value.includes("undefined")) {
    if(!newValue.key.includes("-/-")) {
      nextTick(() => {
        mainFilter.value = newValue.key
        filter_val.value[mainFilter.value] = newValue.value
      })
    }
  }
}, { deep: true, immediate: true })

// Methods
const remove_filter = () => {
  mainFilter.value = 'All'
  emit('removeFilter')
}

const updateFilter = () => {
  return props.filter_map[mainFilter.value].type && props.filter_map[mainFilter.value].type === 'range'
      ? {
        key: props.filter_map[mainFilter.value].key1+'-/-'+props.filter_map[mainFilter.value].key2,
        value: filter_val.value[props.filter_map[mainFilter.value].key1]+'-/-'+filter_val.value[props.filter_map[mainFilter.value].key2],
        title: props.filter_map[mainFilter.value].subTitle1+'-/-'+props.filter_map[mainFilter.value].subTitle2,
        type: 'range'
      }
      : {
        key: props.filter_map[mainFilter.value].key,
        value: filter_val.value[mainFilter.value],
        title: props.filter_map[mainFilter.value].title,
      }
}

const showVal = () => {
  filter_val.value[mainFilter.value] = toggleValue.value
}

const emitFilter = (item) => {
  if(item) mainFilter.value = item
  if(props.emitAll === true) {
    emit('getFilter', {
      all: props.filter_map[mainFilter.value],
      value: props.filter_map[mainFilter.value].type === 'range'
          ? filter_val.value[props.filter_map[mainFilter.value].key1]+'-'+filter_val.value[props.filter_map[mainFilter.value].key2]
          : filter_val.value[mainFilter.value]
    })
  }
}

const updateFilterValue = (val) => {
  filter_val.value[mainFilter.value] = val
}

// Updated hook equivalent
watchEffect(() => {
  let filter = updateFilter()
  if(props.emitAll === false) {
    emit('getFilter', filter)
  }
})

const clearFilterVal = () => {
  filter_val.value = {}
}

defineExpose({
  clearFilterVal
})
</script>

<style scoped>

</style>
