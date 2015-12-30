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

class SearchResultRoom extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <TouchableHighlight onPress={this.props.onPress} >
        <View style={s.container}>
          {this._renderThumbnail(this.props.image)}
          <View style={s.rightContainer}>
            <View style={s.topContainer}>
              <Text style={s.title}>{this.props.identifier}</Text>
              <Text style={s.mode}>{(this.props.mode) ? this.props.mode : ''}</Text>
            </View>
            {this._renderDescription()}
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

    return (<Image style={s.thumbnail} source={{uri: thumbnailUrl}} />);
  }

  _renderDescription() {
    if (!this.props.description) {
      return null;
    }

    let description = _.unescape(this.props.description.replace(/\n/g,''));

    return (
      <Text style={s.description}>{description}</Text>
    );
  }
}

module.exports = SearchResultRoom;