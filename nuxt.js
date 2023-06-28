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
}
