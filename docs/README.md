# 这是一套提取自 [<i class="ai-ant-design"></i>](https://ant.design/) 的高质量图标。

1. 输入英文关键词搜索图标。

<el-input v-model="q" :placeholder="`共有 ${icons.length} 个图标...`" prefix-icon="el-icon-search" size="medium" clearable></el-input>

2. 点击图标复制代码。

<div class="Cat">
  <el-radio-group v-model="cat">
    <el-radio-button label="all">全部</el-radio-button>
    <el-radio-button label="direction">方向</el-radio-button>
    <el-radio-button label="logo">Logo</el-radio-button>
    <el-radio-button label="other">其他</el-radio-button>
  </el-radio-group>
</div>

<div class="IconSet">
  <i
    v-for="icon in result"
    :key="icon.id"
    :title="icon.name"
    class="Icon"
    :class="`ai-${icon.id}`"
    @click="handleClick(icon)"
  />
</div>

<div>
  <el-dialog width="90%" :visible.sync="dialogVisible">
    <div slot="title">
      <i :class="`ai-${selectedIcon.id}`" /> {{ selectedIcon.name }}
    </div>
    <el-table :show-header="false" :data="selectedIconInfo">
      <el-table-column prop="key" />
      <el-table-column prop="value" />
    </el-table>
  </el-dialog>
</div>

<script>
import icons from '../dist/anticons.json'

export default {
  data() {
    return {
      icons,
      q: '',
      cat: 'all',
      dialogVisible: false,
      selectedIcon: {}
    }
  },
  computed: {
    result() {
      return this.icons.filter(icon => {
        return (
          this.q ? (icon.id.indexOf(this.q) >= 0 || icon.name.indexOf(this.q) >= 0) : true
        ) && (
          this.cat === 'all' ? true : icon.category === this.cat
        )
      })
    },
    selectedIconInfo() {
      return Object.keys(this.selectedIcon).map(key => {
        return {
          key,
          value: this.selectedIcon[key]
        }
      })
    }
  },
  methods: {
    handleClick(icon) {
      this.selectedIcon = icon
      this.dialogVisible = true
      // const h = this.$createElement
      // this.$notify({
      //   title: icon.name,
      //   message: h('el-button-group', [
      //     h('el-button', {
      //       attrs: {
      //         icon: `ai-${icon.id}`
      //       }
      //     }),
      //     h('el-button', {
      //       attrs: {
      //         icon: `el-icon-download`
      //       }
      //     }, 'SVG')
      //   ]),
      //   duration: 0,
      //   showClose: false,
      //   position: 'bottom-left',
      //   customClass: 'InfoModel'
      // })
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
    box-shadow: 0px 0px 9px 1px rgba(62,175,124,0.529);
  }
}
.InfoModel {
  right: 16px;
  width: auto;
}
.Cat {
  text-align: center;
}
</style>
