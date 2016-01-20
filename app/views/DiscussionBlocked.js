'use strict';

var React = require('react-native');
var s = require('../styles/style');
var Link = require('../components/Link');
var ListItem = require('../components/ListItem');
var common = require('@dbrugne/donut-common/mobile');
var DiscussionBlockedJoin = require('./DiscussionBlockedJoin');
var navigation = require('../navigation/index');
var app = require('../libs/app');
var currentUser = require('../models/current-user');

var {
  StyleSheet,
  View,
  ScrollView,
  TouchableHighlight,
  Image,
  Text
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'discussionBlocked', {
  'by': 'by',
  'allowed': 'This donut is private.',
  'request': 'To request access, ',
  'click': 'click here.',
  'password': 'direct access',
  'password-placeholder': 'password',
  'join': 'join',
  'ban': 'You were banned from this donut',
  'groupban': 'You were banned from this community',
  'kicked': 'You have been kicked out from this donut.',
  'rejoin': ' to get back in.',
  'close': 'Close this donut'
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
  },
  componentWillUnmount: function () {
    currentUser.off(null, null, this);
  },

  onFocus: function () {
    this.render();
  },

  render: function () {
    console.log('render');
    let description = null;
    if (this.props.model.get('description')) {
      description = (
        <Text style={styles.description}>{description}</Text>
      );
    }

    let banned = this._renderBanned();
    let kicked = null;
    let join = null;
    if (!this.state.userConfirmed || this.props.model.get('blocked_why') === 'disallow' || this.props.model.get('blocked_why') === 'other') {
      join = (
        <DiscussionBlockedJoin {...this.props} />
      );
    }
    if (!banned && !join) {
      kicked = this._renderKicked();
    }

    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.main}>
          <View style={styles.container}>
            {this._renderAvatar(this.props.model.get('avatar'))}
            <Text style={styles.identifier}>{this.props.model.get('identifier')}</Text>
            <TouchableHighlight
              onPress={() => navigation.navigate('Profile', {type: 'user', id: this.props.model.get('owner_id'), identifier: '@' + this.props.model.get('owner_username')})}>
              <Text>
                <Text>{i18next.t('discussionBlocked:by')} </Text>
                <Text style={styles.ownerUsername}>@{this.props.model.get('owner_username')}</Text>
              </Text>
            </TouchableHighlight>
            {description}
          </View>

          {banned}
          {kicked}
          {join}

          <ListItem type='button'
                    onPress={() => this.props.model.leaveBlocked()}
                    text={i18next.t('discussionBlocked:close')}
                    ation
                    first
                    last
                    warning
            />

        </ScrollView>
      </View>
    );
  },

  _renderAvatar: function (avatar) {
    if (!avatar) {
      return null;
    }
    var avatarUrl = common.cloudinary.prepare(avatar, 120);
    if (!avatarUrl) {
      return null;
    }

    return (
      <Image style={styles.avatar} source={{uri: avatarUrl}}/>
    );
  },

  _renderBanned: function () {
    if (this.props.model.get('blocked_why') !== 'ban' && this.props.model.get('blocked_why') !== 'groupban') {
      return null;
    }

    let banned = (
      <View style={[s.alertError, {marginHorizontal: 0, borderRadius: 0}]}>
        <Text style={s.alertErrorText}>
          {i18next.t('discussionBlocked:' + this.props.model.get('blocked_why'))}
        </Text>
      </View>
    );

    return banned;
  },

  _renderKicked: function () {
    return (
      <View style={[s.alertError, {marginHorizontal: 0, borderRadius: 0}]}>
        <Link onPress={(() => this.onJoin())}
              prepend={i18next.t('discussionBlocked:kicked')}
              append={i18next.t('discussionBlocked:rejoin')}
              text={i18next.t('discussionBlocked:click')}
              linkStyle={s.alertErrorText}
              prependStyle={s.alertErrorText}
              appendStyle={s.alertErrorText}
              type='underlined'
          />
      </View>
    );
  },

  onJoin: function () {
    app.client.roomJoin(this.props.model.get('id'), null, (response) => {
      if (response.err) {
        // @todo handle errors
        return;
      }
    });
  }
});

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10
  },
  identifier: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold'
  },
  ownerUsername: {
    fontFamily: 'Open Sans',
    fontWeight: 'bold'
  },
  description: {
    marginVertical: 20,
    marginHorizontal: 10,
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 16
  }
});

module.exports = DiscussionBlocked;
