'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/current-user');
var app = require('../libs/app');
var s = require('../styles/style');
var ListItem = require('../components/ListItem');
var navigation = require('../navigation/index');
var UserHeader = require('./UserHeader');

var {
  View,
  ScrollView,
  StyleSheet
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'OneSettings', {
  'close': 'Close this discussion',
  'end': 'END',
  'see': 'See profile',
  'block': 'Block this user',
  'unblock': 'Unblock this user'
});

var OneSettings = React.createClass({
  propTypes: {
    model: React.PropTypes.any.isRequired,
    navigator: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
    return {
      data: this.props.model.toJSON(),
      banned: this.props.model.get('banned')
    };
  },
  componentDidMount () {
    this.props.model.on('change:avatar', () => this.setState({
      avatar: this.props.model.get('avatar')
    }), this);
  },
  componentWillUnmount () {
    this.props.model.off(this, null, null);
  },
  render () {
    return (
      <ScrollView style={styles.main}>
        <UserHeader data={this.state.data} />
        {this._renderLinks()}
        {this._renderEnd()}
      </ScrollView>
    );
  },
  _renderLinks () {
    return (
      <View style={s.listGroup}>
        <ListItem
          onPress={() => navigation.navigate('Profile', {type: 'user', id: this.props.model.get('id'), identifier: this.state.identifier})}
          text={i18next.t('OneSettings:see')}
          type='button'
          first
          action
          />
        {this._renderBlock()}
      </View>
    );
  },
  _renderBlock () {
    if (this.state.data.user_id === currentUser.get('user_id')) {
      return;
    }
    return (
      <ListItem
        type='switch'
        imageLeft={require('../assets/icon-ban.png')}
        text={ this.state.banned ? i18next.t('OneSettings:unblock') : i18next.t('OneSettings:block')}
        onSwitch={this._toggleBanned}
        switchValue={this.state.banned}
        />
    );
  },
  _toggleBanned () {
    if (this.state.banned) {
      this._unbanUser();
    } else {
      this._banUser();
    }
  },
  _banUser () {
    var that = this;
    app.client.userBan(this.props.model.get('id'), (response) => {
      if (response.err) {
        return;
      }
      this.setState({banned: true});
    });
  },
  _unbanUser () {
    var that = this;
    app.client.userDeban(this.props.model.get('id'), (response) => {
      if (response.err) {
        return;
      }
      this.setState({banned: false});
    });
  },
  _renderEnd () {
    return (
      <View style={s.listGroup}>
        <ListItem
          onPress={() => this.props.model.leave()}
          text={i18next.t('OneSettings:close')}
          type='button'
          first
          warning
          title={i18next.t('OneSettings:end')}
          />
      </View>
    );
  }
});

OneSettings.propTypes = {model: React.PropTypes.object};

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap'
  }
});

module.exports = OneSettings;
