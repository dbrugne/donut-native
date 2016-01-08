'use strict';

var React = require('react-native');
var {
  ListView,
  Text,
  Component
} = React;

var app = require('./../libs/app');
var navigation = require('../navigation/index');
var SearchResult = require('../elements/SearchResult');
var LoadingView = require('../elements/Loading');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'welcome': 'Welcome'
});

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
  render () {
    if (!this.state.loaded) {
      return (
        <LoadingView />
      );
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderHeader={this.renderHeader}
        renderRow={this.renderRow.bind(this)}
        style={{flex: 1}}
        scrollEnabled
      />
    );
  }

  renderHeader() {
    return (<Text style={{marginVertical: 20, marginHorizontal: 10}}>{i18next.t('local:welcome')}</Text>);
  }

  renderRow (room) {
    return (
      <SearchResult
        onPress={() => navigation.navigate('Profile', {type: 'room', id: room.room_id, identifier: room.identifier})}
        image={room.avatar}
        type='room'
        identifier={room.identifier}
        description={room.description}
        />
    );
  }
}

module.exports = HomeView;
