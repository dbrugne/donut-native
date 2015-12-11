'use strict';

var React = require('react-native');
var s = require('../../styles/style');
var UserField = require('../UserField');
var ListGroupItem = require('../ListGroupItem');

var {
  TextInput
} = React;

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'placeholder': 'Biography'
});

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
      placeholder={i18next.t('local:placeholder')}
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