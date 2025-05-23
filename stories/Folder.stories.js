import Folder from '../src/runtime/components/media/Folder.vue';
import temp1 from '../src/runtime/assets/images/temp1.png'

export default {
  component: Folder,
  title: 'Components/Media/Folder',
  args: {
    medias: [
      {
        url: temp1
      },
      {
        url: temp1
      },
      {
        url: temp1
      },
      {
        url: temp1
      },
      {
        url: temp1
      },
    ]
  }
};

const Template = (args, { argTypes }) => ({
  components: { Folder },
  setup() {
    return { args };
  },
  props: Object.keys(argTypes),
  template: '<Folder v-bind="args" />',
});


export const Primary = Template.bind({});

