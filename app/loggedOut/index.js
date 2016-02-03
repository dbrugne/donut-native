var React = require('react-native');

var {
  View,
  Component,
  StyleSheet,
  Navigator,
  BackAndroid,
  Platform
} = React;

class LoggedOut extends Component {
  componentDidMount () {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', () => this._back());
    }
  }
  componentWillUnmount () {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', () => this._back());
    }
  }
  _back () {
    var nav = (this.refs && this.refs.navigator) ? this.refs.navigator : null;
    if (!nav) {
      return false;
    }
    var routes = nav.getCurrentRoutes();
    if (routes && routes.length > 1) {
      nav.pop();
      // if callback don't return true the default callback is called
      return true;
    }
    return false;
  }
  render () {
    return (
      <View style={styles.appContainer}>
        <Navigator
          ref='navigator'
          debugOverlay={false}
          renderScene={this.renderScene}
          initialRoute={{ name: 'login', index: 0, component: require('./login') }}
          onBack={() => navigator.pop()}
        />
      </View>
    );
  }
  renderScene (route, navigator) {
    return (<route.component name={route.name} navigator={navigator} client={this.client} />);
  }
}

var styles = StyleSheet.create({
  appContainer: {
    flex: 1
  }
});

module.exports = LoggedOut;
