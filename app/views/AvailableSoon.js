'use strict';

var React = require('react-native');

var {
  View,
  Text
  } = React;

var Link = require('../components/Link');
var s = require('../styles/style');
var hyperlink = require('../libs/hyperlink');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'availableSoon', {
  'disclaimer': 'Available soon on mobile. Already available on our website: '
});

var AvailableSoonView = React.createClass({
  getInitialState: function () {
    return {
      website: 'https://donut.me'
    };
  },
  render: function () {
    return (
      <View style={{flex: 1, marginHorizontal: 10}}>
        <Text stype={s.h1}>{i18next.t('availableSoon:disclaimer')}</Text>
        <Link
          onPress={() => hyperlink.open(this.state.website)}
          stype={s.h1}
          type='underlined'
          text={this.state.website}
          />
      </View>
    );
  }
});

module.exports = AvailableSoonView;
