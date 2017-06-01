/// <binding BeforeBuild='full' />
'use strict';

var gulp = require('gulp');
var run = require('gulp-run');
var runSequence = require('run-sequence');

function getEnvOptions() {
    var options = [];
    if (global.prod) {
        options.push('--env.prod');
    }
    if (global.analyse) {
        options.push('--env.analyse');
    }
    if (options.length > 0) {
        return " " + options.join(" ");
    } else {
        return "";
    }
}

gulp.task('vendor', function () {
    return run('webpack --config webpack.config.vendor.js' + getEnvOptions()).exec();
});

gulp.task('build', function () {
    return run('webpack --config webpack.config.js' + getEnvOptions()).exec();
});

gulp.task('test_compile', function () {
    return run('webpack boot-tests=./ClientApp/test/boot-tests.ts').exec();
});

gulp.task('test_run', function () {
    return run('karma start ClientApp/test/karma.conf.js').exec();
});

gulp.task('prod_var', function () {
    global.prod = true;
})

gulp.task('analyse_var', function () {
    global.analyse = true;
})

gulp.task('test', callback => runSequence('test_compile', 'test_run'));
gulp.task('full', callback => runSequence('vendor', 'build', callback));
gulp.task('analyse', callback => runSequence('analyse_var', 'full'));
gulp.task('publish', callback => runSequence('prod_var', 'full'));