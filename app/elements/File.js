'use strict';

var React = require('react-native');

var {
  Component,
  View,
  TouchableHighlight,
  Text,
  StyleSheet
  } = React;
var {
  Icon
  } = require('react-native-icons');
var hyperlink = require('../libs/hyperlink');

class File extends Component {
  /**
   * @param props = {
   *  fileName
   *  href
   *  size
   * }
   */
  constructor(props) {
    super(props);
    this.extension = props.href.split('.').pop();
  }

  render() {
    var icon = this._selectApproriateIcon();

    return (
      <TouchableHighlight
        style={{marginVertical:10}}
        underlayColor='transparent'
        onPress={() => hyperlink.open(this.props.href)}>
        <View>
          <Icon
            name={icon}
            size={44}
            color='#666'
            style={{width: 44, height: 44}}
            />
          <View style={styles.fileNameView}>
            <Text style={styles.fileName}>{this.props.fileName + '.' + this.extension}</Text>
          </View>
          <View style={styles.filSizeView}>
            <Text style={styles.fileSize}>{this.props.size}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  _selectApproriateIcon() {
    if (pdf.indexOf(this.extension) !== -1) {
      return 'fontawesome|file-pdf-o';
    } else if (text.indexOf(this.extension) !== -1) {
      return 'fontawesome|file-text-o';
    } else if (image.indexOf(this.extension) !== -1) {
      return 'fontawesome|file-image-o';
    } else if (audio.indexOf(this.extension) !== -1) {
      return 'fontawesome|file-audio-o';
    } else if (video.indexOf(this.extension) !== -1) {
      return 'fontawesome|file-video-o';
    } else if (code.indexOf(this.extension) !== -1) {
      return 'fontawesome|file-code-o';
    }
    return 'fontawesome|file-o';
  }
}

// those are the extensions for the files, they are used to show a different icon
// in each case, by default it show an icon with an white file

var pdf = [
  'pdf'
];

var text = [
  'txt'
];

var image = [
  'jpg',
  'gif',
  'bmp',
  'png'
];

var audio = [
  'wav',
  'mp3',
  'wma'
];

var video = [
  'mkv',
  'gif',
  'avi',
  'wmv',
  'mpeg',
  'm4v'
];

var code = [
  'c',
  'cpp',
  'h',
  'hpp',
  'html',
  'css',
  'java',
  'js'
];

var styles = StyleSheet.create({
  fileName: {
    alignSelf: 'center',
    fontSize: 12,
    color: '#333'
  },
  fileNameView: {
    marginHorizontal: 2,
    marginVertical: 2
  },
  filSizeView: {
    marginHorizontal: 2,
    marginVertical: 2
  },
  fileSize: {
    alignSelf: 'center',
    fontSize: 12,
    color: '#999999'
  }
});

module.exports = File;
