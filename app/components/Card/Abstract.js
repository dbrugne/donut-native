'use strict';

var React = require('react-native');
var s = require('./../../styles/search');
var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');

var {
  Component,
  Image
  } = React;

class AbstractCard extends Component {
  constructor (props) {
    super(props);
    this.maxCars = 100;
  }

  _renderThumbnail (thumbnail, isUser) {
    if (!thumbnail) {
      return null;
    }
    var thumbnailUrl = common.cloudinary.prepare(thumbnail, 60);
    if (!thumbnailUrl) {
      return null;
    }

    return (<Image style={[s.thumbnail, isUser && s.thumbnailUser]} source={{uri: thumbnailUrl}}/>);
  }

  truncate (str, esc) {
    if (!str) {
      return null;
    }

    if (esc) {
      str = _.unescape(str.replace(/\n/g, ''));
    }

    return str.length > this.maxCars
      ? str.substr(0, this.maxCars).concat('...')
      : str
      ;
  }
}

module.exports = AbstractCard;
