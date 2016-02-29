'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  Image,
  LayoutAnimation
  } = React;

var _ = require('underscore');
var s = require('../styles/button');
var app = require('../libs/app');
var Alert = require('../libs/alert');
var EventMessage = require('./../components/events/Message');
var UserBlock = require('./../components/events/UserBlock');
var ListItem = require('./../components/ListItem');
var common = require('@dbrugne/donut-common/mobile');
var animation = require('../libs/animations').keyboard;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'report', {
  'spam': 'Spam',
  'shocking': 'Shocking',
  'illegal': 'Illegal',
  'harassment': 'Harassment',
  'other': 'Other',
  'placeholder': 'Comment',
  'send': 'Send',
  'cancel': 'Cancel'
});

var options = [
  'spam',
  'shocking',
  'illegal',
  'harassment',
  'other'
];

var ReportView = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    data: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
    return {
      keyboardSpace: 0,
      focused: null,
      comment: ''
    };
  },
  componentDidMount () {
    app.on('keyboardWillShow', this.onKeyboardWillShow, this);
    app.on('keyboardWillHide', this.onKeyboardWillHide, this);
  },
  componentWillUnmount () {
    app.off(null, null, this);
  },
  render: function () {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <ScrollView>

          {this._renderWhatIsReported()}

          {_.map(options, (opt, index) => {
            return this._renderOption(opt, index);
          })}


          <Text style={s.listGroupItemSpacing}/>
          <ListItem
            ref='input'
            placeholder={i18next.t('report:placeholder')}
            value={this.state.comment}
            maxLength={255}
            onChangeText={(comment) => this.setState({comment: comment})}
            type='input'
            multiline
            first
            last
            multi={true}
            />

          <Text style={s.listGroupItemSpacing}/>
          <ListItem
            onPress={() => this._onSend()}
            text={i18next.t('report:send')}
            action
            type='button'
            first
            warning
            />
          <ListItem
            onPress={() => this._onCancel()}
            text={i18next.t('report:cancel')}
            action
            type='button'
            last
            />

        </ScrollView>
        <View style={{height: this.state.keyboardSpace}}/>
      </View>
    );
  },
  _renderWhatIsReported: function () {
    if (this.props.data.type === 'user') {
      return (
        <View>
          <View style={[{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF'}, {position: 'relative'}]}>
            {this._renderAvatar(this.props.data.user.avatar || this.props.data.user.avatarRaw)}
            <Text style={[styles.statusText, styles.status, this.props.data.user.status === 'connecting' && styles.statusConnecting, this.props.data.user.status === 'offline' && styles.statusOffline, this.props.data.user.status === 'online' && styles.statusOnline]}>{this.props.data.user.status}</Text>
            <Text style={[styles.username, this.props.data.user.realname && styles.usernameGray]}>@{this.props.data.user.username}</Text>
            <Text style={styles.bio}>{_.unescape(this.props.data.user.bio)}</Text>
          </View>
        </View>
      );
    }
    return (
      <View style={{marginTop: 10}}>
        <UserBlock
          navigator={this.props.navigator}
          data={this.props.data.event.userBlock}
          onPress={() => {}}
          >
          <EventMessage
            navigator={this.props.navigator}
            type={this.props.data.event.type}
            data={_.extend(this.props.data.event, {first: true})}
            renderActionSheet={() => {}}
            />
        </UserBlock>
      </View>
    );
  },
  _renderAvatar: function (avatar) {
    if (!avatar) {
      return null;
    }
    var avatarUrl = common.cloudinary.prepare(avatar, 150);
    if (!avatarUrl) {
      return null;
    }

    return (
      <Image style={styles.avatar} source={{uri: avatarUrl}}/>
    );
  },
  _renderOption: function (option, index) {
    return (
      <ListItem
        type='radio'
        key={option}
        first={index === 0}
        last={index === options.length}
        onPress={() => this.setState({focused: option})}
        active={this.state.focused === option}
        text={i18next.t('report:' + option)}
        />
    );
  },
  _onCancel: function () {
    this.props.navigator.pop();
  },
  _onSend: function () {
    if (!this.state.focused) {
      return Alert.show('You need to select a category');
    }
    if (this.props.data.type === 'user') {
      app.client.signalUser(this.props.data.user.user_id, this.props.data.room_id, this.state.focused, this.state.comment);
    } else {
      app.client.signalEvent(this.props.data.event.id, this.state.focused, this.state.comment);
    }
    Alert.show('The report was sent to the DONUT team');
    this.props.navigator.pop();
  },
  onKeyboardWillShow (height) {
    LayoutAnimation.configureNext(animation);
    this.setState({ keyboardSpace: height });
  },
  onKeyboardWillHide () {
    LayoutAnimation.configureNext(animation);
    this.setState({ keyboardSpace: 0 });
  }
});

var styles = StyleSheet.create({
  line: {
    flex: 1,
    borderColor: '#FFF',
    borderBottomWidth: 1,
    backgroundColor: '#EEE'
  },
  container: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: '#999',
    borderWidth: 1
  },
  text: {
    marginLeft: 15,
    flex: 1
  },
  first: {
    borderTopWidth: 1
  },
  textArea: {
    height: 80,
    backgroundColor: '#EEE',
    marginVertical: 10
  },
  button: {
    width: 80,
    borderRadius: 5,
    alignItems: 'center'
  },
  disclaimer: {
    fontSize: 15,
    alignSelf: 'center'
  },
  avatar: {
    width: 120,
    height: 120,
    marginTop: 20
  },
  status: {
    marginBottom: 8,
    alignSelf: 'center',
    textAlign: 'center',
    flex: 1,
    fontWeight: '400',
    fontSize: 12,
    fontFamily: 'Open Sans',
    width: 120,
    paddingLeft: 5,
    paddingRight: 5,
    overflow: 'hidden'
  },
  statusOnline: { backgroundColor: 'rgba(79, 237, 192, 0.8)' },
  statusConnecting: { backgroundColor: 'rgba(255, 218, 62, 0.8)' },
  statusOffline: { backgroundColor: 'rgba(119,119,119,0.8)' },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Open Sans'
  },
  bio: {
    marginVertical: 5,
    marginHorizontal: 5,
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 14
  }
});

module.exports = ReportView;
