'use strict';

var React = require('react-native');
var {
  Component,
  Text,
  View
} = React;

var HomeFeatured = require('../components/HomeFeatured');

class Home extends Component {
  constructor (props) {
    super(props);
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Bienvenue</Text>
        <HomeFeatured {...this.props} />
      </View>
    );
  }
}

module.exports = Home;