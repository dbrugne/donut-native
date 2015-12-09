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
      // items comes in ante-chronological order
      items.reverse(); // @important, before date.isSameDay test

      // remove top date block if top event is older than today
      if (!date.isSameDay(this.blob[this.blob.length - 1], items[items.length - 1])) {
        this.blob.pop();
      }

      // remove user block if top event is from the same user as newer
      if (this.blob.length) {
        var _top = this.blob[this.blob.length - 1]; // date block was removed above
        var _newest = items[items.length - 1];
        if (_top.type === 'user' && _top.data.user_id === _newest.data.user_id) {
          this.blob.pop();
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
    append (item) {
      // add new event at the beginning of this.blob
      var previous = (this.blob.length)
        ? this.blob[0]
        : null;
      var list = this.decorate(item, previous);
      this.blob = list.concat(this.blob);
      return this.dataSource.cloneWithRows(this.blob);
    },
    decorate (item, previous) {
      var list = [item];

      var isDifferentDay = (!previous || !date.isSameDay(previous.data.time, item.data.time));

      // user-block
      if (isDifferentDay ||
        (messagesTypes.indexOf(item.type) !== -1 &&
        (!previous || previous.data.user_id !== item.data.user_id ||
        previous.type !== item.type))) {
        list = list.concat([{type: 'user', data: {
          id: 'user' + item.data.id,
          user_id: item.data.user_id,
          username: item.data.username,
          avatar: item.data.avatar,
          time: item.data.time
        }}]);
      }

      // date
      if (isDifferentDay) {
        list = list.concat([{type: 'date', data: {
          id: 'date' + item.data.id,
          time: item.data.time,
          text: date.longDate(item.data.time)
        }}]);
      }

      return list;
    }
  };

  var dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1.data.id !== r2.data.id
  });
  eds.dataSource = dataSource.cloneWithRows([]);

  return eds;
};