'use strict';

var React = require('react-native');
var _ = require('underscore');

var {
  StyleSheet,
  View,
  Text,
  Component,
  ListView,
  TouchableHighlight
  } = React;

var app = require('../../libs/app');
var navigation = require('../index');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'drawer_content_groups', {
  'groups': 'COMMUNITIES'
});

var NavigationGroupsView = React.createClass({
  getInitialState: function () {
    this.lastGroup = null;
    return {
      elements: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return (row1 !== row2);
        }
      })
    };
  },

  componentDidMount: function () {
    app.on('redrawNavigation', this.refreshData, this);
    app.on('redrawNavigationGroups', this.refreshData, this);
    app.on('focusModelChanged', this.refreshData, this);
  },
  componentWillUnmount: function () {
    app.off(null, null, this);
  },

  refreshData: function () {
    var roomsAndGroups = [];
    _.each(app.rooms.toJSON(), (room) => {
      if (room.group_id) {
        roomsAndGroups.push(room);
      }
    });
    _.each(app.groups.toJSON(), (group) => {
      if (!app.rooms.iwhere('group_id', group.id)) {
        roomsAndGroups.push(group);
      }
    });
    this.setState({
      elements: this.state.elements.cloneWithRows(roomsAndGroups)
    });
  },

  render: function () {
    this.lastGroup = null;
    var title = null;
    if (app.groups.length > 0 || app.rooms.length > 0) {
      title = (
        <View style={{backgroundColor: '#1D1D1D'}}>
          <Text style={styles.title}>{i18next.t('drawer_content_groups:groups')}</Text>
        </View>
      );
    }
    return (
      <View>
        {title}
        <ListView
          dataSource={this.state.elements}
          renderRow={(e) => this.renderElement(e)}
          style={styles.listView}
          scrollEnabled={false}
          />
      </View>
    );
  },

  renderElement: function (e) {
    var groupModel;
    if (e.type === 'group') {
      groupModel = app.groups.iwhere('group_id', e.group_id);
      return (
        <TouchableHighlight
        style={[styles.linkBlock, {backgroundColor: (groupModel && groupModel.get('focused')) ? '#666' : '#222'}]}
        underlayColor= '#414041'
        onPress={() => navigation.navigate('Group', {name: e.name, id: e.group_id})}
        >
        <View style={styles.item}>
          <Text style={styles.itemTitle}>#{e.name}</Text>
        </View>
      </TouchableHighlight>
      );
    }
    var group = null;
    if (e.group_id && e.group_name && e.group_id !== this.lastGroup) {
      this.lastGroup = e.group_id;
      groupModel = app.groups.iwhere('group_id', e.group_id);
      group = (
        <TouchableHighlight
          style={[styles.linkBlock, {backgroundColor: (groupModel && groupModel.get('focused')) ? '#666' : '#222'}]}
          underlayColor= '#414041'
          onPress={() => navigation.navigate('Group', {name: e.group_name, id: e.group_id})}
          >
          <View style={styles.item}>
            <Text style={styles.itemTitle}>#{e.group_name}</Text>
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
            style={[styles.linkBlock, {backgroundColor: (model.get('focused')) ? '#666' : '#222'}]}
            onPress={() => navigation.navigate('Discussion', model)}
            underlayColor= '#414041'
            >
            <View style={(model.get('group_id')) ? styles.itemGroup : styles.item}>
              <Text style={[styles.itemTitle, {textDecorationLine: 'line-through'}]}>
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
          style={[styles.linkBlock, {backgroundColor: (model.get('focused')) ? '#666' : '#222'}]}
          onPress={() => navigation.navigate('Discussion', model)}
          underlayColor= '#414041'
          >
          <View style={(model.get('group_id')) ? styles.itemGroup : styles.item}>
            <Text style={styles.itemTitle}>
              {(model.get('group_id')) ? '/' + model.get('name') : '#' + model.get('name')}
            </Text>
            {badge}
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  title: {
    fontFamily: 'Open Sans',
    fontSize: 10,
    fontWeight: 'bold',
    margin: 10,
    color: '#FFFFFF'
  },
  listView: {
  },
  item: {
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemGroup: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20
  },
  thumbnail: {
    width: 30,
    height: 30,
    borderRadius: 4
  },
  itemTitle: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    color: '#ecf0f1',
    marginLeft: 10,
    flex: 1,
    marginVertical: 10
  },
  unviewed: {
    fontSize: 20,
    color: '#fc2063',
    marginRight: 10
  },
  linkBlock: {
    borderTopColor: '#373737',
    borderTopWidth: 0.5,
    borderStyle: 'solid',
    borderBottomColor: '#0E0D0E',
    borderBottomWidth: 0.5
  }
});

module.exports = NavigationGroupsView;
