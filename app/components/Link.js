'use strict';

var React = require('react-native');
var LinkUnderlined = require('./Link/Underlined');
var LinkBold = require('./Link/Bold');

var Link = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func.isRequired,
    text: React.PropTypes.string.isRequired,
    type: React.PropTypes.oneOf(['underlined', 'bold']).isRequired,
    prepend: React.PropTypes.string,
    append: React.PropTypes.string,
    style: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.number, React.PropTypes.array]),
    linkStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.number, React.PropTypes.array]),
    prependStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.number, React.PropTypes.array]),
    appendStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.number, React.PropTypes.array])
  },
  render () {
    switch (this.props.type) {
      case 'bold':
        return (<LinkBold {...this.props} />);
      case 'underlined':
        return (<LinkUnderlined {...this.props} />);
      default:
        return null;
    }
  }
});

module.exports = Link;
