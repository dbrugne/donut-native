'use strict';

var React = require('react-native');
var Platform = require('Platform');
var s = require('../../styles/style');
var Button = require('../../elements/Button');

var {
  Component,
  View,
  TextInput,
  Text,
  StyleSheet
} = React;

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'save': 'Save'
});

class ListGroupItemInputButton extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <View style={styles.listGroupItem}>
        <TextInput
          autoFocus={true}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
          style={[s.input, styles.input]}
          value={this.props.value} />

        <Button onPress={this.props.onPress}
                style={styles.button}
                type='green'
                label={i18next.t('local:save')} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  listGroupItem: {
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
  input: {
    flex:1,
    height: 30,
    borderRadius: 0,
    borderWidth: 0,
    padding: 0,
    marginLeft: 0
  },
  button: {
    alignSelf: 'flex-end',
    marginTop: 0,
    marginBottom: 0,
    height: 30
  },
  listGroupItemText: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 14,
    flex: 1
  }
});

module.exports = ListGroupItemInputButton;