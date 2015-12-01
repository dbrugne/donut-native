var React = require('react-native');
var _ = require('underscore');
var client = require('../libs/client');
var Button = require('react-native-button');
var Platform = require('Platform');
var currentUser = require('../models/mobile-current-user');
var common = require('@dbrugne/donut-common/mobile');
var navigation = require('../libs/navigation');
var LoadingView = require('../components/Loading');
var cloudinary = require('../libs/cloudinary');

var {
  NativeModules,
  Component,
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  ToastAndroid
  } = React;
var {
  Icon
  } = require('react-native-icons');

/*
 * https://github.com/marcshilling/react-native-image-picker
 */

let { UIImagePickerManager: ImagePickerManager } = NativeModules;

class EditProfileView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      picture: '',
      color: '',
      errors: [],
      username: currentUser.get('username'),
      realName: '',
      load: false
    };
  }

  componentDidMount () {
    currentUser.on('change', this.onChange.bind(this));
    client.userRead(currentUser.get('user_id'), {more: true}, (response) => {
      this.setState({
        realName: response.realname,
        picture: common.cloudinary.prepare(response.avatar, 180),
        color: response.color,
        load: true
      });
    });
  }
  componentWillUnmount () {
    currentUser.off('change');
  }

  onChange (model, options) {
    this.setState({
      color: model.get('color'),
      picture: common.cloudinary.prepare(model.get('avatar'), 180)
    });
  }

  render () {
    if (!this.state.load) {
      return (
        <LoadingView />
      );
    }

    return (
      <ScrollView style={styles.container}>
        {this.state.errors.map((m) => <Text>{m}</Text>)}
        <View style={{flex: 1,flexDirection: 'row',alignItems: 'center', backgroundColor: '#EEE', height: 200}}>
          <Image
            style={styles.image}
            source={{uri: this.state.picture}}
            />
          <View style={{flex: 1}}>
            <Text style={styles.realname}>{this.state.realName}</Text>
            <Text style={{textAlign: 'center'}}>@{this.state.username}</Text>
          </View>
        </View>
        {this._renderMenu(this.state.color)}
      </ScrollView>
    )
  }

  _pickFromCamera () {
    if (Platform.OS === 'android') {
      ImagePickerManager.launchCamera({}, (cancelled, response) => {
        if (!cancelled) {
          this._updateAvatar(response.path);
        }
      });
    }
  }

  _pickFromGallery () {
    if (Platform.OS === 'android') {
      ImagePickerManager.launchImageLibrary({}, (cancelled, response) => {
        if (!cancelled) {
          this._updateAvatar(response.path);
        }
      });
    }
  }

  _updateAvatar (imagePath) {
    this._appendError('uploading ...');
    cloudinary.upload(imagePath, _.bind(function (err, data) {
      if (data.error) {
        return this._appendError(data.error.message);
      }

      var pathSplit = data.url.split('/');
      var updateData = {
        avatar: {
          public_id: data.public_id,
          version: data.version,
          path: pathSplit[pathSplit.length - 2] + '/' + pathSplit[pathSplit.length - 1]
        }
      };
      client.userUpdate(updateData, _.bind(function (response) {
        if (response.err) {
          this._appendError(response.err);
        } else {
          this._appendError('Success');
        }
      }, this));
    }, this));
  }

  _renderMenu (color) {
    return (
      <View style={{marginTop: 20}}>
        <View style={styles.rowAspect}>
          <Button onPress={() => this.props.navigator.push(navigation.getColorPicker())}>
            <View style={styles.formRow}>
              <View>
                <Text style={{fontWeight: 'bold', color: '#222', fontSize: 20}}>Color</Text>
                <Text style={{}}>select color that appears on your profile</Text>
              </View>
              <View
                style={[styles.color, {backgroundColor: color}]}
                />
            </View>
          </Button>
        </View>
        <View style={styles.rowAspect}>
          <Button onPress={this._pickFromGallery.bind(this)}>
            <View style={styles.formRow}>
            <View>
              <Text style={{fontWeight: 'bold', color: '#222', fontSize: 20}}>Gallery</Text>
              <Text style={{}}>get a picture from gallery</Text>
            </View>
            <Icon
              name='fontawesome|archive'
              size={40}
              color='#888'
              style={styles.icon}
            />
            </View>
          </Button>
        </View>
        <View style={styles.rowAspect}>
          <Button onPress={this._pickFromCamera.bind(this)}>
            <View style={styles.formRow}>
              <View>
                <Text style={{fontWeight: 'bold', color: '#222', fontSize: 20}}>Photo</Text>
                <Text style={{}}>get a picture from camera</Text>
              </View>
              <Icon
                name='fontawesome|camera'
                size={40}
                color='#888'
                style={styles.icon}
                />
            </View>
          </Button>
        </View>
      </View>
    );
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
    flex: 1
  },
  image: {
    height: 140,
    width: 140,
    borderRadius: 4,
    marginTop: 15,
    marginLeft: 15
  },
  icon: {
    width: 60,
    height: 60,
    position: 'absolute',
    right: 0
  },
  row: {
    flexDirection: 'row'
  },
  realname: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: "#222"
  },
  formRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 60,
    marginLeft: 10,
    marginRight: 10
  },
  color: {
    height: 40,
    width: 40,
    borderRadius: 4,
    position: 'absolute',
    right: 10,
    top: 10
  },
  rowAspect: {
    marginBottom: 20
  }
});

module.exports = EditProfileView;
