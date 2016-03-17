var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

gulp.task('browserify', function() {
    gulp.src('src/js/main.js')
      .pipe(browserify({transform:'reactify'}))
      .pipe(concat('main.js'))
      .pipe(gulp.dest('js'));
});

gulp.task('copy', function() {
    gulp.src('src/index.html')
      .pipe(gulp.dest('templates'));
});

gulp.task('default',['browserify', 'copy']);

gulp.task('watch', function() {
    var watcher = gulp.watch('src/**/*.*', ['default']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});
