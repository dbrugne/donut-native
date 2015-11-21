var React = require('react-native');
var _ = require('underscore');
var client = require('../libs/client');

var {
  Component,
  Text,
  View,
  Image,
  StyleSheet
  } = React;

var currentUser = require('../models/current-user');
var common = require('@dbrugne/donut-common/mobile');

//@todo yfuks possibility to access camera/library to change poster/avatar

class EditProfileView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      picture: '',
      poster: '',
      color: '',
      errors: [],
      load: false
    };
  }

  componentDidMount () {
    client.userRead(currentUser.get('user_id'), _.bind(function (response) {
      this.setState({
        picture: common.cloudinary.prepare(response.avatar, 100),
        poster: common.cloudinary.prepare(response.poster, 200),
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
      <View style={styles.container}>
        <View>
          {this.state.errors.map((m) => <Text>{m}</Text>)}
          <Text style={styles.label}>Profile picture</Text>
          <Image
            style={styles.image}
            source={{uri: this.state.picture}}
            />
          <Text style={styles.label}>Poster</Text>
          <Image
            style={styles.image}
            source={{uri: this.state.poster}}
            />
          <Text style={styles.label}>Color</Text>
          <View
            style={[styles.image, {backgroundColor: this.state.color}]}
            />
        </View>
      </View>
    )
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
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formInput: {
    height: 42,
    paddingBottom: 10,
    width: 250,
    marginRight: 5,
    flex: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 8,
    color: "#555555"
  },
  label: {
    fontWeight: 'bold',
    color: "#777"
  },
  image: {
    height: 100,
    width: 100
  }
});

module.exports = EditProfileView;
