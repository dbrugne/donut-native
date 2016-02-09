'use strict';

var React = require('react-native');
var {
  Component,
  Text,
  View,
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  Platform,
  StyleSheet
  } = React;

var app = require('../libs/app');
var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'connectionState', {
  'offline': 'Connection lost',
  'connecting': 'Connecting',
  'reconnecting': 'Connecting'
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
    if (this.state.status === 'offline') {
      return (
        <View style={[styles.container, {backgroundColor: '#BBB'}]}>
          <Text style={{color: '#FFF'}}>{i18next.t('connectionState:' + this.state.status)}</Text>
        </View>
      );
    }
    return (
      <View style={[styles.container, {backgroundColor: '#BBB'}]}>
        <Text style={{color: '#FFF'}}>{i18next.t('connectionState:' + this.state.status)}</Text>
        <View style={{width: 10}}/>
        {
          (Platform.OS === 'android')
            ? <ProgressBarAndroid styleAttr='SmallInverse' />
            : <ActivityIndicatorIOS
              animating
              style={styles.loading}
              size='small'
              color='#FFF'
            />
        }
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 30,
    position: 'absolute',
    top: (Platform.OS === 'android') ? 46 : 64,
    left: 0,
    right: 0
  },
  loading: {
    height: 20
  }
});

module.exports = ConnectionState;
