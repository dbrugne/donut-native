var React = require('react-native');

var {
  Text,
  View,
  StyleSheet,
  Image
} = React;


var Launch = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/donut-eyes.jpg')} style={{width: 200, height: 200}} />
        <Text style={styles.text}>Lancement de DONUT ...</Text>
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
  },
  text: {
    fontFamily: 'Open Sans',
    marginVertical: 20,
    fontSize: 18,
    color: '#666'
  }
});

module.exports = Launch;
