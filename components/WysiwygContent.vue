<template>
  <div :class="[wrapperDefaultClasses, wrapperClasses]">
    <component :is="tag" :class="[defaultClasses, classes]" v-html="htmlContent"></component>
  </div>
</template>

<script>
export default {
  name: "WysiwygContent",
  props: {
    tag: {
      type: String,
      default: "div"
    },
    htmlContent: {
      type: String,
      default: ""
    },
    wrapperDefaultClasses: {
      type: String,
      default: "ql-snow"
    },
    wrapperClasses: {
      type: String,
      default: ""
    },
    defaultClasses: {
      type: String,
      default: "ql-editor"
    },
    classes: {
      type: String,
      default: ""
    }
  },
  created() {
    import("quill/dist/quill.snow.css");
  }
}
</script>

<style>
.ql-editor blockquote, .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6, .ql-editor ol, .ql-editor p, .ql-editor pre, .ql-editor ul {
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  margin: 0;
  padding: 0;
}
.ql-editor ol, .ql-editor ul {
  padding-left: 1.5em;
}
.ql-editor ul>li:before {
  content: "\2022";
}
.ql-editor ol li:not([data-list="bullet"]):not([data-list="checked"]):not([data-list="unchecked"]):before {
  content: counter(list-0, decimal) ". ";
}
.ql-editor ol li {
  counter-increment: list-0;
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor li:before {
  display: inline-block;
  white-space: nowrap;
  width: 1.2em;
}
.ql-editor ol>li, .ql-editor ul>li {
  list-style-type: none;
}
.ql-editor ol li:not(.ql-direction-rtl), .ql-editor ul li:not(.ql-direction-rtl) {
  padding-left: 1.5em;
}
.ql-editor li:not(.ql-direction-rtl):before {
  margin-left: -1.5em;
  margin-right: .3em;
  text-align: right;
}
.ql-snow .ql-editor pre.ql-syntax {
  background-color: #23241f;
  color: #f8f8f2;
  overflow: visible;
}
.ql-snow .ql-editor pre {
  margin-bottom: 5px;
  margin-top: 5px;
  padding: 5px 10px;
  white-space: pre-wrap;
}
section .ql-editor img {
  display: inline !important;
}
.quill-button-wrapper {
  display: inline-block;
  margin: 0 4px;
  vertical-align: middle;
}
button.quill-button-container {
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  padding: 3px 10px !important;
  border-radius: 4px !important;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  transition: background-color 0.3s;
  display: inline-block;
}
.quill-button-container:hover {
  background-color: #e9e9e9;
}
.ql-a-button {
  color: #000 !important;
  text-decoration: none !important;
  cursor: pointer;
  display: inline-block;
}
.ql-button {
  width: 28px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
}
.ql-button svg {
  width: 18px;
  height: 18px;
}
</style>
