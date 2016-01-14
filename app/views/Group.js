'use strict';

var React = require('react-native');

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
      model: null,
      error: null
    };
  },
  componentDidMount: function () {
    app.on('refreshGroup', this.onRefresh, this);
    if (this.id) {
      app.client.groupJoin(this.id, (response) => {
        if (response.err) {
          return;
        }
        app.client.groupRead(this.id, {users: true}, (data) => {
          app.groups.addModel(data);
          this.setState({model: app.groups.iwhere('group_id', this.id)});
          if (this.state.model) {
            this.state.model.on('redraw', () => this.onRefresh(), this);
          }
          this.onData(data);
        });
      });
    }
  },
  componentWillUnmount: function () {
    app.off('refreshGroup', this.onRefresh, this);
    if (this.state.model) {
      this.state.model.off(null, null, this);
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
      <GroupContent data={this.state.data} model={this.state.model} navigator={this.props.navigator} />
    );
  },
  onRefresh: function () {
    this.setState({
      loading: true,
      data: null,
      error: null
    });
    if (this.id) {
      app.client.groupRead(this.id, {users: true}, (data) => this.onData(data));
    }
  }
});

module.exports = GroupHomeView;
