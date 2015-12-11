var React = require('react-native');
var _ = require('underscore');

var {
  Text,
  View,
  StyleSheet,
  Image
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'launching': 'Launching DONUT ...'
});

var Launch = React.createClass({
  render: function() {
    console.log(i18next.t('local:launching'));
    return (
      <View style={styles.container}>
        <Image source={require('../assets/donut-eyes.jpg')} style={{width: 200, height: 200}} />
      <Text style={styles.text}>{i18next.t('local:launching')}</Text>
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
