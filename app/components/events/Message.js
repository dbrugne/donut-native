'use strict';

var React = require('react-native');
var {
  View,
  Image,
  TouchableHighlight,
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
  'spammed' : 'Message indésirable d\'après le modérateur [Afficher]',
  'placeholder' : 'PLACEHOLDER FOR DOCUMENTS'
});

module.exports = React.createClass({
  render () {
    var message;
    if (this.props.data.message) {
      if (this.props.data.spammed) {
        // @todo add toggle on viewed spammed messages
        message = (
          <TouchableHighlight
            key={this.props.data.id}
            underlayColor='transparent'
            onPress={() => this._onUnspam(this.props.data.id)} >
            <Text>{i18next.t('local:spammed')}</Text>
          </TouchableHighlight>
        );
      } else {
        message = (
          <ParsedText
            navigator={this.props.navigator}
            style={[s.messageContent, {flexWrap: 'wrap'}]}
          >{this.props.data.message}</ParsedText>
        );
      }
    }

    return (
      <View key={this.props.data.id}>
        <View style={s.message}>{message}</View>
        {this.renderFiles()}
      </View>
    );
  },
  _onUnspam (id) {
    // @todo add logic to display message, probably need to store event content here and re-render when user touch
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
        <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
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
        <Image style={{width: 250, height: 250, alignSelf: 'center', marginVertical:10, marginHorizontal:10}} source={{uri: element.thumbnail}} />
      </TouchableHighlight>
    );
  }
});

