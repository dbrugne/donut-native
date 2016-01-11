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
  StyleSheet,
  View,
  Component,
  TextInput,
  Text
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  "allowed": "This donut is private.",
  "request": "To request access, ",
  "click": "click here.",
  "password": "direct access",
  "password-placeholder": "password",
  "join": "join",
  "request-send" : "Request send"
});

class DiscussionBlockedJoin extends Component {
  constructor (props) {
    super(props);
  }

  render() {
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
          <Text>{i18next.t('local:request')}</Text>
          <Link onPress={(this.onUserRequest.bind(this))}
                text={i18next.t('local:click')}
                type='underlined'
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

  onUserRequest() {
    app.client.roomJoinRequest(this.props.model.get('id'), null, (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show(i18next.t('local:request-send'));
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
          <Text>{i18next.t('local:password')}</Text>
          <TextInput style={s.input}
                     autoCapitalize='none'
                     placeholder={i18next.t('local:password-placeholder')}
                     onChangeText={(text) => this.setState({password: text})}
            />

          <Button onPress={(this.onValidatePassword.bind(this))}
                  type='green'
                  style={{marginHorizontal: 10}}
                  label={i18next.t('local:join')} />

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
});

module.exports = DiscussionBlockedJoin;
