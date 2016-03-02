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
var FileComponent = require('../File');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'message', {
  'spammed' : 'Message indésirable d\'après le modérateur',
  'placeholder' : 'PLACEHOLDER FOR DOCUMENTS',
  'edited' : ' (edited)'
});

module.exports = React.createClass({
  propTypes: {
    data: React.PropTypes.object,
    navigator: React.PropTypes.object,
    renderActionSheet: React.PropTypes.func,
    model: React.PropTypes.object.isRequired
  },
  render () {
    var message = null;
    var edited = null;
    if (this.props.data.edited) {
      edited = (
        <Text style={s.edited}>{i18next.t('message:edited')}</Text>
      );
    }

    if (this.props.data.spammed && !this.props.data.viewed) {
      message = (
        <View>
          <Text style={s.spammed}>{i18next.t('message:spammed')}</Text>
        </View>
      );
    } else if (this.props.data.message) {
      message = (
        <Text>
          <ParsedText
            model={this.props.model}
            navigator={this.props.navigator}
            style={[s.messageContent, {flexWrap: 'wrap'}, this.props.data.viewed && {backgroundColor: 'rgba(241,82,97,0.15)'}, this.props.data.special && {fontSize: 12, fontStyle: 'italic', fontFamily: 'Open Sans', color: '#666666'}]}
          >
            {this.props.data.message}
          </ParsedText>
          {edited}
        </Text>
      );
    }

    return (
      <TouchableHighlight key={this.props.data.id} style={{marginBottom: 10}}
                          underlayColor='transparent'
                          onLongPress={() => this.props.renderActionSheet()}>
        <View style={[{flexDirection: 'column', flex:1, marginLeft:55}, this.props.data.first && {marginLeft:0}]}>
          <View>{message}</View>
          {this.renderFiles()}
        </View>
      </TouchableHighlight>
    );
  },
  renderFiles () {
    if (this.props.data.spammed && !this.props.data.viewed) {
      return null;
    }

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
        <View style={[{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}, this.props.data.viewed && {backgroundColor: 'rgba(241,82,97,0.15)'}]}>
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
        onPress={() => hyperlink.open(element.href)}
        onLongPress={() => this.props.renderActionSheet()}>
        {this._renderImage(element.thumbnail)}
      </TouchableHighlight>
    );
  },
  _renderImage (url) {
    if (!url) {
      return null;
    }

    return (
      <Image style={{width: 100, height: 100, marginTop:5, marginBottom:5, marginLeft:5, borderRadius:3}} source={{uri: url}} />
    );
  }
});