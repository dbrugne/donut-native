'use strict';

var React = require('react-native');
var s = require('../styles/style');
var UserField = require('../components/UserField');
var ListItem = require('../components/ListItem');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupEditDisclaimer', {
  'placeholder': 'message displayed',
  'help': 'Maximum 255 characters'
});

class GroupEditDisclaimer extends UserField {
  key = 'disclaimer';
  constructor (props) {
    super(props);
  }

  renderField () {
    return (
    <ListItem
      ref='input'
      onPress= {() => this.onPress()}
      placeholder={i18next.t('GroupEditDisclaimer:placeholder')}
      value={this.state.value}
      maxLength={255}
      onChange={(event) => this.setState({value: event.nativeEvent.text})}
      type='input-button'
      multi={true}
      help={i18next.t('GroupEditDisclaimer:help')}
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

module.exports = GroupEditDisclaimer;