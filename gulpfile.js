'use strict';

const path = require('path');
const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const open = require('gulp-open');
const mochaPhantomJS = require('gulp-mocha-phantomjs');
const DIST = './dist/';

gulp.task('default', ['fonts', 'css', 'js', 'variables']);

/**
 * Styles
 */

gulp.task('css', () => {
  gulp.src([
    './bower_components/components-font-awesome/css/font-awesome.min.css', // ICONS
    './bower_components/roboto-fontface/css/roboto-fontface.css', // FONT (Roboto)
    './node_modules/prismjs/themes/prism-coy.css', // prismjs coy theme (syntax highlighting)
    './bower_components/flexboxgrid/dist/flexboxgrid.min.css', // flexbox grid system
    './src/less/**/*.less'
  ])
    .pipe(less())
    .pipe(concat('alchemy.css'))
    .pipe(gulp.dest(path.join(DIST, 'css')));
});


/**
 * Variables
 * (to be included in the release)
 */

gulp.task('variables', () => {
  gulp.src(['./src/less/variables.less'])
    .pipe(gulp.dest(path.join(DIST, 'less')));
});

/**
 * Scripts
 */

gulp.task('js', () => {
  gulp.src([
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/a11y-tabs/a11y-tabs.js',
    './node_modules/prismjs/prism.js',
    './node_modules/prismjs/components/prism-jade.min.js',
    './src/js/utils/rndid.js', // ensure rndid is defined for the utils
    './src/js/utils/**/*.js',
    './src/js/**/*.js'
  ])
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
