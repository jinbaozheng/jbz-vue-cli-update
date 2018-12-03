/**
 * Created by cuppi on 2018/11/17.
 */
const path = require('path');
const resolve = path.resolve;
const del = require('del');
const fs = require('fs');
const { series, task } = gulp = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const __torootdir = path.resolve(__dirname, './');
const {vuecli2_dependencies, vuecli2_dev_dependencies, vuecli3_dependencies, vuecli3_dev_dependencies} = require('./constant')
const jsonTransform = require('./handle_json');

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    resolve(fs.readFileSync(filePath, 'utf8'));
  })
}

function updatePackage(cb){
  gulp.src(resolve(__torootdir, './package.json'))
    .pipe(jsonTransform(function(data, file) {
      let deps = data.dependencies;
      let dev_deps = data.devDependencies;
      for (let p in vuecli2_dependencies){
        if (deps.hasOwnProperty(p)){
          delete data.dependencies[p];
        }
      }
      for (let p in vuecli2_dev_dependencies){
        if (dev_deps.hasOwnProperty(p)){
          delete data.devDependencies[p];
        }
      }
      for (let p in vuecli3_dependencies){
        data.dependencies[p] = vuecli3_dependencies[p]
      }
      for (let p in vuecli3_dev_dependencies){
        data.devDependencies[p] = vuecli3_dev_dependencies[p];
      }
      data.scripts = {
        'dev': 'vue-cli-service serve',
        'lint': 'vue-cli-service lint',
        'smart-build-beta': 'jbz-oss-build beta',
        'smart-build-pro': 'jbz-oss-build pro',
        'build': 'vue-cli-service build'
      }
      return JSON.stringify({
        ...data
      }, null, 2);
    }))
    .pipe(rename({
      basename: "package",
    }))
    .pipe(gulp.dest(resolve(__torootdir)));
  cb()
}

function updateDelete(cb){
  // del.sync([resolve(__torootdir, './build'), resolve(__torootdir, './config')]);
  del.sync([resolve(__torootdir, './dist_beta'), resolve(__torootdir, './dist_pro'), resolve(__torootdir, './dist')], {
    force: true
  });
  del.sync([resolve(__torootdir, './.babelrc'), resolve(__torootdir, './.postcssrc.js')], {
    force: true
  })

  del.sync([resolve(__torootdir, './test'), resolve(__torootdir, './static')], {
    force: true
  })

  del.sync([resolve(__torootdir, './index.html')], {
    force: true
  })
  cb()
}


function updateConfig(cb){
  gulp.src(resolve(__torootdir, './index.html'))
    .pipe(gulp.dest(resolve(__torootdir, './public'), {
      overwrite: true
    }))
  gulp.src('./config/**/*.js', {
    dot: true
  })
  // .pipe(replace(/{{alias}}/g, 'just a test'))
    .pipe(gulp.dest('../', {
      overwrite: true
    }));
  cb()
}

exports.default = series(updatePackage, updateConfig, updateDelete)
exports['update:package'] = updatePackage
exports['update:config'] = updateConfig
exports['update:delete'] = updateDelete
