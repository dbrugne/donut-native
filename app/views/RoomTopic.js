'use strict';

var React = require('react-native');
var {
  View
} = React;

var _ = require('underscore');
var i18next = require('../libs/i18next');
var app = require('../libs/app');
var alert = require('../libs/alert');
var ListItem = require('../components/ListItem');

var UpdateRoomTopicView = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    navigator: React.PropTypes.object,
    fetchDataParent: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      topic: this.props.model.get('topic')
    };
  },
  render: function () {
    return (
      <View style={{backgroundColor: '#f0f0f0'}}>
        <ListItem
          ref='input'
          onPress= {() => this.onSendTopic()}
          placeholder='change topic'
          value={this.state.topic}
          onChange={(event) => this.setState({topic: event.nativeEvent.text})}
          type='input-button'
          autoFocus
          />
      </View>
    );
  },
  onSendTopic: function () {
    if (!this.props.model) {
      return;
    }
    app.client.roomTopic(this.props.model.get('id'), this.state.topic, _.bind(function (response) {
      if (response.success) {
        this.props.fetchDataParent();
        return this.props.navigator.pop();
      }
      return alert.show(i18next.t('messages.unknownerror'));
    }, this));
  }
});

UpdateRoomTopicView.propTypes = {
  model: React.PropTypes.object,
  fetchDataParent: React.PropTypes.func,
  navigator: React.PropTypes.object
};

module.exports = UpdateRoomTopicView;
