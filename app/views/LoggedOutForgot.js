var React = require('react-native');
var Platform = require('Platform');
var s = require('../styles/style');
var Alert = require('../libs/alert');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Image
} = React;
var {
  Icon
} = require('react-native-icons');


class ForgotView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }

  render() {
    return (
      <View style={styles.main}>
        <View style={styles.logoCtn}>
          <Image source={require('../assets/logo-bordered.png')} style={styles.logo}/>
        </View>

        <View style={styles.container}>
          <Text style={[s.h1, s.textCenter]}>Forgot Password</Text>
          <Text style={[s.spacer, s.p, s.textCenter]}>What email address do you use to sign into Donut ?</Text>

          <View style={[s.inputContainer, s.marginTop5]}>
            <TextInput
              autoFocus={true}
              placeholder="Email"
              onChange={(event) => this.setState({email: event.nativeEvent.text})}
              style={[s.input, s.marginTop10]}
              value={this.state.email}/>
          </View>
          <TouchableHighlight onPress={(this.onResetPressed.bind(this))}
                              style={[s.button, s.buttonPink, s.marginTop5]}
                              underlayColor='#E4396D'
            >
            <View style={s.buttonLabel}>
              <Text style={s.buttonTextLight}>Reset</Text>
            </View>
          </TouchableHighlight>
        </View>

        <View style={styles.linkCtn} >
          <Icon
            name='fontawesome|chevron-left'
            size={14}
            color='#808080'
            style={styles.icon}
            />
          <TouchableHighlight onPress={(this.onBack.bind(this))}
                              underlayColor='transparent'
                              style={styles.textGray}>
            <Text style={s.link}>Back to login page</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  onBack() {
    this.props.navigator.pop();
  }

  onResetPressed() {
    if (!this.state.email) {
      return Alert.show('not-complete');
    }

    currentUser.forgot(this.state.email, (err) => {
      if (err) {
        Alert.show(err);
      } else {
        Alert.show('Success');
      }
    });
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex:1,
    backgroundColor: '#FAF9F5'
  },
  container: {
    paddingLeft:20,
    paddingRight:20,
    paddingTop:10,
    paddingBottom:10,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  logo: {
    width: 125,
    height: 32,
    alignSelf: 'center'
  },
  logoCtn: {
    marginTop: 50,
    paddingBottom:25,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#C3C3C3'
  },
  iconContainer: {
    justifyContent: 'flex-end',
    borderRightWidth: 2,
    borderColor: '#344B7D',
    borderStyle: 'solid',
    marginRight: 5
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: "center"
  },
  linkCtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#C3C3C3',
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft:5
  },
  textGray: {
    fontWeight: 'normal',
    color: '#808080'
  },
  icon: {
    width: 14,
    height: 14
  }
});

module.exports = ForgotView;
