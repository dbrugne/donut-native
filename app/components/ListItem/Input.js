'use strict';

var React = require('react-native');
var s = require('../../styles/elements/listItem');
var ListItemAbstract = require('./Abstract');

var {
  TextInput
} = React;

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'input', {
  'save': 'Save'
});

class ListItemInput extends ListItemAbstract {
  _renderElement () {
    return (
      <TextInput
        {...this.props}
        style={[s.input]}
      />
    );
  }
}

module.exports = ListItemInput;