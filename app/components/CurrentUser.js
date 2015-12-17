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
var {
  Icon
  } = require('react-native-icons');

var common = require('@dbrugne/donut-common/mobile');
var app = require('../libs/app');
var currentUser = require('../models/mobile-current-user');
var navigation = require('../libs/navigation');
var s = require('../styles/style');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'my-account': 'My account'
});

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

    // currentUser not already loaded with first 'welcome'
    if (!user.username) {
      return (<View></View>);
    }

    var username = (user.username)
      ? '@' + user.username + ' '
      : '';
    var realname = null;
    if (user.realname) {
      realname = (
        <Text style={[styles.text, styles.username]}>{user.realname}</Text>
      );
    }

    var avatar;
    if (user.avatar) {
      avatar = (<Image style={styles.avatar} source={{uri: common.cloudinary.prepare(user.avatar, 60)}} />);
    }

    return (
      <View style={styles.main}>
        <View style={styles.content}>
          <View style={styles.avatarCtn}>
            <TouchableHighlight style={styles.linkBlock}
                                underlayColor= '#414041'
                                onPress={() => navigation.switchTo(navigation.getMyAccount())}>
              <View style={[styles.linkContainer, {position: 'relative'}]}>
                {avatar}
                <Text style={[styles.text, styles.status, user.status === 'connecting' && styles.statusConnecting, user.status === 'offline' && styles.statusOffline, user.status === 'online' && styles.statusOnline]}>{user.status}</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{ flexDirection: 'column', paddingTop:8 }}>
            <Text style={[styles.text, styles.username]}>{username}</Text>
            {realname}
          </View>
        </View>
        <TouchableHighlight style={styles.linkBlock}
                            underlayColor= '#414041'
                            onPress={() => navigation.switchTo(navigation.getMyAccount())}>
          <View style={styles.linkContainer}>
            <View style={styles.iconCtn}>
              <Icon
                name='fontawesome|gear'
                size={18}
                color='#ecf0f1'
                style={styles.icon}
                />
            </View>
            <Text style={styles.linkText}>{i18next.t('local:my-account')}</Text>
          </View>
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
    flexDirection: 'column'
  },
  content: {
    flexDirection: 'row',
    backgroundColor: '1D1D1D'
  },
  avatarCtn: {
    flexDirection: 'column'
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
    left:0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  },
  statusOnline: { backgroundColor: 'rgba(79, 237, 192, 0.8)' },
  statusConnecting: { backgroundColor: 'rgba(255, 218, 62, 0.8)' },
  statusOffline: { backgroundColor: 'rgba(119,119,119,0.8)' },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  linkBlock: {
    borderTopColor: '#373737',
    borderTopWidth: 0.5,
    borderStyle: 'solid',
    borderBottomColor: '#0E0D0E',
    borderBottomWidth: 0.5
  },
  linkText: {
    fontFamily: 'Open Sans',
    fontSize: 16,
    color: '#ecf0f1',
    marginVertical: 15
  },
  iconCtn: {
    marginVertical: 8,
    marginHorizontal: 10
  },
  icon: {
    width: 18,
    height: 18
  }
});

module.exports = CurrentUserView;
