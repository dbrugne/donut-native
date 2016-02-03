'use strict';

var React = require('react-native');
var { ScrollView, StyleSheet } = React;

var GroupHeader = require('./GroupHeader');
var GroupContent = require('./GroupContent');
var app = require('../libs/app');
var LoadingView = require('../components/Loading');

var GroupHomeView = React.createClass({
  propTypes: {
    element: React.PropTypes.object,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    this.id = this.props.element.id;
    return {
      loading: true,
      data: null,
      error: null
    };
  },
  componentDidMount: function () {
    app.on('refreshGroup', this.onRefresh, this);
    this.model = app.groups.iwhere('group_id', this.id);
    if (this.model) {
      this.model.on('redraw', this.onRefresh, this);
    }
    if (this.id) {
      app.client.groupJoin(this.id, (response) => {
        return;
      });
    }
  },
  onFocus: function () {
    this.onRefresh();
  },
  componentWillUnmount: function () {
    app.off('refreshGroup', this.onRefresh, this);
    if (this.model) {
      this.model.off(null, null, this);
    }
  },
  onData: function (response) {
    if (response.err) {
      return this.setState({
        error: 'error'
      });
    }
    this.setState({
      loading: false,
      data: response
    });
  },
  render: function () {
    if (this.state.loading) {
      return (
        <LoadingView/>
      );
    }
    return (
      <ScrollView style={styles.main}>
        <GroupHeader  id={this.props.element.id} />
        <GroupContent data={this.state.data} navigator={this.props.navigator} />
      </ScrollView>
    );
  },
  onRefresh: function () {
    this.setState({
      loading: true,
      data: null,
      error: null
    });
    if (this.id) {
      app.client.groupRead(this.id, {users: true, rooms: true}, (data) => this.onData(data));
    }
  }
});

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  }
});

module.exports = GroupHomeView;
