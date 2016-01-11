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

class UpdateRoomTopicView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      topic: props.model.get('topic')
    };
  }
  render () {
    return (
      <View style={{backgroundColor: '#f0f0f0'}}>
        <View style={{backgroundColor: '#FFF'}}>
          <Input
            placeholder='change topic'
            onChangeText={(text) => this.setState({topic: text})}
            value={this.state.topic}
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
        this.props.fetchDataParent();
        return this.props.navigator.pop();
      }
      return alert.show(i18next.t('messages.unknownerror'));
    }, this));
  }
}

UpdateRoomTopicView.propTypes = {
  model: React.PropTypes.object,
  fetchDataParent: React.PropTypes.func,
  navigator: React.PropTypes.object
};

module.exports = UpdateRoomTopicView;
