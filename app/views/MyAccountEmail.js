var _ = require('underscore');
var React = require('react-native');
var Platform = require('Platform');

var currentUser = require('../models/mobile-current-user');

var ListGroupItem = require('../components/ListGroupItem');

var client = require('../libs/client');
var alert = require('../libs/alert');

var s = require('../styles/style');

var {
  Component,
  Text,
  View
  } = React;


class ChangeEmailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.email
    };
  }

  render() {
    return (
      <View style={{ flexDirection: 'column', flexWrap: 'wrap', backgroundColor: '#f0f0f0', paddingTop: 20, flex: 1 }}>
        <View style={s.listGroup}>
          <Text style={s.listGroupTitle}>Change main email</Text>

          <ListGroupItem
            onPress={(this.onSubmitPressed.bind(this))}
            placeholder="Email"
            value={this.state.email}
            onChange={(event) => this.setState({email: event.nativeEvent.text})}
            type='input-button'
            />

        </View>
        <View style={s.filler}></View>
      </View>
    );
  }

  onSubmitPressed() {
    if (!this.state.email) {
      return alert.show('not-complete');
    }

    client.accountEmail(this.state.email, 'main', (response) => {
      if (response.err) {
        alert.show(response.err);
      } else {
        alert.show('Success');
        this.props.func();
        this.props.navigator.pop();
      }
    });
  }
}

module.exports = ChangeEmailView;
