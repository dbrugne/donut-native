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
var {
  Icon
  } = require('react-native-icons');

var _ = require('underscore');
var app = require('../libs/app');
var client = require('../libs/client');
var common = require('@dbrugne/donut-common/mobile');
var navigation = require('../libs/navigation');
var s = require('../components/style');

var LIMIT = 25;
var TIME_SEARCH = 500;

class SearchView extends Component {
  constructor (props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      type: 'rooms',
      findValue: '',
      more: false,
      dataSource: ds.cloneWithRows([]),
      loading : false
    };

    this.nextValue = '';
    this.resultBlob = [];
    this.timeout = 0;
  }

  render () {
    return (
      <View style={styles.main}>
        <View>
          <View  style={styles.formInputContainer}>
            <TextInput style={styles.formInputFind}
              placeholder='Search donut, community or user here'
              onChangeText={(text) => this.setState({findValue: text})}
              value={this.state.findValue}
              onChange={this.changeText.bind(this)}
              />
            <Icon
            name='fontawesome|search'
            size={18}
            color='#DDD'
            style={styles.formInputFindIcon}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableHighlight onPress={this.search.bind(this, 'rooms', null)}
                                underlayColor= '#DDD'
                                style={[styles.button, this.state.type === 'rooms' && styles.buttonActive]}>
              <Text style={styles.textButton}>donuts</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.search.bind(this, 'users', null)}
                                underlayColor= '#DDD'
                                style={[styles.button, this.state.type === 'users' && styles.buttonActive]}>
              <Text style={styles.textButton}>users</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.search.bind(this, 'groups', null)}
                                underlayColor= '#DDD'
                                style={[styles.button, this.state.type === 'groups' && styles.buttonActive]}>
              <Text style={styles.textButton}>community</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.searchContainer} >
          <ListView
            ref='listview'
            dataSource={this.state.dataSource}
            renderRow={this.renderElement.bind(this)}
            renderFooter={this._renderLoadMore.bind(this)}
            />
        </View>
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
      <TouchableHighlight onPress={() => this.props.navigator.push(navigation.getProfile({type: 'room', id: room.room_id, identifier: room.identifier}))}>
        <View style={styles.element}>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <Text style={styles.textElement}>{room.identifier}</Text>
          <Text> by @{room.owner_username}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderUsersElement (user) {
    var avatarUrl = common.cloudinary.prepare(user.avatar, 30)
    return (
      <TouchableHighlight onPress={() => this.props.navigator.push(navigation.getProfile({type: 'user', id: user.user_id, identifier: '@' + user.username}))}>
        <View style={styles.element}>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <Text style={styles.textElement}>@{user.username}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderGroupsElement (group) {
    var avatarUrl = common.cloudinary.prepare(group.avatar, 30)
    return (
      <TouchableHighlight onPress={() => this.props.navigator.push(navigation.getProfile({type: 'group', id: group.group_id, identifier: group.identifier}))}>
        <View style={styles.element}>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <Text style={styles.textElement}>#{group.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  resetList (skip) {
    if (!skip) {
      this.resultBlob = [];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows([]),
        more: false
      });
    }
  }

  _renderLoadMore () {
    if (this.state.loading) {
      return (<View style={styles.loadMore}><Text style={{color:'#fff', textAlign: 'center'}}>chargement</Text></View>)
    }
    else if (this.state.more) {
      return (
        <TouchableHighlight onPress={this.loadMore.bind(this)}>
          <View style={styles.loadMore}>
            <Text style={{color:'#fff', textAlign: 'center'}}>Load more</Text>

          </View>
        </TouchableHighlight>
      );
    } else if (this.resultBlob.length) {
      return (<View style={styles.loadMore}><Text style={{color:'#fff', textAlign: 'center'}}>Aucun résultat</Text></View>);
    } else {
      return (<View></View>);
    }
  }

  loadMore () {
    var skip = {[this.state.type]: this.resultBlob.length};
    this.search(this.state.type, skip);
  }

  changeText () {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(_.bind(function () {
      this.search(this.state.type, null)
    }, this), TIME_SEARCH);
  }

  search (type, skip) {
    skip = skip || null;
    if (!this.state.findValue) {
      return this.resetList(skip);
    }

    this.setState({
      loading: true
    });

    if (this.state.findValue !== this.nextValue || this.state.type !== type) {
      this.nextValue = this.state.findValue;
      this.setState({
        type: type
      });
    }
    this.resetList(skip);

    if (!skip) {
      this.refs.listview.refs.listviewscroll.scrollTo(0,0);
    }

    var options = {
      [this.state.type]: true,
      limit: {
        [this.state.type]: LIMIT
      },
      skip: skip
    };
    client.search(this.state.findValue, options, _.bind(function (response) {
      if (response.err) {
        return this.resetList(null);
      }
      this.resultBlob = (!this.state.more) ? response[this.state.type].list : this.resultBlob.concat(response[this.state.type].list);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.resultBlob),
        more: (response[this.state.type].list.length === LIMIT),
        loading: false
      });
      this.render();
    }, this));
  }
}

var styles = StyleSheet.create({
  main: {
    flex: 1
  },
  buttonContainer: {
    borderTopWidth: 3,
    borderStyle: 'solid',
    borderColor: '#DDD',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  textButton: {
    padding: 10,
    textAlign: 'center',
    color: '#333'
  },
  button: {
    height: 40,
    flex: 1
  },
  buttonActive: {
    borderBottomWidth:3,
    borderStyle: 'solid',
    borderColor: '#3498db'
  },
  buttonLast: {
    borderRightWidth: 0
  },
  formInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formInputFind: {
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 18,
    color: '#48BBEC',
    flex: 1
  },
  formInputFindIcon: {
    width: 18,
    height: 18,
    alignSelf: 'center',
    marginRight: 10
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderColor: '#fff',
    borderRadius: 20,
    borderWidth: 1
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 10
  },
  element: {
    flexDirection: 'row',
    height: 60,
    borderColor: '#000',
    borderBottomWidth: 1,
    padding: 10
  },
  textElement: {
    marginLeft: 20,
    fontWeight: 'bold'
  },
  loadMore: {
    height: 40,
    backgroundColor: '#000',
    justifyContent: 'center'
  }
});

module.exports = SearchView;