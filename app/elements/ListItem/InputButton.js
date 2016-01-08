'use strict';

var React = require('react-native');
var s = require('../../styles/elements/listItem');
var ListItemAbstract = require('./Abstract');

var {
  View,
  TextInput,
  TouchableHighlight,
  Text
} = React;

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'save': 'Save'
});

class ListItemInput extends ListItemAbstract {
  _renderElement () {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1}}>
        <TextInput
          {...this.props}
          autoFocus
          style={[s.input]}
          keyboardType={(this.props.isEmail) ? 'email-address' : 'default'}/>

        <TouchableHighlight onPress={this.props.onPress}
                            underlayColor='#41C87A'
                            style={[s.button, s.buttonGreen, {borderWidth: 0, padding: 7}, this.props.loading && s.buttonLoading]}>
          <Text style={[s.label, s.labelGreen, this.props.loading && s.labelLoading]}>{i18next.t('local:save')}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

module.exports = ListItemInput;