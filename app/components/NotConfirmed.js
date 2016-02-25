'use strict';

var React = require('react-native');
var alert = require('../libs/alert');
var app = require('../libs/app');
var currentUser = require('../models/current-user');
var i18next = require('../libs/i18next');
var {
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} = React;
i18next.addResourceBundle('en', 'NotConfirmedComponent', {
  "disclaimer": "Verify your account ! Check your mailbox.",
  "send": "Press to re-send an email",
});

var NotConfirmedComponent = React.createClass({
  propTypes: {

  },
  getInitialState () {
    return {
      userConfirmed: currentUser.get('confirmed')
    };
  },
  componentDidMount () {
    currentUser.on('change:confirmed', () => {
      this.setState({userConfirmed: currentUser.get('confirmed')});
    }, this);
  },
  componentWillUnmount () {
    currentUser.off(null, null, this);
  },
  render () {
    if (this.state.userConfirmed) {
      return null;
    }

    return (
      <View style={styles.main}>
        <TouchableHighlight underlayColor='#FF3A7D'
                            onPress={() => this.sendValidationEmail()}
          >
          <View>
            <Text style={styles.text}>{i18next.t('NotConfirmedComponent:disclaimer')}</Text>
            <Text style={styles.text}>{i18next.t('NotConfirmedComponent:send')}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  },
  sendValidationEmail () {
    app.client.userRead(currentUser.get('user_id'), {admin: true}, function (data) {
      if (data.err) {
        return alert.show(i18next.t('messages.' + data.err));
      }

      if (!data.account || !data.account.email) {
        return alert.show(i18next.t('messages.missing-email'));
      }
      app.client.accountEmail(data.account.email, 'validate', (response) => {
        if (response.err) {
          alert.show(i18next.t('messages.' + response.err));
        } else {
          alert.show(i18next.t('messages.validation-email-sent'));
        }
      });
    });
  }
});

var styles = StyleSheet.create({
  main: {
    marginRight: 7,
    marginLeft: 7,
    marginTop: 10,
    backgroundColor: '#FC2063',
    padding: 5
  },
  text: {
    color: '#FFF'
  }
});

module.exports = NotConfirmedComponent;
