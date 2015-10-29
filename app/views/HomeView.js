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
//var client = require('./../libs/client');
var currentUser = require('../models/current-user');

class HomeView extends Component {
  constructor (props) {
    console.log('construct home');
    super(props);
//    this.state = {
//      dataSource: new ListView.DataSource({
//        rowHasChanged: function (row1, row2) {
//          return (row1 !== row2);
//        }
//      })
//    };
  }
  componentWillMount() {
//    var that = this;
//    client.on('welcome', function () {
//      that.fetchData();
//    });
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
    console.log('render HomeView');
//    <ScrollView>
//      <ListView
//        dataSource={this.state.dataSource}
//        renderRow={this.renderRoom}
//        style={styles.listView}
//        />
//    </ScrollView>

    return (
      <View style={styles.main}>
        <View style={styles.links}>
          <TouchableHighlight onPress={() => app.trigger('kikoo')} style={styles.button}>
            <Text style={styles.logout}>Test</Text>
          </TouchableHighlight>
          <Text>Authentication OK!</Text>
          <Text>{currentUser.oauth.token}</Text>
          <Text>{currentUser.oauth.code}</Text>
          <TouchableHighlight onPress={() => currentUser.logout()} style={styles.button}>
            <Text style={styles.logout}>LOGOUT</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.test1.bind(this)} style={styles.button}>
            <Text style={styles.test}>__TEST1__</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.test2.bind(this)} style={styles.button}>
            <Text style={styles.test}>__TEST2__</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  test1 () {
    app.trigger('navigateTo', {name: 'test1', title: 'test1', component: require('./Test1')});
  }

  test2 () {
    app.trigger('navigateTo', {name: 'test2', title: 'test2', component: require('./Test2')});
  }
//  renderRoom(room) {
//    var avatarUrl = common.cloudinary.prepare(room.avatar, 50)
//    return (
//      <View style={styles.container}>
//        <Image
//          source={{uri: avatarUrl}}
//          style={styles.thumbnail}
//          />
//        <View style={styles.rightContainer}>
//          <Text style={styles.title}>{room.identifier}</Text>
//          <Text style={styles.owner}>by {room.owner_username}</Text>
//        </View>
//      </View>
//    );
//  }
}

var styles = StyleSheet.create({
  main: {
    flex: 1,
//    marginTop: NavigatorNavigationBarStyles.General.TotalNavHeight,
    backgroundColor: '#666666',
  },
  links: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  listView: {
    flex: 9,
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  thumbnail: {
    width: 53,
    height: 81,
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
});

module.exports = HomeView;
