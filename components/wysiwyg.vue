<template>
  <div class="input">
    <quill-editor :key="quillKey" ref="myQuillEditor" v-model="settings" :options="options" class="wyzywig" />
    <MediaComponent ref="sectionsMediaComponent" :content-used-key="contentUsedKey" :auth-token="authToken" :server-url="serverUrl" :project-id="projectIdProp" :sections-user-id="sectionsUserId" :selected-media-id="$route.query.id" @emittedMedia="(media) => selectedMedia = media"></MediaComponent>
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
    }
  },
  data() {
    return {
      settings: "",
      savedFormat: null,
      selectedMedia: null,
      options: null
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
      const range = this.$refs.myQuillEditor.quill.getSelection();
      this.$refs.myQuillEditor.quill.insertEmbed(range ? range.index : 0, 'image', media.url);
      this.$emit('wysiwygMedia', media);
      this.$refs.sectionsMediaComponent.closeModal()
    }
  },
  created() {
    if (process.client) {
      let Emoji = require("quill-emoji");
      let Quill = require('quill');
      Quill.register("modules/emoji", Emoji);
    }

    if(this.editorOptions.modules && Object.keys(this.editorOptions.modules).length > 0) {
      this.options = this.editorOptions
    } else if(this.sectionsWysiwygEditorOptions && Object.keys(this.sectionsWysiwygEditorOptions).length > 0) {
      this.options = this.sectionsWysiwygEditorOptions
    } else {
      this.options = {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['link', 'image', 'video', 'formula'],
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': ['#03B1C7', '#61035B', '#fff', '#868686', '#011321', '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }, { 'background': ['#03B1C7', '#61035B', '#fff', '#868686', '#011321', '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['emoji'],
            ["save-format", "apply-format"],
          ],
          "emoji-toolbar": true,
          "emoji-textarea": true,
          "emoji-shortname": true,
        }
      }
    }
  },
  mounted() {
    this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', () => {
      this.uploadFunction();
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
  },
  methods: {
    validate() {
      return true;
    },
    uploadFunction() {
      this.$refs.sectionsMediaComponent.openModal(null, null)
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
</style>
