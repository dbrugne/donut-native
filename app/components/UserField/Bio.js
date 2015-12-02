'use strict';

var React = require('react-native');
var s = require('../../styles/style');
var UserField = require('../UserField');

var {
  TextInput
} = React;

class UserFieldBio extends UserField {
  key = 'bio';

  renderField () {
    return (
      <TextInput
        placeholder='Biography'
        onChangeText={(text) => this.setState({value: text})}
        value={this.state.value}
        multi={true}
        style={s.input} />
    );
  }
}

module.exports = UserFieldBio;