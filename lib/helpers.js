'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectMongoDB = exports.cleanUser = undefined;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _mongodb = require('mongodb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cleanUser = exports.cleanUser = _ramda2.default.pick(['login', 'avatar_url', 'name', 'company', 'location', 'email']);
var connectMongoDB = exports.connectMongoDB = function connectMongoDB() {
  return _mongodb.MongoClient.connect(process.env.MONGODB);
};