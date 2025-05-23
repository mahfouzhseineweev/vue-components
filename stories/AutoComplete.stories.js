import AutoComplete from '../src/runtime/components/AutoComplete.vue';

export default {
  component: AutoComplete,
  title: 'Components/Form Components/AutoComplete',
  args: {
    filterOptions: [
      {
        key: 'All',
        value: 'All'
      },
      {
        key: 'id',
        value: 'id'
      },
      {
        key: 'name',
        value: 'name'
      },
      {
        key: 'title',
        value: 'title'
      },
      {
        key: 'status',
        value: 'status'
      },
      {
        key: 'role',
        value: 'role'
      }
    ]
  }
};

const Template = (args, { argTypes }) => ({
  components: { AutoComplete },
  setup() {
    return { args };
  },
  props: Object.keys(argTypes),
  template: '<AutoComplete v-bind="args" />',
});


export const Primary = Template.bind({});

