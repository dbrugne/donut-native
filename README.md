# donut-native

## TODO

* [ ] Load code from AppHub (broken?)
* [ ] AppStore store submission
* [ ] Test Android (default conf?)
* [ ] APK David
* [ ] GH tasks reviews
* [ ] @dbrugne/donut-client

* [ ] fix android discussion (need to test RN0.0.16 ? but react-native-parsed-text block RN0.16.0 migration ... => test with 0.7.0)
* [ ] Icon and splashscreen Android
* [ ] Switch configuration Android
  - [ ] Facebook ID android/app/src/main/res/values/strings.xml
* [ ] Send .apk to David

* [ ] solve emoticons
* [ ] push notifications logic implementation
* [ ] Android keyboard close on message send
* [ ] Close keyboard (unfocus field?) on drawer open

## Pre-requisites

Requirements: https://facebook.github.io/react-native/docs/getting-started.html

* nvm + node 4.0+

```
brew install watchman
npm install -g react-native-cli
npm install -g babel-cli # react-native-parsed-text
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
* Launch Genymotion
* (on Window you should launch packager manually before with ```react-native start``)
* ```react-native run-android```
* (to see log ```adb logcat```)

**Android release**
* (could be done only on MacOSX with android/app/donut-release-key.keystore)
* ```cd android && ./gradlew assembleRelease && ./gradlew installRelease && cd ..```

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

Allow react-native packager to support other env than Debug and Release 

- /www/donut-native/node_modules/react-native/packager/react-native-xcode.sh

```
#case "$CONFIGURATION" in
#  Debug)
#    DEV=true
#    ;;
#  Release)
#    DEV=false
#    ;;
#  "")
#    echo "$0 must be invoked by Xcode"
#    exit 1
#    ;;
#  *)
#    echo "Unsupported value of \$CONFIGURATION=$CONFIGURATION"
#    exit 1
#    ;;
#esac
case "$CONFIGURATION" in
  Debug)
    DEV=true
    ;;
  "")
    echo "$0 must be invoked by Xcode"
    exit 1
    ;;
  *)
    DEV=false
    ;;
esac
```
