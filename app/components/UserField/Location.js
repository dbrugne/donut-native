'use strict';

var React = require('react-native');
var s = require('../../styles/style');
var UserField = require('../UserField');

var {
  TextInput
} = React;

class UserFieldLocation extends UserField {
  key = 'location';

  renderField () {
    return (
      <TextInput
        placeholder='City, country where you are'
        onChangeText={(text) => this.setState({value: text})}
        value={this.state.value}
        multi={false}
        style={s.input} />
    );
  }
}

module.exports = UserFieldLocation;