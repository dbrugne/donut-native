'use strict';

var React = require('react-native');
var s = require('../styles/style');
var UserField = require('../components/UserField');
var ListItem = require('../components/ListItem');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'myAccountLocation', {
  'placeholder': 'City, country where you are',
  'help': 'Maximum 70 characters'
});

class UserFieldLocation extends UserField {
  key = 'location';

  constructor (props) {
    super(props);
  }

  renderField () {
    return (
    <ListItem
      ref='input'
      onPress= {() => this.onPress()}
      placeholder={i18next.t('myAccountLocation:placeholder')}
      value={this.state.value}
      maxLength={70}
      onChange={(event) => this.setState({value: event.nativeEvent.text})}
      type='input-button'
      help={i18next.t('myAccountLocation:help')}
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

module.exports = UserFieldLocation;