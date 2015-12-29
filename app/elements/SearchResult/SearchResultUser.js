'use strict';

var React = require('react-native');
var Platform = require('Platform');
var s = require('./style');
var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');

var {
  Component,
  View,
  Text,
  TouchableHighlight,
  Image,
  } = React;

class SearchResultUser extends Component {
  maxCars = 100;
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <TouchableHighlight onPress={this.props.onPress} >
        <View style={s.container}>
          {this._renderThumbnail(this.props.image)}
          {this._renderStatus()}
          <View style={s.rightContainer}>
            <Text>
              {this._renderRealname()}
              <Text style={[s.title, this.props.realname && {fontWeight: 'normal', color:'#777'}]}>{this.props.identifier}</Text>
            </Text>
            {this._renderBio()}
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _renderThumbnail (thumbnail) {
    if (!thumbnail) {
      return null;
    }
    var thumbnailUrl = common.cloudinary.prepare(thumbnail, 60);
    if (!thumbnailUrl) {
      return null;
    }

    return (<Image style={s.thumbnailUser} source={{uri: thumbnailUrl}} />);
  }

  _renderRealname() {
    if (!this.props.realname) {
      return null;
    }
    return (
      <Text style={[s.title, {marginLeft:5}]}>{this.props.realname}</Text>
    );
  }
  
  _renderBio() {
    if (!this.props.bio) {
      return null;
    }

    let bio = _.unescape(this.props.bio.replace(/\n/g,''));
    bio = bio.length > this.maxCars
      ? bio.substr(0, this.maxCars).concat('...')
      : bio
    ;

    return (
      <Text style={s.description}>{bio}</Text>
    );
  }

  _renderStatus() {
    return(
      <Text style={[s.statusText, s.status, this.props.status === 'connecting' && s.statusConnecting, this.props.status === 'offline' && s.statusOffline, this.props.status === 'online' && s.statusOnline]}>{this.props.status}</Text>
    );
  }
}

module.exports = SearchResultUser;