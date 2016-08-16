'use strict';

var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  uglify = require('gulp-uglify'),
  pump = require('pump'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  rename = require('gulp-rename'),
  runSequence = require('run-sequence');

var env = process.env.NODE_ENV || 'development';
// read gulp directory contents for the tasks...

console.log('Invoking gulp -',env);
gulp.task('mocha', function() {
  return gulp.src('*.spec.js', {read: false})
  .pipe(mocha({
    timeout: 10000,
    reporter: 'spec' // 'nyan'
  }))
  .once('error', function (err) {
    console.error(err.stack);
    process.exit(1);
  });
});

gulp.task('browserify', function() {
  return browserify('./index.js')
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('regex-pipeline.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./dist/'));
});

gulp.task('compress', function (cb) {
  pump([
      gulp.src('dist/*.js'),
      uglify(),
      rename({
        suffix: '.min'
      }),
      gulp.dest('dist')
    ],
    cb
  );
});

gulp.task('build', function (cb) {
  runSequence(
    'mocha',
    'browserify',
    'compress'
  );
})