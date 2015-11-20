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
      findValue: '',
      more: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return (row1 !== row2);
        }
      })
    };

    this.nextValue = '';
    this.limit = 25;
  }

  render () {
    var more = this.state.more ? this._renderLoadMore() : null;
    return (
      <View style={styles.main}>
        <View onResponderTerminate={this.renderElement.bind(this)}>
          <TextInput style={styles.formInputFind}
            placeholder='Search donut, community or user here'
            onChangeText={(text) => this.setState({findValue: text})}
            value={this.state.findValue}
            />
          <View style={styles.buttonContainer}>
            <TouchableHighlight onPress={this.search.bind(this, 'rooms', null)} style={styles.button}>
              <Text style={styles.textButton}>donuts</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.search.bind(this, 'users', null)} style={styles.button}>
              <Text style={styles.textButton}>users</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.search.bind(this, 'groups', null)} style={styles.button}>
              <Text style={styles.textButton}>community</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderElement.bind(this)}
            />
        </View>
        {more}
      </View>
    );
  }

  renderElement (rowData) {
    if (this.state.type === 'rooms') {
      return this.renderRoomsElement(rowData);
    } else if (this.state.type === 'users') {
      return this.renderUsersElement(rowData);
    } else if (this.state.type === 'groups') {
      return this.renderGroupsElement(rowData);
    }
  }

  renderRoomsElement (room) {
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
    );
  }

  renderUsersElement (user) {
    var avatarUrl = common.cloudinary.prepare(user.avatar, 30)
    return (
      <View>
        <Image
          source={{uri: avatarUrl}}
          style={styles.thumbnail}
          />
        <Text>@{user.username}</Text>
      </View>
    );
  }

  renderGroupsElement (group) {
    var avatarUrl = common.cloudinary.prepare(group.avatar, 30)
    return (
      <View>
        <Image
          source={{uri: avatarUrl}}
          style={styles.thumbnail}
          />
        <Text>{group.name}</Text>
      </View>
    );
  }

  _renderLoadMore () {
    if (this.state.more) {
      return (
        <View>
          <TouchableHighlight onPress={this.loadMore.bind(this)}><Text>Load more</Text></TouchableHighlight>
        </View>
      );
    } else {
      return (<View></View>);
    }
  }

  loadMore () {
    console.log('loadmore');
    var skip = {[this.state.type]: this.state.dataSource._cachedRowCount};
    this.search(this.state.type, skip);
  }

  search (type, skip) {
    skip = skip || null;
    if (!this.state.findValue) {
      return;
    }

    this.setState({
      type: type
    });
    this.nextValue = this.state.findValue;

    var options = {
      [this.state.type]: true,
      limit: {
        [this.state.type]: this.limit
      },
      skip: skip
    };
    client.search(this.state.findValue, options, _.bind(function (response) {
      if (!response.err && response[this.state.type].list.length) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(response[this.state.type].list),
          more: (response[this.state.type].list.length === this.limit)
        })
        console.log(this.state.dataSource);
        this.render();
      }
    }, this));
  }
}

var styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
  },
  textButton: {
    margin: 10,
    textAlign: 'center',
    color: '#fff'
  },
  button: {
    backgroundColor: '#444444',
    margin: 10,
    width: 100,
    height: 40
  },
  formInputFind: {
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