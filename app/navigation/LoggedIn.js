'use strict';

var React = require('react-native');

var {
  Component
} = React;

var client = require('../libs/client');

class Index extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
    this.client = client;
  }
  componentDidMount () {
    this.client.connect();
  }
  componentWillUnmount () {
    this.client.disconnect();
  }
  render () {
    var RootNavigator = require('../libs/navigation').RootNavigator;
    return (
      <RootNavigator />
    );
  }
}

module.exports = Index;
