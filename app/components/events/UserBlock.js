'use strict';

var React = require('react-native');
var s = require('../../styles/events');
var Username = require('./Username');
var date = require('../../libs/date');
var common = require('@dbrugne/donut-common/mobile');

var {
  Component,
  View,
  Text,
  Image
} = React;
class UserBlock extends Component {
  /**
   * @param props = {
   *  text: string to display on element
   *  username
   *  realname
   *  user_id
   *  time
   * }
   */
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <View style={{flexDirection: 'row'}}>
        {this._renderAvatar()}
        <View style={{flexDirection: 'column', flex:1}}>
          <View style={{flexDirection: 'row', flex:1}}>
            <Username
              style={{marginRight:0, fontWeight: 'bold', fontSize: 14, fontFamily: 'Open Sans', color: '#333333'}}
              user_id={this.props.data.user_id}
              username={this.props.data.username}
              realname={this.props.data.realname}
              navigator={this.props.navigator}
              />
            <Text style={s.time}>{date.shortTime(this.props.data.time)}</Text>
          </View>
          {this.props.children}
        </View>
      </View>
    );
  }

  _renderAvatar () {
    if (!(this.props.data.avatar || this.props.data.avatarRaw)) {
      return null;
    }

    let avatar = this.props.data.avatar;
    if (this.props.data.avatarRaw) {
      avatar = common.cloudinary.prepare(this.props.data.avatarRaw, 40);
    }

    return (
      <Image style={{width: 34, height: 34, borderRadius:3, marginLeft:10, marginRight:10}} source={{uri: avatar}}/>
    );
  }
}

module.exports = UserBlock;