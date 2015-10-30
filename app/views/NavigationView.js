'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Navigator,
  Component,
  ListView,
  Image,
  TouchableHighlight
} = React;

var common = require('@dbrugne/donut-common/mobile');
var client = require('../libs/client');
var app = require('../libs/app');

var RoomView = require('../views/Room');
var OnetooneView = require('../views/Onetoone');

class NavigationView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      rooms: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return (row1 !== row2);
        }
      }),
      ones: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return (row1 !== row2);
        }
      })
    };
  }

  componentWillMount () {
    var that = this;
    client.on('welcome', function (data) {
      that.setState({
        rooms: that.state.rooms.cloneWithRows(data.rooms),
        ones: that.state.ones.cloneWithRows(data.onetoones)
      });
    });
  }

  render () {
    return (
      <View style={styles.main}>
        <TouchableHighlight onPress={() => this.navigateToHome()}>
          <Text style={styles.title}>HOME</Text>
        </TouchableHighlight>
        <Text>onetoones</Text>
        <ListView
          dataSource={this.state.ones}
          renderRow={this.renderOne.bind(this)}
          style={styles.listView}
          />
        <Text>rooms</Text>
        <ListView
          dataSource={this.state.rooms}
          renderRow={this.renderRoom.bind(this)}
          style={styles.listView}
          />
      </View>
    );
  }

  renderOne (e) {
    var avatarUrl = common.cloudinary.prepare(e.avatar, 30)
    return (
      <TouchableHighlight onPress={() => this.navigateToOne(e.user_id, e.username)}>
        <View style={styles.container}>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <View style={styles.rightContainer}>
              <Text style={styles.title}>@{e.username}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderRoom (e) {
    return (
      <TouchableHighlight onPress={() => this.navigateToRoom(e.room_id, e.identifier)}>
        <View style={styles.container}>
          <View style={styles.rightContainer}>
              <Text style={styles.title}>{e.identifier}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  navigateToOne (id, title) {
    app.trigger('navigateTo', {
      name: 'one-' + id,
      title: title,
      component: OnetooneView,
      id: id,
    });
  }

  navigateToRoom (id, title) {
    app.trigger('navigateTo', {
      name: 'one-' + id,
      title: title,
      component: RoomView,
      id: id,
    });
  }

  navigateToHome () {
    app.trigger('navigateTo', {
      name: 'home',
    });
  }

};

var styles = StyleSheet.create({
  main: {
    marginTop: 25,
    flexDirection: 'column',
    flexWrap: 'nowrap'
  },
  container: {
    flex: 9,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  thumbnail: {
    width: 30,
    height: 30,
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  owner: {
    textAlign: 'center',
  },
  listView: {
    backgroundColor: '#F5FCFF',
  },
});

module.exports = NavigationView;
