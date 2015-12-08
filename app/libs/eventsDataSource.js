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
      if (!this.blob.length) {
        return;
      }

      var lastId;
      for (let idx = 0; idx < this.blob.length; idx++) {
        var item = this.blob[idx];
        if (item.type === 'date' || item.type === 'user' || !item.data) {
          continue;
        }
        lastId = item.data.id;
      }
      return lastId;
    },
    prepend (items) {
      // @todo avoid user-block is new event is same user as last event

      // items comes in ante-chronological order
      items.reverse(); // @important, before date.isSameDay test

      // systematically remove top date block if top event is older than today
      if (!date.isSameDay(this.blob[this.blob.length - 1], items[items.length - 1])) {
        this.blob.pop();
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

      // user-block
      if (messagesTypes.indexOf(item.type) !== -1 &&
        (!previous || previous.data.user_id !== item.data.user_id ||
        previous.type !== item.type)) {
        list = list.concat([{type: 'user', data: {
          id: 'user' + item.data.id,
          user_id: item.data.user_id,
          username: item.data.username,
          avatar: item.data.avatar,
          time: item.data.time
        }}]);
      }

      // date
      if (!previous || !date.isSameDay(previous.data.time, item.data.time)) {
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