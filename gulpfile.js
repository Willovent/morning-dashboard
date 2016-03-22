var gulp = require('gulp');
var less = require('gulp-less')
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var del = require('del');
var watch = require('gulp-watch');

gulp.task('concat', ['clean:concat'], function() {
    gulp.src(['./app.js', './component/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean:concat', function(cb) {
    del.sync('./dist/app.js');
    cb();
});

gulp.task('copy:html', ['clean:html'], function() {
    gulp.src(['./component/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest('./dist/template'));
    gulp.src(['index.html'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean:html', function(cb) {
    del.sync(['./dist/template','./dist/index.html']);
    cb();
});

gulp.task('copy:assets', function() {
    gulp.src(['./styles/**/!(*.less)'])
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('clean:styles', function(cb) {
    del.sync('./dist/styles');
    cb();
});

gulp.task('copy:vendor', ['clean:vendors'], function() {
    gulp.src(['./vendors/**/*'])
        .pipe(gulp.dest('./dist/vendors'));
});

gulp.task('clean:vendors', function(cb) {

    del.sync('./dist/vendors');
    cb();
});

gulp.task('less', ['copy:assets','clean:styles'], function() {
    gulp.src('./styles/style.less')
        .pipe(less({
            concat: 'style.css'
        }))
        .pipe(gulp.dest('./dist/styles'))
});

gulp.task('clean', function(cb) {
    del.sync('./dist');
    cb();
});

gulp.task('default', ['less', 'copy:assets', 'concat', 'copy:html', 'copy:vendor'], function() {
     browserSync.init({
        server: {
            baseDir: "./dist",
        },
        files: ["index.html", "style.css", "app.js"]
    });
    watch(['./styles/**/*.less'], function(){gulp.start('less')});
    watch(['./scripts/**/*.js', './component/**/*.js'], function(){gulp.start('concat')});
    watch(['./component/**/*.html'], function(){gulp.start('copy:html')});
})