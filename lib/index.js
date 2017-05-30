'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _microrouter = require('microrouter');

var _uidPromise = require('uid-promise');

var _uidPromise2 = _interopRequireDefault(_uidPromise);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _github = require('github');

var _github2 = _interopRequireDefault(_github);

var _querystring = require('querystring');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();


var githubUrl = process.env.GH_HOST || 'github.com';

var cleanUser = _ramda2.default.pick(["login", "id", "avatar_url", "name", "company", "location", "email"]);

var github = new _github2.default({
  debug: false,
  protocol: "https",
  host: "api.github.com",
  headers: {
    "user-agent": "Revelat-io-App"
  },
  Promise: _bluebird2.default,
  followRedirects: false,
  timeout: 5000
});

var login = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res) {
    var state;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _uidPromise2.default)(20);

          case 2:
            state = _context.sent;
            return _context.abrupt('return', res.redirect('https://' + githubUrl + '/login/oauth/authorize?client_id=' + process.env.GH_CLIENT_ID + '&state=' + state));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function login(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var callback = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res) {
    var _req$query, code, state, _ref3, status, data, _decode, access_token, user, resultToken, token;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            res.setHeader('Content-Type', 'text/html');
            _req$query = req.query, code = _req$query.code, state = _req$query.state;

            if (!(!code && !state)) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt('return', res.redirect('/'));

          case 4:
            _context2.prev = 4;
            _context2.next = 7;
            return (0, _axios2.default)({
              method: 'POST',
              url: 'https://' + githubUrl + '/login/oauth/access_token',
              responseType: 'json',
              data: {
                client_id: process.env.GH_CLIENT_ID,
                client_secret: process.env.GH_CLIENT_SECRET,
                code: code
              }
            });

          case 7:
            _ref3 = _context2.sent;
            status = _ref3.status;
            data = _ref3.data;

            if (!(status !== 200)) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt('return', res.send('GitHub server error.'));

          case 12:

            // Get logged user information and craft a JWT Cookie
            _decode = (0, _querystring.decode)(data), access_token = _decode.access_token;

            github.authenticate({
              type: "oauth",
              token: access_token
            });
            _context2.next = 16;
            return github.users.get({});

          case 16:
            user = _context2.sent;
            resultToken = cleanUser(user.data);
            token = _jsonwebtoken2.default.sign(resultToken, process.env.JWT_SECRET, {
              expiresIn: '365d'
            });

            // Create the JWT Cookie and redirect to /

            return _context2.abrupt('return', res.cookie('auth_token', token, { expires: new Date(Date.now() + 31536000000), httpOnly: false }).redirect('/'));

          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2['catch'](4);

            console.log(_context2.t0);
            return _context2.abrupt('return', res.redirect('/?err=' + _context2.t0.toString()));

          case 26:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[4, 22]]);
  }));

  return function callback(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var handler = exports.handler = (0, _microrouter.router)((0, _microrouter.get)('/login/callback', callback), (0, _microrouter.get)('/login', login), function (req, res) {
  return res.send('ok');
});