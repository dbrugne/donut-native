var React = require('react-native');

var {
  View,
  Component,
  StyleSheet,
  Navigator
} = React;

var currentUser = require('../models/mobile-current-user');
var ChooseUsername = require('../views/LoggedOutChooseUsername');

class LoggedOut extends Component {
  render () {
    if (currentUser.oauth.requireUsername === true) {
      return (
        <ChooseUsername />
      );
    }

    return (
      <View style={styles.appContainer}>
        <Navigator
          ref='navigator'
          debugOverlay={false}
          renderScene={this.renderScene}
          initialRoute={{ name: 'login', index: 0, component: require('../views/LoggedOutLogin') }}
          onBack={() => {navigator.pop()}}
        />
      </View>
    );
  }

  renderScene (route, navigator) {
    return (<route.component name={route.name} navigator={navigator} client={this.client} />);
  }
};

var styles = StyleSheet.create({
  appContainer: {
    flex: 1
  },
});

module.exports = LoggedOut;
