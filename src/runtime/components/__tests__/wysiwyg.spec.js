// QuillEditor.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import QuillEditor from '../wysiwyg.vue'
import {createI18n} from "vue-i18n"; // Adjust path as needed

// Mock Quill and its dependencies
const mockQuillInstance = {
    root: { innerHTML: '<p><br></p>' },
    getSelection: vi.fn(() => ({ index: 0, length: 0 })),
    setSelection: vi.fn(),
    getContents: vi.fn(() => ({ ops: [] })),
    setContents: vi.fn(),
    insertEmbed: vi.fn(),
    deleteText: vi.fn(),
    formatText: vi.fn(),
    getFormat: vi.fn(() => ({})),
    getLength: vi.fn(() => 1),
    getModule: vi.fn((module) => {
        if (module === 'toolbar') {
            return {
                addHandler: vi.fn()
            }
        }
        if (module === 'table') {
            return {
                insertTable: vi.fn()
            }
        }
        return {}
    }),
    on: vi.fn(),
    clipboard: {
        convert: vi.fn(() => ({ ops: [] })),
        dangerouslyPasteHTML: vi.fn()
    },
    scroll: {
        descendant: vi.fn(() => [null, 0])
    }
}

// Mock Quill constructor
const MockQuill = vi.fn(() => mockQuillInstance)
MockQuill.import = vi.fn((path) => {
    if (path === 'formats/image') {
        return class ImageBlot {
            static create = vi.fn()
            static value = vi.fn()
        }
    }
    if (path === 'blots/embed') {
        return class Embed {
            static create = vi.fn()
        }
    }
    if (path === 'blots/block/embed') {
        return class BlockEmbed {
            static create = vi.fn()
        }
    }
    if (path === 'attributors/style/size') {
        return { whitelist: [] }
    }
    if (path === 'formats/link') {
        return class LinkFormat {
            static create = vi.fn()
            static sanitize = vi.fn((value) => value)
        }
    }
    return {}
})
MockQuill.register = vi.fn()
MockQuill.sources = {
    USER: 'user',
    SILENT: 'silent'
}

// Mock dynamic imports
vi.mock('quill', () => ({
    default: MockQuill
}))

vi.mock('quill/dist/quill.snow.css', () => ({}))

vi.mock('@devdcodes9/quill-emojijs', () => ({
    default: {
        ToolbarEmoji: class ToolbarEmoji {},
        EmojiBlot: class EmojiBlot {}
    }
}))

vi.mock('@devdcodes9/quill-emojijs/dist/quill-emoji.css', () => ({}))

vi.mock('quill-table-ui', () => ({
    default: class TableUI {}
}))

vi.mock('quill-table-ui/dist/index.css', () => ({}))

// Mock Nuxt composables
vi.mock('#imports', () => ({
    ref: vi.fn((val) => ({ value: val })),
    useRoute: vi.fn(() => ({
        query: { id: 'test-id' }
    })),
    useCookie: vi.fn(() => ({ value: null })),
    onMounted: vi.fn((fn) => fn()),
    onBeforeUnmount: vi.fn(),
    watch: vi.fn(),
    nextTick: vi.fn(() => Promise.resolve())
}))

// Mock LazyGMediaComponent
const LazyGMediaComponent = {
    name: 'LazyGMediaComponent',
    template: '<div ref="sectionsMediaComponentRef" data-testid="media-component"></div>',
    methods: {
        openModal: vi.fn(),
        closeModal: vi.fn()
    }
}

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: {},
        fr: {}
    }
})

describe('QuillEditor Component', () => {
    let wrapper
    let mockProps

    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks()

        mockProps = {
            html: '<p>Test content</p>',
            quillKey: 'test-key',
            editorOptions: {},
            sectionsWysiwygEditorOptions: {},
            authToken: 'test-token',
            sectionsUserId: 'user-123',
            projectIdProp: 'project-456',
            serverUrl: 'https://test.com',
            selectedMediaId: 'media-789',
            contentUsedKey: 'title',
            mediaTranslationPrefix: 'mediaT.'
        }
    })

    describe('Component Initialization', () => {
        it('should render the component with correct structure', async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            expect(wrapper.find('.quill-editor.wyzywig').exists()).toBe(true)
            expect(wrapper.find('.wyzywig-desc').exists()).toBe(true)
        })

        it('should initialize with default props', () => {
            wrapper = shallowMount(QuillEditor, {
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            const vm = wrapper.vm
            expect(vm.html).toBe('')
            expect(vm.quillKey).toBe('quillKey')
            expect(vm.contentUsedKey).toBe('title')
        })

        it('should accept and use custom props', () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            const vm = wrapper.vm
            expect(vm.html).toBe('<p>Test content</p>')
            expect(vm.quillKey).toBe('test-key')
            expect(vm.authToken).toBe('test-token')
            expect(vm.sectionsUserId).toBe('user-123')
            expect(vm.projectIdProp).toBe('project-456')
        })
    })

    describe('Editor Options', () => {
        it('should use custom editor options when provided', async () => {
            const customOptions = {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: [['bold', 'italic']]
                    }
                }
            }

            wrapper = shallowMount(QuillEditor, {
                props: {
                    ...mockProps,
                    editorOptions: customOptions
                },
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            // Wait for component to initialize
            await flushPromises()

            // Check if MockQuill was called with custom options
            expect(MockQuill).toHaveBeenCalled()
        })

        it('should use sections editor options when editorOptions is empty', async () => {
            const sectionsOptions = {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: [['underline', 'strike']]
                    }
                }
            }

            wrapper = shallowMount(QuillEditor, {
                props: {
                    ...mockProps,
                    sectionsWysiwygEditorOptions: sectionsOptions,
                    editorOptions: {}
                },
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            await flushPromises()
            expect(MockQuill).toHaveBeenCalled()
        })

        it('should use default options when no custom options provided', async () => {
            wrapper = shallowMount(QuillEditor, {
                props: {
                    ...mockProps,
                    editorOptions: {},
                    sectionsWysiwygEditorOptions: {}
                },
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            await flushPromises()
            expect(MockQuill).toHaveBeenCalled()
        })
    })

    describe('Content Management', () => {
        beforeEach(async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })
            await flushPromises()
        })

        it('should update content when html prop changes', async () => {
            const newHtml = '<p>Updated content</p>'

            await wrapper.setProps({ html: newHtml })
            await flushPromises()

            // Check if the content was processed
            expect(wrapper.vm.settings).toBe(newHtml)
        })

        it('should emit settingsUpdate when content changes', async () => {
            const vm = wrapper.vm

            // Simulate content change
            vm.settings = '<p>New content</p>'
            await nextTick()

            // Check if the emit was called
            expect(wrapper.emitted('settingsUpdate')).toBeTruthy()
        })

        it('should extract HTML content from Quill custom HTML wrapper', () => {
            const vm = wrapper.vm
            const wrappedHtml = '<div class="ql-custom-html"><div class="ql-html-container"><p>Custom HTML</p></div></div>'

            const result = vm.extractQuillHTMLContent(wrappedHtml)
            expect(result).toBe('<p>Custom HTML</p>')
        })

        it('should return original HTML when no wrapper is present', () => {
            const vm = wrapper.vm
            const normalHtml = '<p>Normal content</p>'

            const result = vm.extractQuillHTMLContent(normalHtml)
            expect(result).toBe('<p>Normal content</p>')
        })
    })

    describe('Media Handling', () => {
        beforeEach(async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })
            await flushPromises()
        })

        it('should handle media selection', async () => {
            const vm = wrapper.vm
            const mockMedia = {
                id: 'media-123',
                url: 'https://example.com/image.jpg',
                seo_tag: 'Test image',
                files: [{
                    filename: 'image.jpg',
                    url: 'https://example.com/image.jpg'
                }]
            }

            // Simulate media selection
            vm.handleEmittedMedia(mockMedia)

            expect(vm.selectedMedia).toEqual(mockMedia)
        })

        it('should insert media into editor when selectedMedia changes', async () => {
            const vm = wrapper.vm
            const mockMedia = {
                id: 'media-123',
                url: 'https://example.com/image.jpg',
                seo_tag: 'Test image',
                files: [{
                    filename: 'image.jpg',
                    url: 'https://example.com/image.jpg'
                }]
            }

            await nextTick()
            // Set up mock for insertEmbed
            mockQuillInstance.getSelection.mockReturnValue({ index: 0, length: 0 })
            mockQuillInstance.getLength.mockReturnValue(1)

            vm.selectedMedia = mockMedia
            await nextTick()

            expect(mockQuillInstance.insertEmbed).toHaveBeenCalledWith(
                0,
                'customImage',
                expect.objectContaining({
                    src: mockMedia.url,
                    'media-id': mockMedia.id,
                    alt: mockMedia.seo_tag,
                    loading: 'lazy'
                }),
                'user'
            )
        })

        it('should emit wysiwygMedia event when media is inserted', async () => {
            const vm = wrapper.vm
            const mockMedia = {
                id: 'media-123',
                url: 'https://example.com/image.jpg',
                seo_tag: 'Test image',
                files: [{
                    filename: 'image.jpg',
                    url: 'https://example.com/image.jpg'
                }]
            }

            vm.selectedMedia = mockMedia
            await nextTick()

            expect(wrapper.emitted('wysiwygMedia')).toBeTruthy()
            expect(wrapper.emitted('wysiwygMedia')[0][0]).toEqual(
                expect.objectContaining({
                    media_id: mockMedia.id,
                    url: mockMedia.url,
                    seo_tag: mockMedia.seo_tag
                })
            )
        })
    })

    describe('Format Management', () => {
        beforeEach(async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })
            await flushPromises()
        })

        it('should save format correctly', () => {
            const vm = wrapper.vm
            const mockFormat = { bold: true, italic: true }

            mockQuillInstance.getSelection.mockReturnValue({ index: 0, length: 5 })
            mockQuillInstance.getFormat.mockReturnValue(mockFormat)

            vm.saveFormat()

            // Check if cookie was set (mocked)
            expect(mockQuillInstance.getFormat).toHaveBeenCalledWith({ index: 0, length: 5 })
        })

        it('should apply saved format correctly', () => {
            const vm = wrapper.vm
            const mockFormat = { bold: true, color: '#ff0000' }

            // Mock saved format
            vm.sectionsQuillFormatCookie = { value: JSON.stringify(mockFormat) }
            mockQuillInstance.getSelection.mockReturnValue({ index: 0, length: 5 })

            vm.applyFormat()

            expect(mockQuillInstance.formatText).toHaveBeenCalledWith(
                0,
                5,
                {
                    "value": JSON.stringify(mockFormat)
                },
                'user'
            )
        })

        it('should handle invalid saved format gracefully', () => {
            const vm = wrapper.vm

            // Mock invalid format
            vm.sectionsQuillFormatCookie = { value: 'invalid-json' }
            mockQuillInstance.getSelection.mockReturnValue({ index: 0, length: 5 })

            expect(() => vm.applyFormat()).not.toThrow()
        })
    })

    describe('Utility Functions', () => {
        beforeEach(async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })
            await flushPromises()
        })

        it('should validate correctly', () => {
            const vm = wrapper.vm
            expect(vm.validate()).toBe(true)
        })

        it('should open media upload modal', () => {
            const vm = wrapper.vm
            const mediaComponentRef = {
                openModal: vi.fn()
            }
            vm.sectionsMediaComponentRef = mediaComponentRef

            vm.uploadFunction('media-123')

            expect(mediaComponentRef.openModal).toHaveBeenCalledWith('media-123', null)
        })

        it('should open media upload modal without mediaId', () => {
            const vm = wrapper.vm
            const mediaComponentRef = {
                openModal: vi.fn()
            }
            vm.sectionsMediaComponentRef = mediaComponentRef

            vm.uploadFunction()

            expect(mediaComponentRef.openModal).toHaveBeenCalledWith(null, null)
        })
    })

    describe('Event Emissions', () => {
        beforeEach(async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })
            await flushPromises()
        })

        it('should emit settingsUpdate when settings change', async () => {
            const vm = wrapper.vm

            vm.settings = '<p>Changed content</p>'
            await nextTick()

            expect(wrapper.emitted()).toHaveProperty('settingsUpdate')
        })

        it('should not emit settingsUpdate for initial empty state', async () => {
            wrapper = shallowMount(QuillEditor, {
                props: { ...mockProps, html: '' },
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            const vm = wrapper.vm
            vm.settings = ''
            await nextTick()

            // Should not emit for initial empty state
            expect(wrapper.emitted('settingsUpdate')).toBeFalsy()
        })

        it('should emit wysiwygMedia when media is handled', async () => {
            const vm = wrapper.vm
            const mockMedia = {
                id: 'media-123',
                url: 'https://example.com/image.jpg',
                seo_tag: 'Test image',
                files: [{ filename: 'image.jpg', url: 'https://example.com/image.jpg' }]
            }

            vm.selectedMedia = mockMedia
            await nextTick()

            expect(wrapper.emitted()).toHaveProperty('wysiwygMedia')
        })
    })

    describe('Fonts Array', () => {
        it('should have correct font sizes in fontsArray', async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            const vm = wrapper.vm
            expect(vm.fontsArray).toEqual([
                "0.25rem", "0.5rem", "0.75rem", false, "1.25rem", "1.5rem", "1.75rem", "2rem",
                "2.25rem", "2.5rem", "2.75rem", "3rem", "3.25rem", "3.5rem", "3.75rem", "4rem",
                "4.25rem", "4.5rem", "4.75rem", "5rem", "5.25rem", "5.5rem", "5.75rem", "6rem",
                "6.25rem", "6.5rem", "6.75rem", "7rem", "7.25rem", "7.5rem", "7.75rem", "8rem"
            ])
        })
    })

    describe('Error Handling', () => {
        it('should handle missing Quill instance gracefully', () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            const vm = wrapper.vm

            // Test saveFormat without Quill instance
            vm.QuillEditorComponent = null
            expect(() => vm.saveFormat()).not.toThrow()

            // Test applyFormat without Quill instance
            expect(() => vm.applyFormat()).not.toThrow()
        })

    })
})