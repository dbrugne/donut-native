var React = require('react-native');
var {
  ListView
} = React;
var _ = require('underscore');

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
      this.blob = [];

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
    },
    tagAsRead (ids) {
      // tag all as read
      if (ids.length === 0) {
        _.each(this.blob, (e, idx) => {
          _.extend(e, {viewed: true});
          this.blob[idx] = e;
        });
      } else {
        _.each(ids, (id) => {
          _.each(this.blob, (e, idx) => {
            if (id === e.id) {
              _.extend(e, {viewed: true});
              this.blob[idx] = e;
            }
          });
        });
      }

      return this.dataSource.cloneWithRows(this.blob);
    },
    update (id, attributes) {
      _.find(this.blob, (e, idx) => {
        if (e.id === id) {
          _.extend(e, attributes);
          this.blob[idx] = e;
          return true;
        }
      });

      return this.dataSource.cloneWithRows(this.blob);
    },
    clearSelection () {
      _.each(this.blob, (e, idx) => {
        if (e.selected === true) {
          _.extend(e, {selected: false});
          this.blob[idx] = e;
        }
      });

      return this.dataSource.cloneWithRows(this.blob);
    },
    markAsDone (ids) {
      this.blob = _.filter(this.blob, (e) => {
        return !_.contains(ids, e.id);
      });

      return this.dataSource.cloneWithRows(this.blob);
    },
    findWhere (key, value) {
      let find = [];
      _.each(this.blob, (e) => {
        if (e[key] === value) {
          find.push(e);
        }
      });
      return find;
    },
    findIdsFromIndex (idxs) {
      var ids = [];
      _.each(idxs, (idx) => {
        let e = this.blob[idx];
        ids.push(e.id);
      });
      return ids;
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