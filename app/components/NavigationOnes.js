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
var navigation = require('../libs/navigation');

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
  componentDidMount () {
    app.on('redrawNavigation', () => this.refreshData());
    app.on('redrawNavigationOnes', () => this.refreshData());
  }
  componentWillUnmount () {
    app.off('redrawNavigation');
    app.off('redrawNavigationOnes');
  }
  refreshData () {
    this.setState({
      elements: this.state.elements.cloneWithRows(onetoones.toJSON())
    });
  }
  render () {
    return (
      <View style={styles.block}>
        <Text style={styles.title}>ONE TO ONES</Text>
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
    var model = onetoones.get(e.user_id);
    if (!model) {
      return;
    }

    var badge = null;
    if (model.get('unviewed')) {
      badge = (
        <Text style={styles.unviewed}>●</Text>
      );
    }

    var avatarUrl = common.cloudinary.prepare(e.avatar, 30);
    return (
      <TouchableHighlight
        onPress={() => navigation.switchTo(navigation.getDiscussion(model.get('id'), model))}
        underlayColor='#888888'
        >
        <View style={styles.item}>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <View style={styles.rightContainer}>
              <Text style={styles.itemTitle}>@{e.username}</Text>
              {badge}
          </View>
        </View>
      </TouchableHighlight>
    );
  }
};

var styles = StyleSheet.create({
  block: {
    marginBottom: 20
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
  },
  unviewed: {
    position: 'absolute',
    top: 0,
    right: 10,
    fontSize: 20,
    color: '#fc2063'
  }
});

module.exports = NavigationOnesView;
