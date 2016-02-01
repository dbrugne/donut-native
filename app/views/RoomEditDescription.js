'use strict';

var React = require('react-native');
var app = require('../libs/app');
var {
  ScrollView
  } = React;

var ListItem = require('../components/ListItem');
var LoadingView = require('../components/Loading');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'RoomEditDescription', {
  'placeholder': 'Description'
}, true, true);

var RoomEditDescriptionView = React.createClass({
  propTypes: {
    roomId: React.PropTypes.string,
    navigator: React.PropTypes.object,
    saveRoomData: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      description: '',
      loaded: false
    };
  },
  componentDidMount: function () {
    app.client.roomRead(this.props.roomId, {more: true}, (response) => {
      if (response.err) {
        return;
      }
      this.setState({description: response.description, loaded: true});
    });
  },
  render: function () {
    if (!this.state.loaded) {
      return (<LoadingView/>);
    }
    return (
      <ScrollView style={{flex: 1}}>
        <ListItem
          ref='input'
          onPress= {() => {
            this.props.saveRoomData('description', this.state.description);
            this.props.navigator.pop();
          }}
          placeholder={i18next.t('RoomEditDescription:placeholder')}
          value={this.state.description}
          onChange={(event) => this.setState({description: event.nativeEvent.text})}
          type='input-button'
          multi
          />
      </ScrollView>
    );
  }
});

module.exports = RoomEditDescriptionView;

