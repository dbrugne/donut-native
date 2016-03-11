'use strict';

var _ = require('underscore');
var React = require('react-native');
var currentUser = require('../models/current-user');
var LoadingView = require('../components/Loading');
var ListItem = require('../components/ListItem');
var Button = require('../components/Button');
var app = require('../libs/app');
var navigation = require('../navigation/index');
var s = require('../styles/style');
var alert = require('../libs/alert');

var {
  Text,
  View,
  ScrollView
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'myAccountEmails', {
  'add-email': 'ADD EMAIL',
  'missing-email': 'You do not have selected a main email for this account.',
  'main-email': 'MAIN EMAIL',
  'additional-emails': 'ADDITIONAL EMAILS',
  'additional-disclaimer': 'Here are your non validated emails. Before you can select one as a main email, you need to check tour inbox and click on the corresponding validation link',
  'select': 'Select below your main email to receive your notifications'
});

var MyAccountEmailsView = React.createClass({
  getInitialState: function () {
    return {
      currentEmail: '',
      emails: [],
      loaded: false
    };
  },
  componentDidMount () {
    this.fetchData();
    app.client.on('user:confirmed', this.fetchData); // will redraw current page each time an email is validated
  },
  componentWillUnmount () {
    app.client.off(null, null, this);
  },
  fetchData () {
    app.client.userRead(currentUser.get('user_id'), {admin: true}, (response) => {
      let currentEmail = response.account && response.account.email ? response.account.email : null;
      // only keep confirmed emails
      let confirmed = response.account && response.account.emails ? _.filter(response.account.emails, (email) => {
        return email.confirmed;
      }) : [];
      // only keep pending emails
      let pending = response.account && response.account.emails ? _.filter(response.account.emails, (email) => {
        return !email.confirmed;
      }) : [];
      this.setState({
        loaded: true,
        currentEmail,
        confirmed,
        pending
      });
    });
  },
  render () {
    if (!this.state.loaded) {
      return (
        <LoadingView />
      );
    }

    return (
      <ScrollView style={{ flexDirection: 'column', flexWrap: 'wrap' }}>
        <View style={{ marginVertical: 20 }}>
          <Text style={{ marginHorizontal: 20, marginBottom: 20, fontFamily: 'Open Sans', fontSize: 14, color: '#394350' }}>{i18next.t('myAccountEmails:select')}</Text>
          {this._renderConfirmed()}
          {this._renderPending()}

          <Button
            onPress={() => navigation.navigate('MyAccountEmailsAdd', this.fetchData)}
            label={i18next.t('myAccountEmails:add-email')}
            type='gray'
            action
            first
            style={{ marginTop: 20, marginHorizontal: 20 }}
            />

        </View>
        <View style={s.filler}/>
      </ScrollView>
    );
  },
  _renderConfirmed () {
    if (!this.state.currentEmail) {
      return (
        <View>
          <Text style={{ marginHorizontal: 20, marginBottom: 20, fontFamily: 'Open Sans', fontSize: 14, color: '#394350' }}>{i18next.t('myAccountEmails:missing-email')}</Text>
        </View>
      );
    }

    return (
      <View>
        {_.map(this.state.confirmed, (item, index) => {
          return (
            <ListItem text={item.email}
                      key={'email-' + index}
                      type='switch'
                      title={index === 0 ? i18next.t('myAccountEmails:main-email') : '' }
                      first={index === 0}
                      last={index === (this.state.confirmed.length - 1)}
                      onSwitch={this._changeMainEmail.bind(this, item)}
                      switchValue={item.email === this.state.currentEmail}
              />
          );
        })}
      </View>
    );
  },
  _renderPending () {
    if (this.state.pending.length === 0) {
      return null;
    }

    return (
      <View style={{ marginTop: 40 }}>
        <Text style={{ marginHorizontal: 20, marginBottom: 20, fontFamily: 'Open Sans', fontSize: 14, color: '#394350' }}>{i18next.t('myAccountEmails:additional-disclaimer')}</Text>
        {_.map(this.state.pending, (item, index) => {
          return (
            <ListItem text={item.email}
                      key={'email-pending-' + index}
                      onPress={() => navigation.navigate('MyAccountEmailEdit', item, this.fetchData)}
                      type='button'
                      action
                      title={index === 0 ? i18next.t('myAccountEmails:additional-emails') : '' }
                      first={index === 0}
                      last={index === (this.state.pending.length - 1)}
              />
          );
        })}
      </View>
    );
  },
  _changeMainEmail: function (item) {
    // Trying to remove main email
    if (this.state.currentEmail === item.email) {
      return null;
    }

    app.client.accountEmail(item.email, 'main', (response) => {
      if (response.err) {
        alert.show(response.err);
      }
      this.setState({
        currentEmail: item.email
      });
    });
  }
});

module.exports = MyAccountEmailsView;
