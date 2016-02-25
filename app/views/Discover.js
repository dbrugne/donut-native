'use strict';

var React = require('react-native');
var {
  Component,
  Text,
  View,
  ScrollView,
  TouchableHighlight
} = React;

var config = require('../libs/config')();
var Featured = require('./DiscoverFeatured');
var NotConfirmedComponent = require('../components/NotConfirmed');

var i18next = require('../libs/i18next');

class Discover extends Component {
  constructor (props) {
    super(props);
  }
  render () {
    var version = config.DONUT_VERSION; // + ' (' + config.DONUT_BUILD + ')';
    return (
      <ScrollView>
        <NotConfirmedComponent />
        <Featured {...this.props} />
        <View>
          <Text style={{paddingVertical:2, paddingHorizontal:5, textAlign: 'right', fontSize:10, color: '#999999'}}>DONUT {version}</Text>
        </View>
      </ScrollView>
    );
  }
}

module.exports = Discover;
