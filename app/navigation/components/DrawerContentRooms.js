'use strict';

var React = require('react-native');
var _ = require('underscore');

var {
  StyleSheet,
  View,
  Text,
  Component,
  ListView,
  LayoutAnimation,
  TouchableHighlight
  } = React;

var app = require('../../libs/app');
var navigation = require('../index');
var animation = require('../../libs/animations').callapse;
var Icon = require('react-native-vector-icons/FontAwesome');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'drawerContentRooms', {
  'rooms': 'DISCUSSIONS',
  'see-all': 'see all',
  'see-less': 'see less'
});

class NavigationRoomsView extends Component {
  constructor (props) {
    super(props);
    this.displayLimit = 4;
    this.state = {
      elements: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return (row1 !== row2);
        }
      }),
      collapsed: true
    };
    this.lastGroup = null;
  }

  componentDidMount () {
    app.on('redrawNavigation', this.refresh, this);
    app.on('redrawNavigationRooms', this.refresh, this);
    app.on('focusedModelChanged', this.refresh, this);
    app.rooms.on('change:unviewed', this.refresh, this);
  }

  componentWillUnmount () {
    app.off(null, null, this);
    app.rooms.off(null, null, this);
  }

  refresh () {
    var rooms = [];
    _.each(app.rooms.toJSON(), (room) => {
      if (room.group_id) {
        return;
      }
      room.visible = (rooms.length <= (this.displayLimit - 1));
      rooms.push(room);
    });
    this.setState({
      rooms: rooms,
      collapsed: true,
      elements: this.state.elements.cloneWithRows(rooms)
    });
  }

  render () {
    if (app.rooms.length === 0) {
      return null;
    }

    this.lastGroup = null;
    return (
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.title}>{i18next.t('drawerContentRooms:rooms')}</Text>
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
  }

  roomCount() {
    var _roomsCount = 0;
    _.each(app.rooms.toJSON(), (room, idx) => {
      if (room.group_id) {
        return;
      }
      _roomsCount++;
    });
    return _roomsCount;
  }

  _renderToggle() {
    if (this.roomCount() <= this.displayLimit) {
      return null;
    }

    return (
      <TouchableHighlight
        style={{ backgroundColor: '#6E7784', borderRadius: 3, paddingVertical: 5, paddingHorizontal: 10, marginRight:10 }}
        onPress={this.toggle.bind(this)}
        underlayColor='#6E7784'
        >
        <Text
          style={{fontFamily: 'Open Sans', fontSize: 12, color: '#353F4C'}}>{this.state.collapsed ? i18next.t('drawerContentRooms:see-all') : i18next.t('drawerContentRooms:see-less')}</Text>
      </TouchableHighlight>
    );
  }

  _renderMore () {
    if (!this.state.collapsed || this.roomCount() <= this.displayLimit) {
      return null;
    }

    return (
      <TouchableHighlight
        style={{ marginLeft:20, paddingVertical: 10 }}
        onPress={this.toggle.bind(this)}
        underlayColor='transparent'
        >
        <Text style={{color: '#AFBAC8'}}>● ● ●</Text>
      </TouchableHighlight>
    );
  }

  renderElement (e) {
    if (e.visible === false) {
      return null;
    }

    var model = app.rooms.get(e.room_id);
    if (!model) {
      return null;
    }

    if (e.blocked) {
      return (
        <View>
          <TouchableHighlight
            onPress={() => navigation.navigate('Discussion', model)}
            underlayColor='transparent'
            >
            <View style={styles.item}>
              <Text style={[styles.itemTitle, {color: (model.get('focused')) ? '#FFFFFF' : '#AFBAC8'}, {textDecorationLine: 'line-through'}]}> {('#' + model.get('name'))} </Text>
              <TouchableHighlight
                underlayColor= 'transparent'
                style={{marginRight: 20}}
                onPress={() => app.client.roomLeaveBlock(e.room_id)}
                >
                <Icon
                  name='close'
                  size={18}
                  color='#AFBAC8'
                  />
              </TouchableHighlight>
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
        <TouchableHighlight
          onPress={() => navigation.navigate('Discussion', model)}
          underlayColor='transparent'
          >
          <View style={styles.item}>
            <Text style={[styles.itemTitle, {color: (model.get('focused')) ? '#FFFFFF' : '#AFBAC8'}]}>
              {('#' + model.get('name'))}
            </Text>
            {badge}
          </View>
        </TouchableHighlight>
      </View>
    );
  }
  toggle () {
    LayoutAnimation.configureNext(animation);
    var rooms = [];
    if (this.state.collapsed) {
      _.each(app.rooms.toJSON(), (room) => {
        if (room.group_id) {
          return;
        }
        room.visible = true;
        rooms.push(room);
      });
      return this.setState({
        rooms: rooms,
        collapsed: false,
        elements: this.state.elements.cloneWithRows(rooms)
      });
    }

    _.each(app.rooms.toJSON(), (room) => {
      if (room.group_id) {
        return;
      }
      room.visible = (rooms.length <= (this.displayLimit - 1));
      rooms.push(room);
    });
    this.setState({
      rooms: rooms,
      collapsed: true,
      elements: this.state.elements.cloneWithRows(rooms)
    });
  }
}

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
  }
});

module.exports = NavigationRoomsView;
