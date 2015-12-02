'use strict';
var React = require('react-native');
var _ = require('underscore');
var s = require('../styles/style');
var navigation = require('../libs/navigation');
var ListGroupItem = require('../components/ListGroupItem');
var LoadingView = require('../components/Loading');
var client = require('../libs/client');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ScrollView
  } = React;

var app = require('../libs/app');
var currentUser = require('../models/mobile-current-user');

class EmailsView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentEmail: '',
      emails: [],
      errors: [],
      loaded: false
    };
  }

  componentDidMount () {
    this.fetchData();
  }

  fetchData () {
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

  render () {
    if (!this.state.loaded) {
      return (
        <LoadingView />
      );
    }

    return (
      <ScrollView style={styles.main}>
        <View style={s.listGroup}>
          <Text style={s.listGroupTitle}>CURRENT EMAIL</Text>
          <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountEmail(this.state.currentEmail, this.fetchData.bind(this)))}
                         text={this.state.currentEmail}
                         type='button'
                         action='true'
                         first='true'
            />
          <Text style={s.listGroupItemSpacing}></Text>
          {this._renderAdditionalEmails()}
        </View>
        <TouchableHighlight onPress= {() => this.props.navigator.push(navigation.getMyAccountEmailsAdd(this.fetchData.bind(this)))}
                            style={[s.button, s.buttonPink, s.marginTop10]}
                            underlayColor='#E4396D'
          >
          <View style={s.buttonLabel}>
            <Text style={s.buttonTextLight}>ADD EMAIL</Text>
          </View>
        </TouchableHighlight>
      </ScrollView>
    );
  }

  _renderAdditionalEmails () {
    var listRow = [];
    if (this.state.emails.length < 2) {
      return (<View></View>);
    }
    _.each(this.state.emails, (e, i) => {
      if (e.main) {
        return;
      }
      listRow.push(
        <ListGroupItem onPress={() => this.props.navigator.push(navigation.getMyAccountEmailEdit(e, this.fetchData.bind(this)))}
                       text={e.email}
                       type='button'
                       action='true'
                       icon={(e.confirmed) ? 'fontawesome|check' : 'fontawesome|times'}
                       first={(i === 0 || (i === 1 && this.state.emails[0].main))}
          />
      );
    });
    return (
      <View>
        <Text style={s.listGroupTitle}>ADDITIONAL EMAILS</Text>
        <View>
          {listRow}
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0',
    paddingTop: 20
  }
});

module.exports = EmailsView;
