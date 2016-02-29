'use strict';

var React = require('react-native');
var _ = require('underscore');
var common = require('@dbrugne/donut-common/mobile');
var Icon = require('react-native-vector-icons/EvilIcons');
var IconFA = require('react-native-vector-icons/FontAwesome');

var {
  Component,
  Image,
  View,
  Text,
  StyleSheet
} = React;

class AbstractCard extends Component {
  constructor (props) {
    super(props);
    this.maxCars = 60;
  }

  _renderThumbnail (thumbnail, isCircle) {
    if (!thumbnail) {
      return null;
    }
    var thumbnailUrl = common.cloudinary.prepare(thumbnail, 150);
    if (!thumbnailUrl) {
      return null;
    }

    return (<Image style={[styles.thumbnail, isCircle && styles.thumbnailCircle]} source={{uri: thumbnailUrl}}/>);
  }

  _renderRightArrow () {
    return (
      <Icon
        name='chevron-right'
        size={50}
        color='#D0D9E6'
        style={{position:'absolute', top:45, right:0, backgroundColor: 'transparent'}}
        />
    );
  }

  _renderUsersCount(count) {
    return (
      <View style={{marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
        <IconFA
          name='users'
          size={12}
          color='#AFBAC8'
          style={{backgroundColor: 'transparent'}}
          />
          <Text style={{marginLeft:5, fontFamily: 'Open Sans', fontSize: 12, color: '#AFBAC8', letterSpacing: 0.75, lineHeight: 13, paddingTop: 2 }}>{count}</Text>
      </View>
    );
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

var styles = StyleSheet.create({
  thumbnail: {
    width: 70,
    height: 70,
    marginLeft: 20
  },
  thumbnailCircle: {
    borderRadius: 35
  }
});

module.exports = AbstractCard;
