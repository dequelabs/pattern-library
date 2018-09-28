'use strict';

const path = require('path');
const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const DIST = './dist/';

gulp.task('default', [
  'fonts',
  'css',
  'bundle',
  'variables',
  'minify-css',
  'minify-js',
  'extras'
]);

// Empties out dist/
gulp.task('clean', () => {
  return del(['dist/**/*']);
});

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
    .pipe(concat('pattern-library.css'))
    .pipe(gulp.dest(path.join(DIST, 'css')));
});

/**
 * Minify `pattern-library.css`
 */

gulp.task('minify-css', ['css'], () => {
  return gulp.src(path.join(DIST, 'css', 'pattern-library.css'))
    .pipe(cleanCSS())
    .pipe(rename('pattern-library.min.css'))
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
 * Scripts bundle
 */

gulp.task('bundle', () => {
  return browserify('./index.js')
    .transform('babelify', {
      presets: ['env']
    })
    .bundle()
    .pipe(source('pattern-library.js'))
    .pipe(gulp.dest(path.join(DIST, 'js')));
});

gulp.task('extras', ['bundle'], () => {
  return gulp.src([
      './dist/js/pattern-library.js',
      './node_modules/prismjs/prism.js',
      './node_modules/prismjs/components/prism-jade.min.js'
    ])
    .pipe(concat('pattern-library.js'))
    .pipe(gulp.dest(path.join(DIST, 'js')));
});

/**
 * Minify pattern-library.js
 */

gulp.task('minify-js', ['bundle', 'extras'], () => {
  return gulp.src(path.join(DIST, 'js', 'pattern-library.js'))
    .pipe(uglify())
    .pipe(rename('pattern-library.min.js'))
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
  gulp.watch(['./lib/**/*.js', './index.js'], ['bundle', 'extras', 'minify-js']);
  gulp.watch(['./lib/variables.less'], ['variables']);
});
