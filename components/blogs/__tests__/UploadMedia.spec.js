import { shallowMount } from '@vue/test-utils';
import UploadMedia from '@/components/UploadMedia.vue'; // adjust the import path if needed
import IconsEmptyImage from '@/components/icons/EmptyImage.vue';
import IconsMediaDocument from '@/components/icons/mediaDocument.vue';

describe('UploadMedia.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(UploadMedia, {
      mocks: {
        ...global.mocks,
        $t: jest.fn((v) => v)
      },
      propsData: {
        mediaLabel: 'Test Media Label',
        uploadText: 'Upload Media',
        changeText: 'Change Media',
        seoTag: 'SEO tag: ',
        isDocument: false,
        media: []
      }
    });
  });

  it('renders with no media', () => {
    const emptyImage = wrapper.findComponent(IconsEmptyImage);
    expect(emptyImage.exists()).toBe(true);
    const uploadText = wrapper.find('.section-module-upload-media-upload-text');
    expect(uploadText.text()).toBe('Upload Media');
  });

  it('renders image when media is provided', async () => {
    const media = [{ url: 'https://example.com/image.jpg', seo_tag: 'Image SEO' }];
    await wrapper.setProps({ media });
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe(media[0].url);
    expect(img.attributes('alt')).toBe(media[0].seo_tag);

    const seoTag = wrapper.find('.section-module-upload-media-seo');
    expect(seoTag.exists()).toBe(true);
    expect(seoTag.text()).toBe('SEO tag: Image SEO');
  });

  it('renders document icon when isDocument is true', async () => {
    const media = [{ url: 'url', seo_tag: 'Document SEO' }];
    await wrapper.setProps({ media, isDocument: true });
    const documentIcon = wrapper.findComponent(IconsMediaDocument);
    expect(documentIcon.exists()).toBe(true);
  });

  it('emits "uploadContainerClicked" when container is clicked', async () => {
    await wrapper.find('.section-module-upload-media-white-container').trigger('click');
    expect(wrapper.emitted().uploadContainerClicked).toBeTruthy();
  });

  it('emits "removeUploadedImage" when remove button is clicked', async () => {
    await wrapper.setProps({
      media: [{ url: 'https://example.com/image.jpg', seo_tag: 'Image SEO' }]
    });
    await wrapper.find('.section-module-upload-media-cross').trigger('click');
    expect(wrapper.emitted().removeUploadedImage).toBeTruthy();
  });

  it('renders the media label correctly', () => {
    const label = wrapper.find('.section-module-upload-media-label');
    expect(label.text()).toBe('Test Media Label');
  });

  it('displays the change text if media is present', async () => {
    const media = [{ url: 'https://example.com/image.jpg', seo_tag: 'Image SEO' }];
    await wrapper.setProps({ media });
    const uploadText = wrapper.find('.section-module-upload-media-upload-text');
    expect(uploadText.text()).toBe('Change Media');
  });
});
