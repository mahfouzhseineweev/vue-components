import Card from './blogs/Card.vue';

export default {
  component: Card,
  title: 'Components/Blogs/Card'
};

const Template = (args, { argTypes }) => ({
  components: { Card },
  setup() {
    return { args };
  },
  props: Object.keys(argTypes),
  template: '<Card v-bind="$props" />',
});


export const Primary = Template.bind({});

