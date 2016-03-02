var React = require('react-native');
var Platform = require('Platform');
var s = require('../styles/style');
var Alert = require('../libs/alert');
var Link = require('../components/Link');
var Button = require('../components/Button');
var LoadingModal = require('../components/LoadingModal');
var currentUser = require('../models/current-user');
var animation = require('../libs/animations').homepageLogo;

var {
  Component,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  LayoutAnimation,
  TouchableHighlight
} = React;
var Icon = require('react-native-vector-icons/EvilIcons');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'forgot', {
  'forgot': 'Forgot Password',
  'what': 'What email do you usually use to sign in ?',
  'reset': 'RESET',
  'email': 'Email'
});

class ForgotView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      showLoadingModal: false,
      editing: false
    };
  }

  render() {
    if (this.state.showLoadingModal) {
      return (<LoadingModal />);
    }

    return (
      <View style={{flex: 1, alignItems: 'stretch', position: 'relative'}}>
        <Image source={require('../assets/background.jpg')} style={{position: 'absolute', resizeMode:'stretch'}} />

        <View style={[styles.linkCtn, {marginTop:15, paddingLeft:10, backgroundColor: 'transparent'}]} >
          <TouchableHighlight onPress={(this.onBack.bind(this))}
                              underlayColor='transparent'
            >
            <View>
              <Icon
                name='chevron-left'
                size={50}
                color='#FC2063'
                style={{marginTop: 2, marginRight: 2}}
                />
            </View>
          </TouchableHighlight>
        </View>

        <ScrollView ref='scrollView' contentContainerStyle={{flex:1}} keyboardDismissMode='on-drag' style={{flex: 1}}>

          <View style={styles.logoCtn}>
            <Image source={require('../assets/logo-bordered.png')} style={[styles.logo, this.state.editing && styles.logoSmall]}/>
          </View>

          <View style={styles.container}>
            <View>
              <Text style={{fontFamily: 'Open Sans', fontSize: 16, color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center'}}>{i18next.t('forgot:forgot')}</Text>
              <Text style={{marginTop: 10, fontFamily: 'Open Sans', fontSize: 14, color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center'}}>{i18next.t('forgot:what')}</Text>

              <View style={[{ marginTop: 20, padding:4, borderRadius:4, backgroundColor:'#FFFFFF'}, styles.shadow]}>

                <TextInput
                  autoCapitalize='none'
                  placeholder={i18next.t('forgot:email')}
                  onChange={(event) => this.setState({email: event.nativeEvent.text})}
                  onFocus={this.inputFocused.bind(this, 'email')}
                  onBlur={this.inputBlured.bind(this, 'email')}
                  keyboardType='email-address'
                  returnKeyType='done'
                  style={{ backgroundColor: '#FFF', color: "#AFBAC8", height: 40, paddingBottom: 3, paddingTop: 3, paddingLeft: 10, paddingRight: 10, fontFamily: 'Open Sans', fontSize: 14, flex: 1 }}
                  value={this.state.email}/>

              </View>

              <Button onPress={(this.onResetPressed.bind(this))}
                      style={{marginTop:15}}
                      buttonStyle={[{borderRadius:4}, styles.shadow]}
                      type='pink'
                      label={i18next.t('forgot:reset')} />

            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

  onBack() {
    this.props.navigator.pop();
  }

  inputFocused (refName) {
    LayoutAnimation.configureNext(animation);
    this.setState({
      editing: true
    });
  }

  inputBlured (refName) {
    LayoutAnimation.configureNext(animation);
    this.setState({
      editing: false
    });
  }

  onResetPressed() {
    if (!this.state.email) {
      return Alert.show(i18next.t('messages.not-complete'));
    }

    this.setState({showLoadingModal: true});
    currentUser.forgot(this.state.email, (err) => {
      this.setState({showLoadingModal: false});
      if (err) {
        Alert.show(i18next.t('messages.' + err));
      } else {
        Alert.show(i18next.t('messages.success'));
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
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  logo: {
    width: 200,   // 400
    height: 50,   // 101
    alignSelf: 'center'
  },
  logoSmall: {
    width: 100,
    height: 25
  },
  logoCtn: {
    marginTop: 50,
    paddingBottom:25,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center'
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
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFF'
  },
  textGray: {
    fontWeight: 'normal',
    color: '#808080'
  },
  shadow: {
    shadowColor: 'rgb(30,30,30)',
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    shadowOpacity: 0.75
  }
});

module.exports = ForgotView;
