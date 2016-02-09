'use strict';

var React = require('react-native');
var {
  ListView,
  View,
  Text,
  Component
} = React;

var _ = require('underscore');
var app = require('./../libs/app');
var s = require('../styles/style');
var navigation = require('../navigation/index');
var Card = require('../components/Card');
var Button = require('../components/Button');
var ListItem = require('../components/ListItem');
var LoadingView = require('../components/Loading');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'DiscoverFeatured', {
  'welcome': [
    'Welcome !',
    'Find your way arounf DONUT by joining or creating communities and discussions you belong with.'
  ],
  'groups': 'Featured communities',
  'rooms': 'Featured discussions'
});

class Featured extends Component {
  constructor (props) {
    super(props);
    this.discoverDataSource = require('../libs/discoverDataSource')();
    this.state = {
      loaded: false,
      rooms: [],
      groups: []
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
        let rooms = [];
        let groups = [];

        _.each(response.rooms.list, function(elt){
          if (elt.type === 'room') {
            rooms.push(elt);
          } else {
            groups.push(elt);
          }
        });

        this.setState({
          loaded: true,
          rooms: rooms,
          groups: groups
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
      <View>
        {this._renderStats()}

        <Text style={[s.p, {marginTop: 20}]}>{i18next.t('DiscoverFeatured:welcome')}</Text>

        {this._renderGroups()}

        {this._renderRooms()}
      </View>
    );
  }
  _renderStats() {
    // @todo when handler ready
    return null;
  }
  _renderGroups() {
    if (this.state.groups.length === 0) {
      return null;
    }

    return (
      <View>
        <Text style={s.listGroupItemSpacing}/>
        <ListItem
          onPress={() => navigation.navigate('GroupList')}
          text={i18next.t('DiscoverFeatured:groups')}
          icon='bars'
          type='image-list'
          action
          value={this.state.groups.length + ''}
          first
          imageList={this.state.groups}
          />
      </View>
    );
  }
  _renderRooms() {
    if (this.state.rooms.length === 0) {
      return null;
    }

    return (
      <View>
        <Text style={s.listGroupItemSpacing}/>
        <ListItem
          onPress={() => navigation.navigate('RoomList')}
          text={i18next.t('DiscoverFeatured:rooms')}
          icon='bars'
          type='image-list'
          action
          value={this.state.rooms.length + ''}
          first
          imageList={this.state.rooms}
          />
      </View>
    );
  }
}

module.exports = Featured;
