'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ListView
} = React;

var _ = require('underscore');
var i18next = require('../libs/i18next');
var app = require('../libs/app');
var s = require('../styles/style');
var alert = require('../libs/alert');
var ListItem = require('../components/ListItem');
var navigation = require('../navigation/index');

i18next.addResourceBundle('en', 'GroupAccess', {
  'title': 'Members create discussions and manage them. Members can join any discussion open to members. Note: public discussions are open to anyone.',
  'access-title': 'ACCESS',
  'disclaimer-public': 'This discussion is public. Any user can access it.',
  'disclaimer-public-2': 'You can switch this discussion to private mode. Then, only users you authorize will be able to join, participate and access history. Access will be based on invitation and/or password. The current members of this public discussion will remain members once this discussion switched to private. Caution, this action cannot be undone.',
  'allow-users-request': 'Allow users to request access',
  'allow-users-request-false': 'Users will be not be able to ask for an invitation to enter this community',
  'disclaimer': 'Display a message',
  'disclaimer-help': 'Message displayed to all users trying to join',
  'password': 'Set a password',
  'password-disclaimer': 'Users with the password can join without prior invitation.',
  'password-placeholder': 'Enter a password',
  'password-help': 'Between 4 and 255 characters',
  'password-success': 'Password saved',
  'domains': 'Trusted e-mail domain',
  'domains-placeholder': '@example.com',
  'domains-disclaimer': 'Authorize any user having a trusted e-mail to join (e.g. **@college.edu).',
  'delete-domain': 'Remove',
  'delete-domain-title': 'Remove __domain__',
  'delete-domain-disclaimer': 'Users having a __domain__ email will no longer auto-join the community. However members who have joined thanks to a __domain__ email will remain members.'
});

var GroupAccessView = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    data: React.PropTypes.object,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    this.passwordPattern = /(.{4,255})$/i;
    return {
      data: this.props.data,
      setPassword: !!this.props.data.password,
      newDomain: null,
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.data.allowed_domains || [])
    };
  },
  render: function () {
    if (!this.state.data.is_owner && !this.isAdmin) {
      return null;
    }

    return (
      <View style={{ marginTop: 20 }}>
        <ListItem type='title' title={i18next.t('GroupAccess:access-title')} />
        <View style={{ margin: 20 }}>
          <Text style={{ fontFamily: 'Open Sans', fontSize: 14, color: '#394350' }}>{i18next.t('GroupAccess:title')}</Text>
        </View>

        <View style={{ flexWrap: 'wrap', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch' }}>
          <ListItem
            onPress={() => this.onGroupEdit(require('./GroupEditDisclaimer'), _.unescape(this.state.data.disclaimer))}
            text={i18next.t('GroupAccess:disclaimer')}
            type='edit-button'
            action
            first
            autoCapitalize='none'
            value={_.unescape(this.state.data.disclaimer)}
            />

          <ListItem
            text={i18next.t('GroupAccess:allow-users-request')}
            type='switch'
            switchValue={this.state.data.allow_user_request}
            onSwitch={this.saveGroupData.bind(this, {allow_user_request: !this.state.data.allow_user_request})}
            />

          {this._renderPassword()}

          {this._renderTrustedDomains()}
        </View>
      </View>
    );
  },
  onGroupEdit (component, value) {
    navigation.navigate('UserField', {
      component,
      value,
      onSave: (key, val, cb) => {
        let update = {};
        update[key] = val;
        this.saveGroupData(update, cb);
      }
    });
  },
  _renderPassword: function () {
    let passwordField = null;
    if (this.state.setPassword) {
      passwordField = (
        <ListItem
          ref='input'
          onPress={this._savePassword}
          placeholder={i18next.t('GroupAccess:password-placeholder')}
          value={this.state.data.password}
          maxLength={255}
          onChangeText={(password) => this.setState({ data: _.extend(this.state.data, {password: password}) })}
          type='input-button'
          />
      );
    }
    return (
      <View>
        <ListItem type='switch'
                  first
                  last={!!passwordField}
                  text={i18next.t('GroupAccess:password')}
                  switchValue={this.state.setPassword}
                  onSwitch={this.state.setPassword ? this._cleanPassword : () => { this.setState({ setPassword: true }); }}
          />
        {passwordField}
      </View>
    );
  },
  _renderTrustedDomains: function () {
    return (
      <View>
        <Text style={s.listGroupItemSpacing}/>
        <Text style={s.block}>{i18next.t('GroupAccess:domains')}</Text>
        <Text style={s.block}>{i18next.t('GroupAccess:domains-disclaimer')}</Text>

        <ListItem
          type='input-button'
          onPress={this._addDomain}
          placeholder={i18next.t('GroupAccess:domains-placeholder')}
          maxLength={255}
          value={this.state.newDomain}
          onChangeText={(domain) => this.setState({
            newDomain: domain
          })}
          />
        <ListView
          dataSource={this.state.ds}
          scrollEnabled={false}
          renderRow={this._renderTrustedDomain}
          />
      </View>
    );
  },
  _renderTrustedDomain: function (domain, sectionID, rowID, highlightRow) {
    return (
      <ListItem
        key={rowID}
        onPress={this._removeDomain.bind(this, domain)}
        text={domain}
        type='edit-button'
        iconRight='times'
        action
        />
    );
  },
  _addDomain: function () {
    if (!this.state.newDomain) {
      return;
    }
    app.client.groupDomains(this.state.data.group_id, this.state.newDomain, 'add', _.bind(function (response) {
      if (response.err) {
        return alert.show(i18next.t('messages.' + response.err));
      }

      let newData = _.clone(this.state.data);
      newData.allowed_domains.push(this.state.newDomain);
      this.setState({
        data: newData,
        newDomain: null,
        ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(newData.allowed_domains)
      });
    }, this));
  },
  _removeDomain: function (domain) {
    alert.askConfirmation(
      i18next.t('GroupAccess:delete-domain-title', {domain: domain}),
      i18next.t('GroupAccess:delete-domain-disclaimer', {domain: domain}),
      () => app.client.groupDomains(this.state.data.group_id, domain, 'delete', (response) => {
        if (response.err) {
          return alert.show(i18next.t('messages.' + response.err));
        }

        let newData = _.clone(this.state.data);
        newData.allowed_domains = _.filter(this.state.data.allowed_domains, (d) => {
          return d !== domain;
        });
        this.setState({
          data: newData,
          ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(newData.allowed_domains)
        });
      }),
      () => {
      }
    );
  },
  _savePassword: function () {
    if (!this.passwordPattern.test(this.state.data.password)) {
      return alert.show(i18next.t('messages.invalid-password'));
    }

    this.saveGroupData({password: this.state.data.password}, () => {
      alert.show(i18next.t('GroupAccess:password-success'));
      this.setState({
        setPassword: true
      });
    });
  },
  _cleanPassword: function () {
    this.saveGroupData({password: null}, () => {
      this.setState({
        setPassword: false
      });
    });
  },
  saveGroupData (update, callback) {
    app.client.groupUpdate(this.state.data.group_id, update, (response) => {
      if (response.err) {
        alert.show(i18next.t('messages.' + response.err));
        if (callback) {
          return callback(response.err);
        }
        return;
      }

      this.setState({data: _.extend(this.state.data, update)});

      if (callback) {
        callback();
      }
    });
  }
});

module.exports = GroupAccessView;
