import Card from '../src/runtime/components/media/Card.vue';

export default {
  title: 'Components/Media/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // Define argTypes if your component has props
  argTypes: {
    // Example prop definitions - adjust based on your Card component
    // title: { control: 'text' },
    // description: { control: 'text' },
    // imageUrl: { control: 'text' },
  },
};

// You can also use the render function if you need more control
export const Primary = {
  args: {
    // Your args here
  },
  render: (args) => ({
    components: { Card },
    setup() {
      return { args };
    },
    template: '<Card v-bind="args" />',
  }),
};