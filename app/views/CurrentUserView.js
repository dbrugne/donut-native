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
var currentUser = require('../models/current-user');

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
    return (
      <View style={styles.main}>
        <Image style={styles.avatar} source={{uri: common.cloudinary.prepare(user.avatar, 50)}} />
        <View style={styles.content}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.text, styles.username]}>{username}</Text>
            <Text style={[styles.text, styles.status]}>({user.status})</Text>
          </View>
          <TouchableHighlight style={styles.myAccount} onPress={() => app.trigger('navigateTo', 'my-account')}>
            <Text style={styles.text}>My account</Text>
          </TouchableHighlight>
        </View>
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
    flexDirection: 'row'
  },
  content: {
    marginVertical: 8
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Open Sans',
  },
  avatar: {
    width: 50,
    height: 50,
    margin: 8
  },
  username: {
  },
  myAccount: {
    backgroundColor: '#444444',
    padding: 10
  }
});

module.exports = CurrentUserView;
