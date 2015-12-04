'use strict';

var React = require('react-native');
var s = require('../../styles/style');
var UserField = require('../UserField');
var ListGroupItem = require('../ListGroupItem');

var {
  TextInput
} = React;

class UserFieldWebsite extends UserField {
  constructor (props) {
    super(props);
  }
  key = 'website';

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
    <ListGroupItem
      autoFocus={true}
      onPress= {() => this.onPress()}
      placeholder="URL of a website"
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