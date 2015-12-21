'use strict';

var React = require('react-native');
var s = require('../../styles/elements/listItem');

var {
  Component,
  View,
  TouchableHighlight,
  Text
  } = React;

class ListItemColor extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <View>
        {this._renderTitle()}
        <TouchableHighlight onPress={() => this.props.onPress()}
                            underlayColor= '#DDD'
          >
          <View style={[s.listGroupItem, this.props.first && s.listGroupItemFirst, this.props.last && s.listGroupItemLast]}>
            <View style={{alignSelf: 'center', flex:1, flexDirection: 'row', alignItems:'center'}}>
              <Text style={s.listGroupItemText}>{this.props.text}</Text>
            </View>
            <View style={{alignSelf: 'center', flexDirection: 'row', alignItems:'center'}}>
              <View style={[s.color, {backgroundColor: this.props.color}]}/>
              {this.props.rightIcon}
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  _renderTitle() {
    if (!this.props.title) {
      return null;
    }
    return (
      <Text style={s.listGroupTitle}>{this.props.title}</Text>
    );
  }
}
module.exports = ListItemColor;
