import { shallowMount } from "@vue/test-utils";
import EditBlog from "../EditBlog.vue";
import LocaleTranslations from '../LocaleTranslations.vue'; // Update with the actual path
import Inputs from '@/components/Inputs.vue'; // Update with the actual path

jest.mock('vue-quill-editor', () => ({
  name: 'quill-editor',
  render: () => '<div class="wyzywig"></div>',
}));

describe('EditBlog', () => {
  let wrapper;
  const defaultProps = {
    article: {
      default_locale: 'en',
      title: 'Article Title',
      translations: [
        { locale: 'en', title: 'Title of the article' },
        { locale: 'fr', title: 'Titre de l\'article' },
        { locale: 'es', title: 'Título del artículo' },
      ],
    },
    projectLangs: [
      { key: 'en' },
      { key: 'fr' },
      { key: 'es' },
    ],
    selectedTranslationLang: '',
    langButtonSelectedStyle: 'bg-blue-500',
    langButtonStyle: 'bg-gray-500',
  };

  beforeEach(() => {
    wrapper = shallowMount(EditBlog, {
      mocks: global.mocks,
      data() {
        return defaultProps
      },
      stubs: {
        'quill-editor': true,
        LocaleTranslations,
        Inputs,  // Stub child components
      }
    });
  });

  it('renders quill-editor', () => {
    expect(wrapper.find('.wyzywig').exists()).toBe(true);
  });

  it('renders LocaleTranslations component correctly', async () => {
    const localeTranslations = wrapper.findComponent(LocaleTranslations);

    expect(localeTranslations.exists()).toBe(true);
    expect(localeTranslations.props().locales.length).toBe(2); // Excludes default locale 'en'
    expect(localeTranslations.props().selectedTranslationLang).toBe(defaultProps.selectedTranslationLang);
  });

  it('emits locale-clicked event when a locale is selected', async () => {
    const localeTranslations = wrapper.findComponent(LocaleTranslations);
    await localeTranslations.vm.$emit('locale-clicked', { key: 'fr' });

    // Check if selectedTranslationLang is updated correctly
    expect(wrapper.vm.selectedTranslationLang).toBe('fr');
  });

  it('renders and updates title, description, and body fields based on selectedTranslationLang', async () => {
    // Set selectedTranslationLang to 'fr'
    await wrapper.setData({ selectedTranslationLang: 'fr' });

    // Check that title translation input is rendered
    const titleInput = wrapper.find('#article-title-translation');
    expect(titleInput.exists()).toBe(true);
    expect(titleInput.props().inputModel).toBe(
        defaultProps.article.translations.find(t => t.locale === 'fr').title
    );

    // Check that description translation input is rendered
    const descriptionInput = wrapper.find('#article-description-translation');
    expect(descriptionInput.exists()).toBe(true);
    expect(descriptionInput.props().inputModel).toBe(
        defaultProps.article.translations.find(t => t.locale === 'fr').description
    );

    // Check that body translation input is rendered
    const bodyInput = wrapper.find('#article-body-translation');
    expect(bodyInput.exists()).toBe(true);
    expect(bodyInput.props().inputModel).toBe(
        defaultProps.article.translations.find(t => t.locale === 'fr').body
    );

    // Simulate user input for title, description, and body
    await titleInput.vm.$emit('input', 'Nouveau Titre');
    await descriptionInput.vm.$emit('input', 'Nouvelle description');
    await bodyInput.vm.$emit('input', 'Nouveau contenu du corps');

    // Check if the translations are updated correctly
    expect(wrapper.vm.article.translations.find(t => t.locale === 'fr').title).toBe('Nouveau Titre');
    expect(wrapper.vm.article.translations.find(t => t.locale === 'fr').description).toBe('Nouvelle description');
    expect(wrapper.vm.article.translations.find(t => t.locale === 'fr').body).toBe('Nouveau contenu du corps');
  });

  it('does not render translation field when selectedTranslationLang is not set', async () => {
    // Set selectedTranslationLang to an empty string
    await wrapper.setData({ selectedTranslationLang: '' });

    // Ensure that the title translation field is not rendered
    const titleInput = wrapper.find('#article-title-translation');
    expect(titleInput.exists()).toBe(false);

    // Ensure that the description translation field is not rendered
    const descriptionInput = wrapper.find('#article-description-translation');
    expect(descriptionInput.exists()).toBe(false);

    // Ensure that the body translation field is not rendered
    const bodyInput = wrapper.find('#article-body-translation');
    expect(bodyInput.exists()).toBe(false);
  });

  it('displays translation errors if they exist', async () => {
    const errors = {
      fr: { title: ['This title is required'] },
    };
    await wrapper.setData({ translationErrors: errors, selectedTranslationLang: 'fr' });

    const errorMessage = wrapper.find('.translation-error');
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.text()).toBe('This title is required');
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});