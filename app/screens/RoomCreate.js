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

class RoomCreateView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      roomName: '',
      public: true,
      private: false,
      errors: []
    }
  }

  render () {
    var SwitchComponent;
    if (Platform.OS === 'android') {
      SwitchComponent = SwitchAndroid;
    } else {
      SwitchComponent = SwitchIOS;
    }

    return (
      <View style={styles.container}>
        <TextInput style={styles.inputRoomName}
           placeholder='name of donut'
           onChangeText={(text) => this.setState({roomName: text})}
           value={this.state.roomName}
          />
        <Text style={styles.helpRoomName}>
          Between 2 and 15 characters, only letters, numbers, dashes (-) and underscores (_)
        </Text>
        <Text style={styles.infoRoomName}>
          You are about to create a donut in the global space, if you want to create a donut in a community you are a member of, go to the community page and click on "Create a donut"
        </Text>
        <Text style={styles.title}>
          Who can join the donut
        </Text>
        <View style={styles.modes}>
          <View style={styles.modeOption}>
            <SwitchComponent
              onValueChange={this.onChangeMode.bind(this)}
              value={this.state.public}
              disabled={this.state.public}
              />
            <Text>Public (default)</Text>
          </View>
          <Text style={styles.modeInfo}>Any user can join, participate and access history. Moderation tools available.</Text>
        </View>
        <View style={styles.modes}>
          <View style={styles.modeOption}>
            <SwitchComponent
              onValueChange={this.onChangeMode.bind(this)}
              value={this.state.private}
              disabled={this.state.private}
              />
            <Text>Private</Text>
          </View>
          <Text style={styles.modeInfo}>Only users you authorize can join, participate and access history. Moderation tools available.</Text>
        </View>
        <TouchableHighlight style={styles.button} onPress={(this.onRoomCreate.bind(this))} >
          <Text style={styles.buttonText}>CREATE</Text>
        </TouchableHighlight>
        {this.state.errors.map((m) => <Text>{m}</Text>)}
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
        this._appendError("success");
      }
    }, this));
  }

  _appendError (string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({errors: this.state.messages.concat(string)});
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputRoomName: {
    height: 40,
    borderWidth: 1,
    margin: 10
  },
  helpRoomName: {
    fontStyle: 'italic',
    color: '#737373',
    margin: 10
  },
  infoRoomName: {
    color: '#000',
    margin: 10
  },
  title: {
    color: '#6f6f6f',
    fontWeight: 'bold',
    margin: 10
  },
  modes: {
    flexDirection: 'column',
    marginBottom: 20
  },
  modeOption: {
    flexDirection: 'row'
  },
  modeInfo: {
    marginLeft: 40
  },
  button: {
    height: 25,
    width: 100,
    backgroundColor: "#16a085",
    borderRadius: 3,
    justifyContent: "center",
    alignSelf: "center"
  },
  buttonText: {
    fontSize: 14,
    color: "#ffffff",
    alignSelf: "center"
  },

});

module.exports = RoomCreateView;