'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  SwitchAndroid,
  SwitchIOS,
  View,
  Component,
  ToastAndroid
} = React;

var client = require('../libs/client');
var Platform = require('Platform');
var _ = require('underscore');
var s = require('../styles/style');

class RoomCreateView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      roomName: '',
      public: true,
      private: false,
      errors: [],
      messages: []
    }
  }

  render () {
    var SwitchComponent;
    if (Platform.OS === 'android') {
      SwitchComponent = SwitchAndroid;
    } else {
      SwitchComponent = SwitchIOS;
    }

    var messages = null;
    if ((this.state.errors && this.state.errors.length > 0) || (this.state.messages && this.state.messages.length > 0)) {
      if (this.state.errors && this.state.errors.length > 0) {
        messages = (
          <View style={s.alertError}>
            {this.state.errors.map((m) => <Text style={s.alertErrorText}>{m}</Text>)}
            {this.state.messages.map((m) => <Text style={s.alertErrorText}>{m}</Text>)}
          </View>
        );
      } else {
        messages = (
          <View style={s.alertSuccess}>
            {this.state.errors.map((m) => <Text style={s.alertSuccessText}>{m}</Text>)}
            {this.state.messages.map((m) => <Text style={s.alertSuccessText}>{m}</Text>)}
          </View>
        );
      }
    }

    return (
      <View style={styles.container}>

        {messages}

        <View style={s.inputContainer}>
          <TextInput style={s.input}
             autoFocus={true}
             placeholder='name of donut'
             onChangeText={(text) => this.setState({roomName: text})}
             value={this.state.roomName}
            />
        </View>

        <View style={{marginHorizontal: 10}}>

          <Text style={styles.help}>
            Between 2 and 15 characters, only letters, numbers, dashes (-) and underscores (_)
          </Text>

          <Text style={styles.infoRoomName}>
            You are about to create a donut in the global space, if you want to create a donut in a community you are a member of, go to the community page and click on "Create a donut"
          </Text>

          <Text style={[s.h1, s.marginTop10]}>
            Who can join the donut
          </Text>

          <View style={[styles.modes, s.marginTop10]}>
            <View style={styles.modeOption}>
              <SwitchComponent
                onValueChange={this.onChangeMode.bind(this)}
                value={this.state.public}
                disabled={this.state.public}
                />
              <Text style={{marginLeft:10}}>Public (default)</Text>
            </View>
            <Text style={styles.help}>Any user can join, participate and access history. Moderation tools available.</Text>
          </View>
          <View style={styles.modes}>
            <View style={styles.modeOption}>
              <SwitchComponent
                onValueChange={this.onChangeMode.bind(this)}
                value={this.state.private}
                disabled={this.state.private}
                />
              <Text style={{marginLeft:10}}>Private</Text>
            </View>
            <Text style={styles.help}>Only users you authorize can join, participate and access history. Moderation tools available.</Text>
          </View>
        </View>

        <TouchableHighlight style={[s.button, s.buttonGreen, s.marginTop10]}
                            underlayColor='#50EEC1'
                            onPress={(this.onRoomCreate.bind(this))} >
          <View style={s.buttonLabel}>
            <Text style={s.buttonTextLight}>Créer</Text>
          </View>
        </TouchableHighlight>

      </View>
    );
  }

  onChangeMode () {
    this.setState({
      public: !this.state.public,
      private: !this.state.private
    });
  }

  onRoomCreate () {
    if (!this.state.roomName) {
      return this._appendError('not-complete');
    }

    var mode = (this.state.public) ? 'public' : 'private';
    client.roomCreate(this.state.roomName, mode, null, null, _.bind(function (response) {
      if (response.err) {
        this._appendError(response.err);
      } else {
        this._appendMessage("success");
      }
    }, this));
  }

  _appendError (string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({errors: this.state.errors.concat(string)});
    }
  }

  _appendMessage(string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({messages: this.state.messages.concat(string)});
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  inputRoomName: {
    height: 40,
    borderWidth: 1,
    margin: 10
  },
  help: {
    fontStyle: 'italic',
    color: '#737373',
    marginVertical: 10
  },
  infoRoomName: {
    color: '#000'
  },
  title: {
    color: '#6f6f6f',
    fontWeight: 'bold',
    margin: 10
  },
  modes: {
    flexDirection: 'column',
    marginBottom: 10
  },
  modeOption: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center'
  },
  button: {
    height: 25,
    width: 100,
    backgroundColor: "#16a085",
    borderRadius: 3,
    justifyContent: "center",
    alignSelf: "center"
  }
});

module.exports = RoomCreateView;