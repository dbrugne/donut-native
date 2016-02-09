'use strict';

var React = require('react-native');
var {
  View,
  ListView
} = React;

var _ = require('underscore');
var app = require('../libs/app');
var LoadingView = require('../components/Loading');
var Card = require('../components/Card');
var alert = require('../libs/alert');
var navigation = require('../navigation/index');
var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupList', {
  '': ''
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
      <View style={{flex: 1}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(room) => this._renderElement(room)}
          style={{alignSelf: 'stretch'}}
          />
      </View>
    );
  },
  _renderElement (group) {
    return (
      <Card
        onPress={() => navigation.navigate('Group', {id: group.group_id, name: group.name})}
        image={group.avatar}
        type='group'
        key={group.room_id}
        identifier={group.name}
        description={group.description}
        />
    );
  }
});

module.exports = GroupListView;
