import { shallowMount } from "@vue/test-utils";
import LocaleTranslations from "../LocaleTranslations.vue";

describe('LocaleTranslations.vue', () => {
  const localesMock = [
    { key: 'en' },
    { key: 'fr' },
    { key: 'es' },
  ];

  const defaultProps = {
    defaultLocale: 'en',
    locales: localesMock,
    langButtonSelectedStyle: 'bg-blue-500',
    langButtonStyle: 'bg-gray-500',
    selectedTranslationLang: 'fr',
  };

  it('renders when defaultLocale is provided', () => {
    const wrapper = shallowMount(LocaleTranslations, { propsData: defaultProps });
    expect(wrapper.find('#LocaleTranslations').exists()).toBe(true);
  });

  it('does not render when defaultLocale is empty', () => {
    const wrapper = shallowMount(LocaleTranslations, {
      propsData: { ...defaultProps, defaultLocale: '' },
    });
    expect(wrapper.find('#LocaleTranslations').exists()).toBe(false);
  });

  it('renders locales excluding the default locale', () => {
    const wrapper = shallowMount(LocaleTranslations, {
      propsData: {
        defaultLocale: 'en',
        locales: [
          { key: 'fr' },
          { key: 'es' },
        ],
        langButtonSelectedStyle: 'bg-blue-500',
        langButtonStyle: 'bg-gray-500',
        selectedTranslationLang: '',
      },
    });

    // Find all rendered locale items
    const localeItems = wrapper.findAll('[data-testid^="locale-trans-item-"]');

    // Ensure 'en' (defaultLocale) is not in the list
    localeItems.wrappers.forEach((localeWrapper) => {
      expect(localeWrapper.text()).not.toBe('en');
    });
    expect(localeItems.length).toBe(2); // Only 'fr' and 'es' should be rendered
  });

  it('renders the correct number of locales', () => {
    const wrapper = shallowMount(LocaleTranslations, { propsData: defaultProps });
    localesMock.forEach((locale) => {
      const item = wrapper.find(`.locale-trans-item-${locale.key}`);
      expect(item.exists()).toBe(true);
    });
  });

  it('applies selected style to the selectedTranslationLang', () => {
    const wrapper = shallowMount(LocaleTranslations, { propsData: defaultProps });
    const selectedLang = wrapper.find('.bg-blue-500');
    expect(selectedLang.text()).toBe('fr');
  });

  it('emits "locale-clicked" with correct payload when a locale is clicked', async () => {
    const wrapper = shallowMount(LocaleTranslations, { propsData: defaultProps });
    const firstLocale = wrapper.find('.locale-trans-item-en');
    await firstLocale.trigger('click');
    expect(wrapper.emitted('locale-clicked')).toHaveLength(1);
    expect(wrapper.emitted('locale-clicked')[0]).toEqual([{ key: 'en' }]);
  });

  it('uses default prop values when none are provided', () => {
    const wrapper = shallowMount(LocaleTranslations);
    expect(wrapper.props().defaultLocale).toBe('');
    expect(wrapper.props().locales).toEqual([]);
    expect(wrapper.props().langButtonSelectedStyle).toBe('');
    expect(wrapper.props().langButtonStyle).toBe('');
    expect(wrapper.props().selectedTranslationLang).toBe('');
  });

  it('matches the snapshot', () => {
    const wrapper = shallowMount(LocaleTranslations, { propsData: defaultProps });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
