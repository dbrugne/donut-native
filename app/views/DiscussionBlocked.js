'use strict';

var React = require('react-native');
var s = require('../styles/style');
var Link = require('../components/Link');
var ListItem = require('../components/ListItem');
var Button = require('../components/Button');
var alert = require('../libs/alert');
var common = require('@dbrugne/donut-common/mobile');
var navigation = require('../navigation/index');
var app = require('../libs/app');
var currentUser = require('../models/current-user');
var Disclaimer = require('../components/Disclaimer');
var DiscussionHeader = require('./DiscussionHeader');
var _ = require('underscore');

var {
  StyleSheet,
  View,
  ScrollView,
  Text
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'discussionBlocked', {
  'click': 'REQUEST AN ACCESS.',
  'close': 'CLOSE THIS DISCUSSION'
  //'by': 'by',
  //'allowed': 'This discussion is private.',
  //'disallow': 'This discussion is private.',
  //'request': 'To join,',
  //'password': 'direct access',
  //'password-placeholder': 'password',
  //'join': 'join',
  //'not-confirmed': 'Not confirmed user can\'t join private discussions',
  //'ban': 'You were banned from this discussion',
  //'groupban': 'You were banned from this community',
  //'kick': 'You have been kicked out.',
  //'rejoin': ' to get back in.',
});

var DiscussionBlocked = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      userConfirmed: currentUser.get('confirmed')
    };
  },

  componentDidMount: function () {
    currentUser.on('change:confirmed', () => {
      this.setState({userConfirmed: currentUser.get('confirmed')});
    });
    this.props.model.on('change:blocked_why', () => {
      if (this.isMounted()) {
        this.forceUpdate();
      }
    }, this);
  },
  componentWillUnmount: function () {
    currentUser.off(null, null, this);
    this.props.model.off(this, null, null);
  },

  onFocus: function () {
    this.render();
  },
  render: function () {
    return (
      <View style={styles.container}>
        <DiscussionHeader model={this.props.model} >
          {this._renderActions()}
        </DiscussionHeader>

        <Disclaimer model={this.props.model}
                    navigator={this.props.navigator}
          />

        <View style={{ flex: 1 }}></View>

        <Button type='red'
                onPress={() => this.props.model.leaveBlocked()}
                label={i18next.t('discussionBlocked:close')}
                style={{ margin: 20, alignSelf: 'stretch' }}
          />
      </View>
    );
  },
  _renderActions: function () {
    //// not confirmed
    //if (!this.state.userConfirmed) {
    //  return null;
    //}

    // kicked or banned
    if (_.indexOf(['groupban', 'ban'], this.props.model.get('blocked_why')) !== -1) {
      return null;
    }

    return (
      <Button onPress={() => this.onJoin()}
              label={i18next.t('discussionBlocked:click')}
              type='white'
              style={{ alignSelf: 'stretch',  marginHorizontal: 20, marginTop: 20 }}
        />
    );

    //var why = (!this.state.userConfirmed)
    //  ? 'not-confirmed'
    //  : this.props.model.get('blocked_why');
    //
    //return (
    //  <View style={(why === 'ban' || why === 'groupban') && s.alertError}>
    //    <Text
    //      style={[{marginHorizontal: 10, marginVertical: 10}, (why === 'ban' || why === 'groupban') && s.alertErrorText]}>
    //      {i18next.t('discussionBlocked:' + why)}
    //    </Text>
    //  </View>
    //);
  },

  onJoin: function () {
    app.client.roomBecomeMember(this.props.model.get('id'), (data) => {
      if (data.err) {
        return;
      }
      if (data && data.infos) {
        return navigation.navigate('DiscussionBlockJoin', data.infos, this.props.model);
      } else if (data.success) {
        app.client.roomJoin(this.props.model.get('id'), null, function (response) {
          if (response.err) {
            return alert.show(i18next.t('messages.' + response.err));
          }
        });
      }
    });
  }
});
var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = DiscussionBlocked;
