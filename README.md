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

For both scenario launch Xcode project and be sure donutMobile scheme is selected (selector is on the right of the stop button).

**iOS development (simulator and device)**
* (be sure Product > Scheme > Edit Scheme... > Run has Build Configuration to **Debug**)
* Select device in top dropdown and press play button

**iOS release**
* (be sure Product > Scheme > Edit Scheme... > Run has Build Configuration to **Release**)
* Select device in top dropdown and press play button

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
