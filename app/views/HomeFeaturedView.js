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
  ScrollView,
  ActivityIndicatorIOS
} = React;

var common = require('@dbrugne/donut-common/mobile');
var client = require('./../libs/client');

var router = require('../navigation/Router');

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
  render() {
    if (!this.state.loaded) {
      return (
        <ActivityIndicatorIOS
          animating={true}
          style={{height: 80}}
          size='small'
          color='#666666'
        />
      );
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderElement.bind(this)}
        style={styles.listView}
        scrollEnabled={false}
      />
    );
  }

  renderElement(room) {
    var url = 'room/profile/' + room.room_id;
    var avatarUrl = common.cloudinary.prepare(room.avatar, 30)
    return (
      <TouchableHighlight onPress={() => {
        this.props.childNavigator.push(router.getRoute(url, {identifier: room.identifier}));
      }} >
        <View style={styles.container}>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{room.identifier}</Text>
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
    margin: 10
  },
  thumbnail: {
    width: 30,
    height: 30,
    marginRight: 10
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  title: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

module.exports = HomeView;
