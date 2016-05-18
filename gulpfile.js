'use strict';

var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var open = require('gulp-open');
var DIST = './dist/';

gulp.task('default', ['fonts', 'css', 'js']);

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


gulp.task('js', () => {
  gulp.src('./src/js/**/*.js')
    .pipe(concat('alchemy.js'))
    .pipe(gulp.dest(path.join(DIST, 'js')));
});

gulp.task('fonts', () => {
  gulp.src([
    './bower_components/components-font-awesome/fonts/**/*',
    './bower_components/roboto-fontface/fonts/**/*'
  ])
    .pipe(gulp.dest(path.join(DIST, '/fonts/')));
});

gulp.task('watch', () => {
  gulp.watch(['./src/less/**/*.less', './src/js/**/*.js'], ['default']);
});

gulp.task('open', () => {
  gulp.src('./playground/index.html')
    .pipe(open());
});
