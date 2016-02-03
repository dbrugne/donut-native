'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Component,
  ScrollView,
  StyleSheet
  } = React;

var s = require('../styles/style');
var alert = require('../libs/alert');
var app = require('../libs/app');
var ListItem = require('../components/ListItem');
var GroupHeader = require('./GroupHeader');

var i18next = require('../libs/i18next');

class GroupAskMembershipRequest extends Component {
  constructor (props) {
    super(props);
    this.state = {
      motivations: ''
    };
  }

  render () {
    let content = null;
    if (this.props.isAllowedPending) {
      content = (
        <Text style={[s.block]}>{i18next.t('group.allowed-pending')}</Text>
      );
    } else {
      content = (
        <View style={{alignSelf: 'stretch'}}>
          <Text style={[s.block]}>{i18next.t('group.info-request')}</Text>

          <ListItem
            onChangeText={(text) => this.setState({motivations: text})}
            multiline
            placeholder={i18next.t('group.placeholder-request')}
            first
            type='input'
            />

          <Text style={s.listGroupItemSpacing} />
          <ListItem
            onPress={this.onSendRequest.bind(this)}
            last
            action
            type='button'
            text={i18next.t('group.send')}
            />

        </View>
      );
    }

    if (this.props.scroll) {
      return (
        <ScrollView style={styles.main}>
          <GroupHeader {...this.props} />
          <View style={styles.container}>
            {content}
          </View>
        </ScrollView>
      );
    }

    return content;
  }

  onSendRequest () {
    app.client.groupRequest(this.props.id, this.state.motivations, function (response) {
      if (response.success) {
        return alert.show(i18next.t('group.success-request'));
      } else {
        if (response.err === 'allow-pending') {
          return alert.show(i18next.t('group.allow-pending'));
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

module.exports = GroupAskMembershipRequest;
