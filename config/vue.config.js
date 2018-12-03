const path = require('path');
const chalk = require('chalk');
const is_dev = process.env.NODE_ENV === 'development';
const is_pro = process.env.NODE_ENV === 'production';
const is_test = process.env.NODE_ENV === 'test';
const is_build_beta = process.env.VUE_BUILD_MODE === 'beta';
const is_build_pro = process.env.VUE_BUILD_MODE === 'pro';
function resolve (dir) {
  return path.join(__dirname, '.', dir)
}
const htmlOptions = () => {
  if (is_build_beta){
    return {
      template: path.resolve(__dirname, 'index_beta.html'),
      filmName: path.resolve(__dirname, './dist_beta/index.html')
    }
  } else if (is_build_pro){
    return {
      template: path.resolve(__dirname, 'index_pro.html'),
      filmName: path.resolve(__dirname, './dist_pro/index.html')
    }
  }
  return {};
};

const setProConfig = (config) => {
}

const setBetaConfig = (config) => {
}

const setDevConfig = (config) => {
}

module.exports = {
  baseUrl: './',
  indexPath: 'index.html',
  devServer: {
    port: 8084
  },
  productionSourceMap: !is_build_pro,
  chainWebpack: config => {
    config.plugin('html')
      .tap(args => {
        args[0] = {...args[0], ...htmlOptions()};
        return args;
      });
    config.plugin('define')
      .tap(args => {
        args[0]['process.env'] = {...args[0]['process.env'],
          VUE_BUILD_MODE: `"${process.env.VUE_BUILD_MODE}"`}
        return args;
      });
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        // 修改它的选项...
        options.publicPath = (_) => {
          try{
            const config = require('./.jbz.oss.config.js');
            let baseUrl = '';
            if (is_pro){
              baseUrl = `https://${config.buckets}.${config.region}.aliyuncs.com/${config.ossDirectory}`;
              console.log(chalk.green(`文件映射到路径（成功则是阿里云路径）: ${_}  =>  ${baseUrl + _}`));
            }
            return baseUrl + _;
          } catch(error) {
            console.log(chalk.yellow(`.jbz.oss.config.js Not Found. 没有上传阿里云文件: ${_}`));
            return _;
          }
        }
        return options
      })
  },
  configureWebpack: config => {
    let releaseConfig = '';
    if (is_dev || is_test){
      releaseConfig = path.resolve(__dirname, './src/config/ReleaseConfig.js');
    } else if (is_pro) {
      if (is_build_beta){
        releaseConfig = path.resolve(__dirname, './src/config/ReleaseBetaConfig.js');
      } else if (is_build_pro){
        releaseConfig = path.resolve(__dirname, './src/config/ReleaseProConfig.js');
      }
    }
    let alias = {
    };
    for(let key in alias){
      if (alias.hasOwnProperty(key)){
        alias[key] = resolve(alias[key])
      }
    }
    config.resolve.alias = {...config.resolve.alias,
      ...alias,
      ...{
        'release-config': releaseConfig
      }};
    config.externals = {
      "BMap": "BMap"
    }
    if (is_pro) {
      // 为生产环境修改配置...
      if (is_build_beta){
        setBetaConfig(config)
      } else {
        setProConfig(config)
      }
    } else if (is_dev){
      // 为开发环境修改配置...
      setDevConfig(config)
    }
  },
  outputDir: (() => {
    if (is_build_beta){
      return path.resolve(__dirname, './dist_beta')
    } else if (is_build_pro){
      return path.resolve(__dirname, './dist_pro')
    }
  })(),
  css: {
    loaderOptions: {
      sass: {
        // data: '@import "~@assets/styles/index.scss";'
        // includePaths: [
        //     path.resolve(__dirname, './src/assets/style/index.scss')
        // ]
      }
    }
  }
};
