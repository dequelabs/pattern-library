'use strict';

const path = require('path');
const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const DIST = './dist/';

gulp.task('default', [
  'fonts',
  'css',
  'babelify',
  'variables',
  'minify-css',
  'minify-js',
  'extras'
]);

/**
 * Styles
 */

gulp.task('css', () => {
  return gulp.src([
    './node_modules/font-awesome/css/font-awesome.min.css', // ICONS
    './node_modules/prismjs/themes/prism-coy.css', // prismjs coy theme (syntax highlighting)
    './node_modules/flexboxgrid/dist/flexboxgrid.min.css', // flexbox grid system
    './lib/**/*.less'
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
  return gulp.src(['./lib/variables.less'])
    .pipe(gulp.dest(path.join(DIST, 'less')));
});

/**
 * Scripts
 */

gulp.task('js', () => {
  return browserify('./index.js')
    .bundle()
    .pipe(source('cauldron.js'))
    .pipe(gulp.dest(path.join(DIST, 'js')));
});


gulp.task('babelify', ['js'], () => {
  return gulp.src('./dist/js/cauldron.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(path.join(DIST, 'js')));
});

gulp.task('extras', ['babelify'], () => {
  return gulp.src([
      './dist/js/cauldron.js',
      './node_modules/prismjs/prism.js',
      './node_modules/prismjs/components/prism-jade.min.js'
    ])
    .pipe(concat('cauldron.js'))
    .pipe(gulp.dest(path.join(DIST, 'js')));
});

/**
 * Minify cauldron.js
 */

gulp.task('minify-js', ['babelify', 'extras'], () => {
  return gulp.src(path.join(DIST, 'js', 'cauldron.js'))
    .pipe(uglify())
    .pipe(rename('cauldron.min.js'))
    .pipe(gulp.dest(path.join(DIST, 'js')));
});

/**
 * Fonts
 */

gulp.task('fonts', ['icons', 'roboto']);

gulp.task('icons', () => {
  return gulp.src('./node_modules/font-awesome/fonts/**/*')
    .pipe(gulp.dest(path.join(DIST, '/fonts/')));
});

gulp.task('roboto', () => {
  return gulp.src('./node_modules/roboto-fontface/fonts/Roboto/**/*')
    .pipe(gulp.dest(path.join(DIST, '/fonts/Roboto/')));
});

/**
 * Watcher
 */

gulp.task('watch', () => {
  gulp.watch(['./lib/**/*.less'], ['css']);
  gulp.watch(['./lib/**/*.js', './index.js'], ['js', 'babelify', 'extras', 'minify-js']);
  gulp.watch(['./lib/variables.less'], ['variables']);
});
