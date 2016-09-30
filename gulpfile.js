var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var browserify  = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');

// process JS files and return the stream.
gulp.task('js2', function () {
    return browserify({
      entries:['./src/js/index.js']//,
      // paths: [
        // 'extra paths to search'
      // ]
    }).bundle()
    .pipe(vinylSourceStream('index.js'))
    .pipe(vinylBuffer())
    .pipe(gulp.dest('./dist/js'));
});
gulp.task('js', function () {
    return gulp.src('src/js/index.js')
        .pipe(browserify())
        .pipe(gulp.dest('./dist/js'));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js2'], function (done) {
    browserSync.reload();
    done();
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['js2'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("src/js/*.js", ['js-watch']);
});