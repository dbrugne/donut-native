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
//  componentDidMount() {
//    require('../libs/client').on('welcome', (data) => require('../libs/app').trigger('switchToNavigationStack', 'room/557ed3a4bcb50bc52b74744b'));
//  }
}

module.exports = Home;
