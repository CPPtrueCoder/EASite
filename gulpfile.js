
const gulp = require('gulp');
const {src,dest,parallel,series,watch}= require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer=require('gulp-autoprefixer');
const cleanCSS=require('gulp-clean-css');
const imagemin= require('gulp-imagemin');
const notify= require('gulp-notify');
const del = require('del');

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./src"
        },
     notify:false
    });
    browserSync.watch('src', browserSync.reload);
    
});

function sassTask () {
    return src('src/sass/**/*.sass')
        .pipe(sass().on("error",notify.onError()))
        .pipe(sass())
        .pipe(autoprefixer(['last 15 version']))
        .pipe(cleanCSS({compatibility:'ie8'}))
        .pipe(dest('src/css'))
        .pipe(browserSync.reload({stream:true}))
}
function imagesTask(){
    return src('src/img/**/*')
        .pipe(imagemin([imagemin.optipng({optimizationLevel:5})]))
        .pipe(dest('dist/img'))
}
function watchTask(){
    watch('src/sass/**/*.sass',parallel(sassTask));
    watch('src/img/**/*',browserSync.reload);
    watch('src/js/**/*.js',parallel(scriptsTask));
    watch('src/**/*.html',browserSync.reload);
    watch('src/php/*.php',browserSync.reload);
}
function scriptsTask() {
    return src(['src/js/scripts.js'])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest('src/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
}
function delTask (){
    return del(['dist']);
}
function  buildTask() {
    return src([
        'src/**/*.html',
        'src/**/*.min.js',
        'src/**/*css',
        'src/**/*php'
    ])
        .pipe(dest('dist'))
}
exports.del=delTask;
exports.scripts=scriptsTask;
exports.sass=sassTask;
exports.images=imagesTask;
exports.watch=watchTask;


exports.build=series(delTask,sassTask,imagesTask,buildTask);
exports.default=parallel('serve',watchTask);



