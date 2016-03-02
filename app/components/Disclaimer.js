'use strict';

var React = require('react-native');
var _ = require('underscore');
var Username = require('./events/Username');

var {
  View,
  Text
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'componentsDisclaimer', {
  'message': 'Message from',
  'header': 'This discussion is private.'
});

var Link = React.createClass({
  propTypes: {
    model: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object
  },
  render () {
    return (
      <View style={{ padding: 20, alignSelf: 'stretch', backgroundColor: '#E7ECF3' }}>
        <Text
          style={{ fontFamily: 'Open Sans', fontSize: 14, color: '#394350' }}>{i18next.t('componentsDisclaimer:header')}</Text>
        {this._renderDisclaimer()}
      </View>
    );
  },

  _renderDisclaimer() {
    if (!this.props.model.get('disclaimer')) {
      return null;
    }

    return (
      <View style={{ marginTop: 20 }}>
        <Username
          prepend={i18next.t('componentsDisclaimer:message')}
          user_id={this.props.model.get('owner_id')}
          username={this.props.model.get('owner_username')}
          navigator={this.props.navigator}
          style={{fontStyle: 'italic', paddingLeft: 5, fontWeight: '500'}}
          />
        <View
          style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', alignSelf: 'stretch', marginTop: 20}}>
          <View style={{flexDirection: 'column', flex: 1, justifyContent: 'center'}}>
            <Text style={{ fontStyle: 'italic' }}>{'"' + _.unescape(this.props.model.get('disclaimer')) + '"'}</Text>
          </View>
        </View>
      </View>
    );
  }
});

module.exports = Link;
