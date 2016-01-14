'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ScrollView,
  Component,
  StyleSheet
  } = React;

var ListItem = require('../components/ListItem');
var s = require('../styles/style');
var app = require('../libs/app');
var navigation = require('../navigation/index');
var MembershipRequest = require('./GroupAskRequest');
var MembershipPassword = require('./GroupAskPassword');
var MembershipEmail = require('./GroupAskEmail');
var LoadingView = require('../components/Loading');

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
      app.client.groupBecomeMember(this.props.id, null, this.onData.bind(this));
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
        <LoadingView />
      );
    }

    if (!this.state.success) {
      return (
        <ScrollView style={styles.main}>
          <View style={styles.container}>

            <Text style={[s.block]}>{i18next.t('group.message-not-member')}</Text>

            {this._renderDisclaimer()}

            {this.renderListOptions()}

          </View>
        </ScrollView>
      );
    } else {
      return (
        <View />
      );
    }
  }

  _renderDisclaimer () {
    if (!this.data.options.disclaimer) {
      return null;
    }
    // <Text>{i18next.t('group.message-from')} @{this.data.options.owner_username}:</Text>
    return (
      <View style={[s.alertWarning, {flex: 1, marginVertical: 0, marginHorizontal: 0, borderRadius: 0}]}>
        <View style={{flexDirection: 'column', flex: 1}}>
          <Text
            style={[s.alertWarningText, {fontStyle: 'italic'}]}>{this.data.options.disclaimer}</Text>
        </View>
      </View>
    );
  }

  renderListOptions () {
    var nbrOptions = (this.data.options.allowed_domains ? 1 : 0) + (this.data.options.password ? 1 : 0) + (this.data.options.request ? 1 : 0);
    if (nbrOptions > 1) {
      var request = null;
      var password = null;
      var email = null;

      if (this.data.options.request) {
        request = (
          <ListItem
            onPress={() => navigation.navigate('GroupAskRequest', {id: this.props.id, isAllowedPending: this.data.options.isAllowedPending})}
            text={i18next.t('group.request-title')}
            first
            action
            type='button'
            />
        );
      }
      if (this.data.options.password) {
        password = (
          <ListItem
            onPress={() => navigation.navigate('GroupAskPassword', this.props.id)}
            text={i18next.t('group.password-title')}
            first={(!this.data.options.request)}
            last={(!this.data.options.email)}
            action
            type='button'
            />
        );
      }
      if (this.data.options.allowed_domains) {
        email = (
          <ListItem
            onPress={() => navigation.navigate('GroupAskEmail', {id: this.props.id, domains: this.data.options.allowed_domains})}
            text={i18next.t('group.email-title')}
            last
            action
            type='button'
            />
        );
      }

      return (
        <View style={{paddingTop: 10, alignSelf: 'stretch'}}>
          {request}
          {password}
          {email}
        </View>
      );
    } else if (nbrOptions === 1) {
      if (this.data.options.request) {
        return (
          <MembershipRequest id={this.props.id} isAllowedPending={this.data.options.isAllowedPending} scroll={false} />
        );
      } else if (this.data.options.password) {
        return (
          <MembershipPassword id={this.props.id} navigator={this.props.navigator} scroll={false} />
        );
      } else {
        return (
          <MembershipEmail id={this.props.id} domains={this.data.options.allowed_domains} scroll={false} />
        );
      }
    } else {
      return (
        <View style={{flex:1, alignSelf: 'stretch'}}>
          <Text style={[s.block]}>{i18next.t('group.other-request')}</Text>
        </View>
      );
    }
  }

  updateGroup () {
    this.setState({
      success: true
    });
    this.props.navigator.popToTop();
    app.trigger('refreshGroup');
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = GroupAskMembership;
