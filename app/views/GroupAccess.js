'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ScrollView,
  ListView
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
  'password-success': 'The password has been successfully saved',
  'domains': 'Trusted e-mail domain',
  'domains-placeholder': '@example.com',
  'domains-disclaimer': 'Authorize any user having a trusted e-mail to join (e.g. **@college.edu).',
  'delete-domain': 'Remove',
  'delete-domain-title': 'Remove __domain__',
  'delete-domain-disclaimer': 'You are about to delete the email domain __domain__ from the allowed domains, a new user with the given email could no more join this community without previous invitation, old user with this email domain will remain members'
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
        setPassword: !!data.password,
        newDomain: null,
        ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(data.allowed_domains)
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

          {this._renderTrustedDomains()}
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
  _renderTrustedDomains: function() {
    return (
      <View>
        <Text style={s.listGroupItemSpacing}/>
        <Text style={s.block}>i18next.t('GroupAccess:domains')}</Text>
        <Text style={s.block}>{i18next.t('GroupAccess:domains-disclaimer')}</Text>

        <Text style={s.listGroupItemSpacing}/>
        <ListItem
          type='input-button'
          onPress= {this._addDomain}
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
  _renderTrustedDomain: function(domain, sectionID, rowID, highlightRow) {
    return (
      <ListItem
        key={rowID}
        onPress={this._removeDomain.bind(this, domain)}
        text={i18next.t('GroupAccess:delete-domain')}
        type='edit-button'
        iconRight='times'
        warning
        action
        value={domain}
      />
    );
  },
  _addDomain: function() {
    if (!this.state.newDomain) {
      return;
    }
    app.client.groupDomains(this.state.data.group_id, this.state.newDomain, 'add', _.bind(function (response) {
      if (response.err) {
        return alert.show(i18next.t('message.' + response.err));
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
  _removeDomain: function(domain) {
    alert.askConfirmation(
      i18next.t('GroupAccess:delete-domain-title', {domain: domain}),
      i18next.t('GroupAccess:delete-domain-disclaimer', {domain: domain}),
      () => app.client.groupDomains(this.state.data.group_id, domain, 'delete', (response) => {
        if (response.err) {
          return alert.show(i18next.t('message.' + response.err));
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
      () => {}
    );
  },
  _savePassword: function() {
    if (!this.passwordPattern.test(this.state.data.password)) {
      return alert.show(i18next.t('message.'+response.err));
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
    app.client.groupDomains(this.state.data.group_id, update, (response) => {
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
