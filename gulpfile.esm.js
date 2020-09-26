"use strict";
const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const args = require('minimist')(process.argv.slice(2));

const outputDir = args['dest-dir'] || '_site';

export function staticFiles() {
  return gulp.src('static/**')
             .pipe($.changed(outputDir))
             .pipe(gulp.dest(outputDir));
}

export function pages() {
  const pages = require('./lib/pages');
  return pages.render('content', outputDir, 'layouts');
}

export function styles() {
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
}

export const build = gulp.parallel(pages, staticFiles, styles);

export default build;

export function watch() {
  gulp.watch('styles/*.css', styles);
  gulp.watch(['content/**', 'layouts/*'], pages);
}