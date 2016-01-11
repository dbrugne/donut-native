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
var currentUser = require('../../models/current-user');
var navigation = require('../index');

var i18next = require('../../libs/i18next');

class CurrentUserView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      data: currentUser.toJSON()
    };
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
      return null;
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
        <TouchableHighlight
          underlayColor= '#414041'
          onPress={() => navigation.navigate('MyAccount')}>
          <View style={{flexDirection: 'row', backgroundColor: '1D1D1D', alignItems:'center', justifyContent:'center'}}>
            <View style={styles.avatarCtn}>
              <View style={[styles.linkContainer, {position: 'relative'}]}>
                {avatar}
                <Text style={[styles.text, styles.status, user.status === 'connecting' && styles.statusConnecting, user.status === 'offline' && styles.statusOffline, user.status === 'online' && styles.statusOnline]}>{user.status}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'column', flex:1 }}>
              <Text style={[styles.text, styles.username]}>{username}</Text>
              {realname}
            </View>
            <View style={styles.iconCtn}>
              <Icon
                name='fontawesome|gear'
                size={18}
                color='#999998'
                style={styles.icon}
                />
            </View>
          </View>
        </TouchableHighlight>
        {
          (user.confirmed)
            ? null
            : <View style={{flex: 1, marginRight: 7, marginLeft: 7, backgroundColor: '#FC2063', padding: 5}}>
                <Text style={{color: '#FFF'}}>{i18next.t('messages.mail-notconfirmed')}</Text>
              </View>
        }
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
  avatarCtn: {
    flexDirection: 'column'
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
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