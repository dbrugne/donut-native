var React = require('react-native');
var {
  ListView
} = React;
var _ = require('underscore');

module.exports = function () {
  var dds = {
    blob: [],
    getBottomItem () {
      if (!this.blob.length) {
        return;
      }

      return this.blob[this.blob.length - 1];
    },
    append (items) {
      if (!items || (_.isArray(items) && items.length === 0)) {
        return this.dataSource.cloneWithRows(this.blob);
      }

      if (!_.isArray(items)) {
        items = [items];
      }

      this.blob = items.concat(this.blob);

      return this.dataSource.cloneWithRows(this.blob);
    },
    prepend (items) {
      if (!items || (_.isArray(items) && items.length === 0)) {
        return this.dataSource.cloneWithRows(this.blob);
      }

      if (!_.isArray(items)) {
        items = [items];
      }

      this.blob = this.blob.concat(items);

      return this.dataSource.cloneWithRows(this.blob);
    }
  };

  var dataSource = new ListView.DataSource({
    rowHasChanged: function (row1, row2) {
      return (row1 !== row2);
    }
  });
  dds.dataSource = dataSource.cloneWithRows([]);

  return dds;
};