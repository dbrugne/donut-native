var React = require('react-native');

var {
  Component,
  Text,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image
  } = React;

var {
  height: deviceHeight
  } = Dimensions.get('window');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'confirmModal', {
  'ok': 'Ok',
  'cancel': 'Cancel'
});

class ConfirmationModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      offset: new Animated.Value(deviceHeight)
    };
  }

  componentDidMount() {
    Animated.timing(this.state.offset, {
      duration: 250,
      toValue: 0
    }).start();
  }

  onCancel() {
    this.props.onCancel();
  }

  onConfirm() {
    Animated.timing(this.state.offset, {
      duration: 150,
      toValue: deviceHeight
    }).start(this.props.onConfirm);
  }

  render() {
    return (
      <Animated.View style={[styles.view, styles.flexCenter, {transform: [{translateY: this.state.offset}]}]}>
        <View style={styles.modal}>
          {
            (this.props.type !== 'image')
              ? <View style={{marginTop: 20, marginLeft: 10,  marginRight: 10}}>
                  <Text style={styles.title}>{this.props.title}</Text>
                  <Text style={styles.text}>{this.props.text}</Text>
                </View>
              : <Image source={{uri: 'data:image/png;base64,' + this.props.imageSource, isStatic: true}} style={styles.image}/>
          }

          <View style={styles.actions}>
            <View style={{borderTopWidth: 0.5, borderTopColor: '#333'}}>
              <TouchableOpacity style={styles.button} onPress={() => this.onCancel()}>
                <Text style={styles.buttonText} >{i18next.t('confirmModal:cancel')}</Text>
              </TouchableOpacity>
            </View>
            <View style={{borderLeftWidth: 0.5, borderTopWidth: 0.5, borderTopColor: '#333', borderLeftColor: '#333'}}>
              <TouchableOpacity style={styles.button} onPress={() => this.onConfirm()}>
                <Text style={[styles.buttonText, {fontWeight: 'bold'}]}>{i18next.t('confirmModal:ok')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  view: {
    backgroundColor: 'rgba(0,0,0,.9)',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  modal: {
    width: 280,
    backgroundColor: '#DDD',
    borderRadius: 7
  },
  buttonText: {
    color: '#08F',
    fontSize: 20
  },
  button: {
    width: 140,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actions: {
    flex: 1,
    flexDirection: 'row'
  },
  title: {
    color: "#000",
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center'
  },
  text: {
    color: "#444",
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10
  },
  image: {
    flex: 1,
    width: 280,
    height: 200
  }
});

module.exports = ConfirmationModal;