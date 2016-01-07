'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Component,
  ListView,
  ScrollView,
  StyleSheet
  } = React;

var s = require('../styles/style');
var _ = require('underscore');
var app = require('../libs/app');
var alert = require('../libs/alert');
var ListItem = require('../elements/ListItem');

var i18next = require('../libs/i18next');

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
    let content = (
      <View style={{flex: 1, alignSelf: 'stretch'}}>

        <Text style={[s.block]}>{i18next.t('group.info-email')}</Text>

        <ListItem
          onChangeText={(text) => this.setState({email: text})}
          placeholder={i18next.t('group.email')}
          first
          title={i18next.t('group.email')}
          type='input'
          keyboardType='email-address'
          />

        <Text style={s.listGroupItemSpacing}/>
        <Text style={s.listGroupTitle}>{i18next.t('group.domains')}</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderElement.bind(this)}
          />

        <Text style={s.listGroupItemSpacing}/>
        <ListItem
          onPress={this.onAddEmail.bind(this)}
          last
          action
          type='button'
          text={i18next.t('group.add-email')}
          />

      </View>
    );

    if (this.props.scroll) {
      return (
        <ScrollView style={styles.main}>
          <View style={styles.container}>
            {content}
          </View>
        </ScrollView>
      );
    }

    return content;
  }

  renderElement (element) {
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
      return alert.show(i18next.t('messages.unknownerror'));
    }
    if (!this.state.email) {
      return alert.show(i18next.t('group.wrong-format-email'));
    }
    var mail = this.state.email + this.select;
    app.client.accountEmail(mail, 'add', _.bind(function (response) {
      if (response.success) {
        return alert.show(i18next.t('group.success-email'));
      } else {
        if (response.err === 'mail-already-exist') {
          return alert.show(i18next.t('group.mail-already-exist'));
        }
        if (response.err === 'wrong-format') {
          return alert.show(i18next.t('group.wrong-format-email'));
        }
        return alert.show(i18next.t('messages.' + response.err));
      }
    }, this));
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = GroupAskMembershipEmail;
