var common = require('@dbrugne/donut-common');
var React = require('react-native');
var Platform = require('Platform');
var client = require('../libs/client');
var s = require('../styles/style');
var alert = require('../libs/alert');

var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Image
  } = React;

var i18next = require('i18next-client');
var _localRes = { // current page locales
  'choose': 'It\'s time to choose a username!',
  'disclaimer': 'This username will be your identity on DONUT and will be public. You cannot edit it later.',
  'save': 'save',
  'username': 'username'
};

i18next.init({
  fallbackLng: 'en',
  lng: 'en',
  debug: true,
  resStore: {
    en: {translation: _localRes}
  }
});


class ChooseUsername extends Component {
  constructor (props) {
    super(props);
    this.state = {
      username: ''
    };
  }

  render () {
    return (
      <View style={styles.main}>
        <View style={styles.container}>

          <View style={styles.flexible}>
            <Image source={require('../assets/logo-bordered.png')} style={styles.logo}/>
          </View>

          <Text style={s.h1}>{i18next.t('choose')}</Text>
          <Text style={[s.h2, s.marginTop10]}>{i18next.t('disclaimer')}</Text>

          <View style={[s.inputContainer, s.marginTop10]}>
            <TextInput
              placeholder={i18next.t('username')}
              onChange={(event) => this.setState({username: event.nativeEvent.text})}
              style={s.input}
              value={this.state.username} />
          </View>

          <TouchableHighlight onPress={(this.onSubmit.bind(this))}
                              style={[s.button, s.buttonPink, styles.marginTop5]}
                              underlayColor='#E4396D' >
            <View style={s.buttonLabel}>
              <Text style={s.buttonTextLight}>{i18next.t('save')}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  onSubmit () {
    if (!this.state.username) {
      return alert.show('not-complete');
    }
    if (!common.validate.username(this.state.username)) {
      return alert.show('invalid');
    }

    client.userUpdate({username: this.state.username}, (response) => {
      if (response.err) {
        return alert.show(response.err);
      }

      client.connect();
    });
  }
}

var styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex:1,
    backgroundColor: '#F7F7F7'
  },
  container: {
    marginHorizontal: 20,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingBottom: 40
  },
  logo: {
    width: 250,
    height: 64,
    alignSelf: 'center'
  },
  flexible: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 28,
    height: 28
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
  marginTop5: {
    marginTop: 5
  }
});

module.exports = ChooseUsername;
