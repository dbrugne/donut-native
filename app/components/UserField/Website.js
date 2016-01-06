'use strict';

var React = require('react-native');
var s = require('../../styles/style');
var UserField = require('../UserField');
var ListItem = require('../../elements/ListItem');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'placeholder': 'URL of a website'
});

class UserFieldWebsite extends UserField {
  key = 'website';

  constructor (props) {
    super(props);
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
    return (
    <ListItem
      ref='input'
      autoCapitalize='none'
      onPress= {() => this.onPress()}
      placeholder={i18next.t('local:placeholder')}
      value={this.state.value}
      onChange={(event) => this.setState({value: event.nativeEvent.text})}
      type='input-button'
      multi={false}
      />
    );
  }

  onPress () {
    this.props.data.onSave(this.key, this.state.value);
    this.props.navigator.pop();
  }
}

module.exports = UserFieldWebsite;