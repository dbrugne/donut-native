var _ = require('underscore');
var React = require('react-native');
var ListItem = require('../elements/ListItem');
var s = require('../styles/style');
var config = require('../libs/config')();
var json = require('../../package.json');

var {
  Component,
  Text,
  View
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'version': 'Version __version__'
});

class AboutView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let version = json.version;
    return (
      <View style={{ flexDirection: 'column', alignItems: 'stretch', flex: 1, backgroundColor: '#f0f0f0' }}>
        <View style={s.listGroup}>
          <ListItem text={i18next.t('local:version', {version: version})}
                    first={true}
                    type='text'
            />

          <Text>{JSON.stringify(config)}</Text>
        </View>
      </View>
    )
  }
}

module.exports = AboutView;
