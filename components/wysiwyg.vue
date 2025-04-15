<template>
  <div class="input wyzywig-wrapper">
    <span class="flex text-start text-xs pb-1 wyzywig-desc">{{ $t('quillEditor.quillDesc') }}</span>
    <component :is="QuillComponent" :key="quillKey" ref="myQuillEditor" v-model="settings" :options="options" class="wyzywig" />
    <MediaComponent ref="sectionsMediaComponent" :content-used-key="contentUsedKey" :auth-token="authToken" :server-url="serverUrl" :project-id="projectIdProp" :sections-user-id="sectionsUserId" :selected-media-id="$route.query.id" :media-translation-prefix="mediaTranslationPrefix" @emittedMedia="(media) => selectedMedia = media"></MediaComponent>
  </div>
</template>
<script>
import MediaComponent from "./MediaComponent";

/* eslint-disable camelcase */

export default {
  components: {
    MediaComponent
  },
  props: {
    html: {
      type: String,
      default: ""
    },
    quillKey: {
      type: String,
      default: "quillKey"
    },
    editorOptions: {
      type: Object,
      default() {
        return {}
      }
    },
    sectionsWysiwygEditorOptions: {
      type: Object,
      default() {
        return {}
      }
    },
    authToken: {
      type: String,
      default: ''
    },
    sectionsUserId: {
      type: String,
      default: ''
    },
    projectIdProp: {
      type: String,
      default: ''
    },
    serverUrl: {
      type: String,
      default: ''
    },
    selectedMediaId: {
      type: String,
      default: ''
    },
    contentUsedKey: {
      type: String,
      default: "title"
    },
    mediaTranslationPrefix: {
      type: String,
      default: "mediaT."
    }
  },
  data() {
    return {
      settings: "",
      savedFormat: null,
      selectedMedia: null,
      options: null,
      selectedRange: null,
      QuillComponent: null,
      fontsArray: [
        "1.00rem", "0.25rem", "0.50rem", "0.75rem", "1.25rem", "1.50rem", "1.75rem", "2.00rem",
        "2.25rem", "2.50rem", "2.75rem", "3.00rem", "3.25rem", "3.50rem", "3.75rem", "4.00rem",
        "4.25rem", "4.50rem", "4.75rem", "5.00rem", "5.25rem", "5.50rem", "5.75rem", "6.00rem",
        "6.25rem", "6.50rem", "6.75rem", "7.00rem", "7.25rem", "7.50rem", "7.75rem", "8.00rem"
      ]
    };
  },
  watch: {
    settings() {
      this.$emit('settingsUpdate', this.settings)
    },
    html: {
      handler() {
        this.settings = this.html
      },
      deep: true,
      immediate: true
    },
    selectedMedia(mediaObject) {
      const media = {
        media_id: "",
        url: "",
        seo_tag: "",
        files: [
          {
            filename: "",
            url: ""
          }
        ],
        headers: {}
      };
      media.files[0].url = mediaObject.files[0].url;
      media.files[0].filename = mediaObject.files[0].filename;
      media.media_id = mediaObject.id;
      media.url = mediaObject.files[0].url;
      media.seo_tag = mediaObject.seo_tag;
      if (mediaObject.files[0].headers) {
        media.headers = mediaObject.files[0].headers
      }

      if (this.selectedRange) {
        this.$refs.myQuillEditor.quill.deleteText(this.selectedRange.index, this.selectedRange.length)
      }

      const range = this.$refs.myQuillEditor.quill.getSelection();
      this.$refs.myQuillEditor.quill.insertEmbed(this.selectedRange ? this.selectedRange.index : range ? range.index : 0, 'image', media.url);

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.$refs.myQuillEditor.quill.root.innerHTML, 'text/html');
        const imgTags = doc.querySelectorAll('img');
        imgTags.forEach(img => {
          if (!img.hasAttribute('media-id')) {
            img.setAttribute('media-id', media.media_id);
          }
          if (!img.hasAttribute('alt') && media.seo_tag) {
            img.setAttribute('alt', media.seo_tag);
          }
          if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }
        });
        this.$refs.myQuillEditor.quill.root.innerHTML = doc.body.innerHTML;
      } catch {}

      this.$emit('wysiwygMedia', media);
      this.$refs.sectionsMediaComponent.closeModal()
    }
  },
  created() {
    import("quill/dist/quill.snow.css");
    if (process.client) {
      let Emoji = require("@devdcodes9/quill-emojijs");
      import("@devdcodes9/quill-emojijs/dist/quill-emoji.css");
      let Quill = require('quill').default;

      Quill.prototype.pasteHTML = function (html) {
        this.setContents(this.clipboard.convert({
          html: html,
          text: '\n'
        }))
      };

      Quill.register("modules/emoji-toolbar", Emoji.default.ToolbarEmoji);
      Quill.register('formats/emoji', Emoji.default.EmojiBlot);

      const ImageBlot = Quill.import("formats/image");
      class CustomImageBlot extends ImageBlot {
        static blotName = "customImage";
        static tagName = "img";

        /**
         * Converts the HTML tag to image blot
         * @param value
         */
        static create(value) {
          let node = super.create();
          Object.getOwnPropertyNames(value).forEach((attribute_name) => {
            node.setAttribute(attribute_name, value[attribute_name]);
          });

          return node;
        }

        /**
         * Converts the image blot to HTML tag
         * @param node
         */
        static value(node) {
          var blot = {};
          node.getAttributeNames().forEach((attribute_name) => {
            blot[attribute_name] = node.getAttribute(attribute_name);
          });

          return blot;
        }
      }
      Quill.register(CustomImageBlot);

      const Embed = Quill.import('blots/embed');
      class ButtonBlot extends Embed {
        static create(value) {
          const node = super.create();

          const buttonContainer = document.createElement('button');
          buttonContainer.className = 'quill-button-container';

          buttonContainer.setAttribute('type', 'button');

          buttonContainer.setAttribute('data-button-id', 'button-' + Date.now() + '-' + Math.floor(Math.random() * 1000));

          const anchor = document.createElement('a');
          anchor.innerText = value.label || 'Button';
          anchor.href = value.link || '#';
          anchor.className = 'ql-a-button';
          // anchor.target = '_blank';

          buttonContainer.setAttribute('data-label', value.label || 'Button');
          buttonContainer.setAttribute('data-link', value.link || '#');

          buttonContainer.appendChild(anchor);

          node.appendChild(buttonContainer);

          return node;
        }

        static value(node) {
          const buttonContainer = node.querySelector('.quill-button-container');
          return {
            label: buttonContainer ? buttonContainer.getAttribute('data-label') : '',
            link: buttonContainer ? buttonContainer.getAttribute('data-link') : ''
          };
        }
      }

      ButtonBlot.blotName = 'button';
      ButtonBlot.tagName = 'span';
      ButtonBlot.className = 'quill-button-wrapper';

      Quill.register(ButtonBlot);

      class ButtonToolbarModule {
        constructor(quill, options) {
          this.quill = quill;
          this.options = options;
          this.toolbar = quill.getModule('toolbar');

          if (this.toolbar) {
            this.toolbar.addHandler('button', this.handleButtonAction.bind(this));
          }

          this.quill.on('selection-change', this.handleSelectionChange.bind(this));
        }

        handleSelectionChange(range) {
          this.selectedButtonId = null;

          if (!range) return;

          const [blot] = this.quill.getLeaf(range.index);
          if (!blot) return;

          let currentNode = blot.domNode;
          while (currentNode && !this.selectedButtonId) {
            if (currentNode.classList && currentNode.classList.contains('quill-button-wrapper')) {
              const buttonContainer = currentNode.querySelector('.quill-button-container');
              if (buttonContainer) {
                this.selectedButtonId = buttonContainer.getAttribute('data-button-id');
              }
              break;
            }
            currentNode = currentNode.parentNode;
          }
        }

        handleButtonAction() {
          if (this.selectedButtonId) {
            const buttonElement = this.quill.root.querySelector(`.quill-button-container[data-button-id="${this.selectedButtonId}"]`);
            if (buttonElement) {
              this.editButton(buttonElement);
              return;
            }
          }

          this.createButton();
        }

        createButton() {
          const label = prompt('Button Label:', '');
          if (!label) return; // Cancel if no label

          const link = prompt('Button Link:', '');

          const range = this.quill.getSelection(true);

          this.quill.insertEmbed(range.index, 'button', {
            label: label,
            link: link
          }, Quill.sources.USER);

          this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        }

        editButton(buttonElement) {
          if (!buttonElement) return;

          const currentLabel = buttonElement.getAttribute('data-label');
          const currentLink = buttonElement.getAttribute('data-link');

          const newLabel = prompt('Edit Button Label:', currentLabel);
          if (newLabel === null) return; // User canceled

          const newLink = prompt('Edit Button Link:', currentLink);

          const anchorElement = buttonElement.querySelector('a');
          anchorElement.innerText = newLabel;
          anchorElement.href = newLink;

          buttonElement.setAttribute('data-label', newLabel);
          buttonElement.setAttribute('data-link', newLink);

          this.selectedButtonId = null;
        }
      }

      Quill.register('modules/buttonToolbar', ButtonToolbarModule);



      const BlockEmbed2 = Quill.import('blots/block/embed');

      class HTMLBlot extends BlockEmbed2 {
        static create(value) {
          const node = super.create();

          // Create a div to hold our HTML content
          const container = document.createElement('div');
          container.classList.add('ql-html-container');
          container.innerHTML = value;

          // Add container to the blot's DOM node
          node.appendChild(container);

          // Store the raw HTML for retrieval later
          node.setAttribute('data-html', value);

          return node;
        }

        static value(node) {
          return node.getAttribute('data-html');
        }
      }

      HTMLBlot.blotName = 'html';
      HTMLBlot.tagName = 'div';
      HTMLBlot.className = 'ql-custom-html';

// Register the blot with Quill
      Quill.register(HTMLBlot);

// HTML Module with improved UI
      class HTMLModule {
        constructor(quill, options) {
          this.quill = quill;
          this.options = options || {};
          this.toolbar = quill.getModule('toolbar');

          if (this.toolbar) {
            this.toolbar.addHandler('html', this.handleHTML.bind(this));
          }

          // Create HTML editor modal (but don't append to DOM yet)
          this.createHTMLEditor();
        }

        createHTMLEditor() {
          // Create modal container
          this.modal = document.createElement('div');
          this.modal.className = 'ql-html-editor-modal';

          // Create modal content
          const modalContent = document.createElement('div');
          modalContent.className = 'ql-html-editor-content';

          // Create textarea for HTML editing
          this.htmlEditor = document.createElement('textarea');
          this.htmlEditor.className = 'ql-html-editor-textarea';

          // Create buttons
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'ql-html-editor-buttons';

          this.saveButton = document.createElement('button');
          this.saveButton.textContent = 'Save';
          this.saveButton.className = 'ql-html-editor-save';

          const cancelButton = document.createElement('button');
          cancelButton.textContent = 'Cancel';
          cancelButton.className = 'ql-html-editor-cancel';

          const noteText = document.createElement('div');
          noteText.textContent = 'Use with cautions, when adding a new html content, make sure to wrap it with a <p></p> tag';
          noteText.className = 'ql-html-editor-noteText';

          // Append elements
          buttonContainer.appendChild(this.saveButton);
          buttonContainer.appendChild(cancelButton);
          buttonContainer.appendChild(noteText);

          modalContent.appendChild(this.htmlEditor);
          modalContent.appendChild(buttonContainer);

          this.modal.appendChild(modalContent);

          // Event listeners
          this.saveButton.addEventListener('click', () => {
            this.saveHTML();
          });

          cancelButton.addEventListener('click', () => {
            this.hideHTMLEditor();
          });

          // Close modal when clicking outside
          this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
              this.hideHTMLEditor();
            }
          });
        }

        handleHTML() {
          const range = this.quill.getSelection(true);
          this.range = range;

          // If editing existing HTML blot
          let existingHTML = '';

          // Get current content if no existing HTML
          if (!existingHTML) {
            existingHTML = this.quill.root.innerHTML;
          }

          // Show HTML editor
          this.showHTMLEditor(existingHTML);
        }

        showHTMLEditor(html) {
          // Set HTML content in textarea
          this.htmlEditor.value = html;

          // Append modal to body if not already there
          if (!document.body.contains(this.modal)) {
            document.body.appendChild(this.modal);
          }

          // Show modal
          this.modal.style.display = 'flex';

          // Focus textarea
          setTimeout(() => {
            this.htmlEditor.focus();
          }, 0);
        }

        hideHTMLEditor() {
          this.modal.style.display = 'none';
        }

        saveHTML() {
          const html = this.htmlEditor.value;

          if (html) {
            // Clear entire editor
            const length = this.quill.getLength();
            this.quill.deleteText(0, length, Quill.sources.USER);

            // Insert full HTML as a single custom 'html' blot
            this.quill.insertEmbed(0, 'html', html, Quill.sources.USER);
            this.quill.setSelection(this.quill.getLength(), 0, Quill.sources.USER);
          }

          this.hideHTMLEditor();
        }
      }

// Register the module with Quill
      Quill.register('modules/html', HTMLModule);

// Add styles for the HTML editor and icon
      const style = document.createElement('style');
      style.innerHTML = `
  .ql-html-container {
    width: 100%;
  }

  /* HTML button icon */
  .ql-toolbar.ql-snow button.ql-html::before {
    content: "<>";
    font-family: monospace;
    font-weight: bold;
    font-size: 14px;
    display: flex;
  }

  /* Modal styles */
  .ql-html-editor-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    justify-content: center;
    align-items: center;
  }

  .ql-html-editor-content {
    background-color: white;
    border-radius: 5px;
    width: 80%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    max-height: 80vh;
  }

  .ql-html-editor-textarea {
    width: 100%;
    height: 60vh;
    padding: 15px;
    font-family: monospace;
    font-size: 14px;
    border: 1px solid #ccc;
    resize: none;
  }

  .ql-html-editor-buttons {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    border-top: 1px solid #eee;
    position: relative;
  }

  .ql-html-editor-save,
  .ql-html-editor-cancel {
    max-height: 64px;
    width: auto;
    min-width: auto;
    border-radius: 16px;
    height: auto;
    padding: 6px 8px;
    min-height: auto;
    margin: 10px;
  }

  .ql-html-editor-noteText {
    font-size: 12px;
    position: absolute;
    left: 8px;
  }

  .ql-html-editor-save {
    background-color: #31a9db;
    color: white;
  }
`;
      document.head.appendChild(style);

      const fontSizeArr = this.fontsArray

      var Size = Quill.import('attributors/style/size');
      Size.whitelist = fontSizeArr;
      Quill.register(Size, true);

      var Link = Quill.import('formats/link');

      class MyLink extends Link {
        static create(value) {
          let node = super.create(value);
          value = this.sanitize(value);
          node.setAttribute('href', value);
          if(!value.startsWith("http")) {
            node.removeAttribute('target');
          }
          return node;
        }
      }

      Quill.register(MyLink);

      let QuillTableUI = require('quill-table-ui').default
      import("quill-table-ui/dist/index.css");

      Quill.register({
        'modules/tableUI': QuillTableUI
      }, true)

      window.Quill = Quill
    }

    if(this.editorOptions.modules && Object.keys(this.editorOptions.modules).length > 0) {
      this.options = this.editorOptions
    } else if(this.sectionsWysiwygEditorOptions && Object.keys(this.sectionsWysiwygEditorOptions).length > 0) {
      this.options = this.sectionsWysiwygEditorOptions
    } else {
      this.options = {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['link', 'image', 'video', 'formula'],
              ['blockquote', 'code-block'],

              [{ 'header': 1 }, { 'header': 2 }],               // custom button values
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
              [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
              [{ 'direction': 'rtl' }],                         // text direction

              [{ 'size': this.fontsArray }],  // custom dropdown
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': ['#51AEC3', '#fce085', '#03B1C7', '#61035B', '#fff', '#868686', '#011321', '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }, { 'background': ['#51AEC3', '#fce085', '#03B1C7', '#61035B', '#fff', '#868686', '#011321', '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['emoji'],
              ["save-format", "apply-format"],
              ["button"],
              ['html'],
              ['table-button']
            ],
            handlers: {
              'button': function() {},
              'html': function() {}
            }
          },
          "emoji-toolbar": true,
          buttonToolbar: true,
          html: true,
          table: true,
          tableUI: true
        }
      }
    }
  },
  async mounted() {
    await import('vue-quill-editor').then(module => {
      this.QuillComponent = module.quillEditor
      this.$nextTick(() => {
        this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', () => {
          this.selectedRange = null
          let selectedMedia = ''
          try {
            const range = this.$refs.myQuillEditor.quill.getSelection();
            if (range && range.length > 0) {
              this.selectedRange = range
              const delta = this.$refs.myQuillEditor.quill.getContents(range.index, range.length);
              if (delta && delta.ops && delta.ops.length > 0 && delta.ops.length === 1 && delta.ops[0] && delta.ops[0].insert && delta.ops[0].insert.customImage && delta.ops[0].insert.customImage['media-id']) {
                selectedMedia = delta.ops[0].insert.customImage['media-id']
              }
            }
          } catch {}

          this.uploadFunction(selectedMedia);
        });

        var saveButtons = document.querySelectorAll('.ql-save-format');
        saveButtons.forEach((saveButton) => {
          saveButton.addEventListener('click', () => {
            this.saveFormat()
          });
        })

        var applyButtons = document.querySelectorAll('.ql-apply-format');
        applyButtons.forEach((applyButton) => {
          applyButton.addEventListener('click', () => {
            this.applyFormat()
          });
        })

        document.querySelector('.ql-button').innerHTML = '<div title="Add/Edit a button"><svg viewBox="0 0 18 18"><rect width="16" height="10" x="1" y="4" rx="2" ry="2" stroke-width="1.5" stroke="currentColor" fill="none"></rect><path d="M5,9 L13,9" stroke-width="1.5" stroke="currentColor"></path></svg></div>';

        document.querySelector('.ql-table-button').innerHTML = `
          <div title="Insert 2x2 Table">
            <svg viewBox="0 0 18 18" width="18" height="18">
              <rect x="2" y="2" width="14" height="14" stroke="currentColor" fill="none" stroke-width="1.5" />
              <line x1="9" y1="2" x2="9" y2="16" stroke="currentColor" stroke-width="1.5" />
              <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </div>
        `;
        var tableButton = document.querySelectorAll('.ql-table-button');
        tableButton.forEach((tableButton) => {
          tableButton.addEventListener('click', () => {
            this.$refs.myQuillEditor.quill.getModule('table').insertTable(3, 3);
          });
        })

      })
    })
  },
  methods: {
    validate() {
      return true;
    },
    uploadFunction(mediaId = null) {
      this.$refs.sectionsMediaComponent.openModal(mediaId, null)
    },
    saveFormat() {
      const selection = this.$refs.myQuillEditor.quill.getSelection();
      if (selection) {
        const savedFormat = JSON.stringify(this.$refs.myQuillEditor.quill.getFormat(selection));
        this.$cookies.set('sections-quill-format', savedFormat);
      }
    },
    applyFormat() {
      const selection = this.$refs.myQuillEditor.quill.getSelection();
      const savedFormat = this.$cookies.get('sections-quill-format');

      if (selection && savedFormat) {
        this.$refs.myQuillEditor.quill.formatText(selection.index, selection.length, savedFormat);
      }
    }
  }
};
</script>

<style>
.ql-save-format:after {
  content: "Save format";
}

.ql-apply-format:after {
  content: "Apply format";
}

.ql-formats button.ql-save-format {
  width: 100px !important;
  padding: 0 !important;
}

.ql-formats button.ql-apply-format {
  width: 100px !important;
  padding: 0 !important;
}
.quill-editor.wyzywig img {
  display: inline !important;
}
.quill-editor.wyzywig .ql-toolbar.ql-snow {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
main.sections-main .input.wyzywig-wrapper {
  margin: 0 128px;
}
aside.sections-aside .input.wyzywig-wrapper {
  margin-right: 80px;
}
.ql-html-popupContainer button.ql-html-buttonCancel {
  outline: none;
  max-width: 1000px;
  display: flex;
  background: #31a9db;
  border: none;
  color: white;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 8px;
}

.ql-html-popupContainer button.ql-html-buttonOk {
  outline: none;
  max-width: 1000px;
  display: flex;
  background: #31a9db;
  border: none;
  color: white;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 8px;
}

.ql-html-popupContainer .ql-html-buttonGroup {
  display: flex;
}
.emoji_completions {
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
#emoji-palette {
  margin-top: 30px;
}
.ql-picker.ql-size .ql-picker-label::before, .ql-picker.ql-size .ql-picker-item::before {
  content: attr(data-value) !important;
}
.ql-editor p {
  font-size: 1rem;
}
.ql-snow .ql-size.ql-picker.ql-expanded .ql-picker-options {
  max-height: 250px;
  overflow-y: scroll;
}
</style>
