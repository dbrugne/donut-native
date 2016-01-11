'use strict';

var React = require('react-native');
var {
  Component,
  StyleSheet,
  View,
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  Platform
} = React;

class Loading extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          {
            (Platform.OS === 'android')
            ? <ProgressBarAndroid styleAttr="Inverse" />
            : <ActivityIndicatorIOS
              animating={true}
              style={styles.loading}
              size='small'
              color='#666666'
              />
          }
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1
  },
  centered: {
    alignSelf: 'center',
    justifyContent: 'center'
  },
  loading: {
    height: 30
  }
});

module.exports = Loading;