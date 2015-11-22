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
var navigation = require('../libs/navigation');

class SearchView extends Component {
  constructor (props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      type: 'rooms',
      findValue: '',
      more: false,
      dataSource: ds.cloneWithRows([]),
      loading: false
    };

    this.nextValue = '';
    this.limit = 25;
    this.resultBlob = [];
  }

  render () {
    var more = this.state.more
      ? this._renderLoadMore()
      : null;

    return (
      <View style={styles.main}>
        <View>
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
    var avatarUrl = common.cloudinary.prepare(room.avatar, 30)
    return (
      <TouchableHighlight onPress={() => this.props.navigator.push(navigation.getProfile(room))}>
        <View style={styles.element}>
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
    var url = 'user/profile/' + user.user_id;
    var avatarUrl = common.cloudinary.prepare(user.avatar, 30)
    return (
      <TouchableHighlight onPress={() => app.trigger('navigateTo', url, {username: user.username})}>
        <View style={styles.element}>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <Text>@{user.username}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderGroupsElement (group) {
    var url = 'group/profile/' + group.group_id;
    var avatarUrl = common.cloudinary.prepare(group.avatar, 30)
    return (
      <TouchableHighlight onPress={() => app.trigger('navigateTo', url, {identifier: group.identifier})}>
        <View style={styles.element}>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <Text>#{group.name}</Text>
        </View>
      </TouchableHighlight>
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
    var skip = {[this.state.type]: this.resultBlob.length};
    this.search(this.state.type, skip);
  }

  search (type, skip) {
    skip = skip || null;
    if (!this.state.findValue) {
      return;
    }

    if (this.state.findValue !== this.nextValue && this.state.type !== type) {
      this.resultBlob = [];
    }

    if (!skip) {
      this.setState({
        more: false
      });
    }

    this.setState({
      type: type,
      loading: true
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
        this.resultBlob = (!this.state.more) ? response[this.state.type].list : this.resultBlob.concat(response[this.state.type].list);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.resultBlob),
          more: (response[this.state.type].list.length === this.limit),
          loading: false
        });
        this.render();
      }
    }, this));
  }
}

var styles = StyleSheet.create({
  main: {
    flex: 1,
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
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 10
  },
  element: {
    flexDirection: 'row'
  }
});

module.exports = SearchView;