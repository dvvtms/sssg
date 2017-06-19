const gulp = require('gulp')
const metal = require('./js/metal')
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');

const wrapPipe = function (taskFn) {
    return function (done) {
        var onSuccess = function () {
            console.log('gulp proc finished: ')
            done();
        };
        var onError = function (err) {
            console.log('we have errors in gulp: ', err)
            done(err);
        }
        var outStream = taskFn(onSuccess, onError);
        if (outStream && typeof outStream.on === 'function') {
            outStream.on('end', onSuccess);
        }
    }
}

const dir = {
    base: '.',
    lib: './lib/',
    source: './src/',
    destination: './build/',
    pages: './src/pages/',
    assets: './src/assets/',
    imageSource: './src/assets/images/',
    imageDest: './build/assets/images/',
    selectHtml: './build/**/*.html'
}

gulp.task('buildHtml', function () {
    return metal.buildHtml(dir)
})

gulp.task('serve', wrapPipe((success, error) => {

    browserSync.init({
        server: dir.destination
    })

    gulp.watch(dir.selectHtml, ['htmlMin']).on('error', error)
    gulp.watch(dir.imageSource + '**/*.png', ['imageMin']).on('error', error)
    gulp.watch(dir.assets + 'bulma-sass/**/*.sass', ['sass']).on('error', error)
    gulp.watch(dir.destination + '**/*').on('change', browserSync.reload).on('error', error)
    gulp.watch(dir.pages + '**/*', ['buildHtml']).on('error', error)
}))

gulp.task('imageMin', wrapPipe((success, error) => {
    return gulp.src(dir.imageSource + '*.png')
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest(dir.imageDest))
}))

gulp.task('htmlMin', wrapPipe((success, error) => {
    return gulp.src(dir.selectHtml)
        //.pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(dir.destination));
}))

gulp.task('sass', wrapPipe((success, error) => {
    return gulp.src([dir.assets + 'bulma-sass/*.sass'])
        .pipe(plumber())
        .pipe(sass()).on('error', error)
        .pipe(rename('/css/styles.css'))
        .pipe(plumber())
        .pipe(cleanCSS({ debug: true }, function (details) {
            console.log('before cleanCSS: ', details.name + ': ' + details.stats.originalSize);
            console.log('before cleanCSS: ', details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest(dir.destination + 'assets'))
        .pipe(browserSync.stream());
}))

gulp.task('build', ['buildHtml', 'sass', 'htmlMin', 'imageMin'])
gulp.task('default', ['serve'])