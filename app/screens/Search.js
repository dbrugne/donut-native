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
var s = require('../styles/style');

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
              autoFocus={true}
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
    var avatarUrl = common.cloudinary.prepare(room.avatar, 40);
    var description = null;
    if (room.description) {
      description = (
        <Text style={styles.description}>{_.unescape(room.description).replace(/\n/g, '')}</Text>
      );
    }
    return (
      <TouchableHighlight onPress={() => this.props.navigator.push(navigation.getProfile({type: 'room', id: room.room_id, identifier: room.identifier}))}
                          underlayColor= '#DDD'
        >
        <View style={styles.element}>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <Text style={styles.textElement}>{room.identifier}</Text>
          {description}
        </View>
      </TouchableHighlight>
    );
  }

  renderUsersElement (user) {
    var avatarUrl = common.cloudinary.prepare(user.avatar, 40);
    var realname = null;
    if (user.realname) {
      realname = (
        <Text style={styles.textElement}>{user.realname}</Text>
      );
    }
    var bio = null;
    if (user.bio) {
      bio = (
        <Text style={styles.description}>{_.unescape(user.bio).replace(/\n/g, '')}</Text>
      );
    }
    var status = (
      <Icon
        name='fontawesome|circle-o'
        size={14}
        color='#c7c7c7'
        style={styles.icon}
        />
    );
    if (user.status && user.status === 'online') {
      status = (
        <Icon
          name='fontawesome|circle'
          size={14}
          color='#4fedc0'
          style={styles.icon}
          />
      );
    }
    return (
      <TouchableHighlight onPress={() => this.props.navigator.push(navigation.getProfile({type: 'user', id: user.user_id, identifier: '@' + user.username}))}
                          underlayColor= '#DDD'
        >
        <View style={styles.element}>
          <Image
            source={{uri: avatarUrl}}
            style={[styles.thumbnail, styles.thumbnailUser]}
            />
          {realname}
          <Text style={[styles.textElement, realname && styles.username]}>@{user.username}</Text>
          <View style={styles.status}>
            {status}
          </View>
          {bio}
        </View>
      </TouchableHighlight>
    );
  }

  renderGroupsElement (group) {
    var avatarUrl = common.cloudinary.prepare(group.avatar, 40);
    var description = null;
    if (group.description) {
      description = (
        <Text style={styles.description}>{_.unescape(group.description).replace(/\n/g, '')}</Text>
      );
    }
    return (
      <TouchableHighlight onPress={() => this.props.navigator.push(navigation.getProfile({type: 'group', id: group.group_id, identifier: group.identifier}))}
                          underlayColor= '#DDD'
        >
        <View style={styles.element}>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <Text style={styles.textElement}>#{group.name}</Text>
          {description}
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
      return (<View style={styles.loadMore}><Text style={{color:'#333', textAlign: 'center'}}>chargement</Text></View>)
    }
    else if (this.state.more) {
      return (
        <TouchableHighlight onPress={this.loadMore.bind(this)}
                            underlayColor= '#DDD'
          >
          <View style={styles.loadMore}>
            <Text style={{color:'#333', textAlign: 'center'}}>Load more</Text>

          </View>
        </TouchableHighlight>
      );
    } else if (this.resultBlob.length) {
      return (<View style={styles.loadMore}><Text style={{color:'#333', textAlign: 'center'}}>Aucun résultat</Text></View>);
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
    this.timeout = setTimeout(() => {
      this.search(this.state.type, null)
    }, TIME_SEARCH);
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
    client.search(this.state.findValue, options, (response) => {
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
    });
  }
}

var styles = StyleSheet.create({
  main: {
    flex: 1
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

  searchContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  element: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 60,
    borderColor: '#DDD',
    padding: 10,
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
    borderRadius: 20
  },
  thumbnailUser: {
    borderRadius: 4
  },
  textElement: {
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
  },
  username: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Open Sans',
    color: '#b6b6b6',
    fontWeight: 'normal'
  },
  status: {
    marginLeft: 5
  },
  icon: {
    width: 14,
    height: 14,
    color: '#c7c7c7'
  },
  loadMore: {
    height: 40,
    backgroundColor: '#f5f8fa',
    justifyContent: 'center'
  }
});

module.exports = SearchView;