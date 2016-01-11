'use strict';

var React = require('react-native');
var {
  TouchableOpacity,
  Platform
} = React;

var Icon = require('react-native-icons').Icon;
import ExNavigator from '@exponent/react-native-navigator'; // @important: should be 'import'
var app = require('../../libs/app');

module.exports = React.createClass({
  getInitialState () {
    return {
      unviewed: app.user.get('unviewed')
    };
  },
  componentDidMount () {
    app.user.on('change:unviewed', (model, value) => this.setState({
      unviewed: value
    }), this);
  },
  componentWillUnmount () {
    app.user.off(null, null, this);
  },
  render () {
    var badge = (this.state.unviewed === true)
      ? (<Icon name='fontawesome|circle' size={14} color='#fc2063' style={{position: 'absolute', top: 8, left: 30, width: 13, height: 13}} />)
      : null;

    return (
      <TouchableOpacity
        touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
        onPress={() => require('../index').toggleDrawer()}
        style={ExNavigator.Styles.barBackButton} >
        <Icon name='fontawesome|bars'
              size={25}
              color='#999998'
              style={[{marginLeft: 16, width:22, height:22}, Platform.OS === 'android' ? {marginTop: 14} : {marginTop: 11}]} />
        {badge}
      </TouchableOpacity>
    );
  }
});