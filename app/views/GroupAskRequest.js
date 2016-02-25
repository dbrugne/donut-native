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
var KeyboardAwareComponent = require('../components/KeyboardAware');

var i18next = require('../libs/i18next');

class GroupAskMembershipRequest extends Component {
  constructor (props) {
    super(props);
    this.state = {
      data: props.data,
      motivations: '',
      loading: false
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
            loading={this.state.loading}
            type='button'
            text={i18next.t('group.send')}
            />

        </View>
      );
    }

    if (this.props.scroll) {
      return (
        <KeyboardAwareComponent
          shouldShow={() => { return true }}
          shouldHide={() => { return true }}
          >
          <ScrollView style={styles.main}>
            <GroupHeader  model={this.state.data}/>
            <View style={styles.container}>
              {content}
            </View>
          </ScrollView>
        </KeyboardAwareComponent>
      );
    }

    return content;
  }

  onSendRequest () {
    this.setState({loading: true});
    app.client.groupRequest(this.state.data.group_id, this.state.motivations, (response) => {
      this.setState({loading: false});
      if (response.success) {
        alert.show(i18next.t('group.success-request'));
        app.trigger('refreshGroup', true);
        this.props.navigator.popToTop();
      } else {
        if (response.err === 'allow-pending' || response.err === 'message-wrong-format' || response.err === 'not-confirmed') {
          return alert.show(i18next.t('group.' + response.err));
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
