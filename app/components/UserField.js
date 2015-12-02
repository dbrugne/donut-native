'use strict';

var _ = require('underscore');
var React = require('react-native');
var s = require('../styles/style');
var client = require('../libs/client');
var app = require('../libs/app');
var Alert = require('../libs/alert');

var {
  Component,
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

class UserField extends Component {
  constructor (props) {
    super(props);

    this.state = {value: props.data.value};
  }

  render () {
    var field = this.renderField();
    return (
      <View style={styles.container}>
        <Text style={[s.h1, {marginVertical:10, marginHorizontal: 10}]}>Change your {this.key}</Text>

        <View style={s.inputContainer}>
          {field}
        </View>

        <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))}
                            style={[s.button, s.buttonPink, s.marginTop10]}
                            underlayColor='#E4396D'
          >
          <View style={s.buttonLabel}>
            <Text style={s.buttonTextLight}>SAVE</Text>
          </View>
        </TouchableHighlight>

        <View style={s.filler}></View>

      </View>
    );
  }
  onSubmitPressed () {
    if (this.isValid()) {
      var updateData = {};
      updateData[this.key] = this.state.value;

      client.userUpdate(updateData, (response) => {
        if (response.err) {
          var message = response.err;
          if (_.isObject(response.err)) {
            message = 'An error occured : ';
            _.each(response.err, function (e) {
              message += e + ' ';
            });
          }
          Alert.show(message);
        } else {
          app.trigger('user:save', {key: this.key, value: this.state.value});
          this.props.navigator.pop()
        }
      });
    } else {
      Alert.show('invalid');
    }
  }
  renderField () {
    return (<View />);
  }
  isValid () {
    return true;
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    flex:1
  }
});

module.exports = UserField;