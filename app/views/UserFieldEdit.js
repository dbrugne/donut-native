var React = require('react-native');
var _ = require('underscore');
var client = require('../libs/client');
var Platform = require('Platform');
var s = require('../styles/style');
var currentUser = require('../models/mobile-current-user');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Image,
  ToastAndroid
} = React;

class UserFieldEdit extends Component {
  constructor (props) {
    super(props);

    this.state = {value: props.data.value};
  }

  render () {
    return (
      <View style={styles.container}>

        <Text style={s.h1}>Change your {this.props.data.key}</Text>

        <View style={s.inputContainer}>
          <TextInput
            placeholder={this.props.data.placeholder}
            onChangeText={(text) => this.setState({value: text})}
            value={this.state.value}
            multi={this.props.data.multi}
            style={s.input}/>
        </View>

        <Text style={s.filler}></Text>

        <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))}
                            style={[s.button, s.buttonPink, s.marginTop10]}
                            underlayColor='#E4396D'
          >
          <View style={s.buttonLabel}>
            <Text style={s.buttonTextLight}>SAVE</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={() => this.props.navigator.pop()}
                            style={[s.button, s.buttonGray, s.marginTop10]}
                            underlayColor='#D7DDE1'
          >
          <View style={s.buttonLabel}>
            <Text style={s.buttonTextLight}>CANCEL</Text>
          </View>
        </TouchableHighlight>

      </View>
    )
  }

  onSubmitPressed () {
    this.props.data.onSave(this.props.data.key, this.state.value, () => this.props.navigator.pop() );
  }

  _appendError(string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({errors: this.state.errors.concat(string)});
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#f0f0f0'
  }
});

module.exports = UserFieldEdit;

