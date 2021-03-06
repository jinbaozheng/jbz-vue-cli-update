/**
 * Created by cuppi on 2018/11/17.
 */
const path = require('path');
const resolve = path.resolve;
const chalk = require('chalk');
const del = require('del');
const fs = require('fs');
const { series, task } = gulp = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const clean = require('gulp-clean');
const yarn = require('gulp-yarn');
const __torootdir = path.resolve(process.cwd(), './');
const {vuecli2_dependencies, vuecli2_dev_dependencies, vuecli3_dependencies, vuecli3_dev_dependencies} = require('./constant')
const jsonTransform = require('./handle_json');

const readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        resolve(fs.readFileSync(filePath, 'utf8'));
    })
}

function updatePackage(cb){
    console.log(chalk.green('更新package.json中...'))
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

function updateConfig(cb){
    console.log(chalk.green('更新配置中...'));
    gulp.src(resolve(__torootdir, './index.html'), {
        allowEmpty: true
    }).pipe(clean({
        force: true
    })).pipe(gulp.dest(resolve(__torootdir, './public'), {
        overwrite: true
    }));
    gulp.src(resolve(__dirname, './config/**/*.js'), {
        dot: true
    })
    // .pipe(replace(/{{alias}}/g, 'just a test'))
        .pipe(gulp.dest(resolve(__torootdir, './'), {
            overwrite: true
        }));
    cb();
}

function updateDelete(cb){
    console.log(chalk.green('清理旧版本文件中...'));
    // del.sync([resolve(__torootdir, './build'), resolve(__torootdir, './config')]);
    del.sync([resolve(__torootdir, './config')], {
        force: true
    });
    del.sync([resolve(__torootdir, './dist_beta'), resolve(__torootdir, './dist_pro'), resolve(__torootdir, './dist')], {
        force: true
    });
    del.sync([resolve(__torootdir, './.babelrc'), resolve(__torootdir, './.postcssrc.js')], {
        force: true
    })

    del.sync([resolve(__torootdir, './test'), resolve(__torootdir, './static')], {
        force: true
    })
    cb()
}

function updateNodeModule(cb){
    console.log(chalk.green('更新node_modules中...'));
    del.sync(resolve(__torootdir, './node_modules'));
    gulp.src([resolve(__torootdir, './package.json')])
        .pipe(yarn());
    console.log(chalk.green('更新完成'));
    cb();
}

exports.default = series(updatePackage, updateConfig, updateDelete, updateNodeModule);
exports['update:package'] = updatePackage
exports['update:config'] = updateConfig
exports['update:delete'] = updateDelete
