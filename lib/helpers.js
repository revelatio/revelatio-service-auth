'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateKeypair = exports.connectMongoDB = exports.cleanUser = undefined;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _mongodb = require('mongodb');

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _sshKeygen = require('ssh-keygen');

var _sshKeygen2 = _interopRequireDefault(_sshKeygen);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cleanUser = exports.cleanUser = _ramda2.default.pick(['login', 'avatar_url', 'name', 'company', 'location', 'email']);
var connectMongoDB = exports.connectMongoDB = function connectMongoDB() {
  return _mongodb.MongoClient.connect(process.env.MONGODB);
};

var generateKeypair = exports.generateKeypair = function generateKeypair() {
  return new _bluebird2.default(function (resolve, reject) {
    var location = __dirname + '/sshworkspace/' + (0, _v2.default)() + '_rsa';
    console.log(location);

    (0, _sshKeygen2.default)({
      location: location,
      comment: 'Revelat.io',
      password: '',
      read: true
    }, function (err, out) {
      if (err) {
        return reject(err);
      }

      console.log(out);
      return resolve({
        location: location,
        privateKey: out.key,
        publicKey: out.pubKey
      });
    });
  }).then(function (_ref) {
    var location = _ref.location,
        privateKey = _ref.privateKey,
        publicKey = _ref.publicKey;
    return (0, _del2.default)(location + '*').then(function () {
      return { privateKey: privateKey, publicKey: publicKey };
    });
  });
};