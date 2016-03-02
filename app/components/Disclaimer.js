'use strict';

var React = require('react-native');
var _ = require('underscore');
var Username = require('./events/Username');
var s = require('../styles/style');

var {
  View,
  Text
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'componentsDisclaimer', {
  'message': 'Message from'
});

var Link = React.createClass({
  propTypes: {
    model: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object
  },
  render () {
    if (!this.props.model.get('disclaimer')) {
      return null;
    }

    return (
      <View
        style={[s.alertWarning, {marginVertical: 0, marginHorizontal: 0, marginTop: 10, borderRadius: 0, alignSelf:'stretch'}]}>
        <Username
          prepend={i18next.t('componentsDisclaimer:message')}
          user_id={this.props.model.get('owner_id')}
          username={this.props.model.get('owner_username')}
          navigator={this.props.navigator}
          style={[s.alertWarningText, {fontStyle: 'italic', paddingLeft: 5}]}
          />
        <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', alignSelf:'stretch'}}>
          <View style={{flexDirection: 'column', flex:1, justifyContent: 'center'}}>
            <Text
              style={[s.alertWarningText, {fontStyle: 'italic', paddingLeft: 5}]}>{_.unescape(this.props.model.get('disclaimer'))}</Text>
          </View>
        </View>
      </View>
    );
  }
});

module.exports = Link;
