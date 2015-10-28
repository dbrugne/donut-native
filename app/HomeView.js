'use strict';

var React = require('react-native');
var {
  AppRegistry,
  AsyncStorage,
  Image,
  ListView,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Component
} = React;

var common = require('@dbrugne/donut-common/mobile');
var client = require('./libs/client');

class HomeView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return (row1 !== row2);
        }
      }),
      loaded: null
    };
  }
  componentWillMount() {
    var that = this;
    client.on('welcome', function () {
      that.fetchData();
    });
  }
  fetchData() {
    var that = this;
    client.home(function (response) {
      if (response.err) {
        console.error(response.err);
      }

      that.setState({
        dataSource: that.state.dataSource.cloneWithRows(response.rooms.list),
        loaded: true
      });
    });
  }
  renderLoadingView () {
    return (
      <View style={styles.container}>
        <Text>
          Loading featured rooms...
        </Text>
      </View>
    );
  }
  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

//    <View style={styles.links}>
//      <TouchableHighlight onPress={(this.onLogout.bind(this))} style={styles.button}>
//        <Text style={styles.logout}>Logout</Text>
//      </TouchableHighlight>
//      <TouchableHighlight onPress={(this.onSocketMe.bind(this))} style={styles.button}>
//        <Text style={styles.socketme}>SocketMe</Text>
//      </TouchableHighlight>
//    </View>

    return (
      <View style={styles.main}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRoom}
          style={styles.listView}
          />
      </View>
    );
  }
  renderRoom(room) {
    var avatarUrl = common.cloudinary.prepare(room.avatar, 50)
    return (
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
    );
  }
//  onLogout() {
//    var that = this;
//    AsyncStorage.multiRemove(['token', 'code'], function () {
//      var login = that.props.navigator.getCurrentRoutes().filter(function (element) {
//        return (element.name === 'login');
//      })[0];
//      if (login) {
//        that.props.navigator.popToRoute(login);
//      }
//    });
//  }
//  onSocketMe() {
//    client.roomMessage('557ed3a4bcb50bc52b74744b', 'test depuis react-native', null, null, function (res) {
//      console.log(res);
//    });
//  }
};

var styles = StyleSheet.create({
  main: {
    marginTop: 25,
  },
  links: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flex: 9,
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
  listView: {
    backgroundColor: '#F5FCFF',
  },
});

module.exports = HomeView;