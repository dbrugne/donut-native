'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  Text,
  Component,
  ListView,
  Image,
  TouchableHighlight
} = React;

var common = require('@dbrugne/donut-common/mobile');
var app = require('../libs/app');
var onetoones = require('../collections/onetoones');

var OnetooneView = require('../views/Onetoone'); // @todo : implement routing logic

class NavigationOnesView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      elements: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return (row1 !== row2);
        }
      })
    };
  }

  componentWillMount () {
    app.on('redrawNavigation', () => this.refreshData());
    app.on('redrawNavigationOnes', () => this.refreshData());
  }

  refreshData () {
    this.setState({
      elements: this.state.elements.cloneWithRows(onetoones.toJSON())
    });
  }

  render () {
    return (
      <View style={styles.block}>
        <Text style={styles.title}>onetoones</Text>
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
    var avatarUrl = common.cloudinary.prepare(e.avatar, 30)
    return (
      <TouchableHighlight onPress={() => this.navigateToOne(e.user_id, e.username)}>
        <View style={styles.item}>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <View style={styles.rightContainer}>
              <Text style={styles.itemTitle}>@{e.username}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  navigateToOne (id, title) {
    app.trigger('navigateTo', {
      name: 'one-' + id,
      title: title,
      component: OnetooneView,
      id: id
    });
  }

};

var styles = StyleSheet.create({
  block: {
    marginBottom: 15,
  },
  title: {
    fontFamily: 'Open Sans',
    fontSize: 12,
    fontWeight: 'bold',
    paddingLeft: 10,
    marginBottom: 8,
    color: '#FFFFFF'
  },
  listView: {
  },
  item: {
    paddingLeft: 10,
    paddingVertical: 3,
    flexDirection: 'row'
  },
  thumbnail: {
    width: 30,
    height: 30
  },
  rightContainer: {
    flex: 1,
    paddingLeft: 10
  },
  itemTitle: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    color: '#FFFFFF'
  }
});

module.exports = NavigationOnesView;
