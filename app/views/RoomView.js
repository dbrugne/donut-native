'use strict';

var React = require('react-native');

var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Navigator,
  AsyncStorage
} = React;

class RoomView extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {this.props.identifier}
        </Text>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
  },
  title: {
    fontSize: 18,
    marginBottom: 10
  },
});

module.exports = RoomView;