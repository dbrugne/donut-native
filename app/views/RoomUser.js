'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Component,
  ScrollView,
  Image
} = React;

var app = require('../libs/app');
var common = require('@dbrugne/donut-common/mobile');
var ListItem = require('../components/ListItem');
var s = require('../styles/style');
var alert = require('../libs/alert');
var ConnectionState = require('../components/ConnectionState');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'op': 'Make moderator',
  'modal-description-op': 'Are you sure you want to make @__username__ moderator?',
  'deop': 'Remove from moderator',
  'modal-description-deop': 'Are you sure you want to remove @__username__ from moderators?',
  'voice': 'Unmute',
  'modal-description-voice': 'Are you sure you want to unmute @__username__?',
  'devoice': 'Mute',
  'modal-description-devoice': 'Are you sure you want to mute @__username__?',
  'ban': 'Kick and ban',
  'modal-description-ban': 'Are you sure you want to ban @__username__?',
  'deban': 'unban',
  'modal-description-deban': 'Are you sure you want to unban @__username__?',
  'kick': 'Kick',
  'modal-description-kick': 'Are you sure you want to kick @__username__?'
});

class ProfileView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      isBanned: this.props.user.isBanned,
      isDevoiced: this.props.user.isDevoiced,
      isOp: this.props.user.isOp
    };
  }

  render () {
    var avatarUrl = common.cloudinary.prepare(this.props.user.avatar, 120);
    var role = null;
    if (this.state.isOp) {
      role = <Text style={[styles.role]}>{i18next.t('op')}</Text>
    }
    if (this.props.user.isOwner) {
      role = <Text style={[styles.role]}>{i18next.t('owner')}</Text>
    }
    return (
      <View style={{flex: 1}}>
        <ConnectionState/>
        <ScrollView style={styles.main}>
          <View style={[styles.container, {position: 'relative'}]}>
            <Image style={styles.avatar} source={{uri: avatarUrl}} />
            <Text style={[styles.statusText,
              styles.status,
              this.props.user.status === 'connecting' && styles.statusConnecting,
              this.props.user.status === 'offline' && styles.statusOffline,
              this.props.user.status === 'online' && styles.statusOnline]}>{this.props.user.status}</Text>
            <Text style={[styles.username]}>@{this.props.user.username}</Text>
            {role}
          </View>
          <View style={[s.listGroup]}>
            <Text style={s.listGroupItemSpacing}></Text>
            {this._renderActions()}
            <Text style={s.listGroupItemSpacing}></Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  _renderActions() {
    var actions = [];
    if (this.props.user.isOwner) {
      return null;
    }
    if (this.state.isOp) {
      actions.push(
        <ListItem
          key='deop'
          text={i18next.t('local:deop')}
          type='edit-button'
          first={true}
          action={true}
          icon='fontawesome|shield'
          onPress={() => {this._onDeop()}}
          />
      );
    } else {
      actions.push(
        <ListItem
          key='op'
          text={i18next.t('local:op')}
          type='edit-button'
          first={true}
          action={true}
          iconColor='#4fedc0'
          icon='fontawesome|shield'
          onPress={() => {this._onOp()}}
          />
      );
    }
    if (this.state.isDevoiced) {
      actions.push(
        <ListItem
          key='voice'
          text={i18next.t('local:voice')}
          type='edit-button'
          action={true}
          icon='fontawesome|microphone'
          onPress={() => {this._onVoice()}}
          />
      );
    } else {
      actions.push(
        <ListItem
          key='devoice'
          text={i18next.t('local:devoice')}
          type='edit-button'
          action={true}
          iconColor='#ff3838'
          icon='fontawesome|microphone-slash'
          onPress={() => {this._onDevoice()}}
          />
      );
    }
    if (this.state.isBanned) {
      actions.push(
        <ListItem
          key='unban'
          text={i18next.t('local:unban')}
          type='edit-button'
          action={true}
          icon='fontawesome|ban'
          onPress={() => {this._onUnban()}}
          />
      );
    } else {
      actions.push(
        <ListItem
          key='ban'
          text={i18next.t('local:ban')}
          type='edit-button'
          action={true}
          iconColor='#ff3838'
          icon='fontawesome|ban'
          onPress={() => {this._onBan()}}
          />
      );
      actions.push(
        <ListItem
          key='kick'
          text={i18next.t('local:kick')}
          type='edit-button'
          action={true}
          icon='fontawesome|times'
          onPress={() => {this._onKick()}}
          />
      );
    }
    return actions;
  }

  _onDeop () {
    alert.askConfirmation(
      i18next.t('local:deop'),
      i18next.t('local:modal-description-deop', {username: this.props.user.username}),
      () => {
        app.client.roomDeop(this.props.roomId, this.props.user.user_id, (response) => {
          if (response.err) {
            return alert.show(response.err);
          }
          this.setState({isOp: false});
          this.props.parentCallback();
        });
      },
      () => {}
    );
  }
  _onOp () {
    alert.askConfirmation(
      i18next.t('local:op'),
      i18next.t('local:modal-description-op', {username: this.props.user.username}),
      () => {
        app.client.roomOp(this.props.roomId, this.props.user.user_id, (response) => {
          if (response.err) {
            return alert.show(response.err);
          }
          this.setState({isOp: true});
          this.props.parentCallback();
        });
      },
      () => {}
    );
  }
  _onDevoice () {
    alert.askConfirmation(
      i18next.t('local:devoice'),
      i18next.t('local:modal-description-devoice', {username: this.props.user.username}),
      () => {
        app.client.roomDevoice(this.props.roomId, this.props.user.user_id, null,(response) => {
          if (response.err) {
            return alert.show(response.err);
          }
          this.setState({isDevoiced: true});
          this.props.parentCallback();
        });
      },
      () => {}
    );
  }
  _onVoice () {
    alert.askConfirmation(
      i18next.t('local:voice'),
      i18next.t('local:modal-description-voice', {username: this.props.user.username}),
      () => {
        app.client.roomVoice(this.props.roomId, this.props.user.user_id, (response) => {
          if (response.err) {
            return alert.show(response.err);
          }
          this.setState({isDevoiced: false});
          this.props.parentCallback();
        });
      },
      () => {}
    );
  }
  _onUnban() {
    alert.askConfirmation(
      i18next.t('local:deban'),
      i18next.t('local:modal-description-deban', {username: this.props.user.username}),
      () => {
        app.client.roomDeban(this.props.roomId, this.props.user.user_id, (response) => {
          if (response.err) {
            return alert.show(response.err);
          }
          this.setState({isBanned: false});
          this.props.parentCallback();
        });
      },
      () => {}
    );
  }
  _onBan () {
    alert.askConfirmation(
      i18next.t('local:ban'),
      i18next.t('local:modal-description-ban', {username: this.props.user.username}),
      () => {
        app.client.roomBan(this.props.roomId, this.props.user.user_id, null, (response) => {
          if (response.err) {
            return alert.show(response.err);
          }
          this.setState({isBanned: true});
          this.props.parentCallback();
        });
      },
      () => {}
    );
  }
  _onKick () {
    alert.askConfirmation(
      i18next.t('local:kick'),
      i18next.t('local:modal-description-kick', {username: this.props.user.username}),
      () => {
        app.client.roomKick(this.props.roomId, this.props.user.user_id, null, (response) => {
          if (response.err) {
            return alert.show(response.err);
          }
          this.props.navigator.pop();
          this.props.parentCallback();
        });
      },
      () => {}
    );
  }
}

var styles = StyleSheet.create({
  main: {
    flexWrap: 'wrap',
    flexDirection: 'column',
    backgroundColor: '#f0f0f0'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  role: {
    marginBottom: 5
  },
  avatar: {
    width: 120,
    height: 120,
    marginTop:20
  },
  username: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5
  },
  usernameGray: {
    color: '#b6b6b6'
  },
  status: {
    marginBottom: 8,
    alignSelf: 'center',
    textAlign: 'center',
    flex:1,
    fontWeight: '400',
    fontSize: 12,
    fontFamily: 'Open Sans',
    width: 120,
    paddingLeft:5,
    paddingRight:5,
    overflow: 'hidden'
  },
  statusOnline: { backgroundColor: 'rgba(79, 237, 192, 0.8)' },
  statusConnecting: { backgroundColor: 'rgba(255, 218, 62, 0.8)' },
  statusOffline: { backgroundColor: 'rgba(119,119,119,0.8)' },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Open Sans'
  },
  icon: {
    width: 14,
    height: 14,
    color: '#c7c7c7'
  },
  iconOnline: {
    color: '#4fedc0'
  }
});

module.exports = ProfileView;

