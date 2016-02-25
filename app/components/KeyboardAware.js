'use strict';

var React = require('react-native');
var animation = require('../libs/animations').keyboard;
var app = require('../libs/app');

var {
  StyleSheet,
  View,
  LayoutAnimation
} = React;

var KeyboardAwareComponent = React.createClass({
  propTypes: {
    shouldShow: React.PropTypes.func,
    shouldHide: React.PropTypes.func
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
      <View style={styles.main}>
        {this.props.children}
        <View style={{height: this.state.keyboardSpace}}/>
      </View>
    );
  },
  onKeyboardWillShow (height) {
    if (typeof(this.props.shouldShow) !== "function" || !this.props.shouldShow()) {
      return;
    }

    LayoutAnimation.configureNext(animation);
    this.setState({ keyboardSpace: height });
  },
  onKeyboardWillHide () {
    if (typeof(this.props.shouldHide) !== "function" || !this.props.shouldHide()) {
      return;
    }

    LayoutAnimation.configureNext(animation);
    this.setState({ keyboardSpace: 0 });
  }
});

var styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column'
  },
});

module.exports = KeyboardAwareComponent;
