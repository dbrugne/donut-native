var React = require('react-native');
var {
  ListView
} = React;
var _ = require('underscore');
var date = require('../libs/date');

var messagesTypes = ['room:message', 'user:message'];

module.exports = function () {
  var eds = {
    blob: [],
    getBottomItemId () {
      var bottom = this.getBottomItem();
      if (!bottom || !bottom.data) {
        return;
      }
      return bottom.data.id;
    },
    getBottomItem () {
      if (!this.blob.length) {
        return;
      }

      var bottom;
      for (let idx = 0; idx <= this.blob.length; idx++) {
        bottom = this.blob[idx];
        if (bottom.type === 'date' || bottom.type === 'user' || !bottom.data) {
          continue;
        }
        break;
      }
      return bottom;
    },
    getTopItemId () {
      var top = this.getTopItem();
      if (!top || !top.data) {
        return;
      }
      return top.data.id;
    },
    getTopItem () {
      if (!this.blob.length) {
        return;
      }

      var top;
      for (let idx = this.blob.length - 1; idx >= 0 ; idx--) {
        top = this.blob[idx];
        if (top.type === 'date' || top.type === 'user' || !top.data) {
          continue;
        }
        break;
      }
      return top;
    },
    prepend (items) {
      // items comes in chronological order, blob is sorted ante-chronologically

      // remove top date block if top event is older than today
      if (!date.isSameDay(this.blob[this.blob.length - 1], items[items.length - 1])) {
        this.blob.pop();
      }

      // remove user block if top event is from the same user as newer
      if (this.blob.length) {
        var _top = this.blob[this.blob.length - 1]; // date block was removed above
        var _newest = items[items.length - 1];
        if (_top.data.first && _top.data.user_id === _newest.data.user_id) {
          delete _top.data.first;
          delete _top.data.userBlock;
          this.blob[this.blob.length - 1] = _top;
        }
      }

      // add new events at the end of this.blob
      var list = [];
      _.each(items, (i, idx) => {
        let previous = (idx > 0)
          ? items[idx-1]
          : null;
        list = this.decorate(i, previous).concat(list);
      });

      this.blob = this.blob.concat(list);
      return this.dataSource.cloneWithRows(this.blob);
    },
    append (items) {
      // items comes in chronological order, blob is sorted ante-chronologically

      // add new events at the beginning of this.blob
      var list = [];
      _.each(items, (i, idx) => {
        let previous = (idx <= 0)
          ? this.blob[0]
          : items[idx-1];
        list = this.decorate(i, previous).concat(list);
      });

      this.blob = list.concat(this.blob);
      return this.dataSource.cloneWithRows(this.blob);
    },
    decorate (item, previous) {
      var isDifferentDay = (!previous || !date.isSameDay(previous.data.time, item.data.time));

      // user-block
      if ((isDifferentDay && messagesTypes.indexOf(item.type) !== -1) ||
        (messagesTypes.indexOf(item.type) !== -1 && (!previous || previous.data.user_id !== item.data.user_id || previous.type !== item.type))) {
        item.data.first = true;
        item.data.userBlock = {
          id: item.data.id,
          user_id: item.data.user_id,
          username: item.data.username,
          realname: item.data.realname,
          avatarRaw: item.data.avatar,
          time: item.data.time
        };
      }

      var list = [item];

      // date
      if (isDifferentDay) {
        list = list.concat([{type: 'date', data: {
          id: 'date' + item.data.id,
          time: item.data.time,
          text: date.longDate(item.data.time)
        }}]);
      }

      return list;
    },
    updateEvent (id, attributes) {
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
    rowHasChanged: (r1, r2) => r1.data.id !== r2.data.id
  });
  eds.dataSource = dataSource.cloneWithRows([]);

  return eds;
};