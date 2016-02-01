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
      userConfirmed: currentUser.get('confirmed') || (this.props.model.get('type') === 'room' && this.props.model.get('mode') === 'public')
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
      <View style={styles.inputContainer}>
        <Button style={styles.button} onPress={() => this._addImage()} disabled={!this.state.userConfirmed}>
          <Icon
            name='camera'
            size={28}
            color='#999998'
            style={styles.icon}
          />
        </Button>
        <TextInput style={styles.input}
                   ref='input'
                   onChangeText={(text) => this.setState({text})}
                   placeholder={inputPlaceholder}
                   blurOnSubmit={false}
                   value={this.state.text}
                   multiline
                   editable={this.state.userConfirmed}
          />
        <Button style={styles.button} onPress={() => this.onSubmit()} disabled={!this.state.userConfirmed}>
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

    var message = emojione.toShort(this.state.text);
    this.model.sendMessage(message, null, (response) => {
      if (response === 'not-connected') {
        return alert.show(i18next.t('messages.not-connected'));
      } else if (response.err) {
        return alert.show(i18next.t('messages.' + response.err));
      }
      this.setState({
        text: ''
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
    height: 40,
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
