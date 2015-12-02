'use strict';

var React = require('react-native');
var s = require('../../styles/style');
var UserField = require('../UserField');

var {
  TextInput
} = React;

class UserFieldWebsite extends UserField {
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
      <TextInput
        placeholder='URL of a website'
        onChangeText={(text) => this.setState({value: text})}
        value={this.state.value}
        multi={false}
        style={s.input} />
    );
  }
}

module.exports = UserFieldWebsite;