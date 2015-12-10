'use strict';

var _ = require('underscore');
var React = require('react-native');

var currentUser = require('../models/mobile-current-user');

var LoadingView = require('../components/Loading');
var ListGroupItem = require('../components/ListGroupItem');

var app = require('../libs/app');
var navigation = require('../libs/navigation');
var client = require('../libs/client');

var s = require('../styles/style');

var {
  Component,
  Text,
  View,
  ScrollView
  } = React;

var i18next = require('i18next-client');
var locales = require('../locales/en/translation.json'); // global locales
var _localRes = { // current page locales
  'add-email': 'Add email',
  'current-email': 'CURRENT EMAIL',
  'missing-email': 'You do not have entered a main email for this account.',
  'additional-emails': 'Additional emails.'
};

i18next.init({
  fallbackLng: 'en',
  lng: 'en',
  debug: true,
  resStore: {
    en: {translation: _.extend(locales, _localRes)}
  }
});

class EmailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEmail: '',
      emails: [],
      loaded: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    client.userRead(currentUser.get('user_id'), {admin: true}, (response) => {
      this.setState({
        loaded: true,
        currentEmail: (response.account && response.account.email)
          ? response.account.email
          : '',
        emails: (response.account && response.account.emails)
          ? response.account.emails
          : []
      });
    });
  }

  render() {
    if (!this.state.loaded) {
      return (
        <LoadingView />
      );
    }

    return (
      <ScrollView
        style={{ flexDirection: 'column', flexWrap: 'wrap', backgroundColor: '#f0f0f0', paddingTop: 20, flex:1 }}>
        <View style={s.listGroup}>

          {this._renderMainEmail()}

          {this._renderAdditionalEmails()}

          <ListGroupItem
            onPress={() => this.props.navigator.push(navigation.getMyAccountEmailsAdd(this.fetchData.bind(this)))}
            text={i18next.t('add-email')}
            type='button'
            action='true'
            first='true'
            />

        </View>
        <View style={s.filler}></View>
      </ScrollView>
    );
  }

  _renderMainEmail() {
    if (this.state.currentEmail) {
      return (
        <View>
          <Text style={s.listGroupTitle}>{i18next.t('current-email')}</Text>
          <ListGroupItem
            onPress={() => this.props.navigator.push(navigation.getMyAccountEmail(this.state.currentEmail, this.fetchData.bind(this)))}
            text={this.state.currentEmail}
            type='button'
            action='true'
            first='true'
            />
          <Text style={s.listGroupItemSpacing}></Text>
        </View>
      );
    }

    return (
      <View>
        <Text style={s.listGroupTitle}>{i18next.t('missing-email')}</Text>
        <Text style={s.listGroupItemSpacing}></Text>
      </View>
    );
  }

  _renderAdditionalEmails() {
    var listRow = [];
    var numberOfAdditionalEmails = 0;

    _.each(this.state.emails, (e, i) => {
      if (e.main) {
        return;
      }
      numberOfAdditionalEmails++;
      listRow.push(
        <ListGroupItem
          onPress={() => this.props.navigator.push(navigation.getMyAccountEmailEdit(e, this.fetchData.bind(this)))}
          text={e.email}
          type='button'
          action='true'
          icon={(e.confirmed) ? 'fontawesome|check' : 'fontawesome|times'}
          first={(i === 0 || (i === 1 && this.state.emails[0].main))}
          />
      );
    });

    if (numberOfAdditionalEmails === 0) {
      return (<View />);
    }
    return (
      <View>
        <Text style={s.listGroupTitle}>{i18next.t('additional-emails')}</Text>
        <View>
          {listRow}
          <Text style={s.listGroupItemSpacing}></Text>
        </View>
      </View>
    );
  }
}

module.exports = EmailsView;
