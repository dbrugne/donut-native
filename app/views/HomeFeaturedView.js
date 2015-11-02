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
  componentDidMount() {
//    client.on('welcome', this.fetchData.bind(this));
    client.on('welcome', (data) => this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data.featured),
      loaded: true
    }));

    // @todo : refresh on next focus every 5 minutes
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
      <ScrollView>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderElement}
          style={styles.listView}
          />
      </ScrollView>
    );
  }

  renderElement(room) {
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
}

var styles = StyleSheet.create({
  main: {
    flex: 1,
//    marginTop: NavigatorNavigationBarStyles.General.TotalNavHeight,
  },
  links: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  listView: {
    flex: 9,
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
