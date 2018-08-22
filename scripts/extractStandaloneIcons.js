/* eslint new-cap: 0 no-eval: 0 */
const path = require('path')
const fs = require('fs-extra')
const axios = require('axios')
const extractZip = require('extract-zip')
const globby = require('globby')
const { version } = require('./config')

class ExtractStandaloneIcons {
  constructor(version) {
    this.version = version
    this.zipUrl = `https://github.com/ant-design/ant-design-icons/archive/${version}.zip`
    this.targetPath = path.resolve(__dirname, '../src/standalone')
    this.targetSVGPath = path.resolve(this.targetPath, 'svg')
  }

  async extract() {
    const tmpPath = path.resolve(__dirname, '__tmp3')

    fs.emptyDirSync(this.targetPath)

    const zip = await this.fetch(this.zipUrl)

    const zipFile = path.join(tmpPath, 'repo.zip')
    const repoDir = path.join(tmpPath, 'repo')

    fs.outputFileSync(zipFile, zip)

    extractZip(zipFile, { dir: repoDir }, err => {
      if (err) throw err

      globby([repoDir + '/*/svg/*.svg'])
        .then(svgFiles => {
          svgFiles.forEach(svgFile => {
            const { name, ext, dir } = path.parse(svgFile)
            let newName = name.toLowerCase().replace(/\s+/g, '-')
            newName = newName === 'check-close-circle' ? 'check-circle' : newName
            fs.renameSync(svgFile, path.join(dir, newName + ext))
          })
          fs.moveSync(path.parse(svgFiles[0]).dir, this.targetSVGPath)
          fs.removeSync(tmpPath)
        })
    })
  }

  async fetch(url) {
    const { data } = await axios.get(url, { responseType: 'arraybuffer' })
    return data
  }
}

new ExtractStandaloneIcons(version.standalone)
  .extract()
  .then(
    () => console.log('success'),
    console.error
  )
