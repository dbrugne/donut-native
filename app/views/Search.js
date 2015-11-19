'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  ListView,
  Component,
} = React;

var _ = require('underscore');
var app = require('../libs/app');
var client = require('../libs/client');
var common = require('@dbrugne/donut-common/mobile');

class SearchView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      type: 'rooms',
      loaded: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return (row1 !== row2);
        }
      })
    };
  }

  render () {
    return (
      <View style={styles.main}>
        <View>
          <TextInput style={styles.formInputFind}
            placeholder='Search donut, community or user here'
            onChangeText={(text) => this.setState({findValue: text})}
            value={this.state.text}
            />
        </View>
        <TouchableHighlight onPress={this.findRooms.bind(this)} style={styles.button}>
          <Text style={styles.textButton}>SEARCH</Text>
        </TouchableHighlight>
        <View style={styles.searchContainer}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderElement}
            />
        </View>
      </View>
    );
  }

  renderElement (room) {
    var url = 'room/profile/' + room.room_id;
    var avatarUrl = common.cloudinary.prepare(room.avatar, 30)
    return (
      <TouchableHighlight onPress={() => app.trigger('navigateTo', url, {identifier: room.identifier})}>
        <View>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <Text>{room.identifier}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  findRooms () {
    if (!this.state.findValue) {
      console.log('empty');
      return;
    }
    var options = {
      rooms: true,
      limit: {
        rooms: 5
      }
    };
    var that = this;
    client.search(this.state.findValue, options, _.bind(function (response) {
      if (!response.err && response.rooms) {
        console.log('good');
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(response.rooms.list),
          loaded: true
        })
        this.render();
      }
    }, this))
  }

}

var styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textButton: {
    textAlign: 'center',
    color: '#fff'
  },
  button: {
    backgroundColor: '#444444',
    marginLeft: 5,
    width: 100
  },
  formInputFind: {
    flex: 1,
    top: 0
  },
  thumbnail: {
    width: 30,
    height: 30
  },
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10
  }
});

module.exports = SearchView;