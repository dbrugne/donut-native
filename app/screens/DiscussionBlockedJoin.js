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
  TextInput,
  TouchableHighlight,
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
  "join": "join"
});

class DiscussionBlockedJoin extends Component {
  passwordPattern =  /(.{4,255})$/i;

  constructor (props) {
    super(props);
  }

  render() {

    let allowUserRequest = this._renderAllowUserRequest();
    let password = this._renderPassword();

    return (
      <View>
        {allowUserRequest}
        {password}
      </View>
    );
  }

  // @todo implement allow user request link
  _renderAllowUserRequest() {
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
    if (!this.props.model.get('hasPassword')) {
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

module.exports = DiscussionBlockedJoin;
