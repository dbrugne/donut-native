'use strict';

var React = require('react-native');
var s = require('../styles/style');
var app = require('../libs/app');
var Alert = require('../libs/alert');
var ListItem = require('../components/ListItem');
var LoadingModal = require('../components/LoadingModal');
var Disclaimer = require('../components/Disclaimer');
var DiscussionHeader = require('./DiscussionHeader');

var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  ScrollView
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'discussionBlockedJoin', {
  'request': 'Request',
  'request-placeholder': 'Your motivations ...',
  'request-disclaimer': 'Your contact details and your following message (optional) will be sent to the moderators of this discussion.',
  'password': 'Password',
  'password-disclaimer': 'Enter the discussion password',
  'password-placeholder': 'password',
  'join': 'join',
  'request-send': 'Request send',
  'infos': 'Members can participate to the conversation and receive notifications from it.',
  'invite-only': 'This discussion is only accessible from a moderator invitation.',
  'allowed-pending': 'You already have a membership request pending.',
  'wrong-password': 'Incorrect password',
  'spam-password': 'You need to wait before trying again'
});

var DiscussionBlockedJoin = React.createClass({
  propTypes: {
    infos: React.PropTypes.object,
    data: React.PropTypes.object,
    navigator: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      type: 'request', // type request focused by default
      request: null,
      password: null,
      showLoading: false
    };
  },

  render: function () {
    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          <DiscussionHeader data={this.props.data} />

          <Text style={{marginVertical: 10, marginHorizontal: 10}}>{i18next.t('discussionBlockedJoin:infos')}</Text>
          <Disclaimer owner_id={this.props.infos.owner_id}
                      owner_username={this.props.infos.owner_username}
                      text={this.props.infos.disclaimer}
                      navigator={this.props.navigator}
          />

          <Text style={s.listGroupItemSpacing}/>
          {this._renderActions()}
          {
            (this.state.showLoading)
              ? <LoadingModal/>
              : null
          }
        </View>
      </ScrollView>
    );
  },

  _renderActions: function () {
    if (!this.props.infos.allow_user_request && !this.props.infos.hasPassword) {
      return (
        <View style={{marginVertical: 10, marginHorizontal: 10, flex: 1, alignSelf: 'stretch'}}>
          <Text>{i18next.t('discussionBlockedJoin:invite-only')}</Text>
        </View>
      );
    }

    if (!this.props.infos.allow_user_request && this.props.infos.hasPassword) {
      return this._renderPassword();
    } else if (this.props.infos.allow_user_request && !this.props.infos.hasPassword) {
      return this._renderAllowUserRequest();
    }

    var focused = (this.state.type === 'request')
      ? this._renderAllowUserRequest()
      : this._renderPassword();

    return (
      <View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight onPress={() => this.setState({type: 'request'})}
                              underlayColor= '#DDD'
                              style={[styles.button, this.state.type === 'request' && styles.buttonActive]}>
            <Text style={styles.textButton}>{i18next.t('discussionBlockedJoin:request')}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.setState({type: 'password'})}
                              underlayColor= '#DDD'
                              style={[styles.button, this.state.type === 'password' && styles.buttonActive]}>
            <Text style={styles.textButton}>{i18next.t('discussionBlockedJoin:password')}</Text>
          </TouchableHighlight>
        </View>
        {focused}
      </View>
    );
  },
  _renderAllowUserRequest: function () {
    if (this.props.infos.isAllowedPending) {
      return (
        <View>
            <Text>{i18next.t('discussionBlockedJoin:allowed-pending')}</Text>
        </View>
      );
    }

    return (
      <View>
        <View>
          <View style={{marginVertical: 10, marginHorizontal: 10}}>
            <Text>{i18next.t('discussionBlockedJoin:request-disclaimer')}</Text>
          </View>
          <ListItem
            ref='input'
            onPress= {() => this.onUserRequest()}
            placeholder={i18next.t('discussionBlockedJoin:request-placeholder')}
            value={this.state.request}
            onChange={(event) => this.setState({request: event.nativeEvent.text})}
            type='input-button'
            maxLength={200}
            multiline
            first
            />
        </View>
      </View>
    );
  },

  onUserRequest: function () {
    this.setState({showLoading: true});
    app.client.roomJoinRequest(this.props.infos.room_id, this.state.request, (response) => {
      this.setState({showLoading: false});
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show(i18next.t('discussionBlockedJoin:request-send'));
        this.props.navigator.pop();
      }
    });
  },

  _renderPassword: function () {
    if (!this.props.infos.hasPassword) {
      return null;
    }

    return (
      <View>
        <View style={{marginTop: 10}}>
          <View style={{marginBottom: 10, marginHorizontal: 10}}>
            <Text>{i18next.t('discussionBlockedJoin:password-disclaimer')}</Text>
          </View>
          <ListItem
            ref='input'
            onPress= {() => this.onValidatePassword()}
            placeholder={i18next.t('discussionBlockedJoin:password-placeholder')}
            onChange={(event) => this.setState({password: event.nativeEvent.text})}
            type='input-button'
            autoCapitalize='none'
            first
            secureTextEntry
            />
        </View>
      </View>
    );
  },

  onValidatePassword: function () {
    this.setState({showLoading: true});
    app.client.roomJoin(this.props.infos.room_id, this.state.password, (response) => {
      this.setState({showLoading: false});
      if (response.err) {
        Alert.show(i18next.t('discussionBlockedJoin:' + response.err));
      } else {
        app.trigger('joinRoom', this.props.infos.room_id);
        this.props.navigator.pop();
      }
    });
  }
});
var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  },
  container: {
    flex: 1
  },
  buttonContainer: {
    borderTopWidth: 3,
    borderStyle: 'solid',
    borderColor: '#DDD',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  textButton: {
    padding: 10,
    textAlign: 'center',
    color: '#333'
  },
  button: {
    height: 40,
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#3498db'
  },
  buttonActive: {
    borderBottomWidth: 3,
    borderStyle: 'solid',
    borderColor: '#3498db'
  }
});

module.exports = DiscussionBlockedJoin;
