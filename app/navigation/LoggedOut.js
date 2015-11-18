var React = require('react-native');

var {
  View,
  Component,
  StyleSheet,
  Navigator
} = React;

class LoggedOut extends Component {
  componentDidMount() {
    // @todo : listen for nav event on app => this.refs.navigator
  }
  componentWillUnmount() {
    // @todo : remove nav event listener
  }

  render () {
    return (
      <View style={styles.appContainer}>
        <Navigator
          ref='navigator'
          debugOverlay={false}
          renderScene={this.renderScene}
          initialRoute={{ name: 'login', index: 0, component: require('../views/LoginView') }}
          onBack={() => {navigator.popToTop()}}
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
