'use strict';

var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var DIST = './dist/';

gulp.task('default', ['fonts', 'css', 'js']);

/**
 * Styles
 */

gulp.task('css', () => {
  gulp.src([
    'bower_components/components-font-awesome/css/font-awesome.min.css', // ICONS
    'bower_components/roboto-fontface/css/roboto-fontface.css', // FONT (Roboto)
    './src/less/**/*.less'
  ])
    .pipe(less())
    .pipe(concat('alchemy.css'))
    .pipe(gulp.dest(path.join(DIST, 'css')));
});

/**
 * Scripts
 */

gulp.task('js', () => {
  gulp.src('./src/js/**/*.js')
    .pipe(concat('alchemy.js'))
    .pipe(gulp.dest(path.join(DIST, 'js')));
});

/**
 * Fonts
 */

gulp.task('fonts', () => {
  gulp.src([
    './bower_components/components-font-awesome/fonts/**/*',
    './bower_components/roboto-fontface/fonts/**/*'
  ])
    .pipe(gulp.dest(path.join(DIST, '/fonts/')));
});

/**
 * Watcher
 */

gulp.task('watch', () => {
  gulp.watch(['./src/less/**/*.less', './src/js/**/*.js'], ['css', 'js']);
  gulp.watch(['./playground/**/*.less'], ['playground']);
});
