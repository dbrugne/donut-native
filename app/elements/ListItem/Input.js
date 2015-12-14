'use strict';

var React = require('react-native');
var Platform = require('Platform');
var s = require('./style');
var Button = require('../Button');

var {
  Component,
  View,
  TextInput,
  TouchableHighlight,
  Text
} = React;

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'save': 'Save'
});

class ListItemInput extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <View style={s.listGroupItem}>
        <TextInput
          autoFocus={true}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
          style={s.input}
          value={this.props.value} />

        <TouchableHighlight onPress={this.props.onPress}
                            underlayColor='#41C87A'
                            style={[s.button, s.buttonGreen, this.props.loading && s.buttonLoading]}>
          <Text style={[s.label, s.labelGreen, this.props.loading && s.labelLoading]}>{i18next.t('local:save')}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

module.exports = ListItemInput;