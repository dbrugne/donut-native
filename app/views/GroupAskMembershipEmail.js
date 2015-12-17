'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Component,
  ListView,
  StyleSheet
} = React;

var _ = require('underscore');
var Input = require('../elements/Input');
var Button = require('../elements/Button');
var client = require('../libs/client');
var alert = require('../libs/alert');
var ListItem = require('../elements/ListItem');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'membershipEmail', {
  'info': 'I have an authorized e-mail',
  'email': 'e-mail',
  'domains': 'domains',
  'send': 'send',
  'unknown-error': 'Unknown error, please retry later',
  'wrong-format': 'Mail address is not valid',
  'mail-already-exist': 'This mail address is already used',
  'success': 'The email has been successfully added to your account. You will receive a verification e-mail.'
});

class GroupAskMembershipEmail extends Component {
  constructor (props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.select = '';
    this.domains = this.getDomains();
    this.state = {
      email: '',
      dataSource: ds.cloneWithRows(this.domains)
    };
  }
  render () {
    return (
      <View style={styles.main}>
        <View>
          <Text style={{fontSize: 20}}>
            {i18next.t('membershipEmail:info')}
          </Text>
          <Text style={styles.label}>
            {i18next.t('membershipEmail:email')}
          </Text>
          <View style={{backgroundColor: '#FFF'}}>
            <Input
              placeholder={i18next.t('membershipEmail:email')}
              onChangeText={(text) => this.setState({email: text})}
              />
          </View>
          <Text style={styles.label}>
            {i18next.t('membershipEmail:domains')}
          </Text>
        </View>
        <View style={styles.elementContainer}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderElement.bind(this)}
            />
        </View>
        <Button onPress={this.onAddEmail.bind(this)}
                type='green'
                label={i18next.t('membershipEmail:send')} />
      </View>
    );
  }
  renderElement(element) {
    return (
      <ListItem text={element.name}
                type='switch'
                onSwitch={this.updateElement.bind(this, element.name)}
                switchValue={element.isSelect}
        />
    );
  }
  updateElement (nameDomain) {
    if (this.select === nameDomain) {
      return;
    }
    _.each(this.domains, _.bind(function (domain) {
      if (domain.name === this.select) {
       domain.isSelect = false;
      }
      domain.isSelect = (domain.name === nameDomain);
    }, this));
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      dataSource: ds.cloneWithRows(this.domains)
    });
    this.select = nameDomain;
    this.render();
  }
  getDomains () {
    if (!this.props.domains) {
      return null;
    }
    var listDomains = [];
    _.each(this.props.domains, _.bind(function (nomDomain, index) {
      var domain = {
        name: nomDomain,
        isSelect: (index === 0)
      };
      if (index === 0) {
        this.select = nomDomain;
      }
      listDomains.push(domain);
    }, this));
    return listDomains;
  }
  onAddEmail () {
    if (!this.select || _.indexOf(this.props.domains, this.select) === -1) {
      return alert.show(i18next.t('membershipEmail:unknown-error'));
    }
    if (!this.state.email) {
      return alert.show(i18next.t('membershipEmail:wrong-format'));
    }
    var mail = this.state.email + this.select;
    client.accountEmail(mail, 'add', _.bind(function (response) {
      if (response.success) {
        return alert.show(i18next.t('membershipEmail:success'));
      } else {
        if (response.err === 'mail-already-exist') {
          return alert.show(i18next.t('membershipEmail:mail-already-exist'));
        }
        if (response.err === 'wrong-format') {
          return alert.show(i18next.t('membershipEmail:wrong-format'));
        }
        return alert.show(i18next.t('membershipEmail:unknown-error'));
      }
    }, this));
  }
}

var styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#f0f0f0'
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  elementContainer: {
    flex: 1,
    flexDirection: 'column'
  }
});

module.exports = GroupAskMembershipEmail;
