var React = require('react-native');
var _ = require('underscore');
var client = require('../libs/client');
var Platform = require('Platform');
var s = require('../styles/style');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ToastAndroid
} = React;

var currentUser = require('../models/mobile-current-user');

class MyAccountInformation extends Component {
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
      <View style={styles.main}>
        <View style={styles.container}>

          {messages}

          <Text style={[styles.username, s.marginTop10]}>@{this.state.username}</Text>

          <Text style={[s.inputLabel, s.marginTop20]}>realname</Text>
          <TextInput
            placeholder="name and first name"
            onChange={(event) => this.setState({realName: event.nativeEvent.text})}
            value={this.state.realName}
            style={[s.input, s.marginTop5]}
            maxLength={20}/>

          <Text style={[s.inputLabel, s.marginTop20]}>bio</Text>
          <TextInput
            placeholder="Describe yourself"
            onChange={(event) => this.setState({bio: event.nativeEvent.text})}
            value={this.state.bio}
            style={[s.input, s.marginTop5, styles.bio]}
            maxLength={200}
            multiline={true}/>

          <Text style={[s.inputLabel, s.marginTop20]}>place</Text>
          <TextInput
            placeholder="City, country where you are"
            onChange={(event) => this.setState({location: event.nativeEvent.text})}
            value={this.state.location}
            style={[s.input, s.marginTop5]}/>

          <Text style={[s.inputLabel, s.marginTop20]}>website</Text>
          <TextInput
            placeholder="URL of a website"
            onChange={(event) => this.setState({website: event.nativeEvent.text})}
            value={this.state.website}
            style={[s.input, s.marginTop5]}/>


          <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))}
                              style={[s.button, s.buttonPink, s.marginTop10]}
                              underlayColor='#E4396D'
            >
            <View style={s.buttonLabel}>
              <Text style={s.buttonTextLight}>SAVE</Text>
            </View>
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
        this._appendMessage('Success');
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

  _appendMessage (string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({messages: this.state.messages.concat(string)});
    }
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  bio: {
    height:80
  },
  username: {
    fontWeight: '700',
    fontFamily: 'Open Sans',
    fontSize: 18,
    color: '#333333',
    marginTop: 10
  }
});

module.exports = MyAccountInformation;

