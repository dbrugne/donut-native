'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  Text,
  Component,
  ListView,
  Image,
  LayoutAnimation,
  TouchableHighlight
  } = React;

var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');
var app = require('../../libs/app');
var navigation = require('../index');
var animation = require('../../libs/animations').collapse;

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'drawerContentOnes', {
  'ones': 'ONE TO ONE ',
  'see-all': 'see all',
  'see-less': 'see less'
});

class NavigationOnesView extends Component {
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
  }

  componentDidMount () {
    app.on('redrawNavigation', this.refresh, this);
    app.on('redrawNavigationOnes', this.refresh, this);
    app.on('focusedModelChanged', this.refresh, this);
    app.ones.on('change:unviewed', this.refresh, this);
  }

  componentWillUnmount () {
    app.off(null, null, this);
    app.ones.off(null, null, this);
  }

  refresh () {
    this.setState({
      collapsed: true,
      elements: this.state.elements.cloneWithRows(
        _.map(app.ones.toJSON(), (e, idx) => {
            e.visible = (idx <= (this.displayLimit - 1));
            return e;
          }
        ))
    });
  }

  render () {
    if (app.ones.length === 0) {
      return null;
    }

    return (
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.title}>{i18next.t('drawerContentOnes:ones')}</Text>
          <View style={{flex:1}}/>
          {this._renderToggle()}
        </View>
        <ListView
          dataSource={this.state.elements}
          renderRow={this.renderElement.bind(this)}
          style={styles.listView}
          scrollEnabled={false}
          />
        {this._renderMore()}
      </View>
    );
  }

  _renderToggle() {
    if (app.ones.toJSON().length <= this.displayLimit) {
      return null;
    }

    return (
      <TouchableHighlight
        style={{ backgroundColor: '#6E7784', borderRadius: 3, paddingVertical: 5, paddingHorizontal: 10, marginRight:10 }}
        onPress={this.toggle.bind(this)}
        underlayColor='#6E7784'
        >
        <Text style={{fontFamily: 'Open Sans', fontSize: 12, color: '#353F4C'}}>{this.state.collapsed ? i18next.t('drawerContentOnes:see-all') : i18next.t('drawerContentOnes:see-less')}</Text>
      </TouchableHighlight>
    );
  }

  _renderMore () {
    if (!this.state.collapsed || app.ones.toJSON().length <= this.displayLimit) {
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

    return (
      <TouchableHighlight
        onPress={() => navigation.navigate('Discussion', model)}
        underlayColor='transparent'
        >
        <View style={styles.item}>
          {this._renderAvatar(e.avatar)}
          <Text style={[styles.itemTitle, {color: (model.get('focused')) ? '#FFFFFF' : '#AFBAC8'}]}>@{e.username}</Text>
          {badge}
        </View>
      </TouchableHighlight>
    );
  }

  _renderAvatar (avatar) {
    if (!avatar) {
      return null;
    }
    var avatarUrl = common.cloudinary.prepare(avatar, 50);
    if (!avatarUrl) {
      return null;
    }

    return (
      <Image style={styles.thumbnail} source={{uri: avatarUrl}}/>
    );
  }

  toggle () {
    LayoutAnimation.configureNext(animation);
    if (this.state.collapsed) {
      return this.setState({
        collapsed: false,
        elements: this.state.elements.cloneWithRows(
          _.map(app.ones.toJSON(), (e) => {
              e.visible = true;
              return e;
            }
          ))
      });
    }
    return this.setState({
      collapsed: true,
      elements: this.state.elements.cloneWithRows(
        _.map(app.ones.toJSON(), (e, idx) => {
            e.visible = (idx <= (this.displayLimit - 1));
            return e;
          }
        ))
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
  item: {
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumbnail: {
    width: 30,
    height: 30
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

module.exports = NavigationOnesView;
