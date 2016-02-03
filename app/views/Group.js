'use strict';

var React = require('react-native');
var { ScrollView, StyleSheet, Component } = React;

var GroupHeader = require('./GroupHeader');
var GroupContent = require('./GroupContent');
var app = require('../libs/app');
var LoadingView = require('../components/Loading');
var alert = require('../libs/alert');
var i18next = require('../libs/i18next');

class GroupView extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      data: null
    };
  }

  componentDidMount () {
    app.on('refreshGroup', this.onRefresh, this);

    //if (this.state.model) {
    //  this.state.model.on('redraw', this.onRefresh, this);
    //}

    // @todo still usefull ?
    if (this.props.model.get('id')) {
      app.client.groupJoin(this.props.model.get('id'));
    }
  }

  onFocus () {
    this.onRefresh(false);
  }

  componentWillUnmount () {
    app.off('refreshGroup', this.onRefresh, this);

    //if (this.props.model) {
    //  this.props.model.off(null, null, this);
    //}
  }

  onData (response) {
    if (response.err) {
      return alert.show(i18next.t('messages.' + response.err));
    }

    this.setState({
      loading: false,
      data: response
    });
  }

  render () {
    if (this.state.loading) {
      return (
        <LoadingView/>
      );
    }

    return (
      <ScrollView style={styles.main}>
        <GroupHeader  model={this.state.data}/>
        <GroupContent data={this.state.data} {...this.props} />
      </ScrollView>
    );
  }

  onRefresh (force) {
    if (this.state.data === null || force) {
      this.setState({
        loading: true
      });
      app.client.groupRead(this.props.model.get('id'), {users: true, rooms: true}, (data) => this.onData(data));
    }
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  }
});

module.exports = GroupView;
