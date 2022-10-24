const { defineConfig } = require('@vue/cli-service')
const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');
// //引入clean插件
// const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack:{
    plugins: [
        // new CleanWebpackPlugin(),
      ComponentsPlugin({
        resolvers: [VantResolver()],
      })
    ],
    resolve: {
      alias:{
        'assets' :'@/assets',
        'components':'@/components',
        'network':'@/network',
        'utils':'@/utils',
        'views':'@/views',
      }
    }
  },
  publicPath:'/'
})
