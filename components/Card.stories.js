import Card from './media/Card.vue';

export default {
  component: Card,
  title: 'Components/Media/Card'
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

