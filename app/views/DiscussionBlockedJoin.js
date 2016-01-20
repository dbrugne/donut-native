'use strict';

var React = require('react-native');
var s = require('../styles/style');
var app = require('../libs/app');
var Link = require('../components/Link');
var date = require('../libs/date');
var common = require('@dbrugne/donut-common/mobile');
var Button = require('../components/Button');
var Alert = require('../libs/alert');

var {
  View,
  Component,
  TextInput,
  Text
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'discussionBlockedJoin', {
  'allowed': 'This donut is private.',
  'request': 'To request access, ',
  'click': 'click here.',
  'password': 'direct access',
  'password-placeholder': 'password',
  'join': 'join',
  'request-send': 'Request send'
});

class DiscussionBlockedJoin extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    let allowUserRequest = this._renderAllowUserRequest();
    let password = this._renderPassword();

    return (
      <View style={{flex: 1}}>
        {allowUserRequest}
        {password}
      </View>
    );
  }

  _renderAllowUserRequest() {
    let allowUserRequest = null;

    if (this.props.model.get('allow_user_request')) {
      allowUserRequest = (
        <View>
          <Text>{i18next.t('discussionBlockedJoin:request')}</Text>
          <Link onPress={(this.onUserRequest.bind(this))}
                text={i18next.t('discussionBlockedJoin:click')}
                type='underlined'
            />
        </View>
      );
    }

    return (
      <View>
        <View style={[s.alertError, {marginHorizontal: 0, borderRadius: 0}]}>
          <Text style={s.alertErrorText}>{i18next.t('discussionBlockedJoin:allowed')}</Text>
        </View>
        {allowUserRequest}
      </View>
    );
  }

  onUserRequest() {
    app.client.roomJoinRequest(this.props.model.get('id'), null, (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show(i18next.t('discussionBlockedJoin:request-send'));
      }
    });
  }

  // @todo implement join request with password
  _renderPassword() {
    if (!this.props.model.get('hasPassword')) {
      return null;
    }

    return (
      <View>
        <View style={{marginTop:10}}>
          <Text>{i18next.t('discussionBlockedJoin:password')}</Text>
          <TextInput style={s.input}
                     autoCapitalize='none'
                     placeholder={i18next.t('discussionBlockedJoin:password-placeholder')}
                     onChangeText={(text) => this.setState({password: text})}
            />

          <Button onPress={(this.onValidatePassword.bind(this))}
                  type='green'
                  style={{marginHorizontal: 10}}
                  label={i18next.t('discussionBlockedJoin:join')} />

        </View>
      </View>
    );
  }

  onValidatePassword() {
    app.client.roomJoin(this.props.model.get('id'), this.state.password, (repsonse) => {
      if (repsonse.err) {
        Alert.show(repsonse.err);
      } else {
        app.trigger('joinRoom', this.props.model.get('id'));
      }
    });
  }
}

module.exports = DiscussionBlockedJoin;
