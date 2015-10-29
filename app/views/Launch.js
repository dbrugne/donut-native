var React = require('react-native');

var {
  Text,
  View,
  StyleSheet
} = React;


var Launch = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text>Launch me harder!</Text>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: 50
  }
});

module.exports = Launch;
