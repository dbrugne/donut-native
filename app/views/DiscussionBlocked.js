'use strict';

var React = require('react-native');
var s = require('../styles/style');
var Link = require('../components/Link');
var ListItem = require('../components/ListItem');
var common = require('@dbrugne/donut-common/mobile');
var navigation = require('../navigation/index');
var app = require('../libs/app');
var currentUser = require('../models/current-user');
var Disclaimer = require('../components/Disclaimer');

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
  'disallow': 'This donut is private.',
  'request': 'To join,',
  'click': 'Request an access.',
  'password': 'direct access',
  'password-placeholder': 'password',
  'join': 'join',
  'not-confirmed': 'Not confirmed user can\'t join private discussions',
  'ban': 'You were banned from this donut',
  'groupban': 'You were banned from this community',
  'kick': 'You have been kicked out from this donut.',
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
      <View style={{flex: 1}}>
        <ScrollView style={styles.main}>
          <View style={styles.container}>
            {this._renderAvatar(this.props.model.get('avatar'))}
            <Text style={styles.identifier}>{this.props.model.get('identifier')}</Text>
            <TouchableHighlight
              onPress={() => navigation.navigate('Profile', {type: 'user', id: this.props.model.get('owner_id'), identifier: '@' + this.props.model.get('owner_username')})}>
              <Text>
                <Text>{i18next.t('discussionBlocked:by')}</Text>
                <Text style={styles.ownerUsername}>@{this.props.model.get('owner_username')}</Text>
              </Text>
            </TouchableHighlight>

            {this._renderDescription()}

            <Disclaimer owner_id={this.props.model.get('owner_id')}
                        owner_username={this.props.model.get('owner_username')}
                        text={this.props.model.get('disclaimer')}
                        navigator={this.props.navigator}
            />

          </View>

          {this._renderActions()}

          <Text style={s.listGroupItemSpacing}/>
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
  _renderDescription: function () {
    if (!this.props.model.get('description')) {
      return null;
    }

    return (
      <Text style={styles.description}>{description}</Text>
    );
  },
  _renderActions: function () {
    var why = (!this.state.userConfirmed)
      ? 'not-confirmed'
      : this.props.model.get('blocked_why');

    var rejoinButton = (why !== 'ban' && why !== 'groupban' && why !== 'not-confirmed')
      ? <ListItem onPress={() => this.onJoin()}
                  text={i18next.t('discussionBlocked:click')}
                  action
                  first
                  type='button'
    />
      : null;
    return (
      <View>
        <Text style={{marginHorizontal: 10, marginVertical: 10}}>
          {i18next.t('discussionBlocked:' + why)}
        </Text>
        {rejoinButton}
      </View>
    );
  },

  onJoin: function () {
    app.client.roomBecomeMember(this.props.model.get('id'), (data) => {
      if (data.err) {
        return;
      }
      if (data && data.infos) {
        return navigation.navigate('DiscussionBlockJoin', data.infos);
      } else if (data.success) {
        app.client.roomJoin(this.props.model.get('id'), null, function (response) {
          // @todo handle errors
          return;
        });
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
