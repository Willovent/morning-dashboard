var gulp = require('gulp');
var less = require('gulp-less')
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');

gulp.task('build:scripts', ['clean:scripts'], function() {
    gulp.src(['./typings/main.d.ts','./app.ts', './component/**/*.ts'])
        .pipe(ts({
           out: 'app.js'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean:scripts', function(cb) {
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

gulp.task('copy:assets',['clean:assets'], function() {
    gulp.src(['./styles/**/!(*.less)'])
        .pipe(gulp.dest('./dist/styles'));
});


gulp.task('clean:assets', function(cb) {
    del.sync('./dist/styles/!(style.css)');
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

gulp.task('less', ['clean:styles'], function() {
    gulp.src(['./styles/style.less','./component/**/*.less'])
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./dist/styles'))
});

gulp.task('clean:styles', function(cb) {
    del.sync('./dist/styles/style.css');
    cb();
});

gulp.task('clean', function(cb) {
    del.sync('./dist');
    cb();
});

gulp.task('default', ['less', 'copy:assets', 'build:scripts', 'copy:html', 'copy:vendor'], function() {
     browserSync.init({
        server: {
            baseDir: "./dist",
        },
        files: ["./dist/*","./dist/**/*"]
    });
    watch(['./styles/**/!(*.less)'], function(){gulp.start('copy:assets')});
    watch(['./styles/style.less','./component/**/*.less'], function(){gulp.start('less')});
    watch(['./scripts/**/*.ts', './component/**/*.ts'], function(){gulp.start('build:scripts')});
    watch(['./component/**/*.html','index.html'], function(){gulp.start('copy:html')});
})