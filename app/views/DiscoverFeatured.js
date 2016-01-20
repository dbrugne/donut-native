'use strict';

var React = require('react-native');
var {
  ListView,
  Text,
  Component
} = React;

var app = require('./../libs/app');
var s = require('../styles/style');
var navigation = require('../navigation/index');
var Card = require('../components/Card');
var Button = require('../components/Button');
var LoadingView = require('../components/Loading');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'DiscoverFeatured', {
  'welcome': 'Join new communities and discussions from this list',
  'view-more': 'View more'
});

class Featured extends Component {
  constructor (props) {
    super(props);
    this.discoverDataSource = require('../libs/discoverDataSource')();
    this.state = {
      loaded: false,
      dataSource: this.discoverDataSource.dataSource
    };
  }
  componentDidMount () {
    // @todo : refresh on next focus every 5 minutes
    app.on('ready', this.onReady, this);
  }
  componentWillUnmount () {
    app.off(null, null, this);
  }
  onReady () {
    app.client.home((response) => {
      if (response && response.rooms) {
        this.setState({
          loaded: true,
          dataSource: this.discoverDataSource.append(response.rooms.list)
        });
      }
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
        renderFooter={this.renderFooter.bind(this)}
        style={{flex: 1}}
        scrollEnabled
        />
    );
  }
  renderHeader () {
    return (<Text style={[s.p, {marginTop: 20}]}>{i18next.t('DiscoverFeatured:welcome')}</Text>);
  }
  renderRow (room) {
    return (
      <Card
        onPress={() => navigation.navigate('Profile', {type: 'room', id: room.room_id, identifier: room.identifier})}
        image={room.avatar}
        type='room'
        identifier={room.identifier}
        description={room.description}
        mode={room.mode}
        key={room.room_id}
        />
    );
  }
  renderFooter () {
    return (
      <Button
        type='white'
        onPress={() => navigation.navigate('Search')}
        label={i18next.t('DiscoverFeatured:view-more')}
      />
    );
  }
}

module.exports = Featured;
