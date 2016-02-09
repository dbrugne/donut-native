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
      <View style={{flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f0f0f0', flex: 1}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5}}>
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