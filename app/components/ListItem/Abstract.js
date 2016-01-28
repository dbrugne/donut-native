'use strict';

var React = require('react-native');
var s = require('../../styles/elements/listItem');

var {
  Component,
  View,
  Text
} = React;
var Icon = require('react-native-vector-icons/FontAwesome');

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
    if (!this.props.action && !this.props.iconRight) {
      return null;
    }

    return (
      <Icon
        name={this.props.iconRight ? this.props.iconRight : 'fontawesome|chevron-right'}
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

ListItemAbstract.propTypes = {
  action: React.PropTypes.bool, // boolean to display right arrow
  first: React.PropTypes.bool, // boolean if the current element is the first on list
  last: React.PropTypes.bool, // boolean if the current element is the last on list
  icon: React.PropTypes.string, // fontawesome code name of the icon to display on left
  iconColor: React.PropTypes.string, // color of the icon to display on left, default is #666
  iconRight: React.PropTypes.string, // fontawesome code name of the icon to display on right
  title: React.PropTypes.string, // title to display above the ListItem
  help: React.PropTypes.string // help message to display bellow the ListItem
};
