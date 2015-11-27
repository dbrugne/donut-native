'use strict';

var React = require('react-native');
var Platform = require('Platform');

var {
  Component,
  View,
  SwitchAndroid,
  SwitchIOS,
  Text,
  StyleSheet
} = React;

class ListGroupItemSwitch extends Component {
  /**
   * @param props = {
   *  onSwitch: callback action on switch component if any
   *  switchValue: boolean, value of switch button if any
   *  first: boolean if the current element is the first on list
   *  last: boolean if the current element is the last on list
   *  warning: boolean if the current item has a warning state
   *  text: string to display on element
   * }
   */
  constructor (props) {
    super(props);
  }

  render () {
    var swicthComponent = null;
    if (this.props.onSwitch) {
      var SwitchComponent;
      if (Platform.OS === 'android') {
        SwitchComponent = SwitchAndroid;
      } else {
        SwitchComponent = SwitchIOS;
      }

      swicthComponent = (
        <SwitchComponent
          style={styles.ListGroupItemToggleRight}
          onValueChange={() => this.props.onSwitch()}
          value={this.props.switchValue}
          />
      );
    }

    return (
      <View style={[styles.ListGroupItem, this.props.first && styles.ListGroupItemFirst, this.props.last && styles.ListGroupItemLast]}>
        <Text style={[styles.ListGroupItemText, this.props.warning && styles.ListGroupItemTextWarning]}>{this.props.text}</Text>
        {swicthComponent}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  ListGroupItem: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#DDD',
    borderBottomWidth:1,
    borderStyle: 'solid'
  },
  ListGroupItemFirst: {
    borderColor: '#DDD',
    borderTopWidth:1,
    borderStyle: 'solid'
  },
  ListGroupItemLast: {

  },
  ListGroupItemToggleRight: {
    alignSelf: 'flex-end'
  },
  ListGroupItemText: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 14,
    flex: 1
  },
  ListGroupItemTextWarning: {
    color: '#ff3838'
  }
});

module.exports = ListGroupItemSwitch;