var React = require('react-native');
var _ = require('underscore');
var client = require('../libs/client');
var app = require('../libs/app');
var Platform = require('Platform');
var common = require('@dbrugne/donut-common/mobile');
var s = require('../styles/style');
var LoadingView = require('../components/Loading');
var Alert = require('../libs/alert');
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
      website: {
        value: ''
      },
      load: false
    };

    app.on('user:save', (data) => {
      var state = {load: true};
      state[data.key] = data.value;
      this.setState(state);
    });
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
        website: (response.website && response.website.title ? response.website.title : {value: ''}),
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
        Alert.show(response.err);
      } else {
        var state = {load: true};
        state[key] = value;
        this.setState(state);

        callback();
      }
    }, this));
  }

  onUserEdit(component, value) {
    return this.props.navigator.push(navigation.getUserFieldEdit({
      component,
      value,
      onSave: this.saveUserData.bind(this)
    }));
  }

  render() {
    if (!this.state.load) {
      return (
        <LoadingView />
      );
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

        <ListGroupItem text='Realname'
                       type='edit-button'
                       first={true}
                       value={this.state.realname}
                       onPress={() => this.onUserEdit(require('../components/UserField/Realname'), this.state.realname)}
          />

        <ListGroupItem text='Biography'
                       type='edit-button'
                       value={this.state.bio}
                       onPress={() => this.onUserEdit(require('../components/UserField/Bio'), this.state.bio)}
          />

        <ListGroupItem text='Location'
                       type='edit-button'
                       value={this.state.location}
                       onPress={() => this.onUserEdit (require('../components/UserField/Location'), this.state.location)}
          />

        <ListGroupItem text='Website'
                       type='edit-button'
                       value={this.state.website}
                       onPress={() => this.onUserEdit(require('../components/UserField/Website'), this.state.website)}
          />

        <Text style={s.filler}></Text>

      </View>
    );
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

