import HeaderContainer from '../src/runtime/components/HeaderContainer.vue';
import Card from "~/src/runtime/components/media/Card.vue";

export default {
  component: HeaderContainer,
  title: 'Components/Media/HeaderContainer',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // Define argTypes if your component has props
  argTypes: {
    items: {
      control: {
        type: 'object' // This tells Storybook to treat it as an editable object/array
      },
      description: 'Array of items with label and value properties',
      table: {
        type: {
          summary: 'Array<{label: string, value: string}>'
        },
        defaultValue: {
          summary: 'Default items array'
        }
      }
    },
  },
};

export const Primary = {
  args: {
    items: [
      {
        label: 'ID:',
        value: '440449594'
      },
      {
        label: 'Creation date:',
        value: '18 March 2020'
      },
      {
        label: 'Created by:',
        value: 'Loreum epsum'
      },
      {
        label: 'Media type:',
        value: 'Image'
      },
    ]
  },
  render: (args) => ({
    components: { HeaderContainer },
    setup() {
      return { args };
    },
    template: '<HeaderContainer v-bind="args" />',
  }),
};