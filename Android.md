# Android platform

## Install release SDK for windows

1. Connect your device to the computer
2. Open your phone path in the windows explorer
3. Drag and drop the **SDK** in a folder (data for example)
4. Now in your phone open the file explorer ("My files" or "File manager" on Samsung for example)
5. Go to the folder where you copy the **SDK** previously and press the **SDK**
6. Accept the terms and enjoy !

## Useful commands

- **react-native run-android** (install the app)
- **react-native start** (start the packager)
- **adb logcat** (show android log)
- **adb devices** (show all connected devices and vm)

## Key hashes
* Damien: ysxcifnNOepEMyMqSh8s0ZBZeQw=
* Yann: 7/tWINJFkb+GgkDP+zjT7zAmb1I=
* Seb: HEZ7J3XiTRk0MZ93L126qZ+Nr9M=
* Yoann: 62a6zyOL4/TN09IEwnUQou6bMZ0=
* release.keystore: AW/MTPQS+E+uQTrpZppXB7Xx0VM=

## Setup for Windows

- SDK and NDK path should not contains whitespace !
- https://facebook.github.io/react-native/docs/android-setup.html#content
- in PATH add =>  \<sdk path>\tools and \<sdk path>\platform-tools
- https://github.com/facebook/react-native/blob/master/ReactAndroid/README.md#prerequisites

To use your own device :
- https://facebook.github.io/react-native/docs/running-on-device-android.html#content
- make sure your device had the correct driver
- then lunch the app => react-native phone menu => dev settings => debug server ... => ipPcOnWifi:8081 
