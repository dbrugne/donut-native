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
          <Text style={s.listGroupTitle}>Add a new email</Text>

          <ListGroupItem
            onPress= {(this.onSubmitPressed.bind(this))}
            placeholder="Email"
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
      return Alert.show('not-complete');
    }

    client.accountEmail(this.state.email, 'add', (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show('Success');
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
