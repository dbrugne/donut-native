var _ = require('underscore');
var React = require('react-native');
var ListItem = require('../elements/ListItem');
var s = require('../styles/style');
var config = require('../libs/config')();
var storage = require('../libs/storage');

var debug = require('../libs/debug')('storage');

var {
  Component,
  View,
  Text,
  ScrollView,
  ListView
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'version': 'Version __version__'
});

class AboutView extends Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      ds: ds.cloneWithRows([]),
    }
  }

  componentDidMount () {
    this.fetchData();
  }

  render() {
    return (
      <ScrollView>
        <View style={{ flexDirection: 'column', alignItems: 'stretch', flex: 1, backgroundColor: '#f0f0f0' }}>
          <View style={s.listGroup}>
            <ListItem text={i18next.t('local:version', {version: config.version})}
                      first={true}
                      type='text'
            />
            <ListItem text='checkPermissions' type='button'
                      onPress={() => {
                      require('../pushNotification/index').checkPermissions();
                    }}
            />
            <ListItem text='requestPermissions' type='button'
                      onPress={() => {
                      require('../pushNotification/index').requestPermissions();
                    }}
            />
            <ListItem text='abandonPermissions' type='button'
                      onPress={() => {
                      require('../pushNotification/index').abandonPermissions();
                    }}
            />
            <ListItem text='registerInstallation' type='button'
                      onPress={() => {
                        var debug2 = require('../libs/debug')('pushNotification');
                        storage.getKey('deviceToken', (err, deviceToken) => {
                          if (err) {
                            return debug2.warn(deviceToken);
                          }
                          if (!deviceToken) {
                            return debug2.warn('no device token for this device');
                          }
                          require('../pushNotification/utils').registerInstallation(deviceToken);
                        });

                      }}
            />
            <ListView
              style={{margin: 10, backgroundColor: '#FFF'}}
              dataSource={this.state.ds}
              scrollEnabled={false}
              renderRow={(r) => (
                  <View style={{padding: 5}}>
                    <Text style={{fontWeight: 'bold'}}>{r.key}</Text>
                    <Text>{r.value}</Text>
                  </View>
                )}
            />
          </View>
        </View>
      </ScrollView>
    )
  }

  fetchData () {
    storage.getAll((err, _storage) => {
      if (err) {
        return debug.warn(err);
      }
      var items = [];
      var parseNode = (v, k) => {
        if (_.isObject(v)) {
          _.each(v, (_v, _k) => parseNode(_v, k+'.'+_k));
        } else {
          items.push({key: k, value: v});
        }
      };

      items.push({key: 'CONFIG'});
      _.each(config, parseNode);
      items.push({key: 'STORAGE'});
      _.each(_storage, parseNode);

      this.setState({ds: this.state.ds.cloneWithRows(items)});
    });
  }
}

module.exports = AboutView;
