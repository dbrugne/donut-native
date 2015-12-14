var React = require('react-native');
var _ = require('underscore');
var Platform = require('Platform');
var client = require('../libs/client');
var Input = require('../elements/Input');
var Button = require('../elements/Button');
var Alert = require('../libs/alert');
var s = require('../styles/style');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight
  } = React;

var currentUser = require('../models/mobile-current-user');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'add-email': 'Add a new email',
  'email': 'Email',
  'save': 'save'
});

class AddEmailView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      email: ''
    };
  }

  render () {
    return (
      <View style={styles.main}>
        <View style={s.listGroup}>
          <Text style={s.listGroupTitle}>{i18next.t('local:add-email')}</Text>

          <View style={[s.inputContainer, s.marginTop5]}>
            <Input
              placeholder={i18next.t('local:email')}
              value={this.state.email}
              onChangeText={(text) => this.setState({email: text})}
              />
          </View>

          <Button onPress={(this.onSubmitPressed.bind(this))}
                  type='green'
                  style={[s.marginTop5]}
                  label={i18next.t('local:save')} />

        </View>
        <View style={s.filler}></View>
      </View>
    )
  }

  onSubmitPressed () {
    if (!this.state.email) {
      return Alert.show(i18next.t('messages.not-complete'));
    }

    client.accountEmail(this.state.email, 'add', (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show(i18next.t('messages.validation-email-sent'));
        this.props.func();
        this.props.navigator.pop();
      }
    });
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0',
    paddingTop: 20,
    flex:1
  }
});

module.exports = AddEmailView;
