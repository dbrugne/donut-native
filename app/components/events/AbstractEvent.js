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
var {
  Icon
  } = require('react-native-icons');

class AbstractEvent extends Component {
  /**
   * @param props = {
   *  text: string to display on element
   *  icon: fontawesome code name of the icon to display on left
   *  iconColor: color of the icon to display on left, default is #666
   *  username
   *  user_id
   *  time
   * }
   */
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <View style={{flexDirection:'row', flexWrap: 'wrap', alignItems: 'center', marginLeft:10, marginRight:10}}>
        {this._renderIcon()}
        {this._renderAvatar()}
        <Username
          style={[s.username, {marginRight:0}]}
          user_id={this.props.data.user_id}
          username={this.props.data.username}
          navigator={this.props.navigator}
          />
        <Text style={[s.topicContent, {flexWrap: 'wrap', flex:1, marginLeft:2}]}>{this.props.text}</Text>
        <Text style={{color: '#666666', fontSize: 10, fontFamily: 'Open Sans', alignSelf:'flex-end'}}>{date.shortTime(this.props.data.time)}</Text>
      </View>
    );
  }

  _renderIcon () {
    if (!this.props.icon) {
      return null;
    }
    let iconColor = this.props.iconColor || '#666';

    return (
      <Icon
        name={this.props.icon}
        size={12}
        color={iconColor}
        style={{width:12, height:12}}
        />
    );
  }

  _renderAvatar () {
    if (!this.props.data.avatar) {
      return null;
    }

    return (
      <Image style={{width: 14, height: 14, borderRadius:3, marginLeft:5, marginRight:5}} source={{uri: this.props.data.avatar}}/>
    );
  }
}

module.exports = AbstractEvent;