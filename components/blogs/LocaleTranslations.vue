<template>
  <div v-if="defaultLocale" id="LocaleTranslations" class="flex flex-row gap-2">
    <div v-for="(lang, langIdx) in locales" :key="`lang-item-${langIdx}`" :data-testid="`locale-trans-item-${lang.key}`" class="flex px-2 py-2 uppercase md:cursor-pointer h-max" :class="[lang.key === selectedTranslationLang ? langButtonSelectedStyle : langButtonStyle, `locale-trans-item-${lang.key}`]" @click="$emit('locale-clicked', lang)">
      {{ lang.key }}
    </div>
  </div>
</template>

<script>
export default {
  name: "LocaleTranslations",
  props: {
    defaultLocale: {
      type: String,
      default: ''
    },
    locales: {
      type: Array,
      default() {
        return []
      }
    },
    langButtonSelectedStyle: {
      type: String,
      default: ''
    },
    langButtonStyle: {
      type: String,
      default: ''
    },
    selectedTranslationLang: {
      type: String,
      default: ''
    }
  }
}
</script>
