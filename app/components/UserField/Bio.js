'use strict';

var React = require('react-native');
var s = require('../../styles/style');
var UserField = require('../UserField');
var ListGroupItem = require('../ListGroupItem');

var {
  TextInput
} = React;

class UserFieldBio extends UserField {
  constructor (props) {
    super(props);
  }
  key = 'bio';

  renderField () {
    return (
    <ListGroupItem
      autoFocus={true}
      onPress= {() => this.onPress()}
      placeholder="Biography"
      value={this.state.value}
      onChange={(event) => this.setState({value: event.nativeEvent.text})}
      type='input-button'
      multi={true}
      />
    );
  }

  onPress () {
    this.props.data.onSave(this.key, this.state.value);
    this.props.navigator.pop();
  }
}

module.exports = UserFieldBio;