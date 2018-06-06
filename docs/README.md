# 这是一套提取自 Ant Design 的高质量图标。

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
      <el-table-column prop="value">
        <div slot-scope="{ row }">
          {{ row.value }}
          <el-button
            size="small"
            v-clipboard="row.value"
            @success="$message.success('代码已复制~')"
            @error="$message.error('代码复制失败~')">
            复制
          </el-button>
        </div>
      </el-table-column>
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
      const info = Object.keys(this.selectedIcon).map(key => {
        return {
          key,
          value: this.selectedIcon[key]
        }
      })
      info.unshift({
        key: 'SVG Sprite',
        value: `<svg><use xlink:href="#${this.selectedIcon.id}" /></svg>`
      })
      info.unshift({
        key: 'WEB Font',
        value: `<i class="ai-${this.selectedIcon.id}" />`
      })
      return info
    }
  },
  methods: {
    handleClick(icon) {
      this.selectedIcon = icon
      this.dialogVisible = true
    }
  }
}
</script>
