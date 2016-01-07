'use strict';

var React = require('react-native');
var _ = require('underscore');
var s = require('../styles/style');
var Link = require('../elements/Link');
var date = require('../libs/date');
var common = require('@dbrugne/donut-common/mobile');
var DiscussionBlockedJoin = require('./DiscussionBlockedJoin');

var {
  StyleSheet,
  View,
  Component,
  ScrollView,
  TouchableHighlight,
  Image,
  Text
} = React;
var {
  Icon
  } = require('react-native-icons');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  "by": "by",
  "allowed": "This donut is private.",
  "request": "To request access, ",
  "click": "click here.",
  "password": "direct access",
  "password-placeholder": "password",
  "join": "join",
  "banned": "You were banned from this donut on __at__",
  "groupbanned": "You were banned from this community on __at__",
  "reason": "for the following reason: ",
  "kicked": "You have been kicked out from this donut.",
  "rejoin": " to get back in.",
  "close": "Close this donut"
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


    let disclaimer = this._renderDisclaimer();
    let banned = this._renderBanned();
    let kicked = this._renderKicked();
    let join = null;
    if (!banned && !kicked) {
      join = (
        <DiscussionBlockedJoin {...this.props} />
      );
    }

    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          {this._renderAvatar(this.props.model.get('avatar'))}
          <Text style={styles.identifier}>{this.props.model.get('identifier')}</Text>
          <TouchableHighlight onPress={() => { this.props.navigator.replace(navigation.getProfile({type: 'user', id: this.props.model.get('owner_id'), identifier: '@' + this.props.model.get('owner_username')})); }}>
            <Text>
              <Text>{i18next.t('local:by')} </Text>
              <Text style={styles.ownerUsername}>@{this.props.model.get('owner_username')}</Text>
            </Text>
          </TouchableHighlight>
          {description}
        </View>
        <View style={styles.container2}>

          {disclaimer}
          {banned}
          {kicked}
          {join}

          <Link onPress={() => this.props.model.leaveBlocked()}
                text={i18next.t('local:close')}
                type='underlined'
            />

        </View>
      </ScrollView>
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

  _renderDisclaimer() {
    if (!this.props.model.get('disclaimer') || this.props.model.get('disclaimer').length === 0) {
      return (
        <View></View>
      );
    }
    var disclaimer = _.unescape(this.props.model.get('disclaimer'));
    return (
      <View style={[styles.disclaimerCtn, s.alertWarning]}>
        <Text style={[styles.disclaimer, s.alertWarningText]}>{disclaimer}</Text>
      </View>
    );
  }

  _renderBanned() {
    if (this.props.model.get('blocked') !== 'banned' && this.props.model.get('blocked') !== 'groupbanned') {
      return null;
    }

    let bannedAt = null;
    if (this.props.model.get('banned_at')) {
      bannedAt = (
        <Text>
          {i18next.t('local:'+this.props.model.get('blocked'), {at: date.dateTime(this.props.model.get('banned_at'))})}
        </Text>
      );
    }

    let bannedReason = null;
    if (this.props.model.get('reason')) {
      bannedReason = (
        <View>
            <Text>{i18next.t('local:reason')}</Text>
            <View>
              <Icon
                name='fontawesome|quote-right'
                size={20}
                color='#ffda3e'
                style={s.buttonIcon}
                />
              <Text>{this.props.model.get('reason')}</Text>
            </View>
        </View>
      );
    }

    let banned = (
      <View>
        {bannedAt}
        {bannedReason}
      </View>
    );

    return banned;
  }

  _renderKicked() {
    if (this.props.model.get('blocked') !== 'kicked') {
      return null;
    }

    return (
      <View>
        <Text> {i18next.t('local:kicked')} </Text>
        <Link onPress={(this.onJoin.bind(this))}
              text={i18next.t('local:click')}
          />
        <Text> {i18next.t('local:rejoin')} </Text>
      </View>
    );
  }

  onJoin() {
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
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  container2: {
    flex: 1,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DDD',
    paddingTop: 10
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10,
    borderColor: '#DCDCDC',
    borderWidth: 2
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
  },
  disclaimerCtn: {

  },
  disclaimer: {

  }
});

module.exports = DiscussionBlocked;
