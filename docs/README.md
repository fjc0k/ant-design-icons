# Beautifully crafted open source icons

Premium designed icons for use in web, iOS, Android, and desktop apps. Support for SVG and web font. Completely open source, MIT licensed.

<el-input v-model="q" :placeholder="`Search in ${icons.length} icons...`" prefix-icon="el-icon-search" size="medium" clearable></el-input>

<div class="IconSet">
  <i v-for="icon in result" :key="icon.id" class="Icon" :class="`ai-${icon.id}`" @click="handleClick(icon)"></i>
</div>

<script>
import icons from '../dist/anticons.json'

export default {
  data() {
    return {
      icons,
      q: ''
    }
  },
  computed: {
    result() {
      return !this.q ? this.icons : this.icons.filter(icon => {
        return icon.id.indexOf(this.q) >= 0 || icon.name.indexOf(this.q) >= 0
      })
    }
  },
  methods: {
    handleClick(icon) {
      const h = this.$createElement
      this.$notify({
        title: icon.name,
        message: h('el-button-group', [
          h('el-button', {
            attrs: {
              icon: `ai-${icon.id}`
            }
          }),
          h('el-button', {
            attrs: {
              icon: `el-icon-download`
            }
          }, 'SVG')
        ]),
        duration: 0,
        showClose: false,
        position: 'bottom-left',
        customClass: 'InfoModel'
      })
    }
  }
}
</script>

<style lang="styl">
.IconSet {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.Icon {
  font-size: 32px;
  padding: 15px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: 500ms ease;

  &:hover {
    box-shadow: 0 3px 6px 0 rgba(0,0,0,0.1), 1px -1px 6px 3px rgba(0,0,0,0.08);
  }
}
.InfoModel {
  right: 16px;
  width: auto;
}
</style>
