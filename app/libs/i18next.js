var i18next = require('i18next-client');
var global = require('../locales/en/translation.json'); // global locales

i18next.init({
  fallbackLng: 'en',
  lng: 'en',
  debug: true,
  resStore: {
    en: {translation: global}
  }
});

module.exports = i18next;