'use strict';

var React = require('react-native');
var _ = require('underscore');
var {
  Component,
  Text,
  View
} = React;

var HomeFeatured = require('../components/HomeFeatured');

var i18next = require('i18next-client');
var locales = require('../locales/en/translation.json'); // global locales
var _localRes = { // current page locales
  'welcome': 'Welcome'
};
i18next.init({
  fallbackLng: 'en',
  lng: 'en',
  debug: true,
  resStore: {
    en: {translation: _.extend(locales, _localRes)}
  }
});

class Home extends Component {
  constructor (props) {
    super(props);
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <Text style={{marginVertical: 20, marginHorizontal: 10}}>{i18next.t('welcome')}</Text>
        <HomeFeatured {...this.props} />
      </View>
    );
  }
}

module.exports = Home;
