'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  ScrollView
  } = React;

var _ = require('underscore');
var i18next = require('../libs/i18next');
var app = require('../libs/app');
var alert = require('../libs/alert');
var ListItem = require('../components/ListItem');
var common = require('@dbrugne/donut-common/mobile');
var emojione = require('emojione');

i18next.addResourceBundle('en', 'RoomTopic', {
  'help': 'Maximum 512 characters'
});

var UpdateRoomTopicView = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    navigator: React.PropTypes.object,
    fetchDataParent: React.PropTypes.func
  },
  getInitialState: function () {
    var topic = this.props.model.get('topic');
    if (topic) {
      topic = common.markup.toText(topic);
      topic = emojione.shortnameToUnicode(topic);
    }
    return {
      topic: topic
    };
  },
  render: function () {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <ListItem
            ref='input'
            onPress= {() => this.onSendTopic()}
            placeholder='change topic'
            value={this.state.topic}
            onChange={(event) => this.setState({topic: event.nativeEvent.text})}
            type='input-button'
            autoFocus
            help={i18next.t('RoomTopic:help')}
            />
        </ScrollView>
      </View>
    );
  },
  onSendTopic: function () {
    if (!this.props.model) {
      return;
    }

    var topic = this.state.topic;
    if (topic) {
      topic = emojione.toShort(topic);
    }
    app.client.roomTopic(this.props.model.get('id'), topic, _.bind(function (response) {
      if (response.success) {
        this.props.fetchDataParent();
        return this.props.navigator.pop();
      }
      return alert.show(i18next.t('messages.unknownerror'));
    }, this));
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f0f0f0'
  }
});

module.exports = UpdateRoomTopicView;
