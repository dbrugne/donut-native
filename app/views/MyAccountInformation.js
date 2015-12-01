var React = require('react-native');
var _ = require('underscore');
var client = require('../libs/client');
var Platform = require('Platform');
var common = require('@dbrugne/donut-common/mobile');
var s = require('../styles/style');
var LoadingView = require('../components/Loading');
var currentUser = require('../models/mobile-current-user');
var ListGroupItem = require('../components/ListGroupItem');
var navigation = require('../libs/navigation');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Image,
  ToastAndroid
  } = React;

class MyAccountInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: currentUser.get('username'),
      realname: '',
      bio: '',
      location: '',
      website: '',
      errors: [],
      messages: [],
      load: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    client.userRead(currentUser.get('user_id'), {more: true, admin: true}, (response) => {
      this.setState({
        realname: response.realname,
        bio: response.bio,
        location: response.location,
        website: response.website,
        picture: common.cloudinary.prepare(response.avatar, 80),
        load: true
      });
    });
  }

  saveUserData(key, value, callback) {
    var updateData = {};
    updateData[key] = value;

    client.userUpdate(updateData, _.bind(function (response) {
      if (response.err) {
        this._appendError(response.err);
      } else {
        var state = {load: true};
        state[key] = value;
        this.setState(state);
        this._appendMessage('Success');
        callback();
      }
    }, this));
  }

  onUserEdit(key, value, placeholder, multi) {
    return this.props.navigator.push(navigation.getUserFieldEdit({
      key,
      value,
      placeholder,
      multi,
      onSave: this.saveUserData.bind(this)
    }));
  }

  render() {
    if (!this.state.load) {
      return (
        <LoadingView />
      );
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

    var realname = null;
    if (this.state.realname) {
      realname = (
        <Text style={styles.username}>{this.state.realname}</Text>
      );
    }

    return (
      <View style={styles.container}>

        <View style={styles.containerHorizontal}>
          <Image
            style={styles.image}
            source={{uri: this.state.picture}}
            />
          <View style={styles.containerVertical}>
            {realname}
            <Text style={[styles.username, realname && styles.usernameGray]}>@{this.state.username}</Text>
          </View>
        </View>

        <ListGroupItem onPress={() => this.onUserEdit('realname', this.state.realname, 'name and first name', false)}
                       text='Realname'
                       type='edit-button'
                       first={true}
                       value={this.state.realname}
          />

        <ListGroupItem onPress={() => this.onUserEdit('bio', this.state.bio, 'describe yourself', true)}
                       text='Biography'
                       type='edit-button'
                       value={this.state.bio}
          />

        <ListGroupItem
          onPress={() => this.onUserEdit ('location', this.state.location, 'City, country where you are', false)}
          text='Location'
          type='edit-button'
          value={this.state.location}
          />

        <ListGroupItem onPress={() => this.onUserEdit('website', this.state.website, 'URL of a website', false)}
                       text='Website'
                       type='edit-button'
                       value={this.state.website}
          />

        {messages}

        <Text style={s.filler}></Text>

      </View>
    )
  }

  _appendError(string) {
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
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#f0f0f0'
  },
  centered: {
    alignSelf: 'center',
    justifyContent: 'center'
  },
  containerHorizontal: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 10
  },
  containerVertical: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: 2
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 4,
    marginRight: 10
  },
  bio: {
    height: 120
  },
  username: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 18,
    fontWeight: '400'
  },
  usernameGray: {
    color: '#b6b6b6'
  },
  realname: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '400'
  },
  icon: {
    width: 14,
    height: 14,
    color: '#c7c7c7'
  },
  loading: {
    height: 120
  }
});

module.exports = MyAccountInformation;

