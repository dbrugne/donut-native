'use strict';

var React = require('react-native');
var {
  Component,
  Text,
  View,
  StyleSheet
  } = React;

var app = require('../libs/app');
var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'offline': 'Connection lost',
  'connecting': 'Connecting...',
  'reconnecting': 'Connecting...'
});

class ConnectionState extends Component {
  constructor (props) {
    super(props);
    this.state = {
      status: app.user.get('status')
    };
  }
  componentDidMount () {
    app.user.on('change:status', () => this.setState({status: app.user.get('status')}), this);
  }
  componentWillUnmount () {
    app.user.off(null, null, this);
  }
  render () {
    if (this.state.status === 'online') {
      return null;
    }
    return (
      <View style={[styles.container, {backgroundColor: (this.state.status === 'offline') ? '#F00' : '#FA0'}]}>
        <Text style={{color: '#FFF'}}>{i18next.t('local:' + this.state.status)}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    height: 30
  }
});

module.exports = ConnectionState;
