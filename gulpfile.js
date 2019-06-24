const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const watch = require('gulp-watch');
const webserver = require('gulp-webserver');
const express = require('express');

gulp.task('server', () => {
  /* 静态资源服务器 */
  gulp.src('dist')
    .pipe(webserver({
      port: 9999,
      livereload: true, // 文件热更新
      open: true,
    }));
  let app = express();
  app.get('/home', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/plain; charset=utf8');
    /* 代理 */
    let proxy = https.request({
      hostname: 'api-gw.damai.cn',
      path: '/cityList.html?_ksTS=1561262900904_52&callback=jsonp53',
      method: 'get'
    }, (response) => {
      response.pipe(res);
    });
    proxy.end();
  });
  app.listen(8888);

  copyStatic();
  compileScss();
  compileScripts();
  compileViewsHtml();
  compileViewsJs();
  watch('./src/styles/**/*.scss', compileScss);
  watch('./src/scripts/**/*.js', compileScripts);
  watch('./src/views/**/*.html', compileViewsHtml);
  watch('./src/views/**/*.js', compileViewsJs);
  
});

function compileScss() {
  gulp.src('./src/styles/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(csso())
  .pipe( gulp.dest('./dist/styles') );
}

function compileScripts() {
  gulp.src('./src/scripts/**/*.js')
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe( gulp.dest('./dist/scripts') );
}

function compileViewsHtml() {
  gulp.src('./src/views/**/*.html')
      .pipe( gulp.dest('./dist/views') );
}

function compileViewsJs() {
  gulp.src('./src/views/**/*.js')
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe( gulp.dest('./dist/views') );
}

function copyStatic() {
  gulp.src('./src/static/**/*')
      .pipe( gulp.dest('./dist/static') );
}