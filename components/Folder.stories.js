import Folder from './media/Folder.vue';

export default {
  component: Folder,
  title: 'Components/Media/Folder',
  args: {
    medias: [
      {
        url: require('~/assets/images/temp1.png')
      },
      {
        url: require('~/assets/images/temp1.png')
      },
      {
        url: require('~/assets/images/temp1.png')
      },
      {
        url: require('~/assets/images/temp1.png')
      },
      {
        url: require('~/assets/images/temp1.png')
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
  template: '<Folder v-bind="$props" />',
});


export const Primary = Template.bind({});

