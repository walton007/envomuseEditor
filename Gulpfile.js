var NwBuilder = require('nw-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs-extra');
    path = require('path');

gulp.task('nw', function () {

    var nw = new NwBuilder({
        version: '0.12.0',
        files: './app/**',
        macIcns: './icons/icon.icns',
        macPlist: {mac_bundle_id: 'envomuseMusicEditor'},
        platforms: ['win64', 'osx64'],
        buildType: 'versioned'
    });

    // Log stuff you want
    nw.on('log', function (msg) {
        gutil.log('nw-builder', msg);
    });

    // Build returns a promise, return it so the task isn't called in parallel
    return nw.build()
    .then(function () {
        console.log('copy ffmpegsumo.so file');
        nw._forEachPlatform(function (name, platform) {
            console.log('_forEachPlatform:', name, platform.releasePath);
            if (name === 'osx64') {
                // copy ffmpegsumo.so
                var srcFile = 'ffmpeglib/ffmpegsumo.so';
                platform.files.forEach(function (file, i) {
                    var destFile = path.join(platform.releasePath, file, 
                        'Contents/Frameworks/nwjs Framework.framework/Libraries', 'ffmpegsumo.so');
                    fs.copySync(srcFile, destFile);
                });
            }
        });

    })
    .catch(function (err) {
        gutil.log('nw-builder', err);
    });
});

gulp.task('default', ['nw']);
