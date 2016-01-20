'use strict';

var React = require('react-native');
var {
  ScrollView
  } = React;

var ListItem = require('../components/ListItem');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'RoomEditDescription', {
  'placeholder': 'Description'
}, true, true);

var RoomEditDescriptionView = React.createClass({
  propTypes: {
    description: React.PropTypes.string,
    navigator: React.PropTypes.object,
    saveRoomData: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      description: this.props.description
    };
  },
  render: function () {
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

