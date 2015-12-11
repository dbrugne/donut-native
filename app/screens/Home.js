'use strict';

var React = require('react-native');
var _ = require('underscore');
var {
  Component,
  Text,
  View
} = React;

var HomeFeatured = require('../components/HomeFeatured');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'welcome': 'Welcome'
});

class Home extends Component {
  constructor (props) {
    super(props);
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <Text style={{marginVertical: 20, marginHorizontal: 10}}>{i18next.t('local:welcome')}</Text>
        <HomeFeatured {...this.props} />
      </View>
    );
  }
}

module.exports = Home;
