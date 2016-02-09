'use strict';

var React = require('react-native');
var {
  Linking,
  Alert
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'hyperlink', {
  'error': 'Can\'t open following URL'
});

module.exports = {
  open (url) {
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        Alert.alert(i18next.t('hyperlink:error'), url, {text: 'Cancel', style: 'cancel'});
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }
};
