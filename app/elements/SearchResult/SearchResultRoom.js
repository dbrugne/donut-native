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
  maxCars = 100;
  constructor (props) {
    super(props);
  }

  render () {
    let avatarUrl = common.cloudinary.prepare(this.props.image, 60);

    return (
      <TouchableHighlight onPress={this.props.onPress} >
        <View style={s.container}>
          <Image
            source={{uri: avatarUrl}}
            style={s.thumbnail}
            />
          <View style={s.rightContainer}>
            <Text style={s.title}>{this.props.identifier}</Text>
            {this._renderDescription()}
          </View>
        </View>
      </TouchableHighlight>
    );
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

module.exports = SearchResultRoom;