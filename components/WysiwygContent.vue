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
</style>
