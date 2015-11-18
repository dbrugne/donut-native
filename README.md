# donut-native

## Pre-requisites

Requirements: https://facebook.github.io/react-native/docs/getting-started.html

* nvm + node 4.0+

```
brew install watchman
npm install -g react-native-cli
```

## Questions

* [x] authentication (email)
* [ ] authentication (Facebook)
* [x] deploy on iOS devices
* [x] deploy on Android devices
* [x] ws connectivity
* [x] multi-view and navigation
* [ ] push notifications

## Interesting example

```
  componentDidMount() {    
    this._loadInitialState().done();
  }
  
  async _loadInitialState() {
    try {
      var value = await AsyncStorage.getItem('token');
      if (value !== null) {
        console.log('logged in', value);
        this.displayHomeView();
      } else {
        console.log('not logged in');
      }
    } catch (error) {
      console.log(error);
    }
  }
```  

## Android setup for windows

Les paths du sdk et du ndk ne doivent pas contenir d'espace !

https://facebook.github.io/react-native/docs/android-setup.html#content

PATH add =>  \<sdk path>\tools and \<sdk path>\platform-tools


https://github.com/facebook/react-native/blob/master/ReactAndroid/README.md#prerequisites

To use your own device :
- https://facebook.github.io/react-native/docs/running-on-device-android.html#content
- and make sure your device had the correct driver
