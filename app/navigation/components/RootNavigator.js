'use strict';

var React = require('react-native');
var Platform = require('Platform');

var Drawer = require('react-native-drawer');
import ExNavigator from '@exponent/react-native-navigator'; // @important: should be 'import'
var BackButton = require('./AndroidBackButton');
var state = require('../state');
var app = require('../libs/app');
var debug = require('../../libs/debug')('navigation');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      status: app.user.get('status')
    };
  },
  componentDidMount () {
    debug.log('mounting RootNavigator');

    // set navigation state
    state.rootNavigator = this.refs.rootNavigator;
    state.drawer = this.refs.drawer;

    app.user.on('change:status', () => this.setState({status: currentUser.get('status')}), this);
  },
  componentWillUnmount () {
    debug.log('unmounting RootNavigator');

    // reset navigation state (@logout)
    state.reset();

    app.user.off(null, null, this);
  },
  render () {
    var Navigation = require('./NavigationView');

    var navigationBarHeight = (Platform.OS === 'android')
      ? 56
      : 64;

    return (
      <Drawer
        ref='drawer'
        content={<Navigation />}
        styles={{main: {shadowColor: '#000000', shadowOpacity: 0.4, shadowRadius: 3}}}
        openDrawerOffset={50}
        panOpenMask={0}
        panCloseMask={50}
        tapToClose
        captureGestures
        onOpen={state.onDrawerDidOpen.bind(state)}
        onClose={state.onDrawerDidClose.bind(state)}
        tweenHandler={this.getDrawerTweenHandler}
      >
        <BackButton />
        <ExNavigator
          ref='rootNavigator'
          showNavigationBar={false}
          initialRoute={state.getInitialRoute()}
          style={{ flex: 1 }}
        />
        {
          (this.state.status === 'offline')
            ? <View style={{
              height: 30,
              backgroundColor: '#F00',
              position: 'absolute',
              top: navigationBarHeight,
              left: 0,
              right: 0,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text style={{color: '#FFF'}}>{this.state.status}</Text></View>
            : (this.state.status === 'connecting')
            ? <View style={{
                height: 30,
                backgroundColor: '#FA0',
                position: 'absolute',
                top: navigationBarHeight,
                left: 0,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center'}}>
            <Text style={{color: '#FFF'}}>{this.state.status}</Text></View>
            : null
        }
      </Drawer>
    );
  },
  getDrawerTweenHandler (ratio) {
    return {
      drawer: { shadowRadius: Math.min(ratio * 5 * 5, 5) },
      main: { opacity: (2 - ratio) / 2 }
    };
  }
});
