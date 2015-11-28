var React = require('react-native');
var _ = require('underscore');
var colors = require('../libs/colors').list;
var Button = require('react-native-button');
var navigation = require('../libs/navigation');
var client = require('../libs/client');

var {
  NativeModules,
  Component,
  Text,
  View,
  ScrollView,
  StyleSheet
  } = React;

class ColorPickerView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      colors: colors
    };
  }

  render () {
    return (
      <ScrollView>
        <Text style={styles.title}>Select a color</Text>
        <View style={styles.colorPicker}>
          {this.state.colors.map((c) =>
            <Button key={c.name} onPress={this._colorPressed.bind(this, c)}>
              <View style={[styles.colorSquare, {backgroundColor: c.hex}]}></View>
            </Button>
          )}
        </View>
      </ScrollView>
    );
  }

  _colorPressed (color) {
    client.userUpdate({color: color.hex}, _.bind(function (response) {
      if (response.err) {
        this._appendError(response.err);
      } else {
        this.props.navigator.pop();
      }
    }, this));
  }
}

var styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10
  },
  colorPicker: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'center'
  },
  colorSquare: {
    width: 35,
    height: 35,
    margin: 3,
    borderRadius: 2
  }
});

module.exports = ColorPickerView;