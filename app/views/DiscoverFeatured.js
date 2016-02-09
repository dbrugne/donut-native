'use strict';

var React = require('react-native');
var {
  ListView,
  View,
  Text,
  Component,
  StyleSheet
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
  'title': 'Welcome',
  'welcome': 'Find your way around DONUT by joining or creating communities and discussions you belong with.',
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

        <Text style={{ marginHorizontal: 10, marginTop: 10, fontSize: 20, color: '#FC2063', letterSpacing: 1.88, lineHeight: 30, textAlign: 'center'}}>{i18next.t('DiscoverFeatured:title')}</Text>
        <Text style={{ marginHorizontal: 10, marginTop: 10, fontSize: 14, color: '#AFBAC8', letterSpacing: 1.50, lineHeight: 20, textAlign: 'center'}}>{i18next.t('DiscoverFeatured:welcome')}</Text>

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
        <Text style={[s.listGroupItemSpacing, {backgroundColor: '#FFF'}]}/>
        <ListItem
          onPress={() => navigation.navigate('GroupList')}
          text={i18next.t('DiscoverFeatured:groups')}
          type='image-list'
          action
          value={this.state.groups.length + ''}
          first
          imageList={_.first(this.state.groups, 5)}
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
        <Text style={[s.listGroupItemSpacing, {backgroundColor: '#FFF'}]}/>
        <ListItem
          onPress={() => navigation.navigate('RoomList')}
          text={i18next.t('DiscoverFeatured:rooms')}
          type='image-list'
          action
          value={this.state.rooms.length + ''}
          first
          imageList={_.first(this.state.rooms, 5)}
          />
      </View>
    );
  }
}

var styles = StyleSheet.create({

});

module.exports = Featured;
