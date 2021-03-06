module.exports = {
  title: 'Ant Design Icons',
  description: 'Ant Design Icons 是一套提取自 Ant Design 的高质量图标，你可以自由地在 React、Vue 或其他框架中使用它。',
  base: '/ant-design-icons/',
  head: [
    ['link', {
      rel: 'icon',
      href: '/logo.png'
    }]
  ],
  themeConfig: {
    repo: 'fjc0k/ant-design-icons',
    nav: [
      { text: '图标', link: '/' },
      { text: '使用指南', link: '/guide' }
    ]
  },
  chainWebpack(config) {
    config.module
      .rule('js')
        .use('babel-loader')
          .tap(options => {
            options.plugins = [
              ...(options.plugins || []),
              [require.resolve('babel-plugin-component'), {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk'
              }]
            ]
            return options
          })
  }
}
