var React = require('react-native');

var {
  View,
  Component,
  StyleSheet,
  Navigator
} = React;

//var NavigationBar = require('../Navigation/NavigationBar');
var LoginView = require('../views/LoginView');

class LoggedOut extends Component {
//  mixins: [NavigationBar],
//
//  getDefaultProps: function() {
//    return {navBarHidden: true};
//  },
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
          initialRoute={{ name: 'login', index: 0, component: LoginView }}
//          renderScene={this.renderScene.bind(this)}
//          navigationBar={this.renderNavBar()}
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
