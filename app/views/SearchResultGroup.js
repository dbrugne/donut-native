'use strict';

var React = require('react-native');
var Platform = require('Platform');
var s = require('./../styles/search');
var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');

var {
  Component,
  View,
  Text,
  TouchableHighlight,
  Image,
} = React;

class SearchResultGroup extends Component {
  maxCars = 100;
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <TouchableHighlight onPress={this.props.onPress} >
        <View style={s.container}>
          {this._renderThumbnail(this.props.image)}
          <View style={s.rightContainer}>
            <Text style={s.title}>{this.props.identifier}</Text>
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
    description = description.length > this.maxCars
      ? description.substr(0, this.maxCars).concat('...')
      : description
    ;

    return (
      <Text style={s.description}>{description}</Text>
    );
  }
}

module.exports = SearchResultGroup;