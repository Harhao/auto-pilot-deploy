const path = require('path');

module.exports = {
  devServer: {
    host: 'localhost',
    port: 3000,
    hot: true,
    open: true,
    compress: true,
    historyApiFallback: true,
    overlay: false,
    contentBase: path.resolve(__dirname, '../dist'),
    quiet: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://mail.163.com',
        changeOrigin: true
      },
    },
  },
  isDll: true,
  dllName: 'vendor'
}
