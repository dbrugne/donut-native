'use strict';

var React = require('react-native');
var s = require('../../styles/style');
var UserField = require('../UserField');
var ListItem = require('../../elements/ListItem');

var {
  TextInput
} = React;

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'placeholder': 'City, country where you are'
});

class UserFieldLocation extends UserField {
  constructor (props) {
    super(props);
  }
  key = 'location';

  renderField () {
    return (
    <ListItem
      autoFocus={true}
      onPress= {() => this.onPress()}
      placeholder={i18next.t('local:placeholder')}
      value={this.state.value}
      onChange={(event) => this.setState({value: event.nativeEvent.text})}
      type='input-button'
      />
    );
  }

  onPress () {
    this.props.data.onSave(this.key, this.state.value);
    this.props.navigator.pop();
  }
}

module.exports = UserFieldLocation;