# donut-native

## CodePush

```
react-native bundle --platform ios --entry-file index.ios.js --bundle-output codepush.js --dev false
code-push release donutMobile codepush.js 1.0.0 --deploymentName Staging|Production
```

## Pre-requisites

Requirements: https://facebook.github.io/react-native/docs/getting-started.html

* nvm + node 4.0+

```
brew install watchman
npm install -g react-native-cli
npm install -g babel-cli # react-native-parsed-text (=> ???)
npm install -g code-push-cli
```

[Android installation and workaround](./Android.md)

## Run iOS

Create 3 schemes (@see http://www.blackdogfoundry.com/blog/migrating-ios-app-through-multiple-environments/) by going to Product > Scheme > Manage Schemes.
From here, add the 3 schemes : Debug, Debug (standalone) & Release.
Now for each one, edit it and select appropriate build configuration for each step (Run / Test / Profile / Analyse / Archive).
Ie: For debug scheme, select "debug" in each debug configuration of the five steps.

For each scenario launch Xcode project select a scheme (listed bellow), select a device and run:

* Debug: with debug tools, connect to test.donut.me, both on simulator or devices (with LAN IP)
* Debug (standalone): without debug tools, connect to test.donut.me, standalone bundle
* Release: without debug tools, connect to donut.me, standalone bundle

## Run Android

**Android  development (Genymotion or device)**
* By default DONUT_ENVIRONMENT is set to "test"
* Launch Genymotion
* (on Window you should launch packager manually before with ```react-native start``)
* ```react-native run-android```
* (to see log ```adb logcat```)

**Android release with "test" DONUT_ENVIRONMENT**
* (could be done on both MacOSX and Windows with android/app/debug.keystore)
* ```cd android && ./gradlew assembledonutReleaseTest && ./gradlew installdonutReleaseTest && cd ..```

**Android release with "production" DONUT_ENVIRONMENT**
* (could be done only on MacOSX with android/app/donut-release-key.keystore)
* ```cd android && ./gradlew assembleRelease && ./gradlew installRelease && cd ..```

## Workaround react-native bugs

- /www/donut-native/node_modules/backbone/backbone.js (will be fixed in 0.16 https://github.com/facebook/react-native/commit/8db35d492b846f51a758e8ee7e5e402c6bad3785)

comment line 26

```
// try { $ = require('jquery'); } catch(e) {}
```

Fix rightIcon on navigator

https://github.com/facebook/react-native/issues/4559
- /www/donative/node_modules/react-native/Libraries/CustomComponents/Navigator/NavigatorNavigationBar.js:193
```javascript
 rendered = (
      <View
        ref={(ref) => {
          this._components[componentName] = this._components[componentName].set(route, ref);
        }}
        pointerEvents={
          route === this.props.navigator.navigationContext.currentRoute ? 'box-none' : 'none'
        }
        style={[initialStage[componentName], {marginLeft: 0, flexDirection: 'column', justifyContent:'center'}]}>
        {content}
      </View>
    );
```
