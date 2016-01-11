module.exports = function (grunt) {
  // set path manually to enable both Windows/MacOSX
  var separator = (process.platform === 'win32') ? '\\' : '/';
  var PathDebugKeystore = process.env['HOME'] + separator + '.android' + separator + 'debug.keystore';
  var PathReleaseKeystore = 'android' + separator + 'app' + separator + 'donut-release-key.keystore';
  var PathReleaseApk = 'android' + separator + 'app' + separator + 'build' + separator + 'outputs' + separator + 'apk' + separator + 'app-donutReleaseTest.apk';
  var PathDebugApk = 'android' + separator + 'app' + separator + 'build' + separator + 'outputs' + separator + 'apk' + separator + 'app-release.apk';

  var today = grunt.template.today('yyyy-mm-dd');
  grunt.loadNpmTasks('grunt-extend-config');
  grunt.loadNpmTasks('grunt-exec');
  grunt.extendConfig({
    exec: {
      createReleaseDir: {
        cmd: function () {
          if (!grunt.file.exists('releases')) {
            return 'mkdir releases';
          }
          return '';
        }
      },
      createTestApk: {
        cmd: function () {
          if (grunt.file.exists(PathDebugKeystore)) {
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
          if (grunt.file.exists(PathReleaseKeystore)) {
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
          if (grunt.file.exists(PathReleaseApk)) {
            return 'mv ' + PathReleaseApk + ' releases/' + today + '-test.apk';
          } else {
            grunt.log.subhead(PathReleaseApk + ' not found');
            return '';
          }
        }
      },
      moveProductionApk: {
        cmd: function () {
          if (grunt.file.exists(PathDebugApk)) {
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
          var productionApkCreated = grunt.file.exists('releases' + separator + today + '-production.apk');
          var testApkCreated = grunt.file.exists('releases' + separator + today + '-test.apk');

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

  grunt.registerTask('build-android', 'Create builds', [
    'exec:createReleaseDir',
    'exec:createProductionApk',
    'exec:createTestApk',
    'exec:moveTestApk',
    'exec:moveProductionApk',
    'exec:push'
  ]);
};

