/**
 * gulpfile.js - sous-chef
 *
 * Licensed under Apache-2.0.
 */

const gulp = require('gulp')
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')
    , buffer = require('vinyl-buffer')
    , postcss = require('gulp-postcss')
    , browserify = require('browserify')
    , imagemin = require('gulp-imagemin')
    , source = require('vinyl-source-stream')
    , sourcemaps = require('gulp-sourcemaps')

gulp.task('js', () =>
  browserify({
    entries: 'public/src/js/index.js',
    debug: true
  })
      .transform('babelify')
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/dist/js'))
)

gulp.task('css', () =>
  gulp.src([ 'public/src/css/**/*.css' ])
      .pipe(sourcemaps.init())
      .pipe(postcss([
          require('precss')(),
          require('autoprefixer')({
              browsers: [ 'last 1 version' ]
          }),
          require('cssnano')()
       ]))
       .pipe(concat('bundle.css'))
       .pipe(sourcemaps.write('.'))
       .pipe(gulp.dest('./public/dist/css'))
)

gulp.task('img', () =>
  gulp.src([ 'public/src/img/*', 'public/src/img/**/*' ])
      .pipe(imagemin())
      .pipe(gulp.dest('./public/dist/img'))
)

gulp.task('default', ['css', 'js', 'img'])

gulp.task('watch', ['default'], () => {
    gulp.watch('public/src/js/**/*.js', ['js'])
    gulp.watch('public/src/css/**/*.css', ['css'])
    gulp.watch('public/src/img/**/*.*', ['img'])
})