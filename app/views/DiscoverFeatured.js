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
var alert = require('../libs/alert');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'DiscoverFeatured', {
  'welcome': 'Join new communities and discussions from this list',
  'load-more': 'Load more'
});

class HomeView extends Component {
  constructor (props) {
    super(props);
    this.discoverDataSource = require('../libs/discoverDataSource')();
    this.loadMoreTimeoutTime = 2000; // 2sec
    this.loadMoreTimeout = null;
    this.state = {
      loaded: false,
      loadMore: false,
      dataSource: this.discoverDataSource.dataSource
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
      dataSource: this.discoverDataSource.append(data.featured),
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
      <Button type='white'
              onPress={this.loadMore.bind(this)}
              label={i18next.t('DiscoverFeatured:load-more')}
              loading={this.state.loadMore}
        />
    );
  }

  loadMore () {
    clearTimeout(this.loadMoreTimeout);
    this.setState({
      loadMore: true
    });

    this.loadMoreTimeout = setTimeout(() => {
      alert.show(i18next.t('messages.error-try-again'));
      this.setState({
        loadMore: false
      });
    }, this.loadMoreTimeoutTime);

    this.fetchData();
  }

  fetchData () {
    // do app.client.featured to get next ones
    return null;
  }
}

module.exports = HomeView;
