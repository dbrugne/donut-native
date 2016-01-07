'use strict';

var React = require('react-native');
var s = require('../../styles/elements/listItem');
var ListItemAbstract = require('./Abstract');

var {
  TextInput
} = React;

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'save': 'Save'
});

class ListItemInput extends ListItemAbstract {
  _renderElement () {
    return (
      <TextInput
        {...this.props}
        autoFocus
        style={[s.input]}
        keyboardType={(this.props.isEmail) ? 'email-address' : 'default'}/>
    );
  }
}

module.exports = ListItemInput;