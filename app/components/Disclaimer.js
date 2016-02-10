'use strict';

var React = require('react-native');
var _ = require('underscore');
var Username = require('./events/Username');
var s = require('../styles/style');

var {
  View,
  Text,
  Image
} = React

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'componentsDisclaimer', {
  'message': 'Message from'
});

var Link = React.createClass({
  propTypes: {
    prepend: React.PropTypes.string,
    text: React.PropTypes.string,
    owner_id: React.PropTypes.string,
    owner_username: React.PropTypes.string,
    navigator: React.PropTypes.object,
    warning: React.PropTypes.bool,
    arrow: React.PropTypes.bool
  },
  render () {
    if (!this.props.text) {
      return null;
    }

    return (
      <View style={[{marginVertical: 0, marginHorizontal: 0, borderRadius: 0, alignSelf:'stretch', position: 'relative'}, s.disclaimer, this.props.warning && s.disclaimerWarning]}>
        {this._renderArrow()}
        {this._renderPrepend()}
        <Username
          prepend={i18next.t('componentsDisclaimer:message')}
          user_id={this.props.owner_id}
          username={this.props.owner_username}
          navigator={this.props.navigator}
          style={[s.disclaimerText, this.props.warning && s.disclaimerTextWarning, {paddingLeft: 5}]}
        />
        <Text style={[s.disclaimerText, this.props.warning && s.disclaimerTextWarning, {fontStyle: 'italic', marginTop: 10}]}>{'"' + _.unescape(this.props.text) + '"'}</Text>
      </View>
    );
  },
  _renderArrow() {
    if (this.props.warning) {
      return (<Image />);
    }

    return (<Image />);
  },
  _renderPrepend() {
    if (!this.props.prepend) {
      return null;
    }

    return (
      <Text style={[s.disclaimerText, this.props.warning && s.disclaimerTextWarning, {marginBottom: 10}]}>{this.props.prepend}</Text>
    );
  }
});

module.exports = Link;
