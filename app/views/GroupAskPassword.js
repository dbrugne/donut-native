'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Component,
  ScrollView,
  StyleSheet
  } = React;

var alert = require('../libs/alert');
var app = require('../libs/app');
var ListItem = require('../components/ListItem');
var s = require('../styles/style');

var i18next = require('../libs/i18next');

class GroupAskMembershipPassword extends Component {
  constructor (props) {
    super(props);
    this.state = {
      password: ''
    };
  }

  render () {
    let content = (
      <View style={{flex: 1, alignSelf: 'stretch'}}>

        <Text style={s.listGroupItemSpacing} />
        <ListItem
          title={i18next.t('group.info-password')}
          onChangeText={(text) => this.setState({password: text})}
          placeholder={i18next.t('group.placeholder-password')}
          first
          secureTextEntry
          type='input'
          />

        <Text style={s.listGroupItemSpacing} />
        <ListItem
          onPress={this.onSendPassword.bind(this)}
          last
          action
          type='button'
          text={i18next.t('group.send')}
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

  onSendPassword () {
    if (!this.state.password) {
      return alert.show(i18next.t('group.wrong-password'));
    }
    app.client.groupBecomeMember(this.props.id, this.state.password, (response) => {
      if (response.success) {
        this.props.navigator.popToTop();
        app.trigger('refreshGroup');
      } else {
        if (response.err === 'wrong-password') {
          return alert.show(i18next.t('group.wrong-password'));
        }
        return alert.show(i18next.t('messages.' + response.err));
      }
    });
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

module.exports = GroupAskMembershipPassword;
