var React = require('react-native');

var {
  Component,
  View,
  StyleSheet,
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  Platform
  } = React;

class LoadingModal extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
          {
            (Platform.OS === 'android')
              ? <ProgressBarAndroid styleAttr="Inverse" />
              : <ActivityIndicatorIOS
                  animating={true}
                  size='large'
                  color='#FFF'
                />
          }
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,.6)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});

module.exports = LoadingModal;
