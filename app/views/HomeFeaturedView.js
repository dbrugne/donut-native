'use strict';

var React = require('react-native');
var {
  Image,
  ListView,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Component,
  ScrollView
} = React;

var common = require('@dbrugne/donut-common/mobile');
var app = require('../libs/app');
var client = require('./../libs/client');
var currentUser = require('../models/current-user');

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
    client.on('welcome', (data) => this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data.featured),
      loaded: true
    }));

    // @todo : refresh on next focus every 5 minutes
  }
  componentWillUnmount () {
    client.off('welcome');
  }
//  fetchData() {
//    var that = this;
//    client.home(function (response) {
//      if (response.err) {
//        console.error(response.err);
//      }
//
//      that.setState({
//        dataSource: that.state.dataSource.cloneWithRows(response.rooms.list),
//        loaded: true
//      });
//    });
//  }
  render() {
    if (!this.state.loaded) {
      return (<View></View>);
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderElement}
        style={styles.listView}
        scrollEnabled={false}
        />
    );
  }

  renderElement(room) {
    var url = 'room/profile/' + room.room_id;
    var avatarUrl = common.cloudinary.prepare(room.avatar, 30)
    return (
      <TouchableHighlight onPress={() => app.trigger('navigateTo', url, {identifier: room.identifier})}>
        <View style={styles.container}>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{room.identifier}</Text>
            <Text style={styles.owner}>by {room.owner_username}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  listView: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    marginVertical: 10
  },
  thumbnail: {
    width: 30,
    height: 30
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
  },
  owner: {
  },
});

module.exports = HomeView;
