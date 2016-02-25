'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ScrollView,
  Component,
  StyleSheet
  } = React;
var Icon = require('react-native-vector-icons/FontAwesome');

var ListItem = require('../components/ListItem');
var s = require('../styles/style');
var app = require('../libs/app');
var navigation = require('../navigation/index');
var MembershipRequest = require('./GroupAskRequest');
var MembershipPassword = require('./GroupAskPassword');
var MembershipEmail = require('./GroupAskEmail');
var LoadingView = require('../components/Loading');
var GroupHeader = require('./GroupHeader');
var i18next = require('../libs/i18next');
var alert = require('../libs/alert');
var KeyboardAwareComponent = require('../components/KeyboardAware');

class GroupAskMembership extends Component {

  constructor (props) {
    super(props);
    this.state = {
      data: props.data,
      options: null,
      loading: true
    };
  }

  onFocus () {
    this.onRefresh();
  }

  onRefresh () {
    app.client.groupBecomeMember(this.state.data.group_id, null, this.onData.bind(this));
  }

  onData (response) {
    if (response.err) {
      if (response.err === 'already-member') {
        return this.updateGroup();
      }
      return alert.show(i18next.t('messages.' + response.err));
    }

    // !response.success --> an option is required to join the group
    if (!response.success && response.options) {
      return this.setState({
        options: response.options,
        loading: false
      });
    }

    this.updateGroup();
  }

  render () {
    if (this.state.loading) {
      return (
        <LoadingView />
      );
    }

    return (
      <KeyboardAwareComponent
        shouldShow={() => { return true }}
        shouldHide={() => { return true }}
        >
        <View style={{flex:1}}>
          <ScrollView style={styles.main}>
            <GroupHeader  model={this.state.data}/>
            <View style={styles.container}>

              {this._renderDisclaimer()}
              {this.renderListOptions()}

            </View>
          </ScrollView>
        </View>
      </KeyboardAwareComponent>
    );
  }

  _renderDisclaimer () {
    if (!this.state.options.disclaimer) {
      return null;
    }
    return (
      <View style={[s.alertWarning, {flex: 1, marginVertical: 0, marginHorizontal: 0, borderRadius: 0, alignSelf:'stretch'}]}>
        <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', alignSelf:'stretch'}}>
          <Icon
            name='quote-right'
            size={14}
            color='#8a6d3b'
            style={{marginTop: 2}}
          />
          <View style={{flexDirection: 'column', flex:1, justifyContent: 'center'}}>
            <Text style={[s.alertWarningText, {fontStyle: 'italic', paddingLeft: 5}]}>{this.state.options.disclaimer}</Text>
          </View>
        </View>
      </View>
    );
  }

  renderListOptions () {
    var nbrOptions = (this.state.options.allowed_domains ? 1 : 0) + (this.state.options.password ? 1 : 0) + (this.state.options.request ? 1 : 0);
    if (nbrOptions > 1) {
      var request = null;
      var password = null;
      var email = null;

      if (this.state.options.request) {
        request = (
          <ListItem
            onPress={() => navigation.navigate('GroupAskRequest', {data: this.state.data, options: this.state.options})}
            text={i18next.t('group.request-title')}
            first
            action
            type='button'
            />
        );
      }
      if (this.state.options.password) {
        password = (
          <ListItem
            onPress={() => navigation.navigate('GroupAskPassword', this.state.data)}
            text={i18next.t('group.password-title')}
            first={(!this.state.options.request)}
            last={(!this.state.options.email)}
            action
            type='button'
            />
        );
      }
      if (this.state.options.allowed_domains) {
        email = (
          <ListItem
            onPress={() => navigation.navigate('GroupAskEmail', {data: this.state.data, options: this.state.options})}
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
      if (this.state.options.request) {
        return (
          <MembershipRequest data={this.state.data} {...this.props} isAllowedPending={this.state.options.isAllowedPending} scroll={false} />
        );
      } else if (this.state.options.password) {
        return (
          <MembershipPassword data={this.state.data} {...this.props} scroll={false} />
        );
      } else {
        return (
          <MembershipEmail data={this.state.data} {...this.props} domains={this.state.options.allowed_domains} scroll={false} />
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
    this.props.navigator.popToTop(); // @todo handle in navigation.popToTop() wrapper
    app.trigger('refreshGroup', true);
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
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = GroupAskMembership;
