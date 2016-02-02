'use strict';

var React = require('react-native');
var s = require('../styles/style');
var UserField = require('../components/UserField');
var ListItem = require('../components/ListItem');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupEditDescription', {
  'placeholder': 'describe this community in a few words',
  'help': 'Maximum 255 characters'
});

class GroupEditDescription extends UserField {
  key = 'description';
  constructor (props) {
    super(props);
  }

  renderField () {
    return (
    <ListItem
      ref='input'
      onPress= {() => this.onPress()}
      placeholder={i18next.t('GroupEditDescription:placeholder')}
      value={this.state.value}
      onChange={(event) => this.setState({value: event.nativeEvent.text})}
      type='input-button'
      multi={true}
      help={i18next.t('GroupEditDescription:help')}
      />
    );
  }

  onPress () {
    this.props.data.onSave(this.key, this.state.value);
    this.props.navigator.pop();
  }
}

module.exports = GroupEditDescription;