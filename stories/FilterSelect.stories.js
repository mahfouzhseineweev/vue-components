import FilterSelect from '../src/runtime/components/FilterSelect.vue';

export default {
  title: 'Components/Form Components/FilterSelect',
  component: FilterSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // Define argTypes if your component has props
  argTypes: {

  },
};

// You can also use the render function if you need more control
export const Primary = {
  args: {
    filter_map: {
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
        type: 'select',
        options: [{key: 'pending', translation: 'Pending'},{key: 'validated', translation: 'Validated'}]
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
    },
    mainFilterOptions: {
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
    },
    singleSelectFilterOptions: {
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
    },
    multiSelectFilterOptions: {
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
    },
    filterOptions: [
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
  },
  render: (args) => ({
    components: { FilterSelect },
    setup() {
      return { args };
    },
    template: '<FilterSelect v-bind="args" />',
  }),
};