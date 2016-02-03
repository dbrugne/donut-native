'use strict';

var React = require('react-native');

var Drawer = require('react-native-drawer');
import ExNavigator from '@exponent/react-native-navigator'; // @important: should be 'import'
var BackButton = require('./AndroidBackButton');
var state = require('../state');
var debug = require('../../libs/debug')('navigation');
var ConnectionState = require('../../components/ConnectionState');

module.exports = React.createClass({
  componentDidMount () {
    debug.log('mounting RootNavigator');

    // set navigation state
    state.rootNavigator = this.refs.rootNavigator;
    state.drawer = this.refs.drawer;
  },
  componentWillUnmount () {
    debug.log('unmounting RootNavigator');

    // reset navigation state (@logout)
    state.reset();
  },
  render () {
    var Navigation = require('./DrawerContent');

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
      >
        <BackButton />
        <ExNavigator
          ref='rootNavigator'
          showNavigationBar={false}
          initialRoute={state.getInitialRoute()}
          style={{flex: 1}}
        />
        <ConnectionState/>
      </Drawer>
    );
  }
});
