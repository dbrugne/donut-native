'use strict';

var React = require('react-native');
var {
  Component,
  View
} = React;

var _ = require('underscore');
var Input = require('../components/Input');
var Button = require('../components/Button');
var i18next = require('../libs/i18next');
var app = require('../libs/app');
var alert = require('../libs/alert');
var ConnectionState = require('../components/ConnectionState');

class UpdateRoomTopicView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      topic: ''
    };
  }
  render () {
    return (
      <View style={{backgroundColor: '#f0f0f0'}}>
        <ConnectionState/>
        <View style={{backgroundColor: '#FFF'}}>
          <Input
            placeholder='change topic'
            onChangeText={(text) => this.setState({topic: text})}
            value={this.props.model.get('topic')}
          />
        </View>
        <Button onPress={this.onSendTopic.bind(this)}
                type='green'
                label={i18next.t('send')} />
      </View>
    );
  }
  onSendTopic () {
    if (!this.props.model) {
      return;
    }
    app.client.roomTopic(this.props.model.get('id'), this.state.topic, _.bind(function (response) {
      if (response.success) {
        return alert.show('success');
      }
      return alert.show(i18next.t('messages.unknownerror'));
    },this));
  }
}

module.exports = UpdateRoomTopicView;