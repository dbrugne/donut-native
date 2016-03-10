'use strict';

var React = require('react-native');
var {
  ScrollView,
  View,
  Text,
  Image
  } = React;

var app = require('../libs/app');
var alert = require('../libs/alert');
var Disclaimer = require('../components/Disclaimer');

var GroupHeader = require('./GroupHeader');
var GroupActions = require('./GroupActions');
var GroupContent = require('./GroupContent');
var LoadingView = require('../components/Loading');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'Group', {
  'request-membership': 'REQUEST MEMBERSHIP',
  'rooms': 'DISCUSSION LIST',
  'users': 'MEMBER LIST',
  'leave': 'LEAVE THIS COMMUNTIY',
  'about': 'ABOUT',
  'empty-methods': 'You can join this community only if invited by its moderators.',
  'community-member': 'You are a member of this community',
  'community-not-member-title': 'You are not a member yet !',
  'community-not-member': 'You can only see public discussions. Members have special priviledges such as direct access to certain private discussions and to this community members.',
  'community-owner': 'You are the owner of this community',
  'community-op': 'You are an op of this community',
  'invite': 'Manage invitations',
  'create-donut': 'Create a discussion',
  'message-ban': 'You were banned from this community',
  'created': 'created on',
  'unknownerror': 'Unknown error, please retry later'
});

var GroupView = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      loaded: false,
      data: null,
      options: null,
      step: 'group'
    };
  },
  componentDidMount () {
    app.on('refreshGroup', this.fetchData, this);
    app.on('groupStep', this.changeStep, this);
    app.on('groupBecomeMember', this.groupBecomeMember, this);

    if (this.props.model.get('id')) {
      app.client.groupJoin(this.props.model.get('id'));
    }
  },
  componentWillUnmount () {
    app.off(null, null, this);
  },
  onFocus () {
    this.fetchData();
  },
  fetchData () {
    app.client.groupRead(this.props.model.get('id'), {users: true, rooms: true}, (data) => this.onData(data));
  },
  changeStep: function (step) {
    this.setState({step});
  },
  groupBecomeMember: function (options) {
    this.setState({options});
  },
  onData (response) {
    if (response.err) {
      return alert.show(i18next.t('messages.' + response.err));
    }

    this.setState({
      loaded: true,
      data: response
    });
  },
  render () {
    if (!this.state.loaded) {
      return (
        <LoadingView/>
      );
    }

    return (
      <ScrollView style={{ flexDirection: 'column', flexWrap: 'wrap' }}>
        <GroupHeader data={this.state.data} small={this.state.step !== 'group' && this.state.step !== 'groupJoin'}>
          <GroupActions {...this.props} data={this.state.data} step={this.state.step}/>
        </GroupHeader>
        {this._renderMessage()}
        <GroupContent {...this.props} data={this.state.data} step={this.state.step} options={this.state.options}/>
      </ScrollView>
    );
  },
  _renderMessage: function () {
    // Default group page, display user status
    if (this.state.step === 'group') {
      // render banned
      if (this.state.data.i_am_banned) {
        return (
          <View
            style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
            <View style={{ backgroundColor: '#F15261', padding: 20, alignSelf: 'stretch' }}>
              <Text style={{ fontFamily: 'Open Sans', fontSize: 14, color: '#FFFFFF' }}>
                {i18next.t('Group:message-ban')}
              </Text>
            </View>
          </View>
        );
        // render not member
      } else if (!this.state.data.is_member) {
        return (
          <View
            style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
            <Image source={require('../assets/arrow-top-gray.png')}
                   style={{ width: 30, height: 8.5, resizeMode: 'contain', marginTop: -8.5 }}/>
            <View style={{ backgroundColor: '#E7ECF3', padding: 20, alignSelf: 'stretch' }}>
              <Text
                style={{ fontFamily: 'Open Sans', fontWeight: '600', fontSize: 14, color: '#394350' }}>{i18next.t('Group:community-not-member-title')}</Text>
              <Text
                style={{ marginTop: 20, fontFamily: 'Open Sans', fontSize: 14, color: '#394350' }}>{i18next.t('Group:community-not-member')}</Text>
            </View>
          </View>
        );
        // render owner
      } else if (this.state.data.is_owner) {
        return (
          <View
            style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', backgroundColor: '#E7ECF3', padding: 20 }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'stretch' }}>
              <Image source={require('../assets/icon-check.png')}
                     style={{ width: 21.5, height: 17.5, resizeMode: 'contain' }}/>
              <Text
                style={{ marginLeft: 10, fontFamily: 'Open Sans', fontWeight: '600', fontSize: 14, color: '#394350' }}>{i18next.t('Group:community-owner')}</Text>
            </View>
          </View>
        );
        // render op
      } else if (this.state.data.is_op) {
        return (
          <View
            style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', backgroundColor: '#E7ECF3', padding: 20 }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'stretch' }}>
              <Image source={require('../assets/icon-check.png')}
                     style={{ width: 21.5, height: 17.5, resizeMode: 'contain' }}/>
              <Text
                style={{ marginLeft: 10, fontFamily: 'Open Sans', fontWeight: '600', fontSize: 14, color: '#394350' }}>{i18next.t('Group:community-op')}</Text>
            </View>
          </View>
        );
        // render member
      } else {
        return (
          <View
            style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', backgroundColor: '#E7ECF3', padding: 20 }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'stretch' }}>
              <Image source={require('../assets/icon-check.png')}
                     style={{ width: 21.5, height: 17.5, resizeMode: 'contain' }}/>
              <Text
                style={{ marginLeft: 10, fontFamily: 'Open Sans', fontWeight: '600', fontSize: 14, color: '#394350' }}>{i18next.t('Group:community-member')}</Text>
            </View>
          </View>
        );
      }
    }

    if (this.state.step === 'groupJoin') {
      // no join method set, display message
      if (!this.state.options.request && !this.state.options.password && !this.state.options.allowed_domains) {
        return (
          <View
            style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
            <Disclaimer title={i18next.t('Group:empty-methods')} data={this.state.data}
                        navigator={this.props.navigator}/>
          </View>
        );
      }
      return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
          <Disclaimer data={this.state.data} navigator={this.props.navigator}/>
        </View>
      );
    }
  }
});

module.exports = GroupView;
