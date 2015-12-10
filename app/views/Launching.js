var React = require('react-native');
var _ = require('underscore');

var {
  Text,
  View,
  StyleSheet,
  Image
} = React;

var i18next = require('i18next-client');
var locales = require('../locales/en/translation.json'); // global locales
var _localRes = { // current page locales
  'launching': 'Lancement de DONUT ...'
};

i18next.init({
  fallbackLng: 'en',
  lng: 'en',
  debug: true,
  resStore: {
    en: {translation: _.extend(locales, _localRes)}
  }
});

var Launch = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/donut-eyes.jpg')} style={{width: 200, height: 200}} />
      <Text style={styles.text}>{i18next.t('launching')}</Text>
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
