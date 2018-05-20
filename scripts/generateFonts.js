const path = require('path')
const fs = require('fs-extra')
const webfontsGenerator = require('webfonts-generator')
const globby = require('globby')
const CleanCSS = require('clean-css')

class GenerateFonts {
  constructor() {
    this.srcPath = path.join(__dirname, '../src')
    this.distPath = path.join(__dirname, '../dist')
  }

  generate() {
    return new Promise((resolve, reject) => {
      fs.emptyDirSync(this.distPath)
      fs.copySync(this.srcPath, this.distPath)
      const options = this.getOptions()
      webfontsGenerator(options, err => {
        if (err) {
          reject(err)
        } else {
          this.minifyCSS(options.cssDest).then(resolve, reject)
        }
      })
    })
  }

  minifyCSS(CSSPath) {
    return new Promise((resolve, reject) => {
      new CleanCSS({ rebase: false, returnPromise: true })
        .minify([CSSPath])
        .then(
          ({ styles }) => {
            fs.outputFileSync(CSSPath.replace(/\.css$/, '.min.css'), styles)
            resolve()
          },
          reject
        )
    })
  }

  getOptions() {
    return {
      files: globby.sync(path.join(this.srcPath, 'svg/*.svg')),
      dest: path.join(this.distPath, 'font'),
      fontName: 'anticons',
      codepoints: require('../src/anticons.json').reduce((codepoints, icon) => {
        codepoints[icon.id] = parseInt(icon.unicode, 16)
        return codepoints
      }, {}),
      css: true,
      cssDest: path.join(this.distPath, 'anticons.css'),
      cssTemplate: path.join(__dirname, './templates/anticons.hbs'),
      cssFontsUrl: './font',
      types: ['svg', 'ttf', 'woff', 'woff2', 'eot'],
      templateOptions: {
        classPrefix: 'ai-',
        baseSelector: '.ai',
        cssFontsUrl: './font',
        version: require('../package.json').version
      },
      descent: 128
    }
  }
}

new GenerateFonts()
  .generate()
  .then(
    () => console.log('success'),
    console.error
  )
