'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  TextInput
} = React;
var Icon = require('react-native-vector-icons/FontAwesome');

var Button = require('react-native-button');
var imageUpload = require('../libs/imageUpload');
var currentUser = require('../models/current-user');
var i18next = require('../libs/i18next');
var alert = require('../libs/alert');
var emojione = require('emojione');

var MAXINPUTHEIGHT = 200;
var MININPUTHEIGHT = 40;

var InputView = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    setImageSource: React.PropTypes.func,
    showConfirmationModal: React.PropTypes.func
  },
  getInitialState: function () {
    this.model = this.props.model;
    return {
      text: '',
      userConfirmed: currentUser.get('confirmed') || (this.props.model.get('type') === 'room' && this.props.model.get('mode') === 'public'),
      height: MININPUTHEIGHT,
      inSendingIntent: false
    };
  },
  render: function () {
    var inputPlaceholder;
    if (this.state.userConfirmed) {
      inputPlaceholder = 'Message ' + ((this.model.get('type') === 'room')
          ? 'dans ' + this.model.get('identifier')
          : 'à @' + this.model.get('username'));
    } else {
      inputPlaceholder = i18next.t('messages.not-confirmed');
    }
    return (
      <View style={[styles.inputContainer, this.state.inSendingIntent && {backgroundColor: '#EEE'}]}>
        <Button style={styles.button} onPress={() => this._addImage()} disabled={!this.state.userConfirmed || this.state.inSendingIntent}>
          <Icon
            name='camera'
            size={28}
            color='#999998'
            style={styles.icon}
          />
        </Button>
        <View style={{flex: 1}}>
        <TextInput style={[styles.input, {height: (this.state.height < MAXINPUTHEIGHT) ? this.state.height : MAXINPUTHEIGHT}]}
                   ref='input'
                   placeholder={inputPlaceholder}
                   blurOnSubmit={false}
                   value={this.state.text}
                   multiline
                   editable={this.state.userConfirmed}
                   underlineColorAndroid={this.state.inSendingIntent ? '#EEE' : '#FFF'}
                   onChange={(event) => {
                     var inputHeight = 40;
                     // @bug: not working on iOS until https://github.com/facebook/react-native/commit/f83d53dacf1dfda55368d92659654c77b393b278
                     if (event.nativeEvent && event.nativeEvent.contentSize && event.nativeEvent.contentSize.height) {
                       inputHeight = Math.max(40, event.nativeEvent.contentSize.height);
                     }
                     this.setState({
                       text: event.nativeEvent.text,
                       height: inputHeight
                     });
                   }}
                   maxLength={1024}
          />
        </View>
        <Button style={styles.button} onPress={() => this.onSubmit()} disabled={!this.state.userConfirmed || this.state.inSendingIntent}>
          <Icon
            name='paper-plane'
            size={28}
            color='#999998'
            style={styles.icon}
          />
        </Button>
      </View>
    );
  },
  onSubmit: function () {
    if (this.state.text === '') {
      return;
    }

    this.setState({inSendingIntent: true});
    var message = this.state.text.trim();
    message = emojione.toShort(message);
    this.model.sendMessage(message, null, (response) => {
      this.setState({inSendingIntent: false});
      if (response === 'not-connected') {
        return alert.show(i18next.t('messages.not-connected'));
      } else if (response.err) {
        return alert.show(i18next.t('messages.' + response.err));
      }
      this.setState({
        text: '',
        height: MININPUTHEIGHT
      });
      this.refs.input.focus(); // @bug: not working on Android (https://github.com/facebook/react-native/pull/2149)
    });
  },
  _addImage: function () {
    imageUpload.pickImage((response) => {
      if (response.didCancel) {
        return;
      }
      // set image source for the confirmation modal
      this.props.setImageSource(response.data);
      // show confirmation modal with the image
      this.props.showConfirmationModal();
    });
  }
});

var styles = StyleSheet.create({
  inputContainer: {
    left: 0,
    right: 0,
    borderColor: '#d9d9d9',
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    flexDirection: 'row'
  },
  input: {
    flex: 1,
    padding: 3,
    paddingHorizontal: 5,
    fontSize: 17
  },
  icon: {
    marginHorizontal: 5,
    marginTop: 5
  },
  button: {
    flex: 1,
    width: 40
  }
});

module.exports = InputView;
