'use strict';

var React = require('react-native');
var { ScrollView } = React;

var GroupHeader = require('./GroupHeader');
var GroupContent = require('./GroupContent');
var app = require('../libs/app');
var LoadingView = require('../components/Loading');
var Button = require('../components/Button');
var alert = require('../libs/alert');
var navigation = require('../navigation/index');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'Group', {
  'request-membership': 'REQUEST MEMBERSHIP'
});

var GroupView = React.createClass({
  propTypes: {
    model: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      loaded: false,
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
  fetchData () {
    app.client.groupRead(this.props.model.get('id'), {users: true, rooms: true}, (data) => this.onData(data));
  },
  onData (response) {
    if (response.err) {
      return alert.show(i18next.t('messages.' + response.err));
    }

    this.setState({
      loaded: true,
      data: response
    });
  },
  render () {
    if (!this.state.loaded) {
      return (
        <LoadingView/>
      );
    }

    return (
      <ScrollView style={{ flexDirection: 'column', flexWrap: 'wrap' }}>
        <GroupHeader data={this.state.data}>
          {this._renderActions()}
        </GroupHeader>
        <GroupContent data={this.state.data} {...this.props} />
      </ScrollView>
    );
  },
  _renderActions: function () {
    if (this.state.data.is_member || this.state.data.is_op || this.state.data.i_am_banned || this.state.data.is_owner) {
      return null;
    }

    return (
      <Button onPress={() => navigation.navigate('GroupAsk', this.state.data)}
              label={i18next.t('Group:request-membership')}
              type='white'
              style={{ alignSelf: 'stretch', marginHorizontal: 20, marginTop: 20 }}
        />
    );
  }
});

module.exports = GroupView;
