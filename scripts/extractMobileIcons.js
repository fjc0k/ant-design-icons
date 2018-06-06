/* eslint new-cap: 0 no-eval: 0 */
const _ = require('lodash')
const path = require('path')
const fs = require('fs-extra')
const axios = require('axios')
const { version } = require('./config')

class ExtractMobileIcons {
  constructor(version) {
    this.version = version
    this.iconSetUrl = `https://raw.githubusercontent.com/ant-design/ant-design-mobile/${version}/components/icon/loadSprite.tsx`
    this.targetPath = path.resolve(__dirname, '../src/mobile')
  }

  async extract() {
    const tmpPath = path.resolve(__dirname, '__tmp2')

    // Extract individual SVG files & generate index.js
    const modules = []
    const indexFile = path.join(tmpPath, 'index.js')
    const SVGFilesPath = path.join(tmpPath, 'svg')
    const icons = await this.getIconSet()
    icons.forEach(icon => {
      modules.push(`export { default as ${_.camelCase(icon.id)} } from './svg/${icon.id}.svg'`)
      fs.outputFileSync(path.join(SVGFilesPath, `${icon.id}.svg`), icon.svg)
    })
    fs.outputFileSync(indexFile, modules.join('\n') + '\n')

    // Extract icons.json
    const iconSetFile = path.join(tmpPath, 'anticons.json')
    fs.outputFileSync(iconSetFile, JSON.stringify(icons.map(icon => {
      delete icon.svg
      return icon
    }), null, 2))

    // Move
    fs.emptyDirSync(this.targetPath)
    fs.moveSync(SVGFilesPath, path.join(this.targetPath, 'svg'))
    fs.moveSync(iconSetFile, path.join(this.targetPath, 'anticons.json'))
    fs.moveSync(indexFile, path.join(this.targetPath, 'index.js'))
    fs.removeSync(tmpPath)
  }

  async fetch(url) {
    const { data } = await axios.get(url)
    return data
  }

  async getIconSet() {
    const iconSet = []
    const code = await this.fetch(this.iconSetUrl)
    const icons = eval('true,' + code.match(/const icons: \{ \[key: string\]: string \} = (\{.+?\});/s)[1])
    Object.keys(icons).forEach((iconId, index) => {
      iconSet.push({
        id: iconId,
        name: iconId.split('-').map(word => {
          return word === 'o' ? 'Outlined' : _.upperFirst(word)
        }).join(' '),
        category: 'mobile',
        unicode: Number(0xF600 + index).toString(16),
        version: this.version,
        svg: icons[iconId]
          .replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"')
      })
    })
    return iconSet
  }
}

new ExtractMobileIcons(version.mobile)
  .extract()
  .then(
    () => console.log('success'),
    console.error
  )
