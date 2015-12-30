'use strict';

var React = require('react-native');
var {
  Image,
  ListView,
  Component,
  ActivityIndicatorIOS
} = React;

var _ = require('underscore');
var app = require('./../libs/app');
var navigation = require('../libs/navigation');
var SearchResult = require('../elements/SearchResult');
var LoadingView = require('../elements/Loading');

class HomeView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loaded: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return (row1 !== row2);
        }
      })
    };
  }
  componentDidMount () {
    app.on('readyToRoute', this.onWelcome, this);
    // @todo : refresh on next focus every 5 minutes
  }
  componentWillUnmount () {
    app.off(null, null, this);
  }
  onWelcome (data) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data.featured),
      loaded: true
    });
  }
  render() {
    if (!this.state.loaded) {
      return (
        <LoadingView />
      );
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        style={{flex: 1}}
        scrollEnabled={true}
      />
    );
  }

  renderRow(room) {
    return (
      <SearchResult
        onPress={() => {this.props.navigator.push(navigation.getProfile({type: 'room', id: room.room_id, identifier: room.identifier}));}}
        image={room.avatar}
        type='room'
        identifier={room.identifier}
        description={room.description}
        />
    );
  }
}

module.exports = HomeView;
