'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  Text,
  Component,
  ListView,
  TouchableHighlight
} = React;

var app = require('../libs/app');
var rooms = require('../collections/rooms');
var navigation = require('../libs/navigation');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'rooms': 'ROOMS'
});

class NavigationRoomsView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      elements: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return (row1 !== row2);
        }
      })
    };
    this.lastGroup =  null;
  }

  componentDidMount () {
    app.on('redrawNavigation', this.refreshData, this);
    app.on('redrawNavigationRooms', this.refreshData, this);
    app.on('viewedEvent', this.refreshData, this);
  }
  componentWillUnmount () {
    app.off(null, null, this);
  }

  refreshData () {
    this.lastGroup = null;
    this.setState({
      elements: this.state.elements.cloneWithRows(rooms.toJSON())
    });
  }

  render () {
    var title = null;
    if (rooms.length > 0) {
      title = (
        <View style={{backgroundColor: '#1D1D1D'}}>
          <Text style={styles.title}>{i18next.t('local:rooms')}</Text>
        </View>
      );
    }
    return (
      <View>
        {title}
        <ListView
          dataSource={this.state.elements}
          renderRow={this.renderElement.bind(this)}
          style={styles.listView}
          scrollEnabled={false}
        />
      </View>
    );
  }

  renderElement (e) {
    var group = null;
    if (e.group_id && e.group_name && e.group_id !== this.lastGroup) {
      this.lastGroup =  e.group_id;
      group = (
        <TouchableHighlight
          style={styles.linkBlock}
          underlayColor= '#414041'
          >
          <View style={styles.item}>
            <Text style={styles.itemTitle}>#{e.group_name}</Text>
          </View>
        </TouchableHighlight>
      );
    }

    var model = rooms.get(e.room_id);
    if (!model) {
      return(<View></View>);
    }

    if (e.blocked) {
      return (
        <View>
          {group}
          <TouchableHighlight
            style={styles.linkBlock}
            onPress={() => navigation.switchTo(navigation.getBlockedDiscussion(model.get('id'), model))}
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
        style={styles.linkBlock}
        onPress={() => navigation.switchTo(navigation.getDiscussion(model.get('id'), model))}
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
};

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
    marginVertical: 5,
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
    flex:1
  },
  unviewed: {
    fontSize: 20,
    color: '#fc2063',
    marginRight:10
  },
  linkBlock: {
    paddingTop: 2,
    paddingBottom: 2,
    borderTopColor: '#373737',
    borderTopWidth: 0.5,
    borderStyle: 'solid',
    borderBottomColor: '#0E0D0E',
    borderBottomWidth: 0.5
  }
});

module.exports = NavigationRoomsView;
