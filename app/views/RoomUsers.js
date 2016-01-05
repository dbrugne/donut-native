'use strict';
var React = require('react-native');
var _ = require('underscore');
var s = require('../elements/SearchResult/style');
var LoadingView = require('../elements/Loading');
var app = require('../libs/app');
var common = require('@dbrugne/donut-common/mobile');
var SearchResultUser = require('../elements/SearchResult/SearchResultUser');
var navigation = require('../libs/navigation');
var currentUser = require('../models/current-user');

var {
  Component,
  ListView,
  TouchableHighlight,
  View,
  Image,
  TextInput,
  Text,
  StyleSheet
  } = React;
var {
  Icon
  } = require('react-native-icons');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'room-users', {
  'edit': 'Edit',
  'search': 'search'
}, true, true);

class RoomUsersView extends Component {
  constructor (props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.username !== r2.username});
    this.state = {
      loaded: false,
      dataSource: ds.cloneWithRows([]),
      findValue: ''
    };
  }

  fetchData () {
    this.setState({loaded: false});
    var users = [];
    app.client.roomUsers(this.props.model.get('id'), {type: 'users'}, (response) => {
      _.each(response.users, (u) => {
        users.push(u);
      });
      users = _.sortBy(users, (u) => {return u.username.toLowerCase()});
      users = _.sortBy(users, (u) => {return u.status === 'offline';});
      this.setState({dataSource: this.state.dataSource.cloneWithRows(users), loaded: true});
    });
  }

  componentDidMount () {
    this.fetchData();
  }

  render () {
   if (!this.state.loaded) {
      return (<LoadingView />);
    }

    return (
      <View style={{flex: 1}}>
        <View  style={styles.formInputContainer}>
          <TextInput style={styles.formInputFind}
                     autoCapitalize='none'
                     placeholder={i18next.t('room-users:search')}
                     onChangeText={(text) => this.setState({findValue: text})}
                     value={this.state.findValue}
                     onSubmitEditing={(event) => {this._onSearch(event.nativeEvent.text)}}
            />
          <Icon
            name='fontawesome|search'
            size={18}
            color='#DDD'
            style={styles.formInputFindIcon}
            />
        </View>
        <ListView
          ref='listViewUsers'
          dataSource={this.state.dataSource}
          renderRow={this._renderElement.bind(this)}
          style={{flex: 1}}
          />
      </View>
    );
  }

  _renderElement (user) {
    let avatarUrl = common.cloudinary.prepare(user.avatar, 60);
    var isAdminOrOp = this.props.model.currentUserIsOwner() || this.props.model.currentUserIsOp() || this.props.model.currentUserIsAdmin();

    return (
      <View>
        <View style={{flexDirection: 'row'}}>
          <TouchableHighlight style={{flex: 1}} onPress={() => {this.props.navigator.push(navigation.getProfile({
                type: 'user',
                id: user.user_id,
                identifier: '@' + user.username
              }))}}>
            <View style={s.container}>
              <Image
                source={{uri: avatarUrl}}
                style={s.thumbnailUser}
                />
              <Text style={[s.statusText, s.status, user.status === 'connecting' && s.statusConnecting, user.status === 'offline' && s.statusOffline, user.status === 'online' && s.statusOnline]}>{user.status}</Text>
              <View style={{flex:1, marginLeft: 60,justifyContent:'center'}}>
                <Text style={s.title}>{'@' + user.username}</Text>
                {this._renderRoles(user)}
              </View>
              {user.isDevoiced ? this._renderMuted() : null}
            </View>
          </TouchableHighlight>
          { isAdminOrOp ?
            <TouchableHighlight style={{width: 100, height: 100}} onPress={() => this.props.navigator.push(navigation.getManageUser(this.props.model.get('id'), user, () => this.fetchData()))}>
              <View style={[s.container, {justifyContent:'center'}]}>
                <Text style={{fontSize: 17, alignSelf: 'center'}}>{i18next.t('room-users:edit')}</Text>
              </View>
            </TouchableHighlight>
            : null
          }
        </View>
      </View>
    );
  }

  _renderRoles (user) {
    if (user.isOp) {
      return (
        <Text>{i18next.t('op')}</Text>
      );
    }
    if (user.isOwner) {
      return (
        <Text>{i18next.t('owner')}</Text>
      );
    }
    return null;
  }

  _renderMuted () {
    return (
      <Icon
        name='fontawesome|microphone-slash'
        size={35}
        color='#ff3838'
        style={{width: 40, height: 40, position: 'absolute', top: 30, right: 10}}
        />
    );
  }

  _onSearch (text) {
    var users = [];
    app.client.roomUsers(this.props.model.get('id'), {type: 'users', searchString: text}, (response) => {
      _.each(response.users, (u) => {
        users.push(u);
      });
      users = _.sortBy(users, (u) => {return u.username.toLowerCase()});
      users = _.sortBy(users, (u) => {return u.status === 'offline';});
      this.setState({dataSource: this.state.dataSource.cloneWithRows(users)});
    });
  }
}

var styles = StyleSheet.create({
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
  }
});

module.exports = RoomUsersView;
