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
i18next.addResourceBundle('en', 'RoomEditDisclaimer', {
  'placeholder': 'Disclaimer',
  'help': 'Maximum 200 characters'
});

var RoomEditDisclaimerView = React.createClass({
  propTypes: {
    roomId: React.PropTypes.string,
    navigator: React.PropTypes.object,
    saveRoomData: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      disclaimer: '',
      loaded: false
    };
  },
  componentDidMount: function () {
    app.client.roomRead(this.props.roomId, {more: true}, (response) => {
      if (response.err) {
        return;
      }
      this.setState({disclaimer: _.unescape(response.disclaimer), loaded: true});
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
            onPress={this.onPress}
            maxLength={200}
            multiline
            placeholder={i18next.t('RoomEditDisclaimer:placeholder')}
            value={this.state.disclaimer}
            onChange={(event) => this.setState({disclaimer: event.nativeEvent.text})}
            type='input-button'
            multi
            help={i18next.t('RoomEditDisclaimer:help')}
          />
        </ScrollView>
      </View>
    );
  },
  onPress() {
    this.props.saveRoomData({disclaimer: this.state.disclaimer}, (err) => {
      if (!err) {
        this.props.navigator.pop();
      }
    });
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f0f0f0'
  }
});

module.exports = RoomEditDisclaimerView;

