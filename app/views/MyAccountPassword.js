var React = require('react-native');
var Platform = require('Platform');
var _ = require('underscore');

var currentUser = require('../models/mobile-current-user');

var LoadingView = require('../components/Loading');

var client = require('../libs/client');
var alert = require('../libs/alert');

var s = require('../styles/style');

var {
  Component,
  Text,
  View,
  TextInput,
  TouchableHighlight
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'old-password': 'old password',
  'change-password': 'Change password',
  'new-password': 'new password',
  'confirm': 'confirm',
  'change': 'CHANGE'
});

class ChangePasswordView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      hasPassword: false,
      loaded: false
    };
  }

  componentDidMount () {
    client.userRead(currentUser.get('user_id'), {admin: true}, (response) => {
      this.setState({
        loaded: true,
        hasPassword: !!(response.account && response.account.has_password)
      });
    });
  }

  render () {
    if (!this.state.loaded) {
      return (
        <LoadingView />
      );
    }

    var inputOldPassword;
    if (this.state.hasPassword) {
      inputOldPassword = (
        <View style={[s.inputContainer, s.marginTop5]}>
          <TextInput
          autoFocus={true}
          placeholder={i18next.t('local:old-password')}
          secureTextEntry={true}
          onChange={(event) => this.setState({oldPassword: event.nativeEvent.text})}
          onSubmitEditing={() => this._focusNextField('1')}
          style={s.input} />
        </View>
      );
    }

    return (
      <View style={{ flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', flex: 1, backgroundColor: '#f0f0f0' }}>
        <Text style={[s.h1, s.textCenter, s.marginTop5]}>{i18next.t('local:change-password')}</Text>

        <Text style={s.marginTop20}></Text>

        {inputOldPassword}

        <View style={[s.inputContainer, s.marginTop5]}>
          <TextInput
            ref='1'
            placeholder={i18next.t('local:new-password')}
            secureTextEntry={true}
            onChange={(event) => this.setState({newPassword: event.nativeEvent.text})}
            onSubmitEditing={() => this._focusNextField('2')}
            style={s.input} />
        </View>

        <View style={[s.inputContainer, s.marginTop5]}>
          <TextInput
            ref='2'
            placeholder={i18next.t('local:confirm')}
            secureTextEntry={true}
            onChange={(event) => this.setState({confirmPassword: event.nativeEvent.text})}
            style={s.input} />
        </View>

        <Text style={s.filler}></Text>

        <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))}
                            style={[s.button, s.buttonPink, s.marginTop10]}
                            underlayColor='#E4396D'
          >
          <View style={s.buttonLabel}>
            <Text style={s.buttonTextLight}>{i18next.t('local:change')}</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  _focusNextField(nextField) {
    this.refs[nextField].focus()
  }

  onSubmitPressed () {
    if (!this.state.newPassword || (this.state.hasPassword && !this.state.oldPassword)) {
      return alert.show(i18next.t('messages.not-complete'));
    }

    if (this.state.newPassword !== this.state.confirmPassword) {
      return alert.show(i18next.t('messages.not-same-password'));
    }

    client.accountPassword(this.state.newPassword, this.state.oldPassword, (response) => {
      if (response.err) {
        alert.show(response.err);
      } else {
        alert.show(i18next.t('messages.success'));
      }
    });
  }
}

module.exports = ChangePasswordView;

