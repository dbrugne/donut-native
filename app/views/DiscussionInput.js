'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Image,
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
    showConfirmationModal: React.PropTypes.func,
    addImage: React.PropTypes.func
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
          ? 'in ' + this.model.get('identifier')
          : 'to @' + this.model.get('username'));
    } else {
      inputPlaceholder = i18next.t('messages.not-confirmed');
    }
    return (
      <View style={[styles.inputContainer, this.state.inSendingIntent && {backgroundColor: '#EEE'}]}>
        <Button style={styles.button} onPress={() => this._addImage()} disabled={!this.state.userConfirmed || this.state.inSendingIntent}>
          <Image source={require('../assets/camera.png')} style={{width: 25, height: 18, marginLeft: 10, marginRight: 10}} />
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
          <Image source={require('../assets/send.png')} style={{width: 19.5, height: 24, marginLeft: 10, marginRight: 10}} />
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
    imageUpload.pickImage((response, type) => {
      if (response.didCancel) {
        return;
      }
      // set image source for the upload / confirmation
      this.props.setImageSource(response.data);

      if (type === 'library') {
        // show confirmation modal with the image
        this.props.showConfirmationModal();
      } else {
        // add image directly to the conversation
        this.props.addImage();
      }
    });
  }
});

var styles = StyleSheet.create({
  inputContainer: {
    left: 0,
    right: 0,
    borderColor: '#D0D9E6',
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 8,
    fontSize: 14
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
