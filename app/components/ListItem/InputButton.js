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
i18next.addResourceBundle('en', 'inputButton', {
  'save': 'Save'
});

class ListItemInputButton extends ListItemAbstract {
  _renderContent () {
    return (
      <View style={[s.listGroupItem, this.props.first && s.listGroupItemFirst, this.props.last && s.listGroupItemLast]}>
        {this._renderElement()}
        {this._renderRightIcon()}
      </View>
    );
  }

  _renderElement () {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', flex: 1}}>
        <TextInput
          {...this.props}
          style={[s.input, this.props.multiline && {height: 80}]}
          />

        <TouchableHighlight onPress={this.props.onPress}
                            underlayColor='#41C87A'
                            style={[s.button, s.buttonGreen, {borderWidth: 0, padding: 7}, this.props.loading && s.buttonLoading]}>
          <Text style={[s.label, s.labelGreen, this.props.loading && s.labelLoading]}>{i18next.t('inputButton:save')}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

module.exports = ListItemInputButton;
