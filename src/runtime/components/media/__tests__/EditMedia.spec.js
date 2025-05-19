import { shallowMount } from "@vue/test-utils";
import EditMedia from "../EditMedia.vue";

import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {},
    fr: {}
  }
})

describe('EditMedia', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(EditMedia, {
      global: {
        plugins: [i18n],
        stubs: {
          LazyGHeaderContainer: true,
          LazyGButtons: true,
          LazyGAlertPopup: true,
          LazyGAnimatedLoading: true
        },
        config: {
          globalProperties: {
            $t: vi.fn((key) => key),
            mediaHeader: vi.fn(({ token }, projectId) => ({
              Authorization: `Bearer ${token}`,
              'Project-ID': projectId,
            })),
            localePath: vi.fn(),
            useRoute: () => ({
              params: { pathMatch: [] },
              query: {},
            }),
          }
        }
      },
      data() {
        return {
          showPopupCode: true,
          popupContent: {
            content: [
              { id: 1, name: 'Content 1' },
              { id: 2, name: 'Content 2' }
            ],
            author: 'Author Name'
          }
        }
      },
      propsData: {
        contentUsedKey: 'name',
        mediaTranslationPrefix: 'mediaT.'
      }
    })
  })

  it('does not display "undefined" in content-used div', async () => {

    wrapper.vm.showPopupCode = true
    wrapper.vm.popupContent = {
      content: [
        { id: 1, name: 'Content 1' },
        { id: 2, name: 'Content 2' }
      ],
          author: 'Author Name'
    }

    await wrapper.vm.$nextTick()

    const contentUsedDivs = wrapper.findAll('.content-used')
    console.log(contentUsedDivs)
    contentUsedDivs.forEach(div => {
      expect(div.exists()).toBe(true);
      expect(div.text()).not.toContain('undefined')
    })
  })
})