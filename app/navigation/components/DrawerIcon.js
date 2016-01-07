'use strict';

var React = require('react-native');
var {
  TouchableOpacity
} = React;

var Icon = require('react-native-icons').Icon;
import ExNavigator from '@exponent/react-native-navigator'; // @important: should be 'import'
var app = require('../../libs/app');
var state = require('../state');

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
      ? (<Icon name='fontawesome|circle' size={14} color='#fc2063' style={{position: 'absolute', top: 5, left: 20, width: 13, height: 13}} />)
      : null;

    return (
      <TouchableOpacity
        touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
        onPress={() => state.toggleDrawer()}
        style={[{marginLeft: 5}, ExNavigator.Styles.barBackButton]} >
        <Icon name='fontawesome|bars'
              size={25}
              color='#fc2063'
              style={[ExNavigator.Styles.barButtonIcon, {marginTop: 11, marginLeft: 5, width: 22, height: 22}]} />
        {badge}
      </TouchableOpacity>
    );
  }
});
