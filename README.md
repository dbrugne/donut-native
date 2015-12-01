# donut-native

## Questions & tasks

* [ ] push notifications
* [ ] hyperlink opening
* [ ] Add i18next usage
* [ ] Build stand alone APK for testing
* [ ] Build on iOS for testing
* [ ] stores submission

## Pre-requisites

Requirements: https://facebook.github.io/react-native/docs/getting-started.html

* nvm + node 4.0+

```
brew install watchman
npm install -g react-native-cli
```

[Android installation and workaround](./Android.md)

## Run

**iOS development**
* Open Xcode project: ```open /www/donut-native/ios/donutMobile.xcodeproj```
* Select device in top dropdown and play icon

**iOS device**
@todo 

**Android  development**
*  Launch Genymotion
* (on Window launch packager before, react-native start)
* react-native run-android

**Android device**
@todo

## Production build
 
* [ ] debug/test settings and bundle package
* [ ] Facebook ID ios/donutMobile/Info.plist
* [ ] Facebook ID android/app/src/main/res/values/strings.xml
* [ ] WS URL app/libs/client.js
* [ ] OAUTH URL app/libs/oauth.js

## Fix compilation errors (jquery & xmlhttprequest libs)

- /www/donut-native/node_modules/backbone/backbone.js (will be fixed in 0.16 https://github.com/facebook/react-native/commit/8db35d492b846f51a758e8ee7e5e402c6bad3785)

comment line 26

```
// try { $ = require('jquery'); } catch(e) {}
```

- /www/donut-native/node_modules/engine.io-client/lib/transports/index.js

Change path to XMLHttpRequest

```
// var XMLHttpRequest = require('xmlhttprequest');
var XMLHttpRequest = require('../xmlhttprequest');
```
 
- /www/donut-native/node_modules/engine.io-client/lib/transports/polling-xhr.js

Change path to XMLHttpRequest

```
// var XMLHttpRequest = require('xmlhttprequest');
var XMLHttpRequest = require('../xmlhttprequest');
```

- /www/donut-native/node_modules/engine.io-client/lib/transports/polling.js

Change path to XMLHttpRequest

```
// var XMLHttpRequest = require('xmlhttprequest');
var XMLHttpRequest = require('../xmlhttprequest');
```