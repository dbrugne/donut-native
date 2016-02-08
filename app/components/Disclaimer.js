'use strict';

var React = require('react-native');
var Username = require('./events/Username');
var s = require('../styles/style');

var {
  View,
  Text
} = React;
var Icon = require('react-native-vector-icons/FontAwesome');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'componentsDisclaimer', {
  'message': 'Message from'
});

var Link = React.createClass({
  propTypes: {
    text: React.PropTypes.string,
    owner_id: React.PropTypes.string,
    owner_username: React.PropTypes.string,
    navigator: React.PropTypes.object
  },
  render () {
    if (!this.props.text) {
      return null;
    }

    return (
      <View style={[s.alertWarning, {marginVertical: 0, marginHorizontal: 0, marginTop: 10, borderRadius: 0, alignSelf:'stretch'}]}>
        <Username
          prepend={i18next.t('componentsDisclaimer:message')}
          user_id={this.props.owner_id}
          username={this.props.owner_username}
          navigator={this.props.navigator}
          style={[s.alertWarningText, {fontStyle: 'italic', paddingLeft: 5}]}
        />
        <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', alignSelf:'stretch'}}>
          <Icon
            name='quote-right'
            size={14}
            color='#8a6d3b'
            style={{marginTop: 2}}
          />
          <View style={{flexDirection: 'column', flex:1, justifyContent: 'center'}}>
            <Text style={[s.alertWarningText, {fontStyle: 'italic', paddingLeft: 5}]}>{this.props.text}</Text>
          </View>
        </View>
      </View>
    );
  }
});

module.exports = Link;
