const low = require('lowdb')
const path = require('path');
const { app } = require('electron');
const FileAsync = require('lowdb/adapters/FileAsync')
const adapters = {
  uploads: new FileAsync(path.join(app.getAppPath(), 'app/runtime/database/uploads.json')),
  setting: new FileAsync(path.join(app.getAppPath(), 'app/runtime/database/setting.json')),
  session: new FileAsync(path.join(app.getAppPath(), 'app/runtime/database/session.json'))
};

class DataSet {
  constructor(set, schema) {
    low(adapters[set]).then((db) => {
      this.db = db;
      this.db.defaults(schema).write();
    });
  }

  getState() {
    return this.db.getState();
  }

  setState(state) {
    return this.db.setState(state).write();
  }

  get(selector, options) {
    let data = [];
    if (options) {
      data = this.db
      .get(selector)
      .find(options)
      .value();
    } else {
      data = this.db
        .get(selector)
        .value();
    }
    return data;
  }

  set(selector, newData) {
    return this.db
      .set(selector, newData)
      .write();
  }

  assign(selector, options, newData) {
    return this.db.get(selector)
    .find(options)
    .assign(newData)
    .write();
  }

  push(selector, data) {
    return this.db.get(selector)
    .push(data)
    .write();
  }

  // 更新一个用户数据，如果不存在则插入
  update(selector, options = {}, data) {
    if (this.get(selector, options)) {
      return this.assign(selector, options, data);
    } else {
      return this.push(selector, data);
    }
  }

  // 移除指定的数据项
  remove(selector, options) {
    return this.db.get(selector)
      .remove(options)
      .write();
  }

  // 设置条目
  setNumber(selector, fn) {
    return this.db.update(selector, fn)
    .write();
  }
}

module.exports = DataSet;