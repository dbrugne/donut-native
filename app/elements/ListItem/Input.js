'use strict';

var React = require('react-native');
var Platform = require('Platform');
var s = require('../../styles/elements/listItem');
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
      <View>
        {this._renderTitle()}
        <View style={[s.listGroupItem, { justifyContent:'center', alignItem:'center', paddingTop: 5, paddingBottom: 5 }]}>
          <TextInput
            autoFocus={true}
            placeholder={this.props.placeholder}
            onChange={this.props.onChange}
            style={[s.input, {marginTop:5}]}
            value={this.props.value} />

          <TouchableHighlight onPress={this.props.onPress}
                              underlayColor='#41C87A'
                              style={[s.button, s.buttonGreen, {borderWidth: 0, padding:10}, this.props.loading && s.buttonLoading]}>
            <Text style={[s.label, s.labelGreen, this.props.loading && s.labelLoading]}>{i18next.t('local:save')}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  _renderTitle() {
    if (!this.props.title) {
      return null;
    }
    return (
      <Text style={s.listGroupTitle}>{this.props.title}</Text>
    );
  }
}

module.exports = ListItemInput;