
// import gulp
const gulp = require('gulp'),
    runSequence = require('run-sequence'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector');

// define css dir
const cssDir = 'origin/css',
    jsDir = 'origin/js',
    htmlDir = 'origin/htm';

// define css path
const cssSrc = `${cssDir}/*.css`,
    jsSrc = `${jsDir}/*.js`,
    htmlSrc  = `${htmlDir}/*.htm`,
    htmlDist = "dist/htm";


// CSS file + hash => rev-manifest.json
gulp.task('revCss', function(){
    return gulp.src(cssSrc)
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});


// JS file + hash => rev-manifest.json
gulp.task('revJs', function(){
    return gulp.src(jsSrc)
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});


// *.html + rev-manifest.json => *.html
gulp.task('revHtml', function () {
    return gulp.src(['rev/**/*.json', htmlSrc])
        .pipe(revCollector())
        .pipe(gulp.dest(htmlDist));
});


// start task
gulp.task('prod-build', function (done) {
    condition = false;
    runSequence(
        ['revCss'],
        ['revJs'],
        ['revHtml'],
        done);
});


gulp.task('build', ['prod-build']);
