'use strict';

var React = require('react-native');
var s = require('../styles/style');
var UserField = require('../components/UserField');
var ListItem = require('../components/ListItem');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'myAccountWebsite', {
  'placeholder': 'Website URL',
  'help': 'Valid URL of 255 characters max.'
});

// @todo : avoid uppercase in Input field only for this user attribute

class UserFieldWebsite extends UserField {

  constructor (props) {
    super(props);
    this.key = 'website';
  }

  isValid () {
    if (!this.state.value) {
      return true;
    }
    if (this.state.value.length < 5 || this.state.value.length > 255) {
      return false;
    }
    return (this.state.value && /^[^\s]+\.[^\s]+$/.test(this.state.value));
  }

  renderField () {
    var value = (this.state.value && this.state.value.title)
      ? this.state.value.title
      : this.state.value;
    return (
    <ListItem
      ref='input'
      onPress= {() => this.onPress()}
      placeholder={i18next.t('myAccountWebsite:placeholder')}
      value={value}
      maxLength={255}
      onChange={(event) => this.setState({value: event.nativeEvent.text})}
      type='input-button'
      autoCapitalize='none'
      help={i18next.t('myAccountWebsite:help')}
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

module.exports = UserFieldWebsite;