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
        <Text style={{}}>Launch me harder!</Text>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = Launch;
