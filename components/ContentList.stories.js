import ContentList from './ContentList.vue';

export default {
  component: ContentList,
  title: 'Components/Media/ContentList'
};

const Template = (args, { argTypes }) => ({
  components: { ContentList },
  setup() {
    return { args };
  },
  props: Object.keys(argTypes),
  template: '<ContentList v-bind="$props" />',
});


export const Primary = Template.bind({});

