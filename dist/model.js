var _ = require('lodash'),
    Datastore = require('nedb');

var Model = function (modelType, dbUrl) {
  this.modelType = modelType || 'unknown';
  this.init(dbUrl);
  //console.log('new model', this.modelType, this.dbUrl);
};

Model.prototype._setObjectType = function (object) {
  if (object) {
    if (Array.isArray(object)) {
      var type = this.modelType;
      object = object.map(function (obj) {
        if (obj) { obj._type = type; }
        return obj;
      });
    } else {
      object._type = this.modelType;
    }
  }
  return object;
};

Model.prototype.init = function (dbUrl) {
  if (dbUrl) {
    this.dbUrl = dbUrl;
    this.db = new Datastore({ filename: dbUrl, autoload: true });
  }
};

Model.prototype.add = function (object, callback) {
  //console.log(this.modelType, 'add', object, this.db != undefined);
  if (object) {
    if (this.db) {
      object = this._setObjectType(object);
      this.db.insert(object, function (err, object) {
        if (callback) {
          callback(err, object);
        } else if (err) { throw err; }
      });
    } else {
      if (callback) { callback('No Datastore configured!'); }
      else { throw 'No Datastore configured!'; }
    }
  }
};

Model.prototype.update = function (object, callback) {
  //console.log(this.modelType, 'update', object, this.db != undefined);
  if (object) {
    if (this.db) {
      object = this._setObjectType(object);
      this.db.update({ _id: object._id }, object, {}, function (err, numUpdated, object) {
        if (callback) {
          callback(err, object, numUpdated);
        } else if (err) { throw err; }
      });
    } else {
      if (callback) { callback('No Datastore configured!'); }
      else { throw 'No Datastore configured!'; }
    }
  }
};

Model.prototype.list = function (callback) {
  this.get({}, callback);
};

Model.prototype.get = function (params, callback) {
  //console.log(this.modelType, 'get', params, this.db != undefined);
  if (this.db) {
    params = _.extend({ _type: this.modelType }, params );
    this.db.find(params, callback);
  } else {
    if (callback) { callback('No Datastore configured!'); }
    else { throw 'No Datastore configured!'; }
  }
};

Model.prototype.remove = function (object, callback) {
  //console.log(this.modelType, 'remove', object, this.db != undefined);
  if (object) {
    if (this.db) {
      this.db.remove(object, {}, callback);
    } else {
      if (callback) { callback('No Datastore configured!'); }
      else { throw 'No Datastore configured!'; }
    }
  }
};

module.exports = Model;
