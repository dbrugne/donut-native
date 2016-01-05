var React = require('react-native');
var {
  ListView
  } = React;
var _ = require('underscore');
var date = require('../libs/date');

module.exports = function () {
  var nds = {
    blob: [],
    getBottomItemTime () {
      var bottom = this.getBottomItem();
      if (!bottom || !bottom.time) {
        return;
      }
      return bottom.time;
    },
    getBottomItem () {
      if (!this.blob.length) {
        return;
      }

      return this.blob[this.blob.length - 1];
    },
    append (items) {
      if (!items || (_.isArray(items) && items.length === 0)){
        return this.dataSource.cloneWithRows(this.blob);
      }

      if (!_.isArray(items)){
        items = [items];
      }

      this.blob = items.concat(this.blob);

      return this.dataSource.cloneWithRows(this.blob);
    },
    prepend (items) {
      if (!items || (_.isArray(items) && items.length === 0)){
        return this.dataSource.cloneWithRows(this.blob);
      }

      if (!_.isArray(items)){
        items = [items];
      }

      this.blob = this.blob.concat(items);

      return this.dataSource.cloneWithRows(this.blob);
    },
    tagAsRead () {
      _.each(this.blob, (e, idx) => {
        _.extend(e, {viewed: true});
        this.blob[idx] = e;
      });

      return this.dataSource.cloneWithRows(this.blob);
    }
  };

  var dataSource = new ListView.DataSource({
    rowHasChanged: function (row1, row2) {
      return (row1 !== row2);
    }
  });
  nds.dataSource = dataSource.cloneWithRows([]);

  return nds;
};