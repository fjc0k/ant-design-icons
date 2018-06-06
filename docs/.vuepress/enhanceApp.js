import {
  Button,
  Input,
  RadioGroup,
  RadioButton,
  Dialog,
  Table,
  TableColumn,
  Message
} from 'element-ui'

import VueClipboards from 'vue-clipboards'

require('../../dist/anticons.css');
require('./app.styl');

export default ({ Vue }) => {
  [
    Button,
    Input,
    RadioGroup,
    RadioButton,
    Dialog,
    Table,
    TableColumn
  ].forEach(component => Vue.component(component.name, component))
  Vue.prototype.$message = Message
  Vue.use(VueClipboards)
}
