
var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    del = require('del'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    ngAnnotate = require('browserify-ngannotate');

var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();

/////////////////////////////////////////////////////////////////////////////////////
//
// cleans the build output
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function (cb) {
    del([
        'dist'
    ], cb);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs bower to install frontend dependencies
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('bower', function() {

    var install = require("gulp-install");

    return gulp.src(['./bower.json'])
        .pipe(install());
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs sass, creates css source maps
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-css', ['clean'], function() {
    return gulp.src('./styles/*')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cachebust.resources())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// fills in the Angular template cache, to prevent loading the html templates via
// separate http requests
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-template-cache', ['clean'], function() {
    
    var ngHtml2Js = require("gulp-ng-html2js"),
        concat = require("gulp-concat");
    
    return gulp.src("./partials/*.html")
        .pipe(ngHtml2Js({
            moduleName: "todoPartials",
            prefix: "/partials/"
        }))
        .pipe(concat("templateCachePartials.js"))
        .pipe(gulp.dest("./dist"));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs jshint
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('jshint', function() {
    gulp.src('/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build-js', ['clean'], function() {
    var b = browserify({
        entries: './js/app.js',
        debug: true,
        paths: ['./js/controllers', './js/services', './js/directives'],
        transform: [ngAnnotate]
    });

    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(cachebust.resources())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js/'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// full build (except sprites), applies cache busting to the main page css and js bundles
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build', [ 'clean', 'bower','build-css','build-template-cache', 'jshint', 'build-js'], function() {
    return gulp.src('index.html')
        .pipe(cachebust.references())
        .pipe(gulp.dest('dist'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// watches file system and triggers a build when a modification is detected
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('watch', function() {
    return gulp.watch(['./index.html','./partials/*.html', './styles/*.*css', './js/**/*.js'], ['build']);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// launches a web server that serves files in the current directory
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('webserver', ['watch','build'], function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: false,
            directoryListing: true,
            open: "http://localhost:8000/dist/index.html"
        }));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// launch a build upon modification and publish it to a running server
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('serve', ['build', 'watch', 'webserver']);
gulp.task('default', ['build']);