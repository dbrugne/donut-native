'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  ScrollView,
  Text
} = React;

var _ = require('underscore');
var s = require('../styles/style');
var app = require('../libs/app');
var LoadingView = require('../components/Loading');
var Card = require('../components/Card');
var alert = require('../libs/alert');
var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupList', {
  'disclaimer': 'Join a community to access all its related discussions and hang out with their members'
});

var GroupListView = React.createClass({
  getInitialState: function () {
    return {
      loading: true,
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2})
    };
  },
  componentDidMount () {
    this.fetchData();
  },
  fetchData: function () {
    this.setState({loading: true});
    app.client.home((response) => {
      this.setState({loading: false});
      if (response.err) {
        return alert.show(i18next.t('messages.' + response.err));
      }
      var groups = [];
      _.each(response.rooms.list, function(elt){
        if (elt.type === 'group') {
          groups.push(elt);
        }
      });

      this.setState({
        loading: false,
        dataSource: this.state.dataSource.cloneWithRows(groups)
      });
    });
  },
  render () {
    if (this.state.loading) {
      return (<LoadingView/>);
    }

    return (
      <ScrollView>

        <View style={s.centeredBlock}>
          <Text style={s.centeredBlockText}>{i18next.t('GroupList:disclaimer')}</Text>
        </View>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderElement}
          style={{alignSelf: 'stretch', marginTop: 10}}
          scrollEnabled={false}
          />
      </ScrollView>
    );
  },
  _renderElement (group, sectionID, rowID) {
    return (
      <Card
        onPress={() => app.trigger('joinGroup', group.group_id)}
        image={group.avatar}
        type='group'
        first={rowID === '0'}
        key={group.group_id}
        identifier={group.name}
        count={group.users}
        description={group.description}
        />
    );
  }
});

module.exports = GroupListView;
