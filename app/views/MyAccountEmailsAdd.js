var React = require('react-native');
var _ = require('underscore');
var Platform = require('Platform');
var client = require('../libs/client');
var ListGroupItem = require('../components/ListGroupItem');
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
  'add-email': 'Add a new email ?',
  'email': 'Email'
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

          <ListGroupItem
            onPress= {(this.onSubmitPressed.bind(this))}
            placeholder={i18next.t('local:email')}
            value={this.state.email}
            onChange={(event) => this.setState({email: event.nativeEvent.text})}
            type='input-button'
            />

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
