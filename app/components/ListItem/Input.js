'use strict';

var React = require('react-native');
var s = require('../../styles/elements/listItem');
var ListItemAbstract = require('./Abstract');

var {
  TextInput,
  View
} = React;

class ListItemInput extends ListItemAbstract {
  _renderElement () {
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{width: 1, height: 40, backgroundColor: '#FC2063'}}/>
        <TextInput
          {...this.props}
          style={[{ flex: 1, fontFamily: 'Open Sans', fontSize: 14, fontWeight: '400', color: '#333', height: 40, paddingVertical: 8, paddingHorizontal: 10 }, this.props.multiline && {height: 80}]}
        />
      </View>
    );
  }
}

module.exports = ListItemInput;
