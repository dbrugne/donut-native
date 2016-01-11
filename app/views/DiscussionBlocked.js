'use strict';

var React = require('react-native');
var _ = require('underscore');
var s = require('../styles/style');
var Link = require('../components/Link');
var ListItem = require('../components/ListItem');
var date = require('../libs/date');
var common = require('@dbrugne/donut-common/mobile');
var DiscussionBlockedJoin = require('./DiscussionBlockedJoin');
var navigation = require('../navigation/index');
var app = require('../libs/app');

var {
  StyleSheet,
  View,
  Component,
  ScrollView,
  TouchableHighlight,
  Image,
  Text
  } = React;
var Icon = require('react-native-icons').Icon;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'by': 'by',
  'allowed': 'This donut is private.',
  'request': 'To request access, ',
  'click': 'click here.',
  'password': 'direct access',
  'password-placeholder': 'password',
  'join': 'join',
  'banned': 'You were banned from this donut on __at__',
  'groupbanned': 'You were banned from this community on __at__',
  'reason': 'for the following reason: ',
  'kicked': 'You have been kicked out from this donut.',
  'rejoin': ' to get back in.',
  'close': 'Close this donut'
});

class DiscussionBlocked extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    let description = null;
    if (this.props.model.get('description')) {
      description = (
        <Text style={styles.description}>{description}</Text>
      );
    }

    let banned = this._renderBanned();
    let kicked = this._renderKicked();
    let join = null;
    if (!banned && !kicked) {
      join = (
        <DiscussionBlockedJoin {...this.props} />
      );
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
                <Text>{i18next.t('local:by')} </Text>
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
                    text={i18next.t('local:close')}
                    ation
                    first
                    last
                    warning
            />

        </ScrollView>
      </View>
    );
  }

  _renderAvatar (avatar) {
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
  }

  _renderBanned () {
    if (this.props.model.get('blocked') !== 'banned' && this.props.model.get('blocked') !== 'groupbanned') {
      return null;
    }

    let bannedAt = null;
    if (this.props.model.get('banned_at')) {
      bannedAt = (
        <Text style={s.alertErrorText}>
          {i18next.t('local:' + this.props.model.get('blocked'), {at: date.dateTime(this.props.model.get('banned_at'))})}
        </Text>
      );
    }

    let bannedReason = null;
    if (this.props.model.get('reason')) {
      bannedReason = (
        <View style={{marginTop: 10, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}}>
          <Icon
            name='fontawesome|quote-right'
            size={14}
            color='#a94442'
            style={{width: 14, height: 14, marginTop: 2}}
            />
          <View style={{flexDirection: 'column', flex:1, justifyContent: 'center'}}>
            <Text
              style={[s.alertErrorText, {fontStyle: 'italic', paddingLeft: 5}]}>{this.props.model.get('reason')}</Text>
          </View>
        </View>
      );
    }

    let banned = (
      <View style={[s.alertError, {marginHorizontal: 0, borderRadius: 0}]}>
        {bannedAt}
        {bannedReason}
      </View>
    );

    return banned;
  }

  _renderKicked () {
    if (this.props.model.get('blocked') !== 'kicked') {
      return null;
    }

    return (
      <View style={[s.alertError, {marginHorizontal: 0, borderRadius: 0}]}>
        <Link onPress={(this.onJoin.bind(this))}
              prepend={i18next.t('local:kicked')}
              append={i18next.t('local:rejoin')}
              text={i18next.t('local:click')}
              linkStyle={s.alertErrorText}
              prependStyle={s.alertErrorText}
              appendStyle={s.alertErrorText}
              type='underlined'
          />
      </View>
    );
  }

  onJoin () {
    app.trigger('joinRoom', this.props.model.get('id'));
  }
}

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
