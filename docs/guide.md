---
sidebar: auto
---

# 使用指南

## 使用 WEB Font

`WEB Font` 是一个传统的使用方式，它通过类名去引用图标。优势是你只需引入一个 CSS 文件，不足是你必须全量引入 CSS 文件及其配套的字体文件，体积略大。

### 安装

#### Webpack

首先，通过包管理器安装 `ant-design-icons`：

```bash
# yarn
yarn add ant-design-icons

# npm
npm install ant-design-icons --save
```

然后，在你的项目入口文件处引入 CSS：

```js
import 'ant-design-icons/dist/anticons.min.css'
```

::: tip 提示
你可能需要安装 [css-loader](https://github.com/webpack-contrib/css-loader) 去处理 CSS 文件，安装 [url-loader](https://github.com/webpack-contrib/url-loader) 去处理字体文件。
:::

#### CDN

复制下面的代码放到 HTML 文档的 `<head>` 标签内：

```html
<link href="https://cdn.jsdelivr.net/npm/ant-design-icons/dist/anticons.min.css" rel="stylesheet">
```

### 使用

`WEB Font` 使用类名去展现图标，`ant-design-icons` 的类名规则是 `ai-${图标ID}`，如：

```html
<i class="ai-smile-o" />
<i class="ai-loading" />
```

效果是这样的：

<i class="ai-smile-o" style="margin-right:10px;" />
<i class="ai-loading" />


### 样式

你可以直接使用 CSS 去更改图标大小、颜色等：

```html
<i class="ai-smile-o" style="color:red;" />
<i class="ai-loading" style="color:blue;font-size:20px;" />
```

效果是这样的：

<i class="ai-smile-o" style="color:red;margin-right:10px;" />
<i class="ai-loading" style="color:blue;font-size:20px;" />


## 使用 SVG Sprite

`SVG Sprite` 类似 `CSS Sprite`，就是说将 SVG 图标整合在一起，然后通过图标 ID 去调用它们。可以看看这篇文章做个大致了解：[未来必热：SVG Sprite技术介绍](http://www.zhangxinxu.com/wordpress/2014/07/introduce-svg-sprite-technology/)

::: tip 注意
`SVG Sprite` 仅支持通过 `Webpack` 等前端构建工具使用。
:::

### 安装

```bash
# yarn
yarn add ant-design-icons

# npm
npm install ant-design-icons --save
```

### 按需引入 SVG 图标

如果你使用了 `Webpack 4`，下面的代码将按需加载对应的 SVG 文件：

```js
import { smileO, loading } from 'ant-design-icons'
```

如果你使用了 `Babel`，你可使用 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 实现按需加载：

```js
// .babelrc.js
module.exports = {
  plugins: [[
    'import',
    {
      libraryName: "ant-design-icons",
      customName: name => `ant-design-icons/dist/svg/${name}.svg`
    },
    'ant-design-icons'
  ]]
}
```

### 生成 SVG Sprite

上一步，我们按需引入了项目中使用的 SVG 图标。这一步，我们需要把它们生成 SVG Sprite。对此，你可能有两种需求：

#### 由 Webpack 自动生成并插入 SVG Sprite

[svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader) 了解一下。

#### 自行生成并插入 SVG Sprite

[svg-to-symbol-loader](https://github.com/fjc0k/svg-to-symbol-loader) 了解一下。

### 使用

如下：

```html
<svg>
  <use xlink:href="#smile-o" />
</svg>
```

效果如此：

<i class="ai-smile-o" />
