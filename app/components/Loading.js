'use strict';

var React = require('react-native');
var {
  Component,
  StyleSheet,
  View,
  ActivityIndicatorIOS
} = React;

class Loading extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicatorIOS
            animating={true}
            style={styles.loading}
            size='small'
            color='#666666'
            />
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
    flex: 1,
    backgroundColor: '#f0f0f0'
    //backgroundColor: '#fF00FF' // pink
  },
  centered: {
    alignSelf: 'center',
    justifyContent: 'center'
  },
  loading: {
    height: 120
  }
});

module.exports = Loading;