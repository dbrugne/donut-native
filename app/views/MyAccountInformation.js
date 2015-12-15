var React = require('react-native');
var _ = require('underscore');
var client = require('../libs/client');
var app = require('../libs/app');
var Platform = require('Platform');
var common = require('@dbrugne/donut-common/mobile');
var s = require('../styles/style');
var LoadingView = require('../elements/Loading');
var Alert = require('../libs/alert');
var currentUser = require('../models/mobile-current-user');
var ListItem = require('../elements/ListItem');
var navigation = require('../libs/navigation');
var imageUpload = require('../libs/imageUpload');

var {
  NativeModules,
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  Image
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'avatar': 'Avatar',
  'color': 'Color',
  'realname': 'Realname',
  'biography': 'Biography',
  'location': 'Location',
  'website': 'Website'
});

class MyAccountInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: currentUser.get('username'),
      realname: '',
      bio: '',
      color: '',
      avatar: '',
      location: '',
      website: {
        value: ''
      },
      load: false
    };
  }

  componentWillUnmount() {
    currentUser.off('change:avatar');
    currentUser.off('change:color');
  }

  componentDidMount() {
    this.fetchData();
    currentUser.on('change:avatar', (model) => {
      this.setState({
        avatar: common.cloudinary.prepare(model.get('avatar'), 120)
      });
    });
    currentUser.on('change:color', (model) => {
      this.setState({
        color: model.get('color')
      });
    });
  }

  fetchData() {
    client.userRead(currentUser.get('user_id'), {more: true, admin: true}, (response) => {
      this.setState({
        realname: response.realname,
        bio: response.bio,
        color: response.color,
        location: response.location,
        website: (response.website && response.website.title ? response.website.title : {value: ''}),
        avatar: common.cloudinary.prepare(response.avatar, 120),
        load: true
      });
    });
  }

  saveUserData(key, value, callback) {
    var updateData = {};
    updateData[key] = value;

    client.userUpdate(updateData, (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        var state = {load: true};
        if (key !== 'avatar') {
          state[key] = value;
        }
        this.setState(state);

        if (callback) {
          callback();
        }
      }
    });
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
            source={{uri: this.state.avatar}}
            />
          <View style={styles.containerVertical}>
            {realname}
            <Text style={[styles.username, realname && styles.usernameGray]}>@{this.state.username}</Text>
          </View>
        </View>

        <ListItem text={i18next.t('local:avatar')}
                  type='edit-button'
                  first={true}
                  action={true}
                  onPress={() => this._updateAvatar()}
          />
        <ListItem text={i18next.t('local:color')}
                  type='color-button'
                  action={true}
                  color={this.state.color}
                  onPress={() => this.props.navigator.push(navigation.getColorPicker())}
          />
        <ListItem text={i18next.t('local:realname')}
                  type='edit-button'
                  action={true}
                  value={this.state.realname}
                  onPress={() => this.onUserEdit(require('../components/UserField/Realname'), this.state.realname)}
          />

        <ListItem text={i18next.t('local:biography')}
                  type='edit-button'
                  action={true}
                  value={this.state.bio}
                  onPress={() => this.onUserEdit(require('../components/UserField/Bio'), this.state.bio)}
          />

        <ListItem text={i18next.t('local:location')}
                  type='edit-button'
                  action={true}
                  value={this.state.location}
                  onPress={() => this.onUserEdit (require('../components/UserField/Location'), this.state.location)}
          />

        <ListItem text={i18next.t('local:website')}
                  type='edit-button'
                  action={true}
                  value={this.state.website}
                  onPress={() => this.onUserEdit(require('../components/UserField/Website'), this.state.website)}
          />

        <Text style={s.filler}></Text>

      </View>
    );
  }

  _updateAvatar() {
    imageUpload.getImageAndUpload('user,avatar', (err, response) => {
      if (err) {
        return Alert.show(err);
      }

      if (response === null) {
        return;
      }

      this.saveUserData('avatar', response, () => {
      });
    });
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
    height: 100,
    width: 100,
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

