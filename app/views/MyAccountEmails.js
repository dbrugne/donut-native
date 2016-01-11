'use strict';

var _ = require('underscore');
var React = require('react-native');
var currentUser = require('../models/current-user');
var LoadingView = require('../components/Loading');
var ListItem = require('../components/ListItem');
var app = require('../libs/app');
var navigation = require('../navigation/index');
var s = require('../styles/style');
var {
  Component,
  Text,
  View,
  ScrollView
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'add-email': 'Add email',
  'current-email': 'CURRENT EMAIL',
  'missing-email': 'You do not have entered a main email for this account.',
  'additional-emails': 'ADDITIONAL EMAILS.'
});

class EmailsView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentEmail: '',
      emails: [],
      loaded: false
    };
  }

  componentDidMount () {
    this.fetchData();
  }

  fetchData () {
    app.client.userRead(currentUser.get('user_id'), {admin: true}, (response) => {
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

  render () {
    if (!this.state.loaded) {
      return (
        <LoadingView />
      );
    }

    return (
      <ScrollView
        style={{ flexDirection: 'column', flexWrap: 'wrap', backgroundColor: '#f0f0f0', paddingTop: 20, flex: 1 }}>
        <View style={s.listGroup}>

          {this._renderMainEmail()}

          {this._renderAdditionalEmails()}

          <ListItem
            onPress={() => navigation.navigate('MyAccountEmailsAdd', this.fetchData.bind(this))}
            text={i18next.t('local:add-email')}
            type='button'
            action='true'
            first='true'
            />

        </View>
        <View style={s.filler} />
      </ScrollView>
    );
  }

  _renderMainEmail () {
    if (this.state.currentEmail) {
      return (
        <View>
          <ListItem
            onPress={() => navigation.navigate('MyAccountEmail', this.state.currentEmail, this.fetchData.bind(this))}
            text={this.state.currentEmail}
            type='button'
            action='true'
            first='true'
            title={i18next.t('local:current-email')}
            />
          <Text style={s.listGroupItemSpacing} />
        </View>
      );
    }

    return (
      <View>
        <Text style={s.listGroupTitle}>{i18next.t('local:missing-email')}</Text>
        <Text style={s.listGroupItemSpacing} />
      </View>
    );
  }

  _renderAdditionalEmails () {
    var listRow = [];
    var numberOfAdditionalEmails = 0;

    _.each(this.state.emails, (e, i) => {
      if (e.main) {
        return;
      }
      numberOfAdditionalEmails++;
      listRow.push(
        <ListItem
          key={e.email}
          onPress={() => navigation.navigate('MyAccountEmailEdit', e, this.fetchData.bind(this))}
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
        <Text style={s.listGroupTitle}>{i18next.t('local:additional-emails')}</Text>
        {listRow}
        <Text style={s.listGroupItemSpacing} />
      </View>
    );
  }
}

module.exports = EmailsView;
