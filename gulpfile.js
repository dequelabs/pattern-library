'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var DIST = './dist/';

gulp.task('default', ['less', 'js']);

gulp.task('less', () => {
  gulp.src('./less/**/*.less')
    .pipe(less())
    .pipe(concat('alchemy.css'))
    .pipe(gulp.dest(DIST));
});

gulp.task('js', () => {
  gulp.src('./js/**/*.js')
    .pipe(concat('alchemy.js'))
    .pipe(gulp.dest(DIST));
});

gulp.task('watch', () => {
  gulp.watch(['./less/**/*.less', './js/**/*.js'], ['default']);
});
