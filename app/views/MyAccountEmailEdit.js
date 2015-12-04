var React = require('react-native');
var _ = require('underscore');
var Platform = require('Platform');
var client = require('../libs/client');
var s = require('../styles/style');
var Alert = require('../libs/alert');
var ListGroupItem = require('../components/ListGroupItem');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight
  } = React;

var currentUser = require('../models/mobile-current-user');

class EditEmailView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.main}>

        <View style={s.listGroup}>

          <Text style={[s.textCenter, styles.email]}>
            {this.props.email.email}
          </Text>

          {this._renderConfirmed()}

          <ListGroupItem onPress={(this.onDeletePressed.bind(this))}
                         text='Delete'
                         type='button'
                         warning='true'
            />

        </View>

        <View style={s.filler}></View>
      </View>
    )
  }

  _renderConfirmed() {
    if (this.props.email.confirmed) {
      return (
        <View>
          <Text style={s.listGroupTitle}>This email was validated</Text>
          {this._renderMain()}
          <Text style={s.listGroupItemSpacing}></Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={s.listGroupTitle}>This email wasn't validated</Text>

          <ListGroupItem onPress={(this.onSendEmail.bind(this))}
                         text='Send a validation email'
                         type='button'
                         action='true'
                         icon='fontawesome|envelope-o'
                         first={true}
            />

          <Text style={s.listGroupItemSpacing}></Text>
        </View>
      );
    }
  }

  _renderMain() {
    if (!this.props.email.main) {
      return (<ListGroupItem onPress={(this.onSetAsMainPressed.bind(this))}
                     text='Define as main email'
                     type='button'
                     action='true'
                     icon='fontawesome|anchor'
                     first={true}
        />);
    } else {
      return (<View />);
    }
  }

  onDeletePressed() {
    client.accountEmail(this.props.email.email, 'delete', (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show('Success');
        this.props.func();
        this.props.navigator.pop();
      }
    });
  }

  onSendEmail() {
    client.accountEmail(this.props.email.email, 'validate', (response) => {
      if (response.err) {
        Alert.show(response.err);
      } else {
        Alert.show('A validation email have been sent');
      }
    });
  }

  onSetAsMainPressed() {
    client.accountEmail(this.props.email.email, 'main', (response) => {
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
  },
  email: {
    fontSize: 23,
    alignSelf: 'center',
    color: "#444",
    marginBottom: 40
  }
});

module.exports = EditEmailView;

