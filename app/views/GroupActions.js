'use strict';

var React = require('react-native');
var _ = require('underscore');
var {
  View,
  LayoutAnimation
  } = React;

var app = require('../libs/app');
var Button = require('../components/Button');
var alert = require('../libs/alert');
var animation = require('../libs/animations').header;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupActions', {
  'request-membership': 'REQUEST MEMBERSHIP',
  'button-cancel': 'CANCEL',
  'request-title': 'REQUEST AN ACCESS',
  'password-title': 'ENTER PASSWORD',
  'domain-title': 'AUTHORIZED EMAIL'
});

var GroupActionsView = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    data: React.PropTypes.any,
    step: React.PropTypes.string,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      step: this.props.step,
      data: this.props.data,
      options: null,
      loadingRequestMembership: false,
      loadingJoinRequest: false,
      loadingJoinPassword: false,
      loadingJoinDomain: false,
    };
  },
  render: function () {
    // Default group page
    LayoutAnimation.configureNext(animation);
    if (this.state.step === 'group') {
      return (
        <View style={{ alignSelf: 'stretch', paddingTop: 20 }}>
          {this._renderRequestMembershipButton()}
        </View>
      );
    }

    // Group ask page: display available join methods
    if (this.state.step === 'groupJoin') {
      return (
        <View style={{ alignSelf: 'stretch', paddingTop: 20 }}>
          {this._renderRequestAccessButton()}
          {this._renderPasswordButton()}
          {this._renderDomainsButton()}
          {this._renderCancelButton()}
        </View>
      );
    }

    // Specific join page, only display cancel button
    if (_.contains(['groupJoinRequest', 'groupJoinPassword', 'groupJoinDomain'], this.state.step)) {
      return (
        <View style={{ alignSelf: 'stretch' }}>
          {this._renderCancelButton()}
        </View>
      );
    }

    // nothing to display
    return null;
  },
  _renderRequestMembershipButton: function () {
    // display a REQUEST MEMBERSHIP button only for not banned non members
    if (this.state.data.is_member || this.state.data.is_op || this.state.data.i_am_banned || this.state.data.is_owner) {
      return null;
    }

    // Change step to display other action buttons & content
    return (
      <Button onPress={() => this.onRequestMembershipPressed()}
              label={i18next.t('GroupActions:request-membership')}
              type='white'
              loading={this.state.loadingRequestMembership}
              style={{ alignSelf: 'stretch', marginHorizontal: 40 }}
        />
    );
  },
  _renderCancelButton: function () {
    return (
      <Button
        onPress={() => this.onCancelPressed()}
        label={i18next.t('GroupActions:button-cancel')}
        type='white'
        warning
        style={[{ alignSelf: 'stretch', marginHorizontal: 40 }, this.state.options.request && {marginTop: 10}, this.state.options.password && {marginTop: 10}, this.state.options.allowed_domains && {marginTop: 10}]}
        />
    );
  },
  _renderRequestAccessButton: function () {
    // only render button if this request option is available
    if (!this.state.options || !this.state.options.request) {
      return null;
    }

    return (
      <Button
        onPress={() => this.onRequestAccessPressed()}
        label={i18next.t('GroupActions:request-title')}
        type='white'
        style={{ alignSelf: 'stretch', marginHorizontal: 40 }}
        />
    );
  },
  _renderPasswordButton: function () {
    // only render button if this request option is available
    if (!this.state.options || !this.state.options.password) {
      return null;
    }

    return (
      <Button onPress={() => this.onPasswordPressed()}
              label={i18next.t('GroupActions:password-title')}
              type='white'
              style={[{ alignSelf: 'stretch', marginHorizontal: 40 }, this.state.options.request && {marginTop: 10}]}
        />
    );
  },
  _renderDomainsButton: function () {
    // only render button if this request option is available
    if (!this.state.options || !this.state.options.allowed_domains) {
      return null;
    }

    return (
      <Button onPress={() => this.onDomainPressed()}
              label={i18next.t('GroupActions:domain-title')}
              type='white'
              style={[{ alignSelf: 'stretch', marginHorizontal: 40 }, this.state.options.request && {marginTop: 10}, this.state.options.password && {marginTop: 10}]}
        />
    );
  },
  onRequestMembershipPressed: function () {
    this._onButtonPressed('loadingRequestMembership', 'groupJoin');
  },
  onCancelPressed: function () {
    // groupJoin -> group
    if (this.state.step === 'groupJoin') {
      this.setState({step: 'group'});
      return app.trigger('groupStep', 'group');
    }

    // groupJoinRequest / groupJoinPassword / groupJoinDomain -> groupJoin
    if (_.contains(['groupJoinRequest', 'groupJoinPassword', 'groupJoinDomain'], this.state.step)) {
      this.setState({step: 'groupJoin'});
      return app.trigger('groupStep', 'groupJoin');
    }
  },
  onRequestAccessPressed: function () {
    this._onButtonPressed('loadingJoinRequest', 'groupJoinRequest');
  },
  onPasswordPressed: function () {
    this._onButtonPressed('loadingJoinPassword', 'groupJoinPassword');
  },
  onDomainPressed: function () {
    this._onButtonPressed('loadingJoinDomain', 'groupJoinDomain');
  },
  _onButtonPressed: function (loadingButton, step) {
    var state = {};
    state[loadingButton] = true;
    this.setState(state);
    app.client.groupBecomeMember(this.state.data.group_id, null, (response) => {
      state[loadingButton] = false;
      this.setState(state);

      // Anything but already a member : show an error
      if (response.err && response.err !== 'already-member') {
        return alert.show(i18next.t('messages.' + response.err));
      }

      // already a member or success or no options to show, redraw group page
      if (response.err || response.success || !response.options) {
        return app.trigger('refreshGroup', true);
      }

      this.setState({
        options: response.options,
        step: step
      });

      app.trigger('groupBecomeMember', response.options); // @todo should be dispatched by handler
      app.trigger('groupStep', step);
    });
  }
});

module.exports = GroupActionsView;
