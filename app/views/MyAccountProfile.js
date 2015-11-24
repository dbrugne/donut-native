var React = require('react-native');
var _ = require('underscore');
var client = require('../libs/client');
var Button = require('react-native-button');
var colors = require('../libs/color').list;
var Platform = require('Platform');

var {
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

var currentUser = require('../models/mobile-current-user');
var common = require('@dbrugne/donut-common/mobile');

//@todo yfuks possibility to access camera/library to change poster/avatar

class EditProfileView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      picture: '',
      color: '',
      errors: [],
      showColorPicker: false,
      username: currentUser.get('username'),
      load: false
    };
  }

  componentDidMount () {
    client.userRead(currentUser.get('user_id'), _.bind(function (response) {
      this.setState({
        picture: common.cloudinary.prepare(response.avatar, 200),
        color: response.color,
        load: true
      });
    }, this));
  }

  render () {
    if (!this.state.load) {
      return this.renderLoadingView();
    }

    return (
      <ScrollView style={styles.container}>
        {this.state.errors.map((m) => <Text>{m}</Text>)}
        <View style={{alignItems: 'center'}}>
          <Button>
            <Image
              style={styles.image}
              source={{uri: this.state.picture}}
              />
            <Icon
              name='fontawesome|pencil'
              size={25}
              color='#888'
              style={styles.icon}
              />
          </Button>
          <View style={styles.row}>
            <Text style={styles.label}>@{this.state.username}</Text>
            <Icon
            name='fontawesome|circle'
            size={8}
            color='#57C259'
            style={styles.status}
            />
          </View>
          <View style={styles.separator}></View>
        </View>
        {this._renderColor(this.state.color)}
        {this._renderColorPicker(colors)}
      </ScrollView>
    )
  }

  _renderColor (color) {
    if (this.state.showColorPicker) {
      return;
    }

    return (
      <View style={{alignItems: 'center'}}>
        <Text style={styles.label}>Color</Text>
        <Button onPress={() => this.setState({showColorPicker: !this.state.showColorPicker})}>
          <View
            style={[styles.image, {backgroundColor: color}]}
            /><Icon
          name='fontawesome|pencil'
          size={25}
          color='#888'
          style={styles.icon}
          />
        </Button>
      </View>
    );
  }

  _renderColorPicker (color) {
    if (!this.state.showColorPicker) {
      return;
    }

    var listOfView = [];
    _.each(color, _.bind(function (c) {
      listOfView.push(
        <Button key={c.name} onPress={() => this._changeUserColor(c)}>
          <View style={[styles.colorSquare, {backgroundColor: c.hex}]}></View>
        </Button>);
    }, this));
    return (
      <View>
        <Text style={[styles.label, {alignSelf: 'center'}]}>Select a color</Text>
        <View style={styles.colorPicker}>
          {listOfView}
        </View>
      </View>
    );
  }

  _changeUserColor (c) {
    client.userUpdate({color: c.hex}, _.bind(function (response) {
      if (response.err) {
        this._appendError(response.err);
      } else {
        this.setState({color: c.hex, showColorPicker: false});
        this._appendError('Success');
      }
    }, this));
  }

  renderLoadingView () {
    return (
      <View style={styles.container}>
        <Text>
          Loading...
        </Text>
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
  label: {
    fontWeight: 'bold',
    color: "#222",
    marginTop: 10
  },
  image: {
    height: 140,
    width: 140,
    borderRadius: 4,
    marginTop: 15
  },
  icon: {
    width: 25,
    height: 25,
    position: 'absolute',
    top: 128,
    right: 0
  },
  status: {
    width: 18,
    height: 28
  },
  separator: {
    flex: 1,
    width: 250,
    height: 1,
    backgroundColor: '#AAA',
    marginTop: 25,
    marginBottom: 15
  },
  colorPicker: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 25,
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row'
  },
  colorSquare: {
    width: 25,
    height: 25,
    margin: 3,
    borderRadius: 2
  }
});

module.exports = EditProfileView;
