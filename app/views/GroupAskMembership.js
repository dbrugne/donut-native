'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ActivityIndicatorIOS,
  Component,
  StyleSheet
} = React;
var {
  Icon
} = require('react-native-icons');

var _ = require('underscore');
var client = require('../libs/client');
var ListItem = require('../elements/ListItem');
var s = require('../styles/style');
var navigation = require('../libs/navigation');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'message': 'Members have special priviledges such as direct access to certain private donuts and to other members of this community.',
  'from': 'Message from ',
  'request-title': 'I request membership',
  'password-title': 'I have the password',
  'email-title': 'I have an authorized e-mail',
  'other-request': 'You can join this community only if invited by its moderators.'
});

class GroupAskMembership extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      success: false,
      error: null
    };
    this.data = {};
  }
  componentDidMount () {
    if (this.props.id) {
      client.groupJoin(this.props.id, null, this.onData.bind(this));
    }
  }
  onData (response) {
    if (response.err) {
      this.setState({
        error: 'error'
      });
    }
    if (!response.success) {
      this.data = response;
      this.setState({
        loading: false
      });
    } else {
      this.data = response;
      this.setState({
        loading: false,
        success: true
      });
    }
  }
  render () {
    if (this.state.loading) {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            <Text>loading</Text>
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
    if (!this.state.success) {
      var disclaimer = null;
      // @todo replace <View style={s.alertWarning}> by element "alert" create is not exist
      if (this.data.options.disclaimer) {
        disclaimer = (
          <View style={s.alertWarning}>
            <Text>{i18next.t('local:from')} @{this.data.options.owner_username}:</Text>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name='fontawesome|quote-right'
                size={14}
                color='#666'
                style={{width: 14, height: 14, marginRight: 2}}
                />
              <Text>{this.data.options.disclaimer}</Text>
            </View>
          </View>
        );
      }
      return (
        <View>
          <View style={styles.container}>
            <Text style={styles.message}>{i18next.t('local:message')}</Text>
            {disclaimer}
          </View>
          <View style={styles.containerOptions}>
            {this.renderListOptions()}
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <Text>Vous êtes déjà membre!</Text>
        </View>
      );
    }
  }
  renderListOptions () {
    var nbrOptions = (this.data.options.allowed_domains ? 1 : 0) + (this.data.options.password ? 1 : 0) + (this.data.options.request ? 1 : 0);
    if (nbrOptions > 1) {
      var request = null;
      var password = null;
      var email = null;
      if (this.data.options.request) {
        request = (
          <ListItem onPress={() => this.props.navigator.push(navigation.getGroupAskMembershipRequest({id: this.props.id, isAllowedPending: this.data.options.isAllowedPending}))}
            text={i18next.t('local:request-title')}
            first={true}
            action='true'
            type='button'
            />
        );
      }
      if (this.data.options.password) {
        password = (
          <ListItem onPress={() => this.props.navigator.push(navigation.getGroupAskMembershipPassword({id: this.props.id, name: this.data.options.name}))}
            text={i18next.t('local:password-title')}
            first={(!this.data.options.request)}
            last={(!this.data.options.email)}
            action='true'
            type='button'
            />
        );
      }
      if (this.data.options.allowed_domains) {
        email = (
          <ListItem
            text={i18next.t('local:email-title')}
            last={true}
            action='true'
            type='button'
            />
        );
      }
      return (
        <View>
          {request}
          {password}
          {email}
        </View>
      );
    } else if (nbrOptions === 1) {
        if (this.data.options.request) {
          return (
            <View><Text>one option request</Text></View>
          );
        } else if (this.data.options.password) {
          return (
            <View><Text>one option password</Text></View>
          );
        } else {
          return (
            <View><Text>one option email</Text></View>
          );
        }
    } else {
      return (
        <View><Text>{i18next.t('local:other-request')}</Text></View>
      );
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
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#FFF'
  },
  containerOptions: {
    marginTop: 50
  },
  message: {
    color: '#424242',
    fontSize: 16
  }
});

module.exports = GroupAskMembership;
