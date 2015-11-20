'use strict';

var React = require('react-native');
var {
  Image,
  ListView,
  TouchableHighlight,
  Text,
  View,
  Component,
  ScrollView
} = React;

var HomeFeaturedView = require('./HomeFeaturedView');

class HomeView extends Component {
  constructor (props) {
    super(props);
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Bienvenue</Text>
        <HomeFeaturedView {...this.props} />
      </View>
    );
  }
//  componentDidMount() {
//    require('../libs/client').on('welcome', (data) => require('../libs/app').trigger('switchToNavigationStack', 'room/557ed3a4bcb50bc52b74744b'));
//  }
}

module.exports = HomeView;
