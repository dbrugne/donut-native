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
var navigation = require('../libs/navigation');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'ones': 'ONE TO ONES'
});

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
    app.on('redrawNavigation', this.refreshData, this);
    app.on('redrawNavigationOnes', this.refreshData, this);
    app.on('viewedEvent', this.refreshData, this);
  }
  componentWillUnmount () {
    app.off(null, null, this);
  }
  refreshData () {
    this.setState({
      elements: this.state.elements.cloneWithRows(app.ones.toJSON())
    });
  }
  render () {
    var title = null;
    if (app.ones.length > 0) {
      title = (
        <View style={{backgroundColor: '#1D1D1D'}}>
          <Text style={styles.title}>{i18next.t('local:ones')}</Text>
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
    var model = app.ones.get(e.user_id);
    if (!model) {
      return;
    }

    var badge = null;
    if (model.get('unviewed')) {
      badge = (
        <Text style={styles.unviewed}>●</Text>
      );
    }

    var avatarUrl = common.cloudinary.prepare(e.avatar, 50);
    return (
      <TouchableHighlight
        style={styles.linkBlock}
        onPress={() => navigation.switchTo(navigation.getDiscussion(model.get('id'), model))}
        underlayColor= '#414041'
        >
        <View style={styles.item}>
          <Image
            source={{uri: avatarUrl}}
            style={styles.thumbnail}
            />
          <Text style={styles.itemTitle}>@{e.username}</Text>
          {badge}
        </View>
      </TouchableHighlight>
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
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumbnail: {
    width: 30,
    height: 30,
    borderRadius: 4
  },
  itemTitle: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
    flex:1,
    marginVertical: 15
  },
  unviewed: {
    fontSize: 20,
    color: '#fc2063',
    marginRight:10
  },
  linkBlock: {
    borderTopColor: '#373737',
    borderTopWidth: 0.5,
    borderStyle: 'solid',
    borderBottomColor: '#0E0D0E',
    borderBottomWidth: 0.5
  }
});

module.exports = NavigationOnesView;
