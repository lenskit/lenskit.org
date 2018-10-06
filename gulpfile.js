"use strict";
const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const args = require('minimist')(process.argv.slice(2));

const outputDir = args['dest-dir'] || '_site';

gulp.task('static', function() {
  return gulp.src('static/**')
             .pipe($.changed(outputDir))
             .pipe(gulp.dest(outputDir));
})

gulp.task('pages', function() {
  const pages = require('./lib/pages');
  return pages.render('content', outputDir, 'layouts');
});

gulp.task('styles', function() {
  return gulp.src('styles/*.css')
             .pipe($.ignore.exclude('_*.css'))
             .pipe($.sourcemaps.init())
             .pipe($.postcss([
               require('postcss-custom-media'),
               require('postcss-nested'),
               require('postcss-custom-properties')
             ]))
             .pipe($.sourcemaps.write('.'))
             .pipe(gulp.dest(path.join(outputDir, 's')));
});

gulp.task('build', gulp.parallel('pages', 'static', 'styles'));

gulp.task('default', gulp.series('build'));

gulp.task('serve', function() {
  var testServer = require('./lib/test-server');
  testServer(outputDir);
});
