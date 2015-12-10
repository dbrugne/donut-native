var _ = require('underscore');
var React = require('react-native');
var colors = require('../libs/colors').list;
var Button = require('react-native-button');
var navigation = require('../libs/navigation');
var client = require('../libs/client');
var alert = require('../libs/alert');

var {
  NativeModules,
  Component,
  Text,
  View,
  ScrollView,
  StyleSheet
  } = React;

var i18next = require('i18next-client');
var locales = require('../locales/en/translation.json'); // global locales
var _localRes = { // current page locales
  'select': 'Select a color'
};

i18next.init({
  fallbackLng: 'en',
  lng: 'en',
  debug: true,
  resStore: {
    en: {translation: _.extend(locales, _localRes)}
  }
});

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
        <Text style={styles.title}>{i18next.t('select')}</Text>
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
    client.userUpdate({color: color.hex}, (response) => {
      if (response.err) {
        return alert.show(response.err);
      }

      this.props.navigator.pop();
    });
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
