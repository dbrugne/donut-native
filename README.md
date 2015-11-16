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

https://facebook.github.io/react-native/docs/android-setup.html#content

PATH add =>  \<sdk>\tools and \<sdk>\platform-tools
