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
var DiscussionHeader = require('./DiscussionHeader');

var {
  StyleSheet,
  View,
  ScrollView,
  Text
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'discussionBlocked', {
  'by': 'by',
  'allowed': 'This discussion is private, request an access',
  'disallow': 'This discussion is private, request an access',
  'request': 'To join,',
  'click': 'Request an access.',
  'password': 'direct access',
  'password-placeholder': 'password',
  'join': 'join',
  'not-confirmed': 'Not confirmed user can\'t join private discussions',
  'ban': 'You were banned from this discussion',
  'groupban': 'You were banned from this community',
  'kick': 'You have been kicked out.',
  'rejoin': ' to get back in.',
  'close': 'Close this discussion'
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
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          <DiscussionHeader data={this.props.model.toJSON()} />

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
      <View style={(why === 'ban' || why === 'groupban') && s.alertError}>
        <Text style={[{marginHorizontal: 10, marginVertical: 10}, (why === 'ban' || why === 'groupban') && s.alertErrorText]}>
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
        return navigation.navigate('DiscussionBlockJoin', data.infos, this.props.model.toJSON());
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
    position: 'relative'
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
