var React = require('react-native');
var {
  ListView
} = React;
var _ = require('underscore');
var date = require('../libs/date');

module.exports = function () {
  var nds = {
    blob: [],
    getBottomItemId () {
      var bottom = this.getBottomItem();
      if (!bottom || !bottom.data) {
        return;
      }
      return bottom.id;
    },
    getBottomItem () {
      if (!this.blob.length) {
        return;
      }

      return this.blob[0];
    },
    //getTopItemId () {
    //  var top = this.getTopItem();
    //  if (!top || !top.data) {
    //    return;
    //  }
    //  return top.id;
    //},
    //getTopItem () {
    //  if (!this.blob.length) {
    //    return;
    //  }
    //
    //  return this.blob[this.blob.length-1];
    //},
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
    updateNotification (id, attributes) {
      _.find(this.blob, (e, idx) => {
        if (e.data.id !== id) {
          return false;
        }
        _.extend(e.data, attributes);
        this.blob[idx] = e;

        return true;
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