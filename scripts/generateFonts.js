const path = require('path')
const fs = require('fs-extra')
const webfontsGenerator = require('webfonts-generator')
const globby = require('globby')
const CleanCSS = require('clean-css')

class GenerateFonts {
  constructor(version = 'desktop', classPrefix = 'ai', descent = 128) {
    this.version = version
    this.classPrefix = classPrefix
    this.descent = descent
    this.srcPath = path.join(__dirname, '../src', version === 'desktop' ? '' : version)
    this.distPath = path.join(__dirname, '../dist', version === 'desktop' ? '' : version)
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
      codepoints: require(path.join(this.srcPath, 'anticons.json')).reduce((codepoints, icon) => {
        codepoints[icon.id] = parseInt(icon.unicode, 16)
        return codepoints
      }, {}),
      css: true,
      cssDest: path.join(this.distPath, 'anticons.css'),
      cssTemplate: path.join(__dirname, './templates/anticons.hbs'),
      cssFontsUrl: './font',
      types: ['svg', 'ttf', 'woff', 'woff2', 'eot'],
      templateOptions: {
        fontFamily: `anticons-${this.version}`,
        classPrefix: `${this.classPrefix}-`,
        baseSelector: `.${this.classPrefix}`,
        cssFontsUrl: './font',
        version: require('../package.json').version
      },
      descent: this.descent
    }
  }
}

new GenerateFonts('desktop', 'ai', 128)
  .generate()
  .then(
    () => console.log('success'),
    console.error
  )

// new GenerateFonts('mobile', 'ami', 0)
//   .generate()
//   .then(
//     () => console.log('success'),
//     console.error
//   )
