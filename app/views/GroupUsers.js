'use strict';
var React = require('react-native');
var Card = require('../components/Card');
var LoadingView = require('../components/Loading');
var app = require('../libs/app');
var alert = require('../libs/alert');
var currentUser = require('../models/current-user');
var userActionSheet = require('../libs/UserActionsSheet');
var Icon = require('react-native-vector-icons/FontAwesome');

var {
  ListView,
  View,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Text
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupUsers', {
  'ban': 'Banned',
  'search': 'search',
  'users': 'Users',
  'op': 'Moderators',
  'load-more': 'Load more',
  'no-results': 'No results'
}, true, true);

var GroupUsersView = React.createClass({
  contextTypes: {
    actionSheet: React.PropTypes.func
  },
  propTypes: {
    navigator: React.PropTypes.object,
    id: React.PropTypes.any.isRequired
  },

  getInitialState: function () {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.username !== r2.username});
    this.usersList = [];
    this.searchString = '';
    this.type = 'members';
    this.currentNumberCharged = 0;
    this.model = app.groups.get(this.props.id);
    return {
      loaded: false,
      dataSource: ds.cloneWithRows([]),
      findValue: '',
      more: false,
      is_op: false,
      is_owner: false,
      type: 'members'
    };
  },
  fetchData: function () {
    this.setState({loaded: false});
    app.client.groupUsers(this.props.id, {
      type: this.type,
      searchString: this.searchString,
      selector: {start: this.currentNumberCharged, length: 10}
    }, (response) => {
      if (response.err) {
        return;
      }
      var numberUsersReceive = 0;
      if (response.users && response.users.length) {
        numberUsersReceive = response.users.length;
      }
      this.currentNumberCharged = this.currentNumberCharged + numberUsersReceive;
      this.usersList = this.usersList.concat(response.users);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.usersList),
        loaded: true,
        more: (response.count > this.usersList.length)
      });
    });
  },
  componentDidMount: function () {
    app.client.groupRead(this.props.id, {}, (response) => {
      if (response.err) {
        return;
      }
      this.setState({
        is_member: response.is_member,
        is_op: response.is_op,
        is_owner: response.is_owner
      });
      this.fetchData();
    });
  },
  render: function () {
    let types = null;
    if (this.state.is_op || this.state.is_owner || currentUser.isAdmin()) {
      types = [
        <TouchableHighlight onPress={() => this._changeType('ban')}
                            underlayColor='#DDD'
                            key='ban'
                            style={[ styles.button, this.state.type === 'ban' && styles.buttonActive ]}>
          <Text style={styles.textButton}>{i18next.t('GroupUsers:ban')}</Text>
        </TouchableHighlight>
      ];
    }
    return (
      <View style={styles.main}>
        <View>
          <View style={styles.formInputContainer}>
            <Icon
              name='search'
              size={18}
              color='#AFBAC8'
              style={{ marginLeft: 20, marginRight: 5 }}
              />
            <TextInput style={styles.formInputFind}
                       autoCapitalize='none'
                       placeholder={i18next.t('GroupUsers:search')}
                       onChangeText={(text) => this.setState({findValue: text})}
                       onSubmitEditing={(event) => this._onSearch(event.nativeEvent.text)}
                       value={this.state.findValue}
                       autoFocus
              />
          </View>

          <View style={[ styles.buttonContainer, styles.shadow, { marginBottom: 10 } ]}>
            <TouchableHighlight onPress={() => this._changeType('members')}
                                underlayColor='#DDD'
                                style={[ styles.button, this.state.type === 'members' && styles.buttonActive ]}>
              <Text
                style={[ styles.textButton, this.state.type === 'members' && styles.textButtonActive ]}>{i18next.t('GroupUsers:users')}</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this._changeType('op')}
                                underlayColor='#DDD'
                                style={[ styles.button, this.state.type === 'op' && styles.buttonActive ]}>
              <Text
                style={[ styles.textButton, this.state.type === 'op' && styles.textButtonActive ]}>{i18next.t('GroupUsers:op')}</Text>
            </TouchableHighlight>
            {types}
          </View>
        </View>

        <View style={styles.searchContainer}>
          <ListView
            ref='listViewUsers'
            dataSource={this.state.dataSource}
            renderRow={(e) => this._renderElement(e)}
            renderFooter={() => this._renderLoadMore()}
            />
        </View>
      </View>
    );
  },
  _changeType: function (type) {
    if (this.type === type) {
      return;
    }

    this.type = type;
    this.usersList = [];
    this.currentNumberCharged = 0;
    this.setState({type: type, dataSource: this.state.dataSource.cloneWithRows([])});
    this.fetchData();
  },
  _renderElement: function (user) {
    return (
      <Card
        onPress={() => this._onOpenActionSheet(user, this.state.is_op || this.state.is_owner || currentUser.isAdmin())}
        image={user.avatar}
        type='user'
        identifier={'@' + user.username}
        realname={user.realname}
        bio={user.bio}
        status={user.status}
        op={user.isOp}
        owner={user.isOwner}
        devoiced={user.isDevoiced}
        banned={user.isBanned}
        />
    );
  },
  _renderLoadMore: function () {
    if (!this.state.loaded) {
      return (<LoadingView style={styles.loadMore}/>);
    } else if (this.state.more) {
      return (
        <TouchableHighlight onPress={() => this.fetchData()}
                            underlayColor='#f0f0f0'
                            style={{height: 50, justifyContent: 'center', alignItems: 'center'}}
          >
          <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{textAlign: 'center', fontFamily: 'Open Sans', fontSize: 14, color: '#8491A1'}}>● ● ●</Text>
            <Text
              style={{ textAlign: 'center', fontFamily: 'Open Sans', fontSize: 14, color: '#8491A1' }}>{i18next.t('GroupUsers:load-more')}</Text>
          </View>
        </TouchableHighlight>
      );
    } else if (!this.usersList.length) {
      return (<View style={styles.loadMore}><Text
        style={{color: '#333', textAlign: 'center'}}>{i18next.t('GroupUsers:no-results')}</Text></View>);
    } else {
      return null;
    }
  },
  _onSearch: function (text) {
    this.searchString = text;
    this.currentNumberCharged = 0;
    this.usersList = [];
    this.setState({dataSource: this.state.dataSource.cloneWithRows([])});
    this.fetchData();
  },
  _onOpenActionSheet: function (user, adminOwnerOrOp) {
    userActionSheet.openGroupActionSheet(this.context.actionSheet(), 'groupUsers', this.model, user, adminOwnerOrOp);
  }
});

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
    paddingVertical: 5,
    fontSize: 18,
    color: '#AFBAC8',
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  textButton: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    padding: 10,
    color: '#AFBAC8',
    textAlign: 'center'
  },
  textButtonActive: {
    color: '#353F4C'
  },
  button: {
    height: 40,
    flex: 1
  },
  buttonActive: {
    borderBottomWidth: 3,
    borderStyle: 'solid',
    borderColor: '#FC2063'
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
    borderTopWidth: 1,
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
    color: '#999999',
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
    justifyContent: 'center'
  },
  shadow: {
    shadowColor: '#E7ECF3',
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 4,
    shadowOpacity: 1
  }
});

module.exports = GroupUsersView;

