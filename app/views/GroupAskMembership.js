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
var ListItem = require('../elements/ListItem');
var s = require('../styles/style');
var app = require('../libs/app');
var navigation = require('../libs/navigation');
var MembershipRequest = require('./GroupAskMembershipRequest');
var MembershipPassword = require('./GroupAskMembershipPassword');
var MembershipEmail = require('./GroupAskMembershipEmail');

var i18next = require('../libs/i18next');

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
      app.client.groupJoin(this.props.id, null, this.onData.bind(this));
    }
  }
  onData (response) {
    if (response.err) {
      this.setState({
        error: 'error'
      });
    }
    if (response.err && response.err === 'already-member') {
      return this.updateGroup();
    }
    if (!response.success) {
      this.data = response;
      this.setState({
        loading: false
      });
    } else {
      this.updateGroup();
    }
  }
  render () {
    if (this.state.loading || this.state.success) {
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
      if (this.data.options.disclaimer) {
        disclaimer = (
          <View style={s.alertWarning}>
            <Text>{i18next.t('group.message-from')} @{this.data.options.owner_username}:</Text>
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
        <View style={styles.main}>
          <View style={styles.container}>
            <Text style={styles.message}>{i18next.t('group.message-not-member')}</Text>
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
          <Text></Text>
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
            text={i18next.t('group.request-title')}
            first={true}
            action='true'
            type='button'
            />
        );
      }
      if (this.data.options.password) {
        password = (
          <ListItem onPress={() => this.props.navigator.push(navigation.getGroupAskMembershipPassword(this.props.id))}
            text={i18next.t('group.password-title')}
            first={(!this.data.options.request)}
            last={(!this.data.options.email)}
            action='true'
            type='button'
            />
        );
      }
      if (this.data.options.allowed_domains) {
        email = (
          <ListItem onPress={() => this.props.navigator.push(navigation.getGroupAskMembershipEmail({id: this.props.id, domains: this.data.options.allowed_domains}))}
            text={i18next.t('group.email-title')}
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
            <MembershipRequest id={this.props.id} isAllowedPending={this.data.options.isAllowedPending} />
          );
        } else if (this.data.options.password) {
          return (
            <MembershipPassword id={this.props.id} navigator={this.props.navigator} />
          );
        } else {
          return (
            <MembershipEmail id={this.props.id} domains={this.data.options.allowed_domains} />
          );
        }
    } else {
      return (
        <View><Text>{i18next.t('group.other-request')}</Text></View>
      );
    }
  }
  updateGroup() {
    this.setState({
      success: true
    });
    this.props.navigator.popToTop();
    app.trigger('refreshGroup');
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
  main: {
    flex: 1
  },
  container: {
    marginTop: 10,
    backgroundColor: '#FFF'
  },
  containerOptions: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10
  },
  message: {
    color: '#424242',
    fontSize: 16
  }
});

module.exports = GroupAskMembership;
