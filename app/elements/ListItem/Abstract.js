'use strict';

var React = require('react-native');
var Platform = require('Platform');
var s = require('../../styles/elements/listItem');

var {
  Component,
  View,
  Text
  } = React;

var {
  Icon
  } = require('react-native-icons');

class ListItemAbstract extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        {this._renderTitle()}
        {this._renderContent()}
        {this._renderHelp()}
      </View>
    );
  }

  _renderContent () {
    return (
      <View style={[s.listGroupItem, this.props.first && s.listGroupItemFirst, this.props.last && s.listGroupItemLast]}>
        {this._renderLeftIcon()}
        {this._renderElement()}
        {this._renderRightIcon()}
      </View>
    );
  }

  /**
   *
   * @returns {*}
   * @private
   */
  _renderLeftIcon () {
    if (!this.props.icon) {
      return null;
    }

    let iconColor = this.props.iconColor || '#666';
    return (
      <Icon
        name={this.props.icon}
        size={14}
        color={iconColor}
        style={s.listGroupItemIconLeft}
        />
    );
  }

  /**
   *
   * @returns {XML}
   * @private
   */
  _renderElement () {
    return (
      <Text/>
    );
  }

  /**
   * Display an arrow on right of the ListGroupItem ?
   * @returns {*}
   * @private
   */
  _renderRightIcon () {
    if (!this.props.action) {
      return null;
    }

    return (
      <Icon
        name='fontawesome|chevron-right'
        size={14}
        color='#DDD'
        style={s.listGroupItemIconRight}
        />
    );
  }

  _renderTitle () {
    if (!this.props.title) {
      return null;
    }
    return (
      <Text style={s.listGroupTitle}>{this.props.title}</Text>
    );
  }

  _renderHelp () {
    if (!this.props.help) {
      return null;
    }

    return (
      <Text style={s.listGroupHelp}>{this.props.help}</Text>
    );
  }
}

module.exports = ListItemAbstract;