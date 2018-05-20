/* eslint new-cap: 0 no-eval: 0 */
const _ = require('lodash')
const path = require('path')
const fs = require('fs-extra')
const fontBlast = require('font-blast')
const globby = require('globby')
const axios = require('axios')
const Entities = require('html-entities').AllHtmlEntities

class ExtractIcons {
  constructor(version) {
    this.version = version
    this.iconSetUrl = `https://raw.githubusercontent.com/ant-design/ant-design/${version}/site/theme/template/IconSet/index.jsx`
    this.styleVarsUrl = `https://raw.githubusercontent.com/ant-design/ant-design/${version}/components/style/themes/default.less`
    this.iconfontStyleUrl = `https://raw.githubusercontent.com/ant-design/ant-design/${version}/components/style/core/iconfont.less`
    this.targetPath = path.resolve(__dirname, '../src')
  }

  async extract() {
    const tmpPath = path.resolve(__dirname, '__tmp')

    // Extract font.svg
    const SVGFont = await this.getSVGFont()
    const SVGFontFile = path.join(tmpPath, 'font/anticons.svg')
    fs.outputFileSync(SVGFontFile, SVGFont)

    // Extract icons.json
    const iconSet = await this.getIconSet()
    const iconSetFile = path.join(tmpPath, 'anticons.json')
    fs.outputFileSync(iconSetFile, JSON.stringify(iconSet, null, 2))

    // Extract individual SVG files
    await fontBlast(SVGFontFile, tmpPath, {
      filenames: iconSet.reduce((filenames, icon) => {
        filenames[icon.unicode] = icon.id
        return filenames
      }, {})
    })

    // Remove unexpected svg files
    const iconIds = iconSet.reduce((iconIds, icon) => {
      iconIds.push(icon.id)
      return iconIds
    }, [])
    const SVGFilesPath = path.join(tmpPath, 'svg')
    const files = globby.sync('*.svg', {
      cwd: SVGFilesPath
    })
    files.forEach(file => {
      const base = path.basename(file, '.svg')
      if (!iconIds.includes(base)) {
        fs.removeSync(path.join(SVGFilesPath, file))
      }
    })

    // Move
    fs.emptyDirSync(this.targetPath)
    fs.moveSync(SVGFilesPath, path.join(this.targetPath, 'svg'))
    fs.moveSync(iconSetFile, path.join(this.targetPath, 'anticons.json'))
    fs.removeSync(tmpPath)
  }

  async fetch(url) {
    const { data } = await axios.get(url)
    return data
  }

  async getSVGFont() {
    const entities = new Entities()
    const styleVars = await this.fetch(this.styleVarsUrl)
    const SVGFontUrl = styleVars.match(/@icon-url\s*:\s*"([^"]+)"/s)[1] + '.svg'
    const SVGFont = await this.fetch(SVGFontUrl)
    return SVGFont.replace(/unicode="([^"]+)"/g, (_, $1) => {
      return `unicode="${
        /^&#/.test($1) ? '&#x' + entities.decode($1).charCodeAt(0).toString(16) + ';' : $1
      }"`
    })
  }

  async getIconSet() {
    const iconSet = []
    const iconfontStyle = await this.fetch(this.iconfontStyleUrl)
    const code = await this.fetch(this.iconSetUrl)
    const icons = eval('true,' + code.match(/icons\s*=\s*(\{.+?\});/s)[1])
    Object.keys(icons).forEach(category => {
      icons[category].forEach(iconId => {
        iconSet.push({
          id: iconId,
          name: iconId.split('-').map(word => {
            const specials = {
              ie: 'IE',
              ppt: 'PPT',
              pdf: 'PDF',
              jpg: 'JPG',
              hdd: 'Hard Disk Drive',
              appstore: 'App Store',
              qrcode: 'QR Code',
              usb: 'USB',
              wifi: 'Wi-Fi',
              api: 'API',
              html5: 'HTML5',
              qq: 'QQ',
              gitlab: 'GitLab',
              github: 'GitHub',
              idcard: 'ID Card'
            }
            return specials[word] ? specials[word] : (
              word === 'o' ? 'Outlined' : _.upperFirst(word)
            )
          }).join(' '),
          category: category,
          unicode: iconfontStyle.match(
            new RegExp(`}-${iconId}:before\\s*{\\s*content:\\s*"\\\\([^"]+)"`, 's')
          )[1],
          version: this.version
        })
      })
    })
    return iconSet
  }
}

new ExtractIcons('3.5.2')
  .extract()
  .then(
    () => console.log('success'),
    console.error
  )
