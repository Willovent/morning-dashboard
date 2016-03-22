var gulp = require('gulp');
var less = require('gulp-less')
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var rimraf = require('rimraf');

gulp.task('concat', ['clean:concat'], function() {
    gulp.src(['./app.js', './component/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean:concat', function(cb) {
    rimraf('./dist/app.js',cb)
});

gulp.task('copy:html', ['clean:html'], function() {
    gulp.src(['./component/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest('./dist/template'));
    gulp.src(['index.html'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean:html', function(cb) {
    rimraf('./dist/template',cb)
    rimraf('./dist/index.html',cb)
});

gulp.task('copy:assets', function() {
    gulp.src(['./styles/**/!(*.less)'])
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('clean:styles', function(cb) {
    rimraf('./dist/styles',cb)
});

gulp.task('copy:vendor', ['clean:vendors'], function() {
    gulp.src(['./vendors/**/*'])
        .pipe(gulp.dest('./dist/vendors'));
});

gulp.task('clean:vendors', function(cb) {
    rimraf('./dist/vendors',cb)
});

gulp.task('less', ['copy:assets',':styles'], function() {
    gulp.src('./styles/style.less')
        .pipe(less({
            concat: 'style.css'
        }))
        .pipe(gulp.dest('./dist/styles'))
});

gulp.task('clean', function(cb) {
    rimraf('./dist', cb);
})



gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist",
        },
        files: ["index.html", "style.css", "app.js"]
    });
});

gulp.task('default', ['less', 'copy:assets', 'browser-sync', 'concat', 'copy:html', 'copy:vendor'], function() {
    gulp.watch(['./styles/**/*.less'], ['less']);
    gulp.watch(['./scripts/**/*.js', './component/**/*.js'], ['concat']);
    gulp.watch(['./component/**/*.html'], ['copy:html']);
})