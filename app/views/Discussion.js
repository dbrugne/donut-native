'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View
} = React;

var debug = require('../libs/debug')('navigation');

var Discussion = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    model: React.PropTypes.object.isRequired
  },
  getInitialState () {
    return {
      blocked: (this.props.model.get('type') === 'room' && this.props.model.get('blocked') === true),
      // wasBlocked is there to check if discussion change from block to unblock
      wasBlocked: (this.props.model.get('type') === 'room' && this.props.model.get('blocked') === true)
    };
  },
  componentDidMount () {
    debug.log(this.props.model.get('identifier') + ' mounted');

    this.props.model.on('change:blocked', this.onBlockedChange, this);
  },
  componentWillUnmount () {
    debug.log(this.props.model.get('identifier') + ' unmounted');

    this.props.model.off(null, null, this);
  },
  onFocus () {
    if (this.refs.discussion) {
      this.refs.discussion.onFocus();
    }
  },
  render () {
    let Comp = (this.state.blocked)
      ? require('./DiscussionBlocked')
      : require('./DiscussionUnblocked');

    return (
      <View style={styles.main}>
        <Comp ref='discussion' navigator={this.props.navigator} model={this.props.model} wasBlocked={this.state.wasBlocked}/>
      </View>
    );
  },
  onBlockedChange: function () {
    this.setState({
      blocked: (this.props.model.get('type') === 'room' && this.props.model.get('blocked') === true),
      // wasBlocked is there to check if discussion change from block to unblock
      wasBlocked: (this.props.model.get('type') === 'room' && this.props.model.get('blocked') !== true)
    });
  }
});

var styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column'
  }
});

module.exports = Discussion;
