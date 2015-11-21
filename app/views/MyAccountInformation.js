var React = require('react-native');
var _ = require('underscore');
var client = require('../libs/client');
var Platform = require('Platform');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ToastAndroid
} = React;

var currentUser = require('../models/current-user');

class EditProfileView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      username: currentUser.get('username'),
      realName: '',
      bio: '',
      location: '',
      website: '',
      errors: [],
      load: false
    };
  }

  componentDidMount () {
    client.userRead(currentUser.get('user_id'), _.bind(function (response) {
      this.setState({
        realName: response.realname,
        bio: response.bio,
        location: response.location,
        website: response.website,
        load: true
      });
    }, this));
  }

  render () {
    if (!this.state.load) {
      return this.renderLoadingView();
    }

    return (
      <View style={styles.container}>
        <View style={styles.center}>
          {this.state.errors.map((m) => <Text>{m}</Text>)}
          <Text>Username <Text style={styles.username}>@{this.state.username}</Text> <Text style={styles.blur}>(unchangeable)</Text></Text>
          <View style={styles.row}>
            <Text style={styles.label}>Real name</Text>
            <TextInput
              placeholder="name and first name"
              onChange={(event) => this.setState({realName: event.nativeEvent.text})}
              value={this.state.realName}
              style={styles.formInput}
              maxLength={20}/>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              placeholder="Describe yourself"
              onChange={(event) => this.setState({bio: event.nativeEvent.text})}
              value={this.state.bio}
              style={styles.formInput}
              maxLength={200}
              multiline={true}/>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Place</Text>
            <TextInput
              placeholder="City, country where you are"
              onChange={(event) => this.setState({location: event.nativeEvent.text})}
              value={this.state.location}
              style={styles.formInput}/>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              placeholder="URL of a website"
              onChange={(event) => this.setState({website: event.nativeEvent.text})}
              value={this.state.website}
              style={styles.formInput}/>
          </View>
          <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))} style={styles.button}>
            <Text style={styles.buttonText}>SAVE</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  //@todo mutualise loading view
  renderLoadingView () {
    return (
      <View style={styles.container}>
        <Text>
          Loading...
        </Text>
      </View>
    );
  }

  onSubmitPressed () {
    var updateData = {
      realname: this.state.realName,
      bio: this.state.bio,
      location: this.state.location,
      website: this.state.website
    };

    client.userUpdate(updateData, _.bind(function (response) {
      if (response.err) {
        this._appendError(response.err);
      } else {
        this._appendError('Success');
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
  blur: {
    color: "#BBB"
  },
  row: {
    marginTop: 20
  },
  label: {
    fontWeight: 'bold',
    color: "#777"
  },
  username: {
    fontWeight: 'bold',
    color: "#111"
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  formInput: {
    height: 42,
    width: 250,
    flex: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 8,
    color: "#555555"
  },
  button: {
    height: 46,
    width: 250,
    backgroundColor: "#fd5286",
    borderRadius: 3,
    marginTop: 30,
    justifyContent: "center",
    alignSelf: "center"
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
    alignSelf: "center"
  },
  center: {
    alignSelf: "center"
  }
});

module.exports = EditProfileView;

