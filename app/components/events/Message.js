'use strict';

var React = require('react-native');
var {
  View,
  Image,
  TouchableHighlight,
  StyleSheet,
  Text
} = React;
var ParsedText = require('../ParsedText');
var _ = require('underscore');
var hyperlink = require('../../libs/hyperlink');
var s = require('../../styles/events');
var app = require('../../libs/app');
var FileComponent = require('../../elements/File');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'spammed' : 'Message indésirable d\'après le modérateur',
  'placeholder' : 'PLACEHOLDER FOR DOCUMENTS',
  'edited' : ' (edited)'
});

module.exports = React.createClass({
  render () {
    var message;
    if (this.props.data.message) {
      if (this.props.data.spammed) {
        message = (
          <View>
            <Text style={s.spammed}>{i18next.t('local:spammed')}</Text>
          </View>
        );
      } else {
        var edited = null;
        if (this.props.data.edited) {
          edited = (
            <Text style={s.edited}>{i18next.t('local:edited')}</Text>
          );
        }
        message = (
          <Text>
            <ParsedText
              navigator={this.props.navigator}
              style={[s.messageContent, {flexWrap: 'wrap'}]}
            >
              {this.props.data.message}
            </ParsedText>
            {edited}
          </Text>
        );
      }
    }

    return (
      <View key={this.props.data.id} style={{marginBottom: 10}}>
        <View style={[{flexDirection: 'column', flex:1, marginLeft:55}, this.props.data.first && {marginLeft:0}]}>
          <View>{message}</View>
          {this.renderFiles()}
        </View>
      </View>
    );
  },
  renderFiles () {
    if (this.props.data.files && this.props.data.files.length > 0) {
      let elements = _.map(this.props.data.files, (element, index) => {
        return (element.type === 'image')
          ? this.renderImage(element, index)
          : this.renderFile(element, index);
      });

      if (!elements.length) {
        return;
      }

      return (
        <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
          {elements}
        </View>
      );
    }
  },
  renderFile (element, index) {
    return (
      <FileComponent
        key={this.props.data.id + '-' + index}
        fileName={element.filename}
        href={element.url}
        size={element.size}
        />
    );
  },
  renderImage (element, index) {
    return (
      <TouchableHighlight
        key={this.props.data.id + '-' + index}
        underlayColor='transparent'
        onPress={() => hyperlink.open(element.href)}>
        {this._renderImage(element.thumbnail)}
      </TouchableHighlight>
    );
  },
  _renderImage (url) {
    if (!url) {
      return null;
    }

    return (
      <Image style={{width: 100, height: 100, marginTop:5, borderRadius:3}} source={{uri: url}} />
    );
  }
});