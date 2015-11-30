'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Component
} = React;

var common = require('@dbrugne/donut-common/mobile');
var app = require('../libs/app');
var currentUser = require('../models/mobile-current-user');
var navigation = require('../libs/navigation');

class CurrentUserView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      data: currentUser.toJSON()
    }
  }
  componentDidMount () {
    currentUser.on('change', this.onChange.bind(this));
  }
  componentWillUnmount () {
    currentUser.off('change');
  }
  render () {
    var user = this.state.data;
    var username = (user.username)
      ? '@' + user.username + ' '
      : '';
    var realname = null;
    if (user.realname) {
      realname = (
        <Text style={[styles.text, styles.username]}>{user.realname}</Text>
      );
    }
    return (
      <View style={styles.main}>
        <View style={styles.content}>
          <View style={styles.avatarCtn}>
            <Image style={styles.avatar} source={{uri: common.cloudinary.prepare(user.avatar, 50)}} />
            <Text style={[styles.text, styles.status, user.status === 'connecting' && styles.statusConnecting, user.status === 'offline' && styles.statusOffline, user.status === 'online' && styles.statusOnline]}>{user.status}</Text>
          </View>
          <View style={{ flexDirection: 'column', paddingTop:8 }}>
            <Text style={[styles.text, styles.username]}>{username}</Text>
            {realname}
          </View>
        </View>
        <TouchableHighlight style={styles.myAccount}
                            underlayColor= '#373737'
                            onPress={() => navigation.switchTo(navigation.getMyAccount())}>
          <Text style={styles.text}>My account</Text>
        </TouchableHighlight>
      </View>
    );
  }
  onChange (model, options) {
    this.setState({
      data: model.toJSON()
    });
  }
}

var styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
    backgroundColor: '#1D1D1D'
  },
  content: {
    flexDirection: 'row'
  },
  avatarCtn: {
    flexDirection: 'column',
    position: 'relative'
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 18,
    fontFamily: 'Open Sans'
  },
  avatar: {
    width: 50,
    height: 50,
    margin:8,
    borderRadius: 4
  },
  status: {
    marginBottom: 8,
    alignSelf: 'center',
    textAlign: 'center',
    flex:1,
    fontWeight: '400',
    fontSize: 12,
    fontFamily: 'Open Sans',
    width: 50,
    paddingLeft:5,
    paddingRight:5,
    marginLeft: 8,
    marginRight: 8,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  },
  statusOnline: { backgroundColor: 'rgba(79, 237, 192, 0.8)' },
  statusConnecting: { backgroundColor: 'rgba(255, 218, 62, 0.8)' },
  statusOffline: { backgroundColor: 'rgba(119,119,119,0.8)' },
  username: {
  },
  myAccount: {
    backgroundColor: '#444444',
    padding: 10
  }
});

module.exports = CurrentUserView;
