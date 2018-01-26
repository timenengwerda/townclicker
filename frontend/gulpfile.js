var gulp = require('gulp');
var requireDir = require('require-dir');

//
// Get all the tasks we list
// in the gulp folder
//
requireDir('./gulp');

//
// Default watch task, which
//
gulp.task('watch', ['sass'], function () {
    gulp.watch('scss/**/*.scss', ['sass']);
});
