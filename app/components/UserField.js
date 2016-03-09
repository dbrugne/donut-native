'use strict';

var React = require('react-native');
var s = require('../styles/style');

var {
  Component,
  View
} = React;

class UserField extends Component {
  constructor (props) {
    super(props);

    this.state = {
      value: props.data.value
    };
  }
  onFocus () {
    if (this.refs.input) {
      setTimeout(() => this.refs.input.focus(), 1000);
    }
  }
  render () {
    var field = this.renderField();
    return (
      <View style={{flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f0f0f0', alignSelf: 'stretch', flex: 1}}>
        <View style={{alignSelf: 'stretch'}}>
          {field}
        </View>
        <View style={s.filler}></View>
      </View>
    );
  }
  renderField () {
    return null;
  }
}

module.exports = UserField;