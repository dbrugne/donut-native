'use strict';

var React = require('react-native');
var s = require('../styles/style');
var UserField = require('../components/UserField');
var ListItem = require('../components/ListItem');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'placeholder': 'name and first name'
});

class UserFieldRealname extends UserField {
  key = 'realname';
  constructor (props) {
    super(props);
  }

  renderField () {
    return (
    <ListItem
      ref='input'
      onPress= {() => this.onPress()}
      placeholder={i18next.t('local:placeholder')}
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

module.exports = UserFieldRealname;