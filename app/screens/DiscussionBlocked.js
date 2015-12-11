'use strict';

var React = require('react-native');
var s = require('../styles/style');
var Link = require('../components/Link');
var date = require('../libs/date');
var common = require('@dbrugne/donut-common/mobile');

var {
  StyleSheet,
  View,
  Component,
  ScrollView,
  TextInput,
  TouchableHighlight,
  Image,
  Text
} = React;
var {
  Icon
  } = require('react-native-icons');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
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


class Discussion extends Component {
  constructor (props) {
    super(props);
  }

  render() {

    let avatarUrl = common.cloudinary.prepare(this.props.model.get('avatar'), 120);

    let description = null;
    if (this.props.model.get('description')) {
      description = (
        <Text style={styles.description}>{description}</Text>
      );
    }

    let allowUserRequest = this._renderAllowUserRequest();
    let password = this._renderPassword();
    let disclaimer = this._renderDisclaimer();
    let banned = this._renderBanned();
    let kicked = this._renderKicked();

    return (
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          <Image style={styles.avatar} source={{uri: avatarUrl}}/>
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

          {allowUserRequest}
          {password}
          {disclaimer}
          {banned}
          {kicked}

          <Link onPress={(this.onClose.bind(this))}
                text={i18next.t('local:close')}
            />

        </View>
      </ScrollView>
    );
  }

  // @todo implement close this window
  onClose () {
    console.log('implement close')
  }

  // @todo implement allow user request link
  _renderAllowUserRequest() {
    if (this.props.model.get('mode') != 'private' || this.props.model.get('blocked') === 'groupbanned' || this.props.model.get('blocked') === 'banned' || this.props.model.get('blocked') === 'kicked') {
      return null;
    }

    let allowUserRequest = null;

    if (this.props.model.get('allow_user_request')) {
      allowUserRequest = (
        <View>
          <Text>{i18next.t('local:request')}</Text>
          <Link onPress={(this.onUserRequest.bind(this))}
                text={i18next.t('local:click')}
            />
        </View>
      );
    }

    return (
      <View>
        <Text>{i18next.t('local:allowed')}</Text>
        {allowUserRequest}
      </View>
    );
  }

  // @todo implement user request
  onUserRequest() {
    console.log('implement user request');
  }

  // @todo implement join request with password
  _renderPassword() {
    if (this.props.model.get('mode') != 'private' || this.props.model.get('blocked') === 'groupbanned' || this.props.model.get('blocked') === 'banned' || this.props.model.get('blocked') === 'kicked' || !this.props.model.get('hasPassword')) {
      return null;
    }

    return (
      <View>
        <View style={{marginTop:10}}>
          <Text>{i18next.t('local:password')}</Text>
          <TextInput style={s.input}
                     autoFocus={true}
                     placeholder={i18next.t('local:password-placeholder')}
                     onChangeText={(text) => this.setState({password: text})}
            />
          <TouchableHighlight style={[s.button, s.buttonGreen, {marginHorizontal: 10}]}
                              underlayColor='#50EEC1'
                              onPress={(this.onValidatePassword.bind(this))}>
            <View style={s.buttonLabel}>
              <Text style={s.buttonTextLight}>{i18next.t('local:join')}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  onValidatePassword() {
    console.log('onValidatePassword');
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

  // @todo implement join room
  onJoin() {
    console.log('todo implement join room')
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

module.exports = Discussion;