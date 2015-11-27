var React = require('react-native');
var _ = require('underscore');
var client = require('../libs/client');
var Platform = require('Platform');
var common = require('@dbrugne/donut-common/mobile');
var s = require('../styles/style');

var {
  Component,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  ToastAndroid
} = React;

var currentUser = require('../models/mobile-current-user');

class MyAccountInformation extends Component {
  constructor (props) {
    super(props);
    this.state = {
      username: currentUser.get('username'),
      realname: '',
      bio: '',
      location: '',
      website: '',
      errors: [],
      load: false
    };
  }

  componentDidMount () {
    client.userRead(currentUser.get('user_id'), _.bind(function (response) {
      this.setState({
        realname: response.realname,
        bio: response.bio,
        location: response.location,
        website: response.website,
        picture: common.cloudinary.prepare(response.avatar, 50),
        load: true
      });
    }, this));
  }

  render () {
    if (!this.state.load) {
      return this.renderLoadingView();
    }

    var messages = null;
    if ((this.state.errors && this.state.errors.length > 0) || (this.state.messages && this.state.messages.length > 0)) {
      if (this.state.errors && this.state.errors.length > 0) {
        messages = (
          <View style={s.alertError}>
            {this.state.errors.map((m) => <Text style={s.alertErrorText}>{m}</Text>)}
            {this.state.messages.map((m) => <Text style={s.alertErrorText}>{m}</Text>)}
          </View>
        );
      } else {
        messages = (
          <View style={s.alertSuccess}>
            {this.state.errors.map((m) => <Text style={s.alertSuccessText}>{m}</Text>)}
            {this.state.messages.map((m) => <Text style={s.alertSuccessText}>{m}</Text>)}
          </View>
        );
      }
    }

    var realname = null;
    if (this.state.realname) {
      realname = (
        <Text style={styles.username}>{this.state.realname}</Text>
      );
    }

    return (
      <View style={styles.container}>

        <View style={styles.containerHorizontal}>
          <Image
            style={styles.image}
            source={{uri: this.state.picture}}
            />
          <View style={styles.containerVertical}>
            {realname}
            <Text style={[styles.username, realname && styles.usernameGray]}>@{this.state.username}</Text>
          </View>
        </View>

        {messages}

        <View style={[s.inputContainer, s.marginTop20]}>
          <Text style={s.inputLabel}>realname</Text>
          <TextInput
            placeholder="name and first name"
            onChange={(event) => this.setState({realname: event.nativeEvent.text})}
            value={this.state.realname}
            style={s.input}
            maxLength={20}/>
        </View>

        <View style={s.inputContainer}>
          <Text style={s.inputLabel}>bio</Text>
          <TextInput
            placeholder="Describe yourself"
            onChange={(event) => this.setState({bio: event.nativeEvent.text})}
            value={this.state.bio}
            style={[s.input, s.marginTop5, styles.bio]}
            maxLength={200}
            multiline={true}/>
         </View>

        <View style={s.inputContainer}>
          <Text style={s.inputLabel}>place</Text>
          <TextInput
            placeholder="City, country where you are"
            onChange={(event) => this.setState({location: event.nativeEvent.text})}
            value={this.state.location}
            style={s.input}/>
        </View>

        <View style={s.inputContainer}>
          <Text style={s.inputLabel}>website</Text>
          <TextInput
            placeholder="URL of a website"
            onChange={(event) => this.setState({website: event.nativeEvent.text})}
            value={this.state.website}
            style={s.input}/>
        </View>

        <Text style={s.filler}></Text>


        <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))}
                            style={[s.button, s.buttonPink, s.marginTop10]}
                            underlayColor='#E4396D'
          >
          <View style={s.buttonLabel}>
            <Text style={s.buttonTextLight}>SAVE</Text>
          </View>
        </TouchableHighlight>

      </View>
    )
  }

  //@todo mutualise loading view
  renderLoadingView () {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text> Loading... </Text>
          <ActivityIndicatorIOS
            animating={this.state.load}
            style={styles.loading}
            size='small'
            color='#666666'
            />
        </View>
      </View>
    );
  }

  onSubmitPressed () {
    var updateData = {
      realname: this.state.realname,
      bio: this.state.bio,
      location: this.state.location,
      website: this.state.website
    };

    client.userUpdate(updateData, _.bind(function (response) {
      if (response.err) {
        this._appendError(response.err);
      } else {
        this._appendMessage('Success');
      }
    }, this));
  }

  _appendError (string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({errors: this.state.messages.concat(string)});
    }
  }

  _appendMessage (string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      this.setState({messages: this.state.messages.concat(string)});
    }
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
  containerHorizontal: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 10
  },
  containerVertical: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: 2
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 4,
    marginRight: 10
  },
  bio: {
    height:120
  },
  username: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 18,
    fontWeight: '400'
  },
  usernameGray: {
    color: '#b6b6b6'
  },
  realname: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '400'
  },
  icon: {
    width: 14,
    height: 14,
    color: '#c7c7c7'
  },
  loading: {
    height: 120
  }
});

module.exports = MyAccountInformation;

