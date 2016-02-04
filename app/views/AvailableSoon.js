'use strict';

var React = require('react-native');
var { View } = React;

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
      <View style={{flex: 1, marginHorizontal: 10, marginVertical: 10}}>
        <Link
          onPress={() => hyperlink.open(this.state.website)}
          stype={s.h1}
          type='underlined'
          text={this.state.website}
          prepend={i18next.t('availableSoon:disclaimer')}
          />
      </View>
    );
  }
});

module.exports = AvailableSoonView;
