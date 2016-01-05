var React = require('react-native');
var Platform = require('Platform');
var app = require('../libs/app');
var ListItem = require('../elements/ListItem');
var Alert = require('../libs/alert');
var s = require('../styles/style');

var {
  Component,
  View,
  StyleSheet
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'add-email': 'ADD A NEW EMAIL',
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

      <View style={{ flexDirection: 'column', flexWrap: 'wrap', backgroundColor: '#f0f0f0', paddingTop: 20, flex: 1 }}>
        <View style={s.listGroup}>

          <ListItem
            onPress={(this.onSubmitPressed.bind(this))}
            placeholder={i18next.t('local:email')}
            value={this.state.email}
            onChange={(event) => this.setState({email: event.nativeEvent.text})}
            type='input-button'
            title={i18next.t('local:add-email')}
            first={true}
            isEmail={true}
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

    app.client.accountEmail(this.state.email, 'add', (response) => {
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
