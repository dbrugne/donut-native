'use strict';

var React = require('react-native');
var {
  ScrollView
  } = React;

var ListItem = require('../components/ListItem');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'RoomEditWebsite', {
  'placeholder': 'Website'
}, true, true);

var RoomEditWebsiteView = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    navigator: React.PropTypes.object,
    saveRoomData: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      website: this.props.model.get('website')
    };
  },
  render: function () {
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
