'use strict';

var React = require('react-native');
var {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Component,
  ListView
} = React;

var _ = require('underscore');
var app = require('../libs/app');
var LoadingModal = require('../components/LoadingModal');
var SearchResult = require('./SearchResult');
var navigation = require('../navigation/index');
var ConnectionState = require('../components/ConnectionState');

class GroupRoomsListView extends Component {
  constructor (props) {
    super(props);
    this.id = props.id;
    this.user = props.user;
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1!== r2});
    this.state = {
      error: null,
      loading: true,
      dataSource: ds.cloneWithRows([])
    }
  }

  componentDidMount () {
    if (this.user && this.user.isBanned) {
      return;
    }
    if (this.id) {
      app.client.groupRead(this.id, {rooms: true}, this.onData.bind(this));
    }
  }

  onData (response) {
    if (response.err) {
      return this.setState({
        error: 'error'
      });
    }
    var rooms = [];
    _.each(response.rooms, _.bind(function (room) {
      if (room.mode === 'public' || (room.mode === 'private' && (this.user.isOwner || this.user.isMember))) {
        rooms.push(room);
      }
    }, this));
    this.setState({
      loading: false,
      dataSource: this.state.dataSource.cloneWithRows(rooms)
    });
  }

  render () {
    if (this.user && this.user.isBanned) {
      return (
        <View>
          <Text>Vous êtes banni de cette communauté</Text>
        </View>
      );
    }
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <LoadingModal />
        </View>
      );
    }
    return (
      <View style={{flex: 1}}>
        <ConnectionState/>
        <ScrollView style={styles.main}>
          <View style={styles.container}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderElement.bind(this)}
              style={{alignSelf: 'stretch'}}
              />
          </View>
        </ScrollView>
      </View>
    );
  }

  renderElement (rowData) {
    return (
      <SearchResult
        onPress={() => navigation.navigate('Profile', {type: 'room', id: rowData.room_id, identifier: rowData.identifier})}
        image={rowData.avatar}
        type='room'
        identifier={rowData.identifier}
        description={rowData.description}
        mode={(!rowData.mode || rowData.mode === 'public') ? 'public' : (rowData.allow_group_member) ? 'member' : 'private'}
        />
    );
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  loading: {
    flex: 1,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  listContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
});

module.exports = GroupRoomsListView;