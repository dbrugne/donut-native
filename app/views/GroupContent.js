'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput
  } = React;

var _ = require('underscore');
var app = require('../libs/app');
var navigation = require('../navigation/index');
var date = require('../libs/date');
var hyperlink = require('../libs/hyperlink');
var ListItem = require('../components/ListItem');
var alert = require('../libs/alert');
var Button = require('../components/Button');
var KeyboardAwareComponent = require('../components/KeyboardAware');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupContent', {
  'success-request': 'Request sent ! You will be notified when accepted.',
  'allowed-pending': 'Access to this community is by invitation, and you already have a request in progress.',
  'placeholder-request': 'Your motivations, background ...',
  'info-request': 'Your contact details and your following message (optional) will be sent to the moderators of this community.',
  'send': 'SEND',
  'placeholder-password': 'password',
  'info-password': 'ENTER THE PASSWORD',
  'create-donut': 'Create a discussion',
  'rooms': 'DISCUSSION LIST ',
  'invite': 'Manage invitations',
  'users': 'MEMBER LIST',
  'about': 'ABOUT',
  'created': 'created on',
  'unknownerror': 'Unknown error, please retry later',
  'leave': 'LEAVE THIS COMMUNTIY',
  'message-wrong-format': 'The message should be less than 200 character',
  'not-confirmed': 'Action authorized to verified accounts only. Verify your e-mail.',
  'allow-pending': 'An access request is already pending',
  'success-domain': 'The email has been successfully added to your account. You will receive a verification e-mail.',
  'email': 'e-mail',
  'info-email': 'I HAVE AN AUTHORIZED E-MAIL',
  'domains': 'Authorized domains:',
  'missing-email': 'Mail address is required',
  'wrong-format-email': 'Mail address is not valid',
  'mail-already-exist': 'This mail address is already used',
  'not-allowed-domain': 'The email entered is not part of authorized domains'
});

var GroupView = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    options: React.PropTypes.object,
    data: React.PropTypes.any,
    step: React.PropTypes.string,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      step: this.props.step,
      options: this.props.options,
      data: this.props.data,

      motivations: '',
      loadingSendRequest: false,
      requestSuccess: false,

      password: null,
      loadingPassword: false,

      domain: '',
      loadingDomain: false,
      domainSuccess: false
    };
  },
  componentDidMount () {
    app.on('groupStep', this.changeStep, this);
    app.on('groupBecomeMember', this.groupBecomeMember, this);
    app.on('groupRead', this.onGroupRead, this);
  },
  componentWillUnmount () {
    app.off(null, null, this);
  },
  // do not remove, used to reset success state on component refocus
  componentWillReceiveProps () {
    this.setState({requestSuccess: false, domainSuccess: false});
  },
  changeStep: function (step) {
    this.setState({step});
  },
  groupBecomeMember: function (options) {
    this.setState({options});
  },
  onGroupRead: function (data) {
    this.setState({data});
  },
  render () {
    // default group page render
    if (this.state.step === 'group') {
      return (
        <View style={{ marginBottom: 20 }}>
          {this._renderDiscussionList()}
          {this._renderMemberList()}
          {this._renderAbout()}
          {this._renderLeaveCommunityButton()}
        </View>
      );
    }

    // group join render: display nothing except buttons & disclaimer
    if (this.state.step === 'groupJoin') {
      return null;
    }

    // AskMembership button pressed
    if (this.state.step === 'groupJoinRequest') {
      // if request send successfully applied
      if (this.state.requestSuccess) {
        return (
          <Text style={{ margin: 20, fontFamily: 'Open Sans', fontSize: 14, color: '#18C095' }}>{i18next.t('GroupContent:success-request')}</Text>
        );
      }
      // if already a request pending, only display a message
      if (this.state.options.isAllowedPending) {
        return (
          <Text
            style={{ margin: 20, fontFamily: 'Open Sans', fontSize: 14, color: '#F15261' }}>{i18next.t('GroupContent:allowed-pending')}</Text>
        );
      }
      // else display request form
      return (
        <KeyboardAwareComponent
          shouldShow={() => { return true; }}
          shouldHide={() => { return true; }}
          >
          <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column', alignItems: 'center', paddingVertical: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 20, alignSelf: 'stretch' }}>
              <View style={{width: 1, height: 40, backgroundColor: '#FC2063'}}/>
              <TextInput autoCapitalize='none'
                         ref='input'
                         placeholder={i18next.t('GroupContent:placeholder-request')}
                         onChangeText={(text) => this.setState({motivations: text})}
                         value={this.state.request}
                         style={{ flex: 1, fontFamily: 'Open Sans', fontSize: 14, fontWeight: '400', color: '#333', height: 40, paddingVertical: 8, paddingHorizontal: 10 }}
                />
            </View>
            <View style={{ flex: 1 }}/>
            <View style={{ height: 1, alignSelf: 'stretch', backgroundColor: '#E7ECF3', marginBottom: 10 }}/>
            <Text style={{ alignSelf: 'stretch', marginHorizontal: 20, fontFamily: 'Open Sans', fontSize: 12, color: '#AFBAC8', fontStyle: 'italic' }}>{i18next.t('GroupContent:info-request')}</Text>
            <Button type='gray'
                    onPress={this.onSendRequest}
                    label={i18next.t('GroupContent:send')}
                    loading={this.state.loadingSendRequest}
                    style={{ alignSelf: 'stretch', marginTop: 10, marginHorizontal: 20 }}
              />
          </View>
        </KeyboardAwareComponent>
      );
    }

    if (this.state.step === 'groupJoinPassword') {
      return (
        <KeyboardAwareComponent
          shouldShow={() => { return true; }}
          shouldHide={() => { return true; }}
          >
          <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column', alignItems: 'center', paddingVertical: 20 }}>
            <View style={{alignSelf: 'stretch'}}>
              <ListItem type='input'
                        autoCapitalize='none'
                        ref='input'
                        first
                        last
                        placeholder={i18next.t('GroupContent:placeholder-password')}
                        onChangeText={(text) => this.setState({password: text})}
                        value={this.state.password}
                        style={{ alignSelf: 'stretch' }}
                        title={i18next.t('GroupContent:info-password')}
                />
            </View>
            <View style={{ flex: 1 }}/>
            <Button type='gray'
                    onPress={this.onSendPassword}
                    label={i18next.t('GroupContent:send')}
                    loading={this.state.loadingPassword}
                    style={{ alignSelf: 'stretch', marginTop: 10, marginHorizontal: 20 }}
              />
          </View>
        </KeyboardAwareComponent>
      );
    }

    if (this.state.step === 'groupJoinDomain') {
      // if request send successfully applied
      if (this.state.domainSuccess) {
        return (
          <Text style={{ margin: 20, fontFamily: 'Open Sans', fontSize: 14, color: '#18C095' }}>{i18next.t('GroupContent:success-domain')}</Text>
        );
      }

      return (
        <KeyboardAwareComponent
          shouldShow={() => { return true; }}
          shouldHide={() => { return true; }}
          >
          <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column', paddingVertical: 20 }}>
            <View style={{alignSelf: 'stretch'}}>
              <ListItem type='input'
                        autoCapitalize='none'
                        ref='input'
                        first
                        last
                        placeholder={i18next.t('GroupContent:email')}
                        onChangeText={(text) => this.setState({domain: text})}
                        value={this.state.domain}
                        style={{ alignSelf: 'stretch' }}
                        title={i18next.t('GroupContent:info-email')}
                />
            </View>

            <View style={{ flex: 1 }}/>

            <Text style={{ marginTop: 20, alignSelf: 'stretch', marginHorizontal: 20, fontFamily: 'Open Sans', fontSize: 12, color: '#AFBAC8', fontStyle: 'italic' }}>{i18next.t('GroupContent:domains')}</Text>
            {_.map(this.state.options.allowed_domains, (domain, index) => {
              return (
                <Text key={'authorized-domain-'+index} style={{ marginHorizontal: 20, fontFamily: 'Open Sans', fontSize: 12, color: '#AFBAC8', fontStyle: 'italic' }}>{domain}</Text>
              );
            })}

            <Button type='gray'
                    onPress={this.onAddEmail}
                    label={i18next.t('GroupContent:send')}
                    loading={this.state.loadingDomain}
                    style={{ alignSelf: 'stretch', marginTop: 10, marginHorizontal: 20 }}
              />
          </View>
        </KeyboardAwareComponent>
      );
    }

    return null;
  },
  _renderDiscussionList: function () {
    if (this.state.data.i_am_banned) {
      return null;
    }

    let createButton = (
      <ListItem
        type='button'
        last
        first
        action
        onPress={() => navigation.navigate('CreateRoom', {group_id: this.state.data.group_id, group_identifier: this.state.data.identifier})}
        text={i18next.t('GroupContent:create-donut')}
        />
    );
    if (!this.state.data.is_member) {
      createButton = null;
    }

    return (
      <View>
        <Text style={{ marginTop: 20 }}/>
        <ListItem
          onPress={() => navigation.navigate('GroupRooms', this.state.data)}
          text={i18next.t('GroupContent:rooms')}
          type='image-list'
          action
          value={this.state.data.rooms.length + ''}
          first
          imageList={this.state.data.rooms}
          />
        {createButton}
      </View>
    );
  },
  _renderMemberList: function () {
    if (this.state.data.i_am_banned || !this.state.data.is_member) {
      return null;
    }

    let buttons = null;
    if (this.state.data.is_owner || this.state.data.is_op) {
      buttons = (
        <View>
          <ListItem
            type='button'
            first
            last
            action
            onPress={() => navigation.navigate('ManageInvitations', {id: this.state.data.group_id, type: 'group'})}
            text={i18next.t('GroupContent:invite')}
            />
        </View>
      );
    }

    return (
      <View>
        <Text style={{marginTop: 20}}/>
        <ListItem
          onPress={() => navigation.navigate('GroupUsers', this.state.data)}
          text={i18next.t('GroupContent:users')}
          type='image-list'
          action
          value={this.state.data.members.length + ''}
          first
          id={this.state.data.group_id}
          parentType='group'
          isOwnerAdminOrOp={this.state.data.is_owner || this.state.data.is_op || app.user.isAdmin()}
          imageList={this.state.data.members}
          />
        {buttons}
      </View>
    );
  },
  _renderAbout: function () {
    return (
      <View style={{ marginTop: 40 }}>
        <Text
          style={{ fontWeight: '600', color: '#FC2063', fontFamily: 'Open Sans', fontSize: 16, marginHorizontal: 20, marginVertical: 5 }}>{i18next.t('GroupContent:about')}</Text>
        {this._renderDescription()}
        {this._renderWebsite()}
        {this._renderCreatedAt()}
      </View>
    );
  },
  _renderDescription: function () {
    if (!this.state.data.description) {
      return null;
    }

    let description = _.unescape(this.state.data.description);

    return (
      <View style={{ marginBottom: 20 }}>
        <View style={{ backgroundColor: '#E7ECF3', height: 1, alignSelf: 'stretch' }}/>
        <Text
          style={{ marginVertical: 10, marginHorizontal: 20, fontFamily: 'Open Sans', fontSize: 14, color: '#394350' }}>{description}</Text>
      </View>
    );
  },
  _renderWebsite: function () {
    if (this.state.data.website) {
      return (
        <ListItem onPress={() => hyperlink.open(this.state.data.website.href)}
                  text={this.state.data.website.title}
                  first
                  action
                  type='button'
                  imageLeft={require('../assets/icon-link.png')}
          />
      );
    }
  },
  _renderCreatedAt: function () {
    return (
      <ListItem
        type='text'
        text={i18next.t('GroupContent:created') + ' ' + date.shortDate(this.state.data.created)}
        last
        imageLeft={require('../assets/icon-time.png')}
        />
    );
  },
  _renderLeaveCommunityButton: function () {
    if (!this.state.data.is_member || this.state.data.is_owner) {
      return null;
    }

    return (
      <View style={{ marginTop: 20, marginHorizontal: 20 }}>
        <Button
          onPress={() => alert.askConfirmation('Quit group', 'You will leave this community', () => this.onGroupQuit(), () => {})}
          label={i18next.t('GroupContent:leave')}
          first={!(this.state.data.is_op || app.user.isAdmin())}
          type='gray'
          />
      </View>
    );
  },
  onGroupQuit: function () {
    if (this.state.data.is_member) {
      app.client.groupQuitMembership(this.state.data.group_id, function (response) {
        if (response.err) {
          return alert.show(i18next.t('GroupContent:unknownerror'));
        }
        app.trigger('refreshGroup');
      });
    }
  },
  onSendRequest: function () {
    this.setState({loadingSendRequest: true});
    app.client.groupRequest(this.state.data.group_id, this.state.motivations, (response) => {
      this.setState({loadingSendRequest: false});
      if (response.success) {
        this.setState({requestSuccess: true});
      } else {
        if (response.err === 'allow-pending' || response.err === 'message-wrong-format' || response.err === 'not-confirmed') {
          return alert.show(i18next.t('GroupContent:' + response.err));
        }
        return alert.show(i18next.t('messages.' + response.err));
      }
    });
  },
  onSendPassword: function () {
    if (!this.state.password) {
      return alert.show(i18next.t('messages.wrong-password'));
    }
    this.setState({loadingPassword: true});
    app.client.groupBecomeMember(this.state.data.group_id, this.state.password, (response) => {
      this.setState({loadingPassword: false});
      if (response.success) {
        // update group page as now currentUser is a member
        app.trigger('refreshGroup', true);
        app.trigger('groupStep', 'group');
      } else {
        if (response.err === 'wrong-password') {
          return alert.show(i18next.t('messages.wrong-password'));
        }
        return alert.show(i18next.t('messages.' + response.err));
      }
    });
  },
  onAddEmail: function () {
    if (!this.state.domain) {
      return alert.show(i18next.t('GroupContent:missing-email'));
    }
    if (!this._isAllowedDomain()) {
      return alert.show(i18next.t('GroupContent:not-allowed-domain'));
    }
    this.setState({loadingDomain: true});
    app.client.accountEmail(this.state.domain, 'add', _.bind(function (response) {
      this.setState({loadingDomain: false});
      if (response.success) {
        this.setState({domainSuccess: true});
      } else {
        if (response.err === 'mail-already-exist') {
          return alert.show(i18next.t('GroupContent:mail-already-exist'));
        }
        if (response.err === 'wrong-format') {
          return alert.show(i18next.t('GroupContent:wrong-format-email'));
        }
        return alert.show(i18next.t('messages.' + response.err));
      }
    }, this));
  },
  _isAllowedDomain: function() {
    if (!this.state.domain || this.state.domain.split('@').length !== 2) {
      return false;
    }
    var domain = '@' + _.last(this.state.domain.split('@')).toLowerCase();
    return _.contains(_.map(this.state.options.allowed_domains, (d) => { return d.toLowerCase(); }), domain);
  }
});

module.exports = GroupView;
