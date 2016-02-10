'use strict';

var React = require('react-native');
var {
  TouchableOpacity
} = React;

var Icon = require('react-native-vector-icons/EvilIcons');
var IconFA = require('react-native-vector-icons/FontAwesome');
import ExNavigator from '@exponent/react-native-navigator'; // @important: should be 'import'
var app = require('../../libs/app');

module.exports = React.createClass({
  getInitialState () {
    return {
      unviewed: !!app.user.get('unviewedDiscussion')
    };
  },
  componentDidMount () {
    app.user.on('change:unviewedDiscussion', (model, value) => this.setState({
      unviewed: !!value
    }), this);
  },
  componentWillUnmount () {
    app.user.off(null, null, this);
  },
  render () {
    var badge = (this.state.unviewed === true)
      ? (<IconFA name='circle' size={13} color='#fc2063' style={{position: 'absolute', top: 6, left: 27, backgroundColor: 'transparent'}} />)
      : null;

    return (
      <TouchableOpacity
        touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
        onPress={() => require('../index').toggleDrawer()}
        style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 44, height:44}} >
        <Icon
          name='navicon'
          size={35}
          color='#FC2063'
        />
        {badge}
      </TouchableOpacity>
    );
  }
});
