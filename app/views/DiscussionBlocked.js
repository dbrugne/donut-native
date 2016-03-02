'use strict';

var React = require('react-native');
var Button = require('../components/Button');
var Disclaimer = require('../components/Disclaimer');
var alert = require('../libs/alert');
var navigation = require('../navigation/index');
var app = require('../libs/app');
var currentUser = require('../models/current-user');
var DiscussionHeader = require('./DiscussionHeader');
var _ = require('underscore');

var {
  StyleSheet,
  View,
  Text,
  Image
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'discussionBlocked', {
  'click': 'REQUEST AN ACCESS',
  'join': 'JOIN',
  'close': 'CLOSE THIS DISCUSSION',
  'disallow': 'This discussion is private.',
  'ban': 'You were banned from this discussion',
  'groupban': 'You were banned from this community',
  'kick': [
    'You have been kicked out by moderators.',
    'You can join back'
  ]
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
        <DiscussionHeader model={this.props.model}>
          {this._renderActions()}
        </DiscussionHeader>

        {this._renderDisclaimer()}

        <View style={{ flex: 1 }}/>

        <Button type='red'
                onPress={() => this.props.model.leaveBlocked()}
                label={i18next.t('discussionBlocked:close')}
                style={{ margin: 20, alignSelf: 'stretch' }}
          />
      </View>
    );
  },
  _renderActions: function () {
    // kicked or banned
    if (_.indexOf(['groupban', 'ban'], this.props.model.get('blocked_why')) !== -1) {
      return null;
    }

    return (
      <Button onPress={() => this.onJoin()}
              label={this.props.model.get('blocked_why') === 'kick' ? i18next.t('discussionBlocked:join') : i18next.t('discussionBlocked:click')}
              type='white'
              style={{ alignSelf: 'stretch', marginHorizontal: 20, marginTop: 20 }}
        />
    );
  },

  _renderDisclaimer: function () {
    var why = this.props.model.get('blocked_why');

    if (why === 'disallow') {
      return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
          <Image source={require('../assets/arrow-top-gray.png')} style={{ width: 30, height: 8.5, resizeMode: 'contain', marginTop: -8.5 }}/>
          <Disclaimer {...this.props} title={i18next.t('discussionBlocked:disallow')} />
        </View>
      );
    }

    if (why === 'kick') {
      return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
          <Image source={require('../assets/arrow-top-red.png')} style={{ width: 30, height: 8.5, resizeMode: 'contain', marginTop: -8.5 }}/>
          <View style={{ backgroundColor: '#F15261', padding: 20, alignSelf: 'stretch' }}>
            <Text style={{ fontFamily: 'Open Sans', fontSize: 14, color: '#FFFFFF' }}>
              {i18next.t('discussionBlocked:kick')}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
        <View style={{ backgroundColor: '#F15261', padding: 20, alignSelf: 'stretch' }}>
          <Text style={{ fontFamily: 'Open Sans', fontSize: 14, color: '#FFFFFF' }}>
            {i18next.t('discussionBlocked:' + why)}
          </Text>
        </View>
      </View>
    );
  },

  onJoin: function () {
    app.client.roomBecomeMember(this.props.model.get('id'), (data) => {
      if (data.err) {
        return;
      }
      if (data && data.infos) {
        return navigation.navigate('DiscussionBlockedJoin', data.infos, this.props.model);
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
