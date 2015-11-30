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
  ActivityIndicatorIOS
} = React;

var common = require('@dbrugne/donut-common/mobile');
var _ = require('underscore');
var client = require('./../libs/client');
var Button = require('react-native-button');

var navigation = require('../libs/navigation');

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
        renderRow={this.renderRow.bind(this)}
        style={styles.listView}
        scrollEnabled={false}
      />
    );
  }

  renderRow(room) {
    var url = 'room/profile/' + room.room_id;
    var avatarUrl = common.cloudinary.prepare(room.avatar, 40);
    var description = null;
    if (room.description) {
      description = (
        <Text style={styles.description}>{_.unescape(room.description.replace(/\n/g,''))}</Text>
      );
    }
    return (
      <TouchableHighlight onPress={() => {
        this.props.navigator.push(navigation.getProfile({type: 'room', id: room.room_id, identifier: room.identifier}));
      }} >
        <View style={styles.container}>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{room.identifier}</Text>
            {description}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 60,
    padding: 10,
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderTopWidth:1,
    borderStyle: 'solid',
    borderTopColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#D7D7D7'
  },
  thumbnail: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  title: {
    fontSize: 16,
    fontFamily: 'Open Sans',
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#333'
  },
  description: {
    marginLeft: 5,
    color: '#777',
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontStyle: 'italic'
  }
});

module.exports = HomeView;
