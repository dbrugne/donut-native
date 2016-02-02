var _ = require('underscore');
var React = require('react-native');
var ListItem = require('../components/ListItem');
var s = require('../styles/style');
var config = require('../libs/config')();
var storage = require('../libs/storage');
var app = require('../libs/app');

var debug = require('../libs/debug')('storage');

var {
  Component,
  View,
  Text,
  ScrollView,
  ListView, TouchableHighlight
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'about', {
  'version': 'Version __version__',
  'disconnect': 'Disconnect',
  'connect': 'Connect',
  'disconnect-reconnect': 'Disconnect 15 sec'
});

class AboutView extends Component {
  constructor (props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      ds: ds.cloneWithRows([]),
      config: false
    };
  }

  componentDidMount () {
    this.fetchData();
  }

  render () {
    return (
      <ScrollView>
        <View style={{ flexDirection: 'column', alignItems: 'stretch', flex: 1 }}>
          <View style={s.listGroup}>
            <TouchableHighlight
              onLongPress={this.toggleConfig.bind(this)}
              underlayColor= 'transparent'
              >
              <View style={[{paddingVertical: 15}, s.listGroupItem, this.props.first && s.listGroupItemFirst, this.props.last && s.listGroupItemLast]}>
                <Text style={[{fontSize: 16}, s.listGroupItemText, this.props.warning && s.listGroupItemTextWarning]}>{i18next.t('about:version', {version: config.DONUT_VERSION + ' (' + config.DONUT_BUILD + ')'})}</Text>
              </View>
            </TouchableHighlight>
            {this._renderConfig()}
          </View>
        </View>
      </ScrollView>
    );
  }

  _renderConfig () {
    if (!this.state.config) {
      return null;
    }

    return (
      <View style={{backgroundColor: '#f0f0f0'}}>
        <ListItem
          text={i18next.t('about:connect')}
          type='button'
          onPress={() => { app.client.connect(); }}
        />
        <ListItem
          text={i18next.t('about:disconnect')}
          type='button'
          onPress={() => { app.client.disconnect(); }}
        />
        <ListItem
          text={i18next.t('about:disconnect-reconnect')}
          type='button'
          onPress={() => { app.client.disconnect(); setTimeout(() => app.client.connect(), 15000); }}
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
    );
  }

  toggleConfig () {
    this.setState({
      config: !this.state.config
    });
  }

  fetchData () {
    storage.getAll((err, _storage) => {
      if (err) {
        return debug.warn(err);
      }
      var items = [];
      var parseNode = (v, k) => {
        if (_.isObject(v)) {
          _.each(v, (_v, _k) => parseNode(_v, k + '.' + _k));
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
