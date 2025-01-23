import { join } from 'path'

export default function() {
  this.nuxt.hook('components:dirs', dirs => {
    // Add ./components dir to the list
    dirs.push({
      path: join(__dirname, 'components'),
      prefix: 'g'
    })
  })
  this.nuxt.hook('plugins:dirs', dirs => {
    // Add ./components dir to the list
    dirs.push({
      path: join(__dirname, 'plugins')
    })
  })
  this.nuxt.hook('i18n:extend-messages', (additionalMessages) => {
    additionalMessages.push({
      en: {
        quillEditor: {
          quillDesc: "To edit an image added to your editor, you need to select it and click on the image icon of the toolbar"
        }
      },
      fr: {
        quillEditor: {
          quillDesc: "Pour éditer une image ajoutée à votre éditeur, vous devez la sélectionner et cliquer sur l'icone image de la barre d'outil"
        }
      }
    })
  })
}
