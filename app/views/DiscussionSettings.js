'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/current-user');
var Button = require('react-native-button');
var app = require('../libs/app');
var s = require('../styles/style');
var ListItem = require('../elements/ListItem');
var navigation = require('../libs/navigation');

var {
  Component,
  Text,
  View,
  ScrollView,
  StyleSheet
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'settings': '__identifier__ SETTINGS',
  'see': 'See the profile',
  'edit': 'Edit',
  'access': 'Access',
  'allowed': 'Allowed users',
  'leave': 'Leave this donut',
  'close': 'Close this private discussion'
}, true, true);

class RoomSettings extends Component {
  constructor (props) {
    super(props);
  }
  render () {
    // @todo link to room edit page
    // @todo link to room access page
    // @todo link to room allowed users page

    return (
      <ScrollView style={styles.main}>
        <View style={s.listGroup}>
          <ListItem
            onPress={() => {this.props.navigator.push(navigation.getProfile({type: 'room', id: this.props.model.get('id'), identifier: this.props.model.get('identifier')}));}}
            title={i18next.t('local:settings', {identifier: this.props.model.get('identifier')})}
            text={i18next.t('local:see')}
            icon='fontawesome|eye'
            type='button'
            first={true}
            action={true}
          />
          <ListItem
            onPress={() => console.log('@todo implement edit page')}
            text={i18next.t('local:edit')+' TODO'}
            icon='fontawesome|pencil'
            type='button'
            action={true}
            />
          <ListItem
            onPress={() => console.log('@todo implement edit page')}
            text={i18next.t('local:access')+' TODO'}
            icon='fontawesome|key'
            type='button'
            action={true}
            />
          <ListItem
            onPress={() => console.log('@todo implement allowed users page')}
            text={i18next.t('local:allowed')+' TODO'}
            icon='fontawesome|shield'
            type='button'
            action={true}
            />

          <Text style={s.listGroupItemSpacing}></Text>
          <ListItem
            onPress={() => this.props.model.leave()}
            text={this.props.model.get('type') === 'room' ? i18next.t('local:leave') : i18next.t('local:close')}
            type='button'
            first={true}
            warning={true}
            />
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0',
    paddingTop: 20
  }
});

module.exports = RoomSettings;
