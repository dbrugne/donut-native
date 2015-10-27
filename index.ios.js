'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  View,
  Navigator,
  Component,
} = React;

var client = require('./app/libs/client');
var LoginView = require('./app/LoginView');

class DonutApp extends Component {
  constructor (props) {
    super(props);
    this.client = client;
  }
  componentDidMount () {
    this.client.connect();
  }
  render () {
    return (
      <Navigator
        style={styles.navigationContainer}
        initialRoute={{ name: 'login', index: 0, component: LoginView }}
        renderScene={this.renderScene.bind(this)}
      />
    );
  }
  renderScene (route, navigator) {
    return (<route.component name={route.name} navigator={navigator} client={this.client} />);
  }
}

var styles = StyleSheet.create({
  navigationContainer: {
    flex: 1
  }
});

AppRegistry.registerComponent('donutMobile', () => DonutApp);