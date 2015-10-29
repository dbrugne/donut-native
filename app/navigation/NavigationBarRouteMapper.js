var React = require('react-native');

var {
  Text,
  StyleSheet
} = React;

var app = require('../libs/app');

var NavigationTitle = React.createClass({
  getInitialState: function() {
    return { updatedTitle: null };
  },

  render: function() {
    var title = this.state.updatedTitle || this.props.route.title;
    return (
      <Text style={styles.navBarTitleText}>
        {title}
      </Text>
    );
  }
});

var styles = StyleSheet.create({
  navBarTitleText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '500',
    marginVertical: 9,
  }
});

// Nav sample: https://github.com/facebook/react-native/blob/2b916f3ceffbcb11ed383f958823d221b3feacc6/Examples/UIExplorer/Navigator/NavigationBarSample.js
class NavigationBarRouteMapper {
  constructor() {
  }

  LeftButton(route, navigator, index, navState) {
    return (<Text route={route} index={index} navigator={navigator} direction="left" />);
  }

  RightButton(route, navigator, index, navState) {
    return (<Text route={route} index={index} navigator={navigator} direction="right" />);
  }

  Title(route, navigator, index, navState) {
    return (<NavigationTitle route={route} />);
  }

}

module.exports = NavigationBarRouteMapper;
