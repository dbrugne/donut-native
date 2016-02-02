'use strict';

var React = require('react-native');
var s = require('../styles/style');
var UserField = require('../components/UserField');
var ListItem = require('../components/ListItem');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupEditWebsite', {
  'placeholder': 'URL of a website',
  'help': 'Require valid url and 255 characters max'
});

class GroupEditWebsite extends UserField {
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
    var value = (this.state.value && this.state.value.title)
      ? this.state.value.title
      : this.state.value;
    return (
      <ListItem
        ref='input'
        onPress= {() => this.onPress()}
        placeholder={i18next.t('GroupEditWebsite:placeholder')}
        value={value}
        onChange={(event) => this.setState({value: event.nativeEvent.text})}
        type='input-button'
        help={i18next.t('GroupEditWebsite:help')}
      />
    );
  }

  onPress () {
    this.props.data.onSave(this.key, this.state.value);
    this.props.navigator.pop();
  }
}

module.exports = GroupEditWebsite;