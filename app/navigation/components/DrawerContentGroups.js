'use strict';

var React = require('react-native');
var _ = require('underscore');

var {
  StyleSheet,
  View,
  Text,
  ListView,
  LayoutAnimation,
  TouchableHighlight
} = React;

var Icon = require('react-native-vector-icons/FontAwesome');
var app = require('../../libs/app');
var navigation = require('../index');
var animation = require('../../libs/animations').callapse;

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'drawerContentGroups', {
  'groups': 'COMMUNITIES',
  'see-all': 'see all',
  'see-less': 'see less'
});

var NavigationGroupsView = React.createClass({
  getInitialState: function () {
    this.lastGroup = null;
    this.displayLimit = 2;
    return {
      elements: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return (row1 !== row2);
        }
      }),
      atLeastOne: false,
      collapsed: true
    };
  },

  componentDidMount: function () {
    app.on('redrawNavigation', this.refresh, this);
    app.on('redrawNavigationGroups', this.refresh, this);
    app.on('focusedModelChanged', this.refresh, this);

    app.rooms.on('change:unviewed', this.refresh, this);
    app.rooms.off(null, null, this);
  },
  componentWillUnmount: function () {
    app.off(null, null, this);
  },

  refresh: function () {
    var roomsAndGroups = [];
    var groupIds = [];
    _.each(app.rooms.toJSON(), (room) => {
      if (!room.group_id) {
        return;
      }
      groupIds.push(room.group_id);
      groupIds = _.uniq(groupIds);
      room.visible = groupIds.length <= (this.displayLimit);
      roomsAndGroups.push(room);
    });
    _.each(app.groups.toJSON(), (group) => {
      if (!app.rooms.iwhere('group_id', group.id)) {
        groupIds.push(group.id);
        groupIds = _.uniq(groupIds);
        group.visible = groupIds.length <= (this.displayLimit);
        roomsAndGroups.push(group);
      }
    });
    this.setState({
      elements: this.state.elements.cloneWithRows(roomsAndGroups),
      atLeastOne: (roomsAndGroups.length > 0),
      collapsed: true
    });
  },

  render: function () {
    if (!this.state.atLeastOne) {
      return null;
    }

    this.lastGroup = null;
    return (
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.title}>{i18next.t('drawerContentGroups:groups')}</Text>
          <View style={{flex:1}}/>
          {this._renderToggle()}
        </View>
        <ListView
          dataSource={this.state.elements}
          renderRow={(e) => this.renderElement(e)}
          style={styles.listView}
          scrollEnabled={false}
          />
        {this._renderMore()}
      </View>
    );
  },

  groupsCount: function() {
    var groupIds = [];
    _.each(app.rooms.toJSON(), (room) => {
      if (!room.group_id) {
        return;
      }
      groupIds.push(room.group_id);
    });
    _.each(app.groups.toJSON(), (group) => {
      groupIds.push(group.id);
    });

    return _.uniq(groupIds).length;
  },

  _renderToggle: function() {
    if (this.groupsCount() <= this.displayLimit) {
      return null;
    }

    return (
      <TouchableHighlight
        style={{ backgroundColor: '#6E7784', borderRadius: 3, paddingVertical: 5, paddingHorizontal: 10, marginRight:10 }}
        onPress={this.toggle}
        underlayColor='#6E7784'
        >
        <Text style={{fontFamily: 'Open Sans', fontSize: 12, color: '#353F4C'}}>{this.state.collapsed ? i18next.t('drawerContentGroups:see-all') : i18next.t('drawerContentGroups:see-less')}</Text>
      </TouchableHighlight>
    );
  },

  _renderMore: function () {
    if (!this.state.collapsed || this.groupsCount() <= this.displayLimit) {
      return null;
    }

    return (
      <TouchableHighlight
        style={{ marginLeft:20, paddingVertical: 10 }}
        onPress={this.toggle}
        underlayColor='#6E7784'
        >
        <Text style={{color: '#AFBAC8'}}>● ● ●</Text>
      </TouchableHighlight>
    );
  },

  renderElement: function (e) {
    if (e.visible === false) {
      return null;
    }

    var groupModel;
    if (e.type === 'group') {
      groupModel = app.groups.get(e.group_id);
      return (
        <TouchableHighlight
        underlayColor='transparent'
        onPress={() => app.trigger('joinGroup', e.group_id)}
        >
        <View style={styles.item}>
          <Text style={[styles.itemTitle, e.blocked && {textDecorationLine: 'line-through'}, {color: (groupModel.get('focused')) ? '#FFFFFF' : '#AFBAC8'}]}>#{e.name}</Text>
          <TouchableHighlight
            underlayColor= 'transparent'
            style={{marginRight: 20}}
            onPress={() => app.client.groupLeave(e.group_id)}
          >
            <Icon
              name='close'
              size={18}
              color='#AFBAC8'
            />
          </TouchableHighlight>
        </View>
      </TouchableHighlight>
      );
    }
    var group = null;
    if (e.group_id && e.group_name && e.group_id !== this.lastGroup) {
      this.lastGroup = e.group_id;
      groupModel = app.groups.get(e.group_id);
      group = (
        <TouchableHighlight
          underlayColor= 'transparent'
          onPress={() => app.trigger('joinGroup', e.group_id)}
          >
          <View style={styles.item}>
            <Text style={[styles.itemTitle, {color: (groupModel.get('focused')) ? '#FFFFFF' : '#AFBAC8'}]}>#{e.group_name}</Text>
          </View>
        </TouchableHighlight>
      );
    }

    var model = app.rooms.get(e.room_id);
    if (!model) {
      return null;
    }

    if (e.blocked) {
      return (
        <View>
          {group}
          <TouchableHighlight
            onPress={() => navigation.navigate('Discussion', model)}
            underlayColor= 'transparent'
            >
            <View style={(model.get('group_id')) ? styles.itemGroup : styles.item}>
              <Text style={[styles.itemTitle, {textDecorationLine: 'line-through', color: '#e74c3c'}, {color: (model.get('focused')) ? '#FFFFFF' : '#AFBAC8'}]}>
                {(model.get('group_id')) ? '/' + model.get('name') : '#' + model.get('name')}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }

    var badge = null;
    if (model.get('unviewed')) {
      badge = (
        <Text style={styles.unviewed}>●</Text>
      );
    }

    return (
      <View>
        {group}
        <TouchableHighlight
          onPress={() => navigation.navigate('Discussion', model)}
          underlayColor= 'transparent'
          >
          <View style={(model.get('group_id')) ? styles.itemGroup : styles.item}>
            <Text style={[styles.itemTitle, {color: (model.get('focused')) ? '#FFFFFF' : '#AFBAC8'}]}>
              {(model.get('group_id')) ? '/' + model.get('name') : '#' + model.get('name')}
            </Text>
            {badge}
          </View>
        </TouchableHighlight>
      </View>
    );
  },
  toggle: function () {
    LayoutAnimation.configureNext(animation);
    var roomsAndGroups = [];
    if (this.state.collapsed) {
      _.each(app.rooms.toJSON(), (room) => {
        if (room.group_id) {
          room.visible = true;
          roomsAndGroups.push(room);
        }
      });
      _.each(app.groups.toJSON(), (group) => {
        if (!app.rooms.iwhere('group_id', group.id)) {
          group.visible = true;
          roomsAndGroups.push(group);
        }
      });
      return this.setState({
        elements: this.state.elements.cloneWithRows(roomsAndGroups),
        atLeastOne: (roomsAndGroups.length > 0),
        collapsed: false
      });
    }

    var groupIds = [];
    _.each(app.rooms.toJSON(), (room) => {
      if (room.group_id) {
        groupIds.push(room.group_id);
        groupIds = _.uniq(groupIds);
        room.visible = groupIds.length <= (this.displayLimit);
        roomsAndGroups.push(room);
      }
    });
    _.each(app.groups.toJSON(), (group) => {
      if (!app.rooms.iwhere('group_id', group.id)) {
        groupIds.push(group.id);
        groupIds = _.uniq(groupIds);
        group.visible = groupIds.length <= (this.displayLimit);
        roomsAndGroups.push(group);
      }
    });
    this.setState({
      elements: this.state.elements.cloneWithRows(roomsAndGroups),
      atLeastOne: (roomsAndGroups.length > 0),
      collapsed: true
    });
  }

});

var styles = StyleSheet.create({
  title: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '600',
    margin: 10,
    color: '#19212A'
  },
  listView: {},
  item: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemGroup: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20
  },
  itemTitle: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
    flex: 1,
    marginVertical: 15
  },
  unviewed: {
    fontSize: 20,
    color: '#fc2063',
    marginRight: 10
  },
  leaveGroupButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  }
});

module.exports = NavigationGroupsView;
