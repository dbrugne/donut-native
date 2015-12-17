'use strict';

var React = require('react-native');
var {
  Text,
  View,
  Image,
  TouchableHighlight,
  Platform
} = React;
var ParsedText = require('react-native-parsed-text');
var _ = require('underscore');
var navigation = require('../../libs/navigation');
var hyperlink = require('../../libs/hyperlink');
var common = require('@dbrugne/donut-common');
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
    return (
      <View key={this.props.data.id}>
        {this.renderMessage()}
        {this.renderFiles()}
      </View>
    );
  },
  renderMessage () {
    if (!this.props.data.message) {
      return;
    }
    var parse = [{
      pattern: common.markup.markupPattern,
      style: s.linksRoom,
      onPress: this.onPress,
      renderText: (string) => {
        var markup = common.markup.markupToObject(string);
        if (!markup) {
          return;
        }
        return markup.title;
      }
    }];
    var text;

    // Check if message is spammed
    // @todo add toggle on viewed spammed messages
    if (this.props.data.spammed) {
      text = (
        <TouchableHighlight
          key={this.props.data.id}
          underlayColor='transparent'
          onPress={() => this._onUnspam(this.props.data.id)}
        >
          <Text>{i18next.t('local:spammed')}</Text>
        </TouchableHighlight>
      );
    } else {
      if (Platform.OS === 'android') {
        // @todo make parsed text work on android
        text = (<Text style={s.messageContent}>
          {common.markup.toText(this.props.data.message)}
        </Text>);
      } else {
        text = (<ParsedText style={s.messageContent} parse={parse}>
          {this.props.data.message}
        </ParsedText>);
      }
    }

    return (
      <View style={[s.message]}>
        {text}
      </View>);
  },
  _onUnspam (id) {
    app.trigger('messageUnspam', id);
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
  },
  onPress (string) {
    var markup = common.markup.markupToObject(string);
    if (!markup) {
      return;
    }
    if (['url', 'email'].indexOf(markup.type) !== -1) {
      hyperlink.open(markup.href);
    }
    if (['user', 'group', 'room'].indexOf(markup.type) !== -1) {
      let route = navigation.getProfile({
        type: markup.type,
        id: markup.id,
        identifier: markup.title
      });
      this.props.navigator.push(route);
    }
  }
});

