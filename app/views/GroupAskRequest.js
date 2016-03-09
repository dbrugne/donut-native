'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput
} = React;

var alert = require('../libs/alert');
var app = require('../libs/app');
var GroupHeader = require('./GroupHeader');
var Disclaimer = require('../components/Disclaimer');
var Button = require('../components/Button');
var KeyboardAwareComponent = require('../components/KeyboardAware');
var i18next = require('../libs/i18next');

var GroupAskRequest = React.createClass({
  propTypes: {
    data: React.PropTypes.any,
    navigator: React.PropTypes.object,
    isAllowedPending: React.PropTypes.bool,
    scroll: React.PropTypes.bool
  },
  getInitialState: function () {
    return {
      data: this.props.data,
      motivations: '',
      loading: false
    };
  },
  render: function () {
    let content = null;
    if (this.props.isAllowedPending) {
      content = (
          <Text style={{ margin: 20, fontFamily: 'Open Sans', fontSize: 14, color: '#F15261' }}>{i18next.t('group.allowed-pending')}</Text>
      );
    } else {
      content = (
        <View
          style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column', alignItems: 'center', paddingVertical: 20 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 20, alignSelf: 'stretch' }}>
            <View style={{width: 1, height: 40, backgroundColor: '#FC2063'}}/>
            <TextInput autoCapitalize='none'
                       ref='input'
                       placeholder={i18next.t('group.placeholder-request')}
                       onChangeText={(text) => this.setState({motivations: text})}
                       value={this.state.request}
                       style={{ flex: 1, fontFamily: 'Open Sans', fontSize: 14, fontWeight: '400', color: '#333', height: 40, paddingVertical: 8, paddingHorizontal: 10 }}
              />
          </View>
          <View style={{ flex: 1 }}/>
          <View style={{ height: 1, alignSelf: 'stretch', backgroundColor: '#E7ECF3', marginBottom: 10 }}/>
          <Text
            style={{ alignSelf: 'stretch', marginHorizontal: 20, fontFamily: 'Open Sans', fontSize: 12, color: '#AFBAC8', fontStyle: 'italic' }}>{i18next.t('group.info-request')}</Text>
          <Button type='gray'
                  onPress={this.onSendRequest}
                  label={i18next.t('group.send')}
                  loading={this.state.loading}
                  style={{ alignSelf: 'stretch', marginTop: 10, marginHorizontal: 20 }}
            />
        </View>
      );
    }

    if (this.props.scroll) {
      return (
        <KeyboardAwareComponent
          shouldShow={() => { return true; }}
          shouldHide={() => { return true; }}
          >
          <GroupHeader data={this.state.data} small/>
          <View style={{alignSelf: 'stretch'}}>
            <Disclaimer {...this.props} />
            {content}
          </View>
        </KeyboardAwareComponent>
      );
    }

    return content;
  },
  onSendRequest: function () {
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
});

module.exports = GroupAskRequest;
