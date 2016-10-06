'use strict';

const path = require('path');
const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const open = require('gulp-open');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const mochaPhantomJS = require('gulp-mocha-phantomjs');
const DIST = './dist/';

gulp.task('default', [
  'fonts',
  'css',
  'js',
  'variables',
  'minify-css',
  'minify-js'
]);

/**
 * Styles
 */

gulp.task('css', () => {
  return gulp.src([
    './bower_components/components-font-awesome/css/font-awesome.min.css', // ICONS
    './bower_components/roboto-fontface/css/roboto-fontface.css', // FONT (Roboto)
    './node_modules/prismjs/themes/prism-coy.css', // prismjs coy theme (syntax highlighting)
    './bower_components/flexboxgrid/dist/flexboxgrid.min.css', // flexbox grid system
    './src/less/**/*.less'
  ])
    .pipe(less())
    .pipe(concat('cauldron.css'))
    .pipe(gulp.dest(path.join(DIST, 'css')));
});

/**
 * Minify `cauldron.css`
 */

gulp.task('minify-css', ['css'], () => {
  return gulp.src(path.join(DIST, 'css', 'cauldron.css'))
    .pipe(cleanCSS())
    .pipe(rename('cauldron.min.css'))
    .pipe(gulp.dest(path.join(DIST, 'css')));
});


/**
 * Variables
 * (to be included in the release)
 */

gulp.task('variables', () => {
  return gulp.src(['./src/less/variables.less'])
    .pipe(gulp.dest(path.join(DIST, 'less')));
});

/**
 * Scripts
 */

gulp.task('js', () => {
  return gulp.src([
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/a11y-tabs/a11y-tabs.js',
    './node_modules/prismjs/prism.js',
    './node_modules/prismjs/components/prism-jade.min.js',
    './src/js/utils/rndid.js', // ensure rndid is defined for the utils
    './src/js/utils/**/*.js',
    './src/js/**/*.js'
  ])
    .pipe(concat('cauldron.js'))
    .pipe(gulp.dest(path.join(DIST, 'js')));
});

/**
 * Minify cauldron.js
 */

gulp.task('minify-js', ['js'], () => {
  return gulp.src(path.join(DIST, 'js', 'cauldron.js'))
    .pipe(uglify())
    .pipe(rename('cauldron.min.js'))
    .pipe(gulp.dest(path.join(DIST, 'js')));
});

/**
 * Fonts
 */

gulp.task('fonts', () => {
  return gulp.src([
    './bower_components/components-font-awesome/fonts/**/*',
    './bower_components/roboto-fontface/fonts/**/*'
  ])
    .pipe(gulp.dest(path.join(DIST, '/fonts/')));
});

/**
 * Watcher
 */

gulp.task('watch', () => {
  gulp.watch(['./src/less/**/*.less'], ['css']);
  gulp.watch(['./src/js/**/*.js'], ['js']);
  gulp.watch(['./src/less/variables.less'], ['variables']);
});

/**
 * Test runner
 */

gulp.task('test', ['default'], () => {
  gulp
    .src('test/runner.html')
    .pipe(mochaPhantomJS({
      reporter: 'nyan',
      phantomjs: {
        viewportSize: {
          width: 965,
          height: 700
        },
        useColors: true
      }
    }));
});
