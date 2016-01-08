'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  ActivityIndicatorIOS,
  Component
} = React;

var app = require('../libs/app');
var RoomProfile = require('../components/RoomProfile');
var UserProfile = require('../components/UserProfile');
var ConnectionState = require('../components/ConnectionState');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'unable-load': 'Unable to load profile, please try again later',
  'loading-profile': 'Chargement du profil de'
});

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
        app.client.roomRead(this.id, {more: true}, this.onData.bind(this));
      } else if (this.type === 'user') {
        app.client.userRead(this.id, {more: true}, this.onData.bind(this));
      }
    }
  }
  onData (response) {
    if (response.err) {
      return this.setState({
        error: i18next.t('local:unable-load')
      });
    }
    this.setState({
      loading: false,
      data: response
    });
  }
  render () {
    if (this.state.loading) {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            <Text>{i18next.t('local:loading-profile')}</Text>
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
  }
});

module.exports = ProfileView;
