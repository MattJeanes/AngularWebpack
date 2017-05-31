/// <binding BeforeBuild='build' />
'use strict';

var gulp = require('gulp');
var run = require('gulp-run');
var webpack2 = require('webpack');

gulp.task('vendor', function () {
    return run('webpack --config webpack.config.vendor.js').exec();
});

gulp.task('build', ['vendor'], function () {
    return run('webpack --config webpack.config.js').exec();
});