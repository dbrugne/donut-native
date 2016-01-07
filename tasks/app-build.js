module.exports = function (grunt) {
  var fs = require('fs');

  // set path manually to enable both Windows/MacOSX
  var separator = (process.platform === 'win32') ? '\\' : '/';
  var PathDebugKeystore = 'android' + separator + 'app' + separator + 'debug.keystore';
  var PathReleaseKeystore = 'android' + separator + 'app' + separator + 'donut-release-key.keystore';
  var PathReleaseApk = 'android' + separator + 'app' + separator + 'build' + separator + 'outputs' + separator + 'apk' + separator + 'app-donutReleaseTest.apk';
  var PathDebugApk = 'android' + separator + 'app' + separator + 'build' + separator + 'outputs' + separator + 'apk' + separator + 'app-release.apk';

  var today = grunt.template.today('yyyy-mm-dd');
  grunt.loadNpmTasks('grunt-extend-config');
  grunt.loadNpmTasks('grunt-exec');
  grunt.extendConfig({
    exec: {
      createTestApk: {
        cmd: function () {
          if (fs.existsSync(PathDebugKeystore)) {
            var cmd = [
              'cd android',
              '.' + separator + 'gradlew assembledonutReleaseTest',
              'cd ..'
            ].join(' && ');
            return cmd;
          } else {
            grunt.log.ok('You need an ' + PathDebugKeystore + ' to create the test apk');
            return '';
          }
        }
      },
      createProductionApk: {
        cmd: function () {
          if (fs.existsSync(PathReleaseKeystore)) {
            var cmd = [
              'cd android',
              '.' + separator + 'gradlew assembleRelease',
              'cd ..'
            ].join(' && ');
            return cmd;
          } else {
            grunt.log.ok('You need an ' + PathReleaseKeystore + ' to create the production apk');
            return '';
          }
        }
      },
      moveTestApk: {
        cmd: function () {
          if (fs.existsSync(PathReleaseApk)) {
            return 'mv ' + PathReleaseApk + ' releases/' + today + '-test.apk';
          } else {
            grunt.log.subhead(PathReleaseApk + ' not found');
            return '';
          }
        }
      },
      moveProductionApk: {
        cmd: function () {
          if (fs.existsSync(PathDebugApk)) {
            return 'mv ' + PathDebugApk + ' releases/' + today + '-production.apk';
          } else {
            grunt.log.subhead(PathDebugApk + ' not found');
            return '';
          }
        }
      },
      push: {
        cmd: function () {
          var cmd = '';
          var productionApkCreated = fs.existsSync('releases' + separator + today + '-production.apk');
          var testApkCreated = fs.existsSync('releases' + separator + today + '-test.apk');

          var productionNewApkPath = 'releases' + separator + today + '-production.apk';
          var testNewApkPath = 'releases' + separator + today + '-test.apk';

          if (productionApkCreated && testApkCreated) {
            grunt.log.ok('commit production apk and test apk...');
            cmd = [
              'git add ' + productionNewApkPath + ' ' + testNewApkPath,
              'git commit ' + productionNewApkPath + ' ' + testNewApkPath + ' -m "build-' + today + '"',
              'git push'
            ].join(' && ');
          } else if (productionApkCreated) {
            grunt.log.ok('commit production apk...');
            cmd = [
              'git add ' + productionNewApkPath,
              'git commit ' + productionNewApkPath + ' -m "build-' + today + '"',
              'git push'
            ].join(' && ');
          } else if (testApkCreated) {
            grunt.log.ok('commit test apk...');
            cmd = [
              'git add ' + testNewApkPath,
              'git commit ' + testNewApkPath + ' -m "build-' + today + '"',
              'git push'
            ].join(' && ');
          } else {
            grunt.log.ok('No apk commited');
          }
          return cmd;
        }
      }
    }
  });

  grunt.registerTask('app-build', 'Create builds', [
    'exec:createProductionApk',
    'exec:createTestApk',
    'exec:moveTestApk',
    'exec:moveProductionApk',
    'exec:push'
  ]);
};

