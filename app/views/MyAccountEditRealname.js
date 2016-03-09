'use strict';

var React = require('react-native');
var s = require('../styles/style');
var UserField = require('../components/UserField');
var ListItem = require('../components/ListItem');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'myAccountRealname', {
  'placeholder': 'Full name',
  'help': 'Between 2 and 20 characters. Letters, dashes (-), apostrophes and spaces.'
});

class UserFieldRealname extends UserField {
  constructor (props) {
    super(props);
    this.key = 'realname';
  }

  renderField () {
    return (
    <ListItem
      ref='input'
      onPress= {() => this.onPress()}
      placeholder={i18next.t('myAccountRealname:placeholder')}
      value={this.state.value}
      maxLength={20}
      onChange={(event) => this.setState({value: event.nativeEvent.text})}
      type='input-button'
      help={i18next.t('myAccountRealname:help')}
      />
    );
  }

  onPress () {
    this.props.data.onSave(this.key, this.state.value, (err) => {
      if (!err) {
        this.props.navigator.pop();
      }
    });
  }
}

module.exports = UserFieldRealname;