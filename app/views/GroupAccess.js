'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ScrollView
  } = React;

var _ = require('underscore');
var i18next = require('../libs/i18next');
var app = require('../libs/app');
var s = require('../styles/style');
var alert = require('../libs/alert');
var ListItem = require('../components/ListItem');
var LoadingView = require('../components/Loading');
var common = require('@dbrugne/donut-common/mobile');
var emojione = require('emojione');
var navigation = require('../navigation/index');

i18next.addResourceBundle('en', 'GroupAccess', {
  'title': 'Members create donuts and manage them. Members can join any donut open to members. Note: public donuts are open to anyone.',
  'disclaimer-public': 'This donut is public. Any user can access it.',
  'disclaimer-public-2': 'You can switch this donut to private mode. Then, only users you authorize will be able to join, participate and access history. Access will be based on invitation and/or password. The current members of this public donut will remain members once this donut switched to private. Caution, this action cannot be undone.',
  'allow-users-request': 'Allow users to request access',
  'allow-users-request-true': 'Users will be able to ask for an invitation to enter this community',
  'allow-users-request-false': 'Users will be not be able to ask for an invitation to enter this community',
  'disclaimer': 'Display a message',
  'disclaimer-help': 'This message will be displayed to any not allowed user trying to enter this community',
  'password': 'Set a password',
  'password-disclaimer': 'Users with the password can join without prior invitation.',
  'password-placeholder': 'Enter a password',
  'password-help': 'The password must be between 4 and 255 characters',
  'password-success': 'The password has been successfully saved'
});

var GroupAccessView = React.createClass({
  propTypes: {
    group: React.PropTypes.object,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    this.passwordPattern = /(.{4,255})$/i;
    return {
      loading: true
    };
  },
  componentDidMount: function() {
    var what = {
      users: false,
      admin: true
    };
    app.client.groupRead(this.props.group.id, what, _.bind(function (data) {
      if (data.err) {
        return alert.show(i18next.t('message.' + data.err));
      }
      this.setState({
        loading: false,
        data: data,
        setPassword: !!data.password
      });
    }, this));
  },
  render: function () {
    if (this.state.loading) {
      return (<LoadingView />);
    }

    return (
      <ScrollView style={{ backgroundColor: '#f0f0f0' }}>
        {this._renderPrivateTitle()}
        <View style={s.listGroup}>
          <Text style={s.listGroupItemSpacing}/>
          <ListItem
            text={i18next.t('GroupAccess:allow-users-request')}
            type='switch'
            help={this.state.data.allow_user_request ? i18next.t('GroupAccess:allow-users-request-true') : i18next.t('GroupAccess:allow-users-request-false')}
            switchValue={this.state.data.allow_user_request}
            onSwitch={this.saveGroupData.bind(this, {allow_user_request: !this.state.data.allow_user_request})}
          />

          <Text style={s.listGroupItemSpacing}/>
          <ListItem
            onPress={() => this.onGroupEdit(require('./GroupEditDisclaimer'), this.state.data.disclaimer)}
            text={i18next.t('GroupAccess:disclaimer')}
            type='edit-button'
            help={i18next.t('GroupAccess:disclaimer-help')}
            action
            autoCapitalize='none'
            value={this.state.data.disclaimer}
          />

          {this._renderPassword()}
        </View>
      </ScrollView>
    );
  },
  onGroupEdit (component, value) {
    navigation.navigate('UserField', {
      component,
      value,
      onSave: (key, val, cb) => {
        let update = {};
        update[key] = val;
        this.saveGroupData(update, cb)
      }
    });
  },
  _renderPrivateTitle: function() {
    return (
      <Text style={s.block}>
        <Text>{i18next.t('GroupAccess:title')}</Text>
      </Text>
    );
  },
  _renderPassword: function() {
    let passwordField = null;
    if (this.state.setPassword) {
      passwordField = (
        <ListItem
          ref='input'
          onPress= {this._savePassword}
          placeholder={i18next.t('GroupAccess:password-placeholder')}
          value={this.state.data.password}
          maxLength={255}
          onChangeText={(password) => this.setState({
            data: _.extend(this.state.data, {password: password})
          })}
          type='input-button'
          help={i18next.t('GroupAccess:password-help')}
        />
      );
    }
    return (
      <View>
        <Text style={s.listGroupItemSpacing}/>
        <ListItem type='switch'
                  first
                  text={i18next.t('GroupAccess:password')}
                  switchValue={this.state.setPassword}
                  onSwitch={this.state.setPassword ? this._cleanPassword : () => { this.setState({ setPassword: true })}}
                  help={this.state.setPassword ? '' : i18next.t('GroupAccess:password-disclaimer')}
        />
        {passwordField}
      </View>
    );
  },
  _savePassword: function() {
    if (!this.passwordPattern.test(this.state.data.password)) {
      return alert.show(i18next.t('GroupAccess:password-help'));
    }

    this.saveGroupData({password: this.state.data.password}, () => {
      alert.show(i18next.t('GroupAccess:password-success'));
      this.setState({
        setPassword: true
      });
    });
  },
  _cleanPassword: function() {
    this.saveGroupData({password: null}, () => {
      this.setState({
        setPassword: false
      });
    });
  },
  saveGroupData (update, callback) {
    app.client.groupUpdate(this.state.data.group_id, update, (response) => {
      if (response.err) {
        alert.show(i18next.t('message.' + response.err));
        if (callback) {
          return callback(response.err);
        }
        return;
      }

      this.setState({ data: _.extend(this.state.data, update)});

      if (callback) {
        callback();
      }
    });
  }
});


module.exports = GroupAccessView;
