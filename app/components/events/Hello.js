'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableHighlight,
  Image,
  StyleSheet
} = React;

var ParsedText = require('../ParsedText');
var UserBlock = require('./UserBlock');
var s = require('../../styles/events');
var app = require('../../libs/app');
var Icon = require('react-native-vector-icons/EvilIcons');
var navigation = require('../../navigation/index');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'eventsHello', {
  'welcome': 'Welcome',
  'success': 'Success',
  'chat': 'Chat with __username__',
  'chat-message': 'This conversation is private. Only you and your interlocutor can see it.',
  'public': 'This public conversation and its history are accessible to anyone.',
  'private': 'This private conversation and its history are only accessible to users authorized by @__owner__.',
  'owner': 'Now set-up your discussion details so that users can join it.',
  'engage': 'Say \'hi\' to engage in the discussion.'
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    type: React.PropTypes.string,
    renderActionSheet: React.PropTypes.func,
    data: React.PropTypes.object.isRequired,
    model: React.PropTypes.object.isRequired
  },
  render () {
    return (
      <View style={[s.event, {flexDirection: 'column', alignItems:'center', justifyContent: 'center'}]}>
        {this._renderTitle()}
        {this._renderMessage()}
      </View>
    );
  },
  _renderTitle() {
    if (this.props.type === 'onetoone') {
      return (
        <Text style={styles.welcome}>{i18next.t('eventsHello:chat', {username: this.props.data.username})}</Text>
      );
    }

    // public room or not owner of private room
    if (this.props.data.room_mode === 'public' || this.props.model.get('owner_id') !== app.user.get('user_id')) {
      return (
        <Text style={styles.welcome}>{i18next.t('eventsHello:welcome')}</Text>
      );
    }

    // owner of private room
    return (
      <Text style={styles.welcome}>{i18next.t('eventsHello:success')}</Text>
    );
  },
  _renderMessage() {
    if (this.props.type === 'onetoone') {
      return (
        <View>
          <Text style={styles.text}>{i18next.t('eventsHello:chat-message')}</Text>
        </View>
      );
    }

    if (this.props.data.room_mode === 'public') {
      return (
        <View>
          <Text style={styles.text}>{i18next.t('eventsHello:public')}</Text>
          <Text style={styles.text}>{i18next.t('eventsHello:engage')}</Text>
        </View>
      );
    }

    if (this.props.model.get('owner_id') === app.user.get('user_id')) {
      return (
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <TouchableHighlight onPress={() => navigation.navigate('DiscussionSettings', this.props.model)}
                              style={[s.button, styles.buttonFacebook]}
                              underlayColor='transparent'
            >
            <Icon
              name={'gear'}
              size={25}
              color='#AFBAC8'
              style={{ backgroundColor: 'transparent'}}
              />
            </TouchableHighlight>
          <Text style={styles.text}>{i18next.t('eventsHello:owner')}</Text>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.text}>{i18next.t('eventsHello:private', {owner: this.props.model.get('owner_username')})}</Text>
        <Text style={styles.text}>{i18next.t('eventsHello:engage')}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  welcome: {
    color: '#fc2063',
    fontSize: 20,
    lineHeight: 31,
    marginBottom: 5
  },
  text: {
    color: '#afbac8',
    fontSize: 16,
    lineHeight: 23,
    fontStyle: 'italic',
    textAlign: 'center',
    alignSelf: 'center'
  }
});
