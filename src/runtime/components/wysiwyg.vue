<template>
  <div title="" class="input wyzywig-wrapper">
    <span class="flex text-start text-xs pb-1 wyzywig-desc">{{ $t('quillEditor.quillDesc') }}</span>

    <ClientOnly>
      <component
        :is="QuillEditorComponent"
        :key="props.quillKey"
        ref="myQuillEditorRef"
        v-model:content="settings"
        :options="editorOptionsObject"
        content-type="html"
        class="wyzywig"
        @ready="onQuillEditorReady"
      />
      <template #fallback>
        <p>Loading editor...</p>
      </template>
    </ClientOnly>

    <LazyGMediaComponent
      ref="sectionsMediaComponentRef"
      :content-used-key="props.contentUsedKey"
      :auth-token="props.authToken"
      :server-url="props.serverUrl"
      :project-id="props.projectIdProp"
      :sections-user-id="props.sectionsUserId"
      :selected-media-id="route.query.id"
      :media-translation-prefix="props.mediaTranslationPrefix"
      @emittedMedia="handleEmittedMedia"
    ></LazyGMediaComponent>
  </div>
</template>

<script setup>
// import { QuillEditor } from '@vueup/vue-quill'
// These will be undefined on the server.
let QuillEditorComponent; // To hold the component if needed, though direct use in template is fine
let Quill;                // To hold the Quill library constructor

// Import other client-side libraries dynamically
let EmojiLib;
let QuillTableUILib;

const props = defineProps({
  html: { type: String, default: "" },
  quillKey: { type: String, default: "quillKey" },
  editorOptions: { type: Object, default: () => ({}) },
  sectionsWysiwygEditorOptions: { type: Object, default: () => ({}) },
  authToken: { type: String, default: '' },
  sectionsUserId: { type: String, default: '' },
  projectIdProp: { type: String, default: '' },
  serverUrl: { type: String, default: '' },
  selectedMediaId: { type: String, default: '' },
  contentUsedKey: { type: String, default: "title" },
  mediaTranslationPrefix: { type: String, default: "mediaT." }
});

const emit = defineEmits(['settingsUpdate', 'wysiwygMedia']);

const route = useRoute();
const sectionsQuillFormatCookie = useCookie('sections-quill-format');

const settings = ref(props.html || "");
const selectedMedia = ref(null);
const editorOptionsObject = ref(null); // Renamed to avoid conflict with props.editorOptions
const selectedRange = ref(null); // To store selection range for image insertion
const myQuillEditorRef = ref(null); // Ref for QuillEditor component instance
const sectionsMediaComponentRef = ref(null); // Ref for MediaComponent instance

const fontsArray = [
  "0.25rem", "0.5rem", "0.75rem", false, "1.25rem", "1.5rem", "1.75rem", "2rem",
  "2.25rem", "2.5rem", "2.75rem", "3rem", "3.25rem", "3.5rem", "3.75rem", "4rem",
  "4.25rem", "4.5rem", "4.75rem", "5rem", "5.25rem", "5.5rem", "5.75rem", "6rem",
  "6.25rem", "6.5rem", "6.75rem", "7rem", "7.25rem", "7.5rem", "7.75rem", "8rem"
];

// For HTML Module Modal - these will hold the DOM elements
let htmlModalElement = null;
let htmlEditorTextareaElement = null;
// let htmlEditorSaveButtonElement = null; // Can bind event directly
let currentEditingHTMLBlot = null;
let currentEditingHTMLBlotRange = null;


// Initialize editorOptionsObject (similar to 'created' logic)
if (props.editorOptions && Object.keys(props.editorOptions).length > 0 && props.editorOptions.modules) {
  editorOptionsObject.value = props.editorOptions;
} else if (props.sectionsWysiwygEditorOptions && Object.keys(props.sectionsWysiwygEditorOptions).length > 0 && props.sectionsWysiwygEditorOptions.modules) {
  editorOptionsObject.value = props.sectionsWysiwygEditorOptions;
} else {
  editorOptionsObject.value = {
    modules: {
      toolbar: {
        container: [
          ["save-format", "apply-format"],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'font': [] }],
          [{ 'size': fontsArray }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': ['#51AEC3', '#fce085', '#03B1C7', '#61035B', '#fff', '#868686', '#011321', '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }, { 'background': ['#51AEC3', '#fce085', '#03B1C7', '#61035B', '#fff', '#868686', '#011321', '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }],
          ['link', 'image', 'video'],
          [{ 'align': [] }],
          [{ 'list': 'bullet' }, { 'list': 'ordered'}],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          ['clean'],
          ['show-additional'],
          ['formula'],
          ['blockquote', 'code-block'],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'direction': 'rtl' }],
          ['emoji'],
          ["button"],
          ['html'],
          ['table-button'],
        ],
        handlers: {} // To be populated after Quill is loaded
      },
      // "emoji-toolbar": true,
      // buttonToolbar: true, // Will be a custom module
      // html: true,          // Will be a custom module
      // table: true,         // Standard Quill table module
      // tableUI: true        // quill-table-ui
    }
  };
}

watch(settings, (newSettings) => {
  // Avoid emitting for initial empty state from Quill or if unchanged from prop
  if (newSettings !== '<p><br></p>' && newSettings !== props.html) {
    emit('settingsUpdate', newSettings);
  }
});

watch(() => props.html, (newHtml) => {
  if (settings.value !== newHtml) {
    settings.value = newHtml;
    // If Quill instance is ready, you might need to set content directly
    // if v-model doesn't update it immediately for some reason.
    const quill = myQuillEditorRef.value?.getQuill();
    if (quill && quill.root.innerHTML !== newHtml) {
      // Check if content is substantially different before pasting
      // to avoid issues with cursor position or minor formatting discrepancies
      if (newHtml === "<p><br></p>" && quill.getLength() <=1 ) {
        // Do nothing if newHTML is empty placeholder and quill is already empty
      } else {
        quill.clipboard.dangerouslyPasteHTML(0, newHtml);
      }
    }
  }
}, { immediate: true });

watch(selectedMedia, (mediaObject) => {
  const quill = myQuillEditorRef.value?.getQuill();
  if (!mediaObject || !quill) {
    console.warn("Quill instance or media object not available for insertion.");
    return;
  }

  const media = {
    media_id: "", url: "", seo_tag: "", files: [{ filename: "", url: "" }], headers: {}
  };

  if (mediaObject.files && mediaObject.files[0]) {
    media.files[0].url = mediaObject.files[0].url;
    media.files[0].filename = mediaObject.files[0].filename;
    if (mediaObject.files[0].headers) media.headers = mediaObject.files[0].headers;
  }
  media.media_id = mediaObject.id;
  media.url = mediaObject.url || (mediaObject.files && mediaObject.files[0] ? mediaObject.files[0].url : '');
  media.seo_tag = mediaObject.seo_tag;

  const range = selectedRange.value || quill.getSelection();
  let insertIndex = range ? range.index : (quill.getLength() > 0 ? quill.getLength() -1 : 0); // Default to end or 0

  if (selectedRange.value && selectedRange.value.length > 0) {
    quill.deleteText(selectedRange.value.index, selectedRange.value.length, Quill.sources.USER);
    insertIndex = selectedRange.value.index; // Insert at the beginning of the deleted range
  }
  selectedRange.value = null; // Clear saved range

  quill.insertEmbed(insertIndex, 'customImage', {
    src: media.url,
    'media-id': media.media_id,
    alt: media.seo_tag || '',
    loading: 'lazy'
  }, Quill.sources.USER);

  quill.setSelection(insertIndex + 1, 0, Quill.sources.SILENT);
  emit('wysiwygMedia', media);
  sectionsMediaComponentRef.value?.closeModal();
});


function handleEmittedMedia(media) {
  selectedMedia.value = media;
}

function validate() {
  return true;
}

function uploadFunction(mediaId = null) {
  sectionsMediaComponentRef.value?.openModal(mediaId, null);
}

function saveFormat() {
  const quill = myQuillEditorRef.value?.getQuill();
  if (quill) {
    const selection = quill.getSelection();
    if (selection) {
      const format = quill.getFormat(selection);
      sectionsQuillFormatCookie.value = JSON.stringify(format);
    }
  }
}

function applyFormat() {
  const savedFormatJson = sectionsQuillFormatCookie.value;
  const quill = myQuillEditorRef.value?.getQuill();
  if (quill && savedFormatJson) {
    const selection = quill.getSelection();
    if (selection) {
      try {
        const savedFormat = JSON.parse(savedFormatJson);
        quill.formatText(selection.index, selection.length, savedFormat, Quill.sources.USER);
      } catch (e) {
        console.error("Failed to parse or apply saved format:", e);
        sectionsQuillFormatCookie.value = null;
      }
    }
  }
}

const vueQuill = await import('@vueup/vue-quill');
QuillEditorComponent = vueQuill.QuillEditor;
Quill = vueQuill.Quill; // Assign the Quill library constructor


// This function will be called when Quill editor is ready
// All Quill specific registrations and toolbar modifications happen here.
const onQuillEditorReady = async (quillInstanceParam) => {
  // The 'quillInstanceParam' is the actual Quill instance from the @ready event
  // We also need the main Quill library constructor for imports/registrations

  console.log("QUILL IS READY")

  if (!Quill) {
    console.error("Quill library (constructor) not loaded.");
    return;
  }

  const quill = quillInstanceParam; // The editor instance

  // --- Register Quill Blots, Formats, and Modules ---
  if (!Quill.prototype.pasteHTML) {
    Quill.prototype.pasteHTML = function (html) {
      if (this.clipboard && this.clipboard.convert) {
        const delta = this.clipboard.convert({ html: html, text: '\n' });
        this.setContents(delta);
      }
    };
  }

  const ImageBlot = Quill.import("formats/image");
  class CustomImageBlot extends ImageBlot {
    static blotName = "customImage";
    static tagName = "img";
    static create(value) {
      let node = super.create(value.src);
      Object.keys(value).forEach(attr => {
        if (attr !== 'src') node.setAttribute(attr, value[attr]);
      });
      return node;
    }
    static value(node) {
      const value = { src: node.getAttribute('src') };
      if (node.hasAttribute('alt')) value.alt = node.getAttribute('alt');
      if (node.hasAttribute('media-id')) value['media-id'] = node.getAttribute('media-id');
      if (node.hasAttribute('loading')) value.loading = node.getAttribute('loading');
      return value;
    }
  }
  Quill.register(CustomImageBlot, true);


  const Embed = Quill.import('blots/embed');
  class ButtonBlot extends Embed {
    static blotName = 'button';
    static tagName = 'span';
    static className = 'quill-button-wrapper';
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
      buttonContainer.setAttribute('data-label', value.label || 'Button');
      buttonContainer.setAttribute('data-link', value.link || '#');
      buttonContainer.appendChild(anchor);
      node.appendChild(buttonContainer);
      return node;
    }
    static value(node) {
      const buttonContainer = node.querySelector('.quill-button-container');
      return buttonContainer ? {
        label: buttonContainer.getAttribute('data-label') || '',
        link: buttonContainer.getAttribute('data-link') || '#'
      } : {};
    }
  }
  Quill.register(ButtonBlot);

  class ButtonToolbarModule {
    constructor(q, opts) {
      this.quill = q; this.options = opts; this.toolbar = q.getModule('toolbar');
      if (this.toolbar) this.toolbar.addHandler('button', this.handleButtonAction.bind(this));
      this.selectedButtonId = null;
      this.quill.on('selection-change', this.handleSelectionChange.bind(this));
    }
    handleSelectionChange(range) {
      this.selectedButtonId = null; if (!range) return;
      const [blot] = this.quill.getLeaf(range.index); if (!blot) return;
      let currentNode = blot.domNode;
      while (currentNode && !this.selectedButtonId) {
        if (currentNode.classList && currentNode.classList.contains('quill-button-wrapper')) {
          const btnContainer = currentNode.querySelector('.quill-button-container');
          if (btnContainer) this.selectedButtonId = btnContainer.getAttribute('data-button-id');
          break;
        }
        currentNode = currentNode.parentNode;
      }
    }
    handleButtonAction() {
      if (this.selectedButtonId) {
        const btnEl = this.quill.root.querySelector(`.quill-button-container[data-button-id="${this.selectedButtonId}"]`);
        if (btnEl) { this.editButton(btnEl); return; }
      }
      this.createButton();
    }
    createButton() {
      const label = prompt('Button Label:', ''); if (!label) return;
      const link = prompt('Button Link:', '');
      const range = this.quill.getSelection(true);
      this.quill.insertEmbed(range.index, 'button', { label: label, link: link }, Quill.sources.USER);
      this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    }
    editButton(buttonElement) {
      if (!buttonElement) return;
      const currentLabel = buttonElement.getAttribute('data-label');
      const currentLink = buttonElement.getAttribute('data-link');
      const newLabel = prompt('Edit Button Label:', currentLabel); if (newLabel === null) return;
      const newLink = prompt('Edit Button Link:', currentLink);
      const anchorElement = buttonElement.querySelector('a');
      anchorElement.innerText = newLabel; anchorElement.href = newLink;
      buttonElement.setAttribute('data-label', newLabel); buttonElement.setAttribute('data-link', newLink);
      this.selectedButtonId = null;
    }
  }
  Quill.register('modules/buttonToolbar', ButtonToolbarModule);

  const BlockEmbed2 = Quill.import('blots/block/embed');
  class HTMLBlot extends BlockEmbed2 {
    static blotName = 'html'; static tagName = 'div'; static className = 'ql-custom-html';
    static create(value) {
      const node = super.create();
      const container = document.createElement('div');
      container.classList.add('ql-html-container'); container.innerHTML = value;
      node.appendChild(container); node.setAttribute('data-html', value);
      return node;
    }
    static value(node) { return node.getAttribute('data-html'); }
  }
  Quill.register(HTMLBlot);

  class HTMLModule {
    constructor(q, opts) {
      this.quill = q; this.options = opts || {}; this.toolbar = q.getModule('toolbar');
      if (this.toolbar) this.toolbar.addHandler('html', this.handleHTML.bind(this));
      this.createHTMLEditor(); // Uses global refs htmlModalElement, etc.
    }
    createHTMLEditor() {
      htmlModalElement = document.createElement('div'); htmlModalElement.className = 'ql-html-editor-modal';
      const modalContent = document.createElement('div'); modalContent.className = 'ql-html-editor-content';
      htmlEditorTextareaElement = document.createElement('textarea'); htmlEditorTextareaElement.className = 'ql-html-editor-textarea';
      const buttonContainer = document.createElement('div'); buttonContainer.className = 'ql-html-editor-buttons';
      const saveButton = document.createElement('button'); saveButton.textContent = 'Save'; saveButton.className = 'ql-html-editor-save';
      const cancelButton = document.createElement('button'); cancelButton.textContent = 'Cancel'; cancelButton.className = 'ql-html-editor-cancel';
      const noteText = document.createElement('div'); noteText.textContent = 'Use with caution...'; noteText.className = 'ql-html-editor-noteText';
      buttonContainer.appendChild(saveButton); buttonContainer.appendChild(cancelButton); buttonContainer.appendChild(noteText);
      modalContent.appendChild(htmlEditorTextareaElement); modalContent.appendChild(buttonContainer);
      htmlModalElement.appendChild(modalContent);
      saveButton.addEventListener('click', () => this.saveHTML());
      cancelButton.addEventListener('click', () => this.hideHTMLEditor());
      htmlModalElement.addEventListener('click', (event) => { if (event.target === htmlModalElement) this.hideHTMLEditor(); });
      document.body.appendChild(htmlModalElement);
      htmlModalElement.style.display = 'none';
    }
    handleHTML() {
      const range = this.quill.getSelection(true);
      currentEditingHTMLBlotRange.value = range;
      let existingHTML = '';
      // Simplified: always edit full content for now, or implement blot detection
      existingHTML = this.quill.root.innerHTML;
      this.showHTMLEditor(existingHTML);
    }
    showHTMLEditor(html) {
      htmlEditorTextareaElement.value = html;
      htmlModalElement.style.display = 'flex';
      setTimeout(() => htmlEditorTextareaElement.focus(), 0);
    }
    hideHTMLEditor() { htmlModalElement.style.display = 'none'; }
    saveHTML() {
      const html = htmlEditorTextareaElement.value;
      if (html) {
        const length = this.quill.getLength();
        this.quill.deleteText(0, length, Quill.sources.USER);
        this.quill.insertEmbed(0, 'html', html, Quill.sources.USER);
        this.quill.setSelection(this.quill.getLength(), 0, Quill.sources.USER);
      }
      this.hideHTMLEditor();
    }
  }
  Quill.register('modules/html', HTMLModule);

  const Size = Quill.import('attributors/style/size'); Size.whitelist = fontsArray; Quill.register(Size, true);
  const LinkFormat = Quill.import('formats/link'); // Renamed to avoid conflict
  class MyLink extends LinkFormat {
    static create(value) {
      let node = super.create(value);
      value = this.sanitize(value); node.setAttribute('href', value);
      if(!value.startsWith("http")) node.removeAttribute('target'); else node.setAttribute('target', '_blank');
      return node;
    }
  }
  Quill.register(MyLink, true);

  // Dynamic import and register third-party modules
  if (!EmojiLib) EmojiLib = await import("@devdcodes9/quill-emojijs");
  Quill.register("modules/emoji-toolbar", EmojiLib.default.ToolbarEmoji);
  Quill.register('formats/emoji', EmojiLib.default.EmojiBlot);

  if (!QuillTableUILib) QuillTableUILib = await import('quill-table-ui');
  Quill.register({ 'modules/tableUI': QuillTableUILib.default }, true);

  // Toolbar and DOM modifications
  await nextTick(); // Ensure editor DOM is fully rendered

  const toolbar = quill.getModule('toolbar');
  if (toolbar) {
    toolbar.addHandler('image', () => {
      selectedRange.value = null;
      let mediaIdToEdit = null;
      const currentRange = quill.getSelection();
      if (currentRange) {
        selectedRange.value = currentRange;
        if (currentRange.length > 0) {
          const delta = quill.getContents(currentRange.index, currentRange.length);
          if (delta?.ops?.length === 1 && delta.ops[0].insert?.customImage?.['media-id']) {
            mediaIdToEdit = delta.ops[0].insert.customImage['media-id'];
          }
        }
      }
      uploadFunction(mediaIdToEdit);
    });
  }

  const editorElement = myQuillEditorRef.value?.$el; // QuillEditor's root DOM element
  if (editorElement) {
    editorElement.querySelectorAll('.ql-save-format').forEach(btn => {
      btn.innerHTML = '<div title="Save format">...SVG...</div>'; // Truncated SVG
      btn.addEventListener('click', saveFormat);
    });
    editorElement.querySelectorAll('.ql-apply-format').forEach(btn => {
      btn.innerHTML = '<div title="Apply format">...SVG...</div>'; // Truncated SVG
      btn.addEventListener('click', applyFormat);
    });
    editorElement.querySelectorAll('.ql-button').forEach(btn => {
      btn.innerHTML = '<div title="Add/Edit button">...SVG...</div>'; // Truncated SVG
    });
    editorElement.querySelectorAll('.ql-table-button').forEach(btn => {
      btn.innerHTML = '<div title="Insert Table">...SVG...</div>'; // Truncated SVG
      btn.addEventListener('click', () => quill.getModule('table').insertTable(3, 3));
    });

    const additionalButton = editorElement.querySelector('.ql-show-additional');
    if(additionalButton){
        additionalButton.innerHTML = '<div title="Show additional options">&gt;</div>';
        additionalButton.addEventListener('click', (e) => {
            const rootEl = editorElement; // editorElement is the .quill-editor wrapper
            const formatGroups = rootEl?.querySelectorAll('.ql-toolbar.ql-snow .ql-formats') || [];
            let anyVisible = false;
            formatGroups.forEach((el) => {
            const isAdditional = el.querySelector('button.ql-formula, button.ql-blockquote, button.ql-code-block, button.ql-script, button.ql-direction, button.ql-emoji, button.ql-button, button.ql-html, button.ql-table-button');
            if (isAdditional) {
                if (el.style.display === 'inline-block' || el.style.display === '') {
                    el.style.display = 'none';
                } else {
                    el.style.display = 'inline-block';
                    anyVisible = true;
                }
            }
            });
            additionalButton.innerHTML = `<div title="${anyVisible ? 'Hide' : 'Show'} additional options">${anyVisible ? '&lt;' : '&gt;'}</div>`;
        });
        // Initially hide additional groups
        editorElement.querySelectorAll('.ql-toolbar.ql-snow .ql-formats').forEach(el => {
            const isAdditional = el.querySelector('button.ql-formula, button.ql-blockquote, button.ql-code-block, button.ql-script, button.ql-direction, button.ql-emoji, button.ql-button, button.ql-html, button.ql-table-button');
            if (isAdditional) el.style.display = 'none';
        });
    }
  }

  // Set initial content if not already matching (v-model might handle this)
  if (quill.root.innerHTML !== props.html) {
      if (props.html === "<p><br></p>" && quill.getLength() <=1 ) { /* Do nothing */ }
      else {
          quill.clipboard.dangerouslyPasteHTML(0, props.html);
          // No need to update settings.value here if v-model:content handles it
      }
  }
};


onBeforeUnmount(() => {
  if (htmlModalElement && htmlModalElement.parentNode === document.body) {
    document.body.removeChild(htmlModalElement);
    htmlModalElement = null; // Clean up
  }
});

// Ensure QuillEditor and Quill are available before component is fully mounted
// This is handled by <ClientOnly> and the onQuillEditorReady event
onMounted(async () => {
  // The main dynamic imports for Quill library and component happen in onQuillEditorReady
  // or can be initiated here if not using @ready.
  // Since we use @ready, most of the heavy lifting is there.
  // If QuillEditorComponent is not assigned by @ready for some reason, dynamic import it.
  if (process.client && !QuillEditorComponent) {
    const vueQuill = await import('@vueup/vue-quill');
    QuillEditorComponent = vueQuill.QuillEditor;
    // Quill constructor is loaded in onQuillEditorReady if not already.
  }
});

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
</style>


<style>
.ql-toolbar.ql-snow .ql-formats button.ql-save-format, .ql-toolbar.ql-snow .ql-formats button.ql-apply-format {
  width: auto !important;
  padding: 0 2px 0 8px !important
}
.ql-apply-format:after, .ql-save-format:after {
  content: "" !important;
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
.ql-picker.ql-size .ql-picker-label[data-value]::before, .ql-picker.ql-size .ql-picker-item[data-value]::before {
  content: attr(data-value) !important;
}
.ql-editor p {
  font-size: 1rem;
}
.ql-snow .ql-size.ql-picker.ql-expanded .ql-picker-options {
  max-height: 250px;
  overflow-y: scroll;
}
.ql-toolbar.ql-snow .ql-formats:has(button.ql-formula),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-blockquote),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-code-block),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-script),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-direction),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-emoji),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-button),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-html),
.ql-toolbar.ql-snow .ql-formats:has(button.ql-table-button) {
  display: none;
}
</style>
