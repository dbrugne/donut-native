'use strict';

var React = require('react-native');
var { ScrollView, Component } = React;

var GroupHeader = require('./GroupHeader');
var GroupContent = require('./GroupContent');
var app = require('../libs/app');
var LoadingView = require('../components/Loading');
var alert = require('../libs/alert');
var i18next = require('../libs/i18next');

var GroupView = React.createClass({
  propTypes: {
    model: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      loading: true,
      data: null
    };
  },
  componentDidMount () {
    app.on('refreshGroup', this.fetchData, this);

    if (this.props.model.get('id')) {
      app.client.groupJoin(this.props.model.get('id'));
    }
  },
  componentWillUnmount () {
    app.off(null, null, this);
  },
  onFocus () {
    this.fetchData();
  },
  fetchData() {
    app.client.groupRead(this.props.model.get('id'), {users: true, rooms: true}, (data) => this.onData(data));
  },
  onData (response) {
    if (response.err) {
      return alert.show(i18next.t('messages.' + response.err));
    }

    this.setState({
      loading: false,
      data: response
    });
  },
  render () {
    if (this.state.loading) {
      return (
        <LoadingView/>
      );
    }

    return (
      <ScrollView style={{ flexDirection: 'column', flexWrap: 'wrap', backgroundColor: '#f0f0f0' }}>
        <GroupHeader data={this.state.data}/>
        <GroupContent data={this.state.data} {...this.props} />
      </ScrollView>
    );
  }
});

module.exports = GroupView;
