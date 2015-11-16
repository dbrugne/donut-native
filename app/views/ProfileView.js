'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  ActivityIndicatorIOS,
  TouchableHighlight,
  Component,
  Image
} = React;

var _ = require('underscore');
var client = require('../libs/client');
var common = require('@dbrugne/donut-common/mobile');

// @todo close button that pop the view
// @todo unmount component when navigating (event from drawer)
// @todo on unmouting stop current loading and pending callbacks

class UserProfileView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
      error: null
    };

    this.id = props.currentRoute.id;
    this.type = props.currentRoute.type;
  }
  componentDidMount () {
    if (this.id) {
      if (this.type === 'room') {
        client.roomRead(this.id, {more: true}, this.onData.bind(this));
      } else {
        client.userRead(this.id, this.onData.bind(this));
      }
    }
  }
  onData (response) {
    if (response.err) {
      return this.setState({
        error: 'Impossible de charger ce profil, veuillez ré-essayer plus tard'
      });
    }
    this.setState({
      loading: false,
      data: response
    });
  }
  render () {
    // @todo i18next
    if (this.state.loading) {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            <Text>Chargement du profil de{"\n"}</Text>
            <Text>{this.props.currentRoute.title}</Text>
          </Text>
          <ActivityIndicatorIOS
            animating={this.state.loading}
            style={styles.loading}
            size='small'
            color='#666666'
            />
        </View>
      );
    }

    var data = this.state.data;
    var avatarUrl = common.cloudinary.prepare(data.avatar, 120);
    var description = data.description || data.bio;
    description = _.unescape(description);

    return (
      <View style={styles.container}>
        <Image style={styles.avatar} source={{uri: avatarUrl}} />
        <Text style={styles.identifier}>{data.identifier}</Text>
        <TouchableHighlight style={styles.owner} onPress={() => console.log('touch')}>
          <Text>
            <Text>by </Text>
            <Text style={styles.ownerUsername}>@{data.owner_username}</Text>
          </Text>
        </TouchableHighlight>
        <Text style={styles.description}>{description}</Text>
        <Text>{data.room_id}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  // loading
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    color: '#424242',
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loading: {
    height: 120
  },
  // profile
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10,
    borderColor: '#DCDCDC',
    borderWidth: 5
  },
  identifier: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold'
  },
  owner: {

  },
  ownerUsername: {
    fontFamily: 'Open Sans',
    fontWeight: 'bold'
  },
  description: {
    marginVertical: 15,
    marginHorizontal: 9
  }
});

module.exports = UserProfileView;