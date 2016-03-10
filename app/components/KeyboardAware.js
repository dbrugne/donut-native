'use strict';

var React = require('react-native');
var animation = require('../libs/animations').keyboard;
var app = require('../libs/app');

var {
  View,
  LayoutAnimation
} = React;

var KeyboardAwareComponent = React.createClass({
  propTypes: {
    shouldShow: React.PropTypes.func,
    shouldHide: React.PropTypes.func,
    children: React.PropTypes.any
  },
  getInitialState () {
    return {
      keyboardSpace: 0
    };
  },
  componentDidMount () {
    app.on('keyboardWillShow', this.onKeyboardWillShow, this);
    app.on('keyboardWillHide', this.onKeyboardWillHide, this);
  },
  componentWillUnmount () {
    app.off(null, null, this);
  },
  render () {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flex: 1}}>
          {this.props.children}
        </View>
        <View style={{height: this.state.keyboardSpace}}/>
      </View>
    );
  },
  onKeyboardWillShow (height) {
    if (typeof(this.props.shouldShow) !== 'function' || !this.props.shouldShow()) {
      return;
    }

    LayoutAnimation.configureNext(animation);
    this.setState({ keyboardSpace: height });
  },
  onKeyboardWillHide () {
    if (typeof(this.props.shouldHide) !== 'function' || !this.props.shouldHide()) {
      return;
    }

    LayoutAnimation.configureNext(animation);
    this.setState({ keyboardSpace: 0 });
  }
});

module.exports = KeyboardAwareComponent;
