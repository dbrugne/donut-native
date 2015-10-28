'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Navigator,
  Component,
} = React;

var Drawer = require('react-native-drawer');
var client = require('./app/libs/client');
var LoginView = require('./app/LoginView');
var NavigationView = require('./app/NavigationView');

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
      <Drawer
        type="static"
        content={<NavigationView />}
        openDrawerOffset={100}
        styles={{main: {shadowColor: "#000000", shadowOpacity: 0.4, shadowRadius: 3}}}
        tweenHandler={Drawer.tweenPresets.parallax}
        >
        <Navigator
          ref='navigator'
          style={styles.navigationContainer}
          initialRoute={{ name: 'login', index: 0, component: LoginView }}
          renderScene={this.renderScene.bind(this)}
          />
      </Drawer>
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