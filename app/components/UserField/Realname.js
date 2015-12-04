'use strict';

var React = require('react-native');
var s = require('../../styles/style');
var UserField = require('../UserField');

var {
  TextInput
} = React;

class UserFieldRealname extends UserField {
  key = 'realname';

  renderField () {
    return (
      <TextInput
        autoFocus={true}
        placeholder='name and first name'
        onChangeText={(text) => this.setState({value: text})}
        value={this.state.value}
        multi={false}
        style={s.input} />
    );
  }
}

module.exports = UserFieldRealname;