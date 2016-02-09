'use strict';

var React = require('react-native');
var app = require('../libs/app');
var {
  StyleSheet,
  View,
  ScrollView
  } = React;

var _ = require('underscore');
var ListItem = require('../components/ListItem');
var LoadingView = require('../components/Loading');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'RoomEditDescription', {
  'placeholder': 'Description',
  'help': '200 characters max.'
});

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
      this.setState({description: _.unescape(response.description), loaded: true});
    });
  },
  render: function () {
    if (!this.state.loaded) {
      return (<LoadingView/>);
    }
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <ListItem
            ref='input'
            onPress= {() => {
              this.props.saveRoomData('description', this.state.description, (err) => {
                if (!err) {
                  this.props.navigator.pop();
                }
              });
            }}
            maxLength={200}
            multiline
            placeholder={i18next.t('RoomEditDescription:placeholder')}
            value={this.state.description}
            onChange={(event) => this.setState({description: event.nativeEvent.text})}
            type='input-button'
            multi
            help={i18next.t('RoomEditDescription:help')}
            />
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f0f0f0'
  }
});

module.exports = RoomEditDescriptionView;

