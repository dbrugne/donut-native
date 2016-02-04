var React = require('react-native');
var Platform = require('Platform');
var s = require('../styles/style');
var Alert = require('../libs/alert');
var Link = require('../components/Link');
var Button = require('../components/Button');
var LoadingModal = require('../components/LoadingModal');
var currentUser = require('../models/current-user');

var {
  Component,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Image
} = React;
var Icon = require('react-native-vector-icons/FontAwesome');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'forgot', {
  'forgot': 'Forgot Password',
  'what': 'What email address do you use to sign into Donut ?',
  'reset': 'Reset',
  'email': 'Email',
  'back': 'Back'
});

class ForgotView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      showLoadingModal: false
    };
  }

  render() {
    return (
      <View style={{flex:1, alignItems: 'stretch'}}>
        <View style={[styles.linkCtn, {marginTop:10, paddingLeft:10}]} >
          <Icon
            name='chevron-left'
            size={14}
            color='#808080'
            style={{marginTop: 2, marginRight: 2}}
          />
          <Link
            onPress={(this.onBack.bind(this))}
            text={i18next.t('forgot:back')}
            linkStyle={[s.link, styles.textGray]}
            type='bold'
          />
        </View>
        <ScrollView
          ref='scrollView'
          contentContainerStyle={{flex:1}}
          keyboardDismissMode='on-drag'
          style={{flex: 1, backgroundColor: '#FAF9F5'}}>
          <View>
            <View style={styles.logoCtn}>
              <Image source={require('../assets/logo-bordered.png')} style={styles.logo}/>
            </View>

            <View style={styles.container}>
              <Text style={[s.h1, s.textCenter]}>{i18next.t('forgot:forgot')}</Text>
              <Text style={[s.spacer, s.p, s.textCenter]}>{i18next.t('forgot:what')}</Text>

              <View ref='email'
                    style={[s.inputContainer, s.marginTop5]}>
                <TextInput
                  autoCapitalize='none'
                  placeholder={i18next.t('forgot:email')}
                  onChange={(event) => this.setState({email: event.nativeEvent.text})}
                  onFocus={this.inputFocused.bind(this, 'email')}
                  onBlur={this.inputBlured.bind(this, 'email')}
                  keyboardType='email-address'
                  returnKeyType='done'
                  style={[s.input, s.marginTop10]}
                  value={this.state.email}/>
              </View>

              <Button onPress={(this.onResetPressed.bind(this))}
                      style={s.marginTop5}
                      type='pink'
                      label={i18next.t('forgot:reset')} />

            </View>
          </View>
        </ScrollView>
        {this.state.showLoadingModal ? <LoadingModal /> : null}
      </View>
    )
  }

  onBack() {
    this.props.navigator.pop();
  }

  inputFocused (refName) {
    setTimeout(() => {
      this._updateScroll(refName, 60);
    }, 300); // delay between keyboard opening start and scroll update (no callback after keyboard is rendered)
  }

  inputBlured (refName) {
    setTimeout(() => {
      this._updateScroll(refName, -60);
    }, 300); // delay between keyboard opening start and scroll update (no callback after keyboard is rendered)
  }

  _updateScroll(refName, offset) {
    let scrollResponder = this.refs.scrollView.getScrollResponder();
    scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
      React.findNodeHandle(this.refs[refName]),
      offset,
      true
    );
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
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFF'
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
