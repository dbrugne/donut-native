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
var RoomProfile = require('../components/RoomProfile');
var GroupProfile = require('../components/GroupProfile');
var UserProfile = require('../components/UserProfile');
var navigation = require('../libs/navigation');

// @todo unmount component when navigating (even from drawer)
// @todo on unmouting stop current loading and pending callbacks

class ProfileView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
      error: null
    };

    this.type = props.element.type;
    this.id = props.element.id;
  }
  componentDidMount () {
    if (this.id) {
      if (this.type === 'room') {
        client.roomRead(this.id, {more: true}, this.onData.bind(this));
      } else if (this.type === 'user') {
        client.userRead(this.id, {more: true}, this.onData.bind(this));
      } else if (this.type === 'group') {
        client.groupRead(this.id, {}, this.onData.bind(this));
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
            <Text>{this.props.element.identifier}</Text>
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

    switch (this.type) {
      case 'room':
        return (
          <RoomProfile data={this.state.data} navigator={this.props.navigator} />
        );
      break;
      case 'user':
        return (
          <UserProfile data={this.state.data} navigator={this.props.navigator} />
        );
      break;
      case 'group':
        return (
          <GroupProfile data={this.state.data} navigator={this.props.navigator} />
        );
      break;
      default:
        return (<View>Unable to display this profile</View>); // @todo ylastapis skin a reusable error page component
      break;
    }
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
});

module.exports = ProfileView;
