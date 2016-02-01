'use strict';

var React = require('react-native');
var {
  ScrollView
  } = React;

var ListItem = require('../components/ListItem');
var app = require('../libs/app');
var LoadingView = require('../components/Loading');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'RoomEditWebsite', {
  'placeholder': 'Website'
}, true, true);

var RoomEditWebsiteView = React.createClass({
  propTypes: {
    roomId: React.PropTypes.string,
    navigator: React.PropTypes.object,
    saveRoomData: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      website: '',
      loaded: false
    };
  },
  componentDidMount: function () {
    app.client.roomRead(this.props.roomId, {more: true}, (response) => {
      if (response.err) {
        return;
      }
      if (response.website && response.website.title) {
        this.setState({website: response.website.title});
      }
      this.setState({loaded: true});
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
            this.props.saveRoomData('website', this.state.website);
            this.props.navigator.pop();
          }}
          placeholder={i18next.t('RoomEditWebsite:placeholder')}
          value={this.state.website}
          onChange={(event) => this.setState({website: event.nativeEvent.text})}
          type='input-button'
          />
      </ScrollView>
    );
  }
});

module.exports = RoomEditWebsiteView;
