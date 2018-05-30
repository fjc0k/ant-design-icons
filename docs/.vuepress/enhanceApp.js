import ElementUI from 'element-ui'
import VueClipboards from 'vue-clipboards'
import './elTheme/index.css'
import '../../dist/anticons.css'

export default ({ Vue }) => {
  Vue.use(ElementUI)
  Vue.use(VueClipboards)
}
