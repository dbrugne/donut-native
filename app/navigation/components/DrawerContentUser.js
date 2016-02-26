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
var Icon = require('react-native-vector-icons/FontAwesome');
var _ = require('underscore');

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

    var name = user.realname
      ? user.realname
      : user.username
        ? '@' + user.username
        : '';

    var avatar;
    if (user.avatar) {
      avatar = (<Image style={styles.avatar} source={{uri: common.cloudinary.prepare(user.avatar, 50)}} />);
    }

    return (
      <View style={styles.main}>
        <TouchableHighlight
          underlayColor= '#414041'
          onPress={() => navigation.navigate('MyAccount')}>
          <View style={{flexDirection: 'row', backgroundColor: 'rgba(29,37,47,30)', alignItems: 'center', justifyContent: 'center'}}>
            <View style={styles.avatarCtn}>
              <View style={[styles.linkContainer, {position: 'relative'}]}>
                {avatar}
                <View style={[styles.status, user.status === 'connecting' && styles.statusConnecting, user.status === 'offline' && styles.statusOffline, user.status === 'online' && styles.statusOnline]}>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'column', flex:1, position: 'relative', marginLeft: 10 }}>
              <Text style={styles.text}>{name}</Text>
            </View>
            <View style={styles.iconCtn}>
              <Icon
                name='gear'
                size={18}
                color='rgba(208,217,230,40)'
              />
            </View>
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
  avatarCtn: {
    flexDirection: 'column'
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Open Sans'
  },
  avatar: {
    width: 40,
    height: 40,
    marginVertical: 5,
    marginHorizontal: 10
  },
  status: {
    position: 'absolute',
    width: 15,
    height: 15,
    bottom: 6,
    right:0,
    borderRadius: 7.5,
    borderColor: 'rgba(29,37,47,30)',
    borderWidth: 2,
    borderStyle: 'solid'
  },
  statusOnline: { backgroundColor: 'rgb(79, 237, 192)' },
  statusConnecting: { backgroundColor: 'rgb(255, 218, 62)' },
  statusOffline: { backgroundColor: 'rgb(119,119,119)' },
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
    marginRight: 20
  }
});

module.exports = CurrentUserView;
