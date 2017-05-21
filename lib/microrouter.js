'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('url'),
    parse = _require.parse;

var UrlPattern = require('url-pattern');

var getParamsAndQuery = function getParamsAndQuery(pattern, url) {
  var _parse = parse(url, true),
      query = _parse.query,
      pathname = _parse.pathname;

  var route = new UrlPattern(pattern);
  var params = route.match(pathname);

  return { query: query, params: params };
};

var METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

var methodFn = function methodFn(method) {
  return function (path, handler) {
    if (!path) throw new Error('You need to set a valid path');
    if (!handler) throw new Error('You need to set a valid handler');

    return function (req, res) {
      var _getParamsAndQuery = getParamsAndQuery(path, req.url),
          params = _getParamsAndQuery.params,
          query = _getParamsAndQuery.query;

      if (params && req.method === method) {
        return handler((0, _assign2.default)(req, { params: params, query: query }), res);
      }
    };
  };
};

exports.router = function () {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res) {
      var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fn, result;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 3;
              _iterator = (0, _getIterator3.default)(funcs);

            case 5:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 15;
                break;
              }

              fn = _step.value;
              _context.next = 9;
              return fn(req, res);

            case 9:
              result = _context.sent;

              if (!(result || res.headersSent)) {
                _context.next = 12;
                break;
              }

              return _context.abrupt('return', result);

            case 12:
              _iteratorNormalCompletion = true;
              _context.next = 5;
              break;

            case 15:
              _context.next = 21;
              break;

            case 17:
              _context.prev = 17;
              _context.t0 = _context['catch'](3);
              _didIteratorError = true;
              _iteratorError = _context.t0;

            case 21:
              _context.prev = 21;
              _context.prev = 22;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 24:
              _context.prev = 24;

              if (!_didIteratorError) {
                _context.next = 27;
                break;
              }

              throw _iteratorError;

            case 27:
              return _context.finish(24);

            case 28:
              return _context.finish(21);

            case 29:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[3, 17, 21, 29], [22,, 24, 28]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

METHODS.forEach(function (method) {
  exports[method === 'DELETE' ? 'del' : method.toLowerCase()] = methodFn(method);
});