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
      <View style={[styles.container, this.props.style]}>
        <View style={styles.centered}>
          {this._renderLoader()}
        </View>
      </View>
    );
  }

  _renderLoader () {
    if ((Platform.OS === 'android')) {
      return (<ProgressBarAndroid styleAttr='Inverse'/>);
    }

    return (
      <ActivityIndicatorIOS
        animating
        style={styles.loading}
        size='small'
        color='#666666'
        />
    );
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

Loading.propTypes = {
  styles: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.number])
};
