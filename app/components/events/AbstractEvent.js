'use strict';

var React = require('react-native');
var s = require('../../styles/events');
var Username = require('./Username');
var date = require('../../libs/date');

var {
  Component,
  View,
  Text,
  Image
} = React;
class AbstractEvent extends Component {
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
              style={{marginRight:0, fontWeight: 'bold', fontSize: 12, fontFamily: 'Open Sans', color: '#333333'}}
              user_id={this.props.user_id}
              username={this.props.data.username}
              realname={this.props.data.realname}
              navigator={this.props.data.navigator}
              />
            <Text style={s.time}>{date.shortTime(this.props.data.time)}</Text>
          </View>
          {this.props.children}
        </View>
      </View>
    );
  }

  _renderAvatar () {
    if (!this.props.data.avatar) {
      return null;
    }

    return (
      <Image style={{width: 34, height: 34, borderRadius:3, marginLeft:10, marginRight:10}} source={{uri: this.props.data.avatar}}/>
    );
  }
}

module.exports = AbstractEvent;