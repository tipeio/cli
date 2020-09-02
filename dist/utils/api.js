"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retrieveAPIKeys = exports.createAPIKey = exports.authenticate = exports.getAuthToken = exports.createEnv = exports.createFirstProject = exports.getProjects = exports.checkAPIKey = exports.openAuthWindow = void 0;

var _pollUntilPromise = _interopRequireDefault(require("poll-until-promise"));

var _got = _interopRequireDefault(require("got"));

var _open = _interopRequireDefault(require("open"));

var _async = require("./async");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const PROD_URL = 'https://api.admin.tipe.io';

const isUnauthorized = error => error.name === 'HTTPError' && error.response.statusCode === 401;

const getURL = host => host ? host : PROD_URL;

function api(_x) {
  return _api.apply(this, arguments);
}

function _api() {
  _api = _asyncToGenerator(function* (options) {
    const config = {
      prefixUrl: getURL(options.host)
    };

    if (options.timeout) {
      config.timeout = options.timeout;
    }

    if (options.apiKey) {
      config.headers = {
        authorization: options.apiKey
      };
    }

    if (options.payload) {
      config.json = options.payload;
    }

    if (options.project && options.method !== 'get') {
      if (config.json) {
        config.json = _objectSpread({}, config.json, {
          project: options.project
        });
      } else {
        config.json = {
          project: options.project
        };
      }
    }

    const method = options.method || 'post';
    const result = yield _got.default[method](options.path, config).json();
    return result.data;
  });
  return _api.apply(this, arguments);
}

const openAuthWindow = config => (0, _open.default)(`${getURL(config.host)}/api/cli/signup?cli_token=${config.token}`);

exports.openAuthWindow = openAuthWindow;

const checkAPIKey =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (options) {
    const _ref2 = yield (0, _async.asyncWrap)(api({
      path: 'api/cli/check',
      host: getURL(options.host),
      apiKey: options.apiKey
    })),
          _ref3 = _slicedToArray(_ref2, 1),
          error = _ref3[0];

    if (error) {
      if (isUnauthorized(error)) return false;
      throw error;
    }

    return true;
  });

  return function checkAPIKey(_x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.checkAPIKey = checkAPIKey;

const getProjects =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(function* (options) {
    const result = yield api({
      path: 'api/projects',
      host: getURL(options.host),
      apiKey: options.apiKey,
      method: 'get'
    });
    return result;
  });

  return function getProjects(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getProjects = getProjects;

const createFirstProject =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(function* (options) {
    const result = yield api({
      path: 'api/cli/init',
      host: getURL(options.host),
      method: 'post',
      payload: {
        name: options.name
      },
      apiKey: options.apiKey
    });
    return result;
  });

  return function createFirstProject(_x4) {
    return _ref5.apply(this, arguments);
  };
}();

exports.createFirstProject = createFirstProject;

const createEnv =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(function* (options) {
    const result = yield api({
      path: 'api/projects/createEnvironment',
      host: getURL(options.host),
      method: 'post',
      apiKey: options.apiKey,
      payload: options.environment
    });
    return result;
  });

  return function createEnv(_x5) {
    return _ref6.apply(this, arguments);
  };
}();

exports.createEnv = createEnv;

const getAuthToken =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(function* (options) {
    const result = yield api({
      path: 'api/cli/token',
      host: getURL(options.host)
    });
    return result.token.value;
  });

  return function getAuthToken(_x6) {
    return _ref7.apply(this, arguments);
  };
}();

exports.getAuthToken = getAuthToken;

const authenticate =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(function* (options) {
    const pollTimeout = 50 * 60 * 100; // poll for at most 5 mins

    const httpTimeout = 3000;
    const poll = new _pollUntilPromise.default({
      stopOnFailure: true,
      interval: 1000,
      timeout: pollTimeout
    });
    return poll.execute(
    /*#__PURE__*/
    _asyncToGenerator(function* () {
      const result = yield api({
        path: 'api/cli/swap',
        host: getURL(options.host),
        payload: {
          token: options.token
        },
        timeout: httpTimeout // http timeout

      });

      if (result && result.key && result.user) {
        return result;
      } else {
        return false;
      }
    }));
  });

  return function authenticate(_x7) {
    return _ref8.apply(this, arguments);
  };
}();

exports.authenticate = authenticate;

const createAPIKey =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(function* (options) {
    const result = yield api({
      path: 'api/cli/key',
      host: getURL(options.host),
      apiKey: options.apiKey,
      method: 'post',
      payload: {
        name: options.name
      }
    });
    return result;
  });

  return function createAPIKey(_x8) {
    return _ref10.apply(this, arguments);
  };
}();

exports.createAPIKey = createAPIKey;

const retrieveAPIKeys =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(function* (options) {
    const result = yield api({
      path: 'api/cli/apikeys',
      host: getURL(options.host),
      apiKey: options.apiKey,
      project: options.project,
      method: 'get'
    });
    return result;
  });

  return function retrieveAPIKeys(_x9) {
    return _ref11.apply(this, arguments);
  };
}();

exports.retrieveAPIKeys = retrieveAPIKeys;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9hcGkudHMiXSwibmFtZXMiOlsiUFJPRF9VUkwiLCJpc1VuYXV0aG9yaXplZCIsImVycm9yIiwibmFtZSIsInJlc3BvbnNlIiwic3RhdHVzQ29kZSIsImdldFVSTCIsImhvc3QiLCJhcGkiLCJvcHRpb25zIiwiY29uZmlnIiwicHJlZml4VXJsIiwidGltZW91dCIsImFwaUtleSIsImhlYWRlcnMiLCJhdXRob3JpemF0aW9uIiwicGF5bG9hZCIsImpzb24iLCJwcm9qZWN0IiwibWV0aG9kIiwicmVzdWx0IiwiZ290IiwicGF0aCIsImRhdGEiLCJvcGVuQXV0aFdpbmRvdyIsInRva2VuIiwiY2hlY2tBUElLZXkiLCJnZXRQcm9qZWN0cyIsImNyZWF0ZUZpcnN0UHJvamVjdCIsImNyZWF0ZUVudiIsImVudmlyb25tZW50IiwiZ2V0QXV0aFRva2VuIiwidmFsdWUiLCJhdXRoZW50aWNhdGUiLCJwb2xsVGltZW91dCIsImh0dHBUaW1lb3V0IiwicG9sbCIsIlBvbGwiLCJzdG9wT25GYWlsdXJlIiwiaW50ZXJ2YWwiLCJleGVjdXRlIiwia2V5IiwidXNlciIsImNyZWF0ZUFQSUtleSIsInJldHJpZXZlQVBJS2V5cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLE1BQU1BLFFBQVEsR0FBRywyQkFBakI7O0FBRUEsTUFBTUMsY0FBYyxHQUFJQyxLQUFELElBQ3JCQSxLQUFLLENBQUNDLElBQU4sS0FBZSxXQUFmLElBQStCRCxLQUFELENBQXFCRSxRQUFyQixDQUE4QkMsVUFBOUIsS0FBNkMsR0FEN0U7O0FBR0EsTUFBTUMsTUFBTSxHQUFJQyxJQUFELElBQTJCQSxJQUFJLEdBQUdBLElBQUgsR0FBVVAsUUFBeEQ7O1NBRWVRLEc7Ozs7OzJCQUFmLFdBQXNCQyxPQUF0QixFQUFzRDtBQUNwRCxVQUFNQyxNQUFXLEdBQUc7QUFBRUMsTUFBQUEsU0FBUyxFQUFF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QUFJLEVBQUUsYUFEZ0Q7QUFFdERmLE1BQUFBLElBQUksRUFBRUQsTUFBTSxDQUFDRyxPQUFPLENBQUNGLElBQVQsQ0FGMEM7QUFHdERNLE1BQUFBLE1BQU0sRUFBRUosT0FBTyxDQUFDSSxNQUhzQztBQUl0RE0sTUFBQUEsTUFBTSxFQUFFLE1BSjhDO0FBS3RESCxNQUFBQSxPQUFPLEVBQUU7QUFBRWIsUUFBQUEsSUFBSSxFQUFFTSxPQUFPLENBQUNOO0FBQWhCO0FBTDZDLEtBQWhDLENBQXhCO0FBUUEsV0FBT2lCLE1BQVA7QUFDRCxHQWR3Qjs7QUFBQSxrQkFBWnVCLFlBQVk7QUFBQTtBQUFBO0FBQUEsR0FBbEI7Ozs7QUFnQkEsTUFBTUMsZUFBZ0M7QUFBQTtBQUFBO0FBQUEsaUNBQUcsV0FBT25DLE9BQVAsRUFBbUQ7QUFDakcsVUFBTVcsTUFBNkIsU0FBU1osR0FBRyxDQUF3QjtBQUNyRWMsTUFBQUEsSUFBSSxFQUFFLGlCQUQrRDtBQUVyRWYsTUFBQUEsSUFBSSxFQUFFRCxNQUFNLENBQUNHLE9BQU8sQ0FBQ0YsSUFBVCxDQUZ5RDtBQUdyRU0sTUFBQUEsTUFBTSxFQUFFSixPQUFPLENBQUNJLE1BSHFEO0FBSXJFSyxNQUFBQSxPQUFPLEVBQUVULE9BQU8sQ0FBQ1MsT0FKb0Q7QUFLckVDLE1BQUFBLE1BQU0sRUFBRTtBQUw2RCxLQUF4QixDQUEvQztBQVFBLFdBQU9DLE1BQVA7QUFDRCxHQVY0Qzs7QUFBQSxrQkFBaEN3QixlQUFnQztBQUFBO0FBQUE7QUFBQSxHQUF0QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQb2xsIGZyb20gJ3BvbGwtdW50aWwtcHJvbWlzZSdcbmltcG9ydCBnb3QsIHsgSFRUUEVycm9yIH0gZnJvbSAnZ290J1xuaW1wb3J0IG9wZW4gZnJvbSAnb3BlbidcbmltcG9ydCB7IENoaWxkUHJvY2VzcyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgeyBhc3luY1dyYXAgfSBmcm9tICcuL2FzeW5jJ1xuaW1wb3J0IHtcbiAgUHJvamVjdCxcbiAgRW52LFxuICBDcmVhdGVFbnYsXG4gIEF1dGhlbnRpY2F0ZSxcbiAgQVBJQ29uZmlnLFxuICBBdXRoUmVzdWx0LFxuICBHZXRBdXRoVG9rZW4sXG4gIENyZWF0ZUZpcnN0UHJvamVjdCxcbiAgR2V0UHJvamVjdHMsXG4gIENoZWNrQVBJS2V5LFxuICBSZXRyaWV2ZUFQSUtleXMsXG4gIEFwaUtleSxcbiAgQVBJRXJyb3IsXG4gIEhUVFBNZXRob2QsXG59IGZyb20gJy4uL3R5cGVzJ1xuXG5jb25zdCBQUk9EX1VSTCA9ICdodHRwczovL2FwaS5hZG1pbi50aXBlLmlvJ1xuXG5jb25zdCBpc1VuYXV0aG9yaXplZCA9IChlcnJvcjogQVBJRXJyb3IpOiBib29sZWFuID0+XG4gIGVycm9yLm5hbWUgPT09ICdIVFRQRXJyb3InICYmIChlcnJvciBhcyBIVFRQRXJyb3IpLnJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDQwMVxuXG5jb25zdCBnZXRVUkwgPSAoaG9zdDogc3RyaW5nKTogc3RyaW5nID0+IChob3N0ID8gaG9zdCA6IFBST0RfVVJMKVxuXG5hc3luYyBmdW5jdGlvbiBhcGk8VD4ob3B0aW9uczogQVBJQ29uZmlnKTogUHJvbWlzZTxUPiB7XG4gIGNvbnN0IGNvbmZpZzogYW55ID0geyBwcmVmaXhVcmw6IGdldFVSTChvcHRpb25zLmhvc3QpIH1cblxuICBpZiAob3B0aW9ucy50aW1lb3V0KSB7XG4gICAgY29uZmlnLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXRcbiAgfVxuXG4gIGlmIChvcHRpb25zLmFwaUtleSkge1xuICAgIGNvbmZpZy5oZWFkZXJzID0geyBhdXRob3JpemF0aW9uOiBvcHRpb25zLmFwaUtleSB9XG4gIH1cblxuICBpZiAob3B0aW9ucy5wYXlsb2FkKSB7XG4gICAgY29uZmlnLmpzb24gPSBvcHRpb25zLnBheWxvYWRcbiAgfVxuXG4gIGlmIChvcHRpb25zLnByb2plY3QgJiYgb3B0aW9ucy5tZXRob2QgIT09ICdnZXQnKSB7XG4gICAgaWYgKGNvbmZpZy5qc29uKSB7XG4gICAgICBjb25maWcuanNvbiA9IHsgLi4uY29uZmlnLmpzb24sIHByb2plY3Q6IG9wdGlvbnMucHJvamVjdCB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpZy5qc29uID0geyBwcm9qZWN0OiBvcHRpb25zLnByb2plY3QgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG1ldGhvZDogSFRUUE1ldGhvZCA9IG9wdGlvbnMubWV0aG9kIHx8ICdwb3N0J1xuICBjb25zdCByZXN1bHQ6IGFueSA9IGF3YWl0IGdvdFttZXRob2RdKG9wdGlvbnMucGF0aCwgY29uZmlnKS5qc29uKClcbiAgcmV0dXJuIHJlc3VsdC5kYXRhXG59XG5cbmV4cG9ydCBjb25zdCBvcGVuQXV0aFdpbmRvdyA9IChjb25maWc6IHsgaG9zdDogc3RyaW5nOyB0b2tlbjogc3RyaW5nIH0pOiBQcm9taXNlPENoaWxkUHJvY2Vzcz4gPT5cbiAgb3BlbihgJHtnZXRVUkwoY29uZmlnLmhvc3QpfS9hcGkvY2xpL3NpZ251cD9jbGlfdG9rZW49JHtjb25maWcudG9rZW59YClcblxuZXhwb3J0IGNvbnN0IGNoZWNrQVBJS2V5OiBDaGVja0FQSUtleSA9IGFzeW5jIG9wdGlvbnMgPT4ge1xuICBjb25zdCBbZXJyb3JdID0gYXdhaXQgYXN5bmNXcmFwPGFueT4oXG4gICAgYXBpPGFueT4oe1xuICAgICAgcGF0aDogJ2FwaS9jbGkvY2hlY2snLFxuICAgICAgaG9zdDogZ2V0VVJMKG9wdGlvbnMuaG9zdCksXG4gICAgICBhcGlLZXk6IG9wdGlvbnMuYXBpS2V5LFxuICAgIH0pLFxuICApXG5cbiAgaWYgKGVycm9yKSB7XG4gICAgaWYgKGlzVW5hdXRob3JpemVkKGVycm9yIGFzIEFQSUVycm9yKSkgcmV0dXJuIGZhbHNlXG4gICAgdGhyb3cgZXJyb3JcbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5leHBvcnQgY29uc3QgZ2V0UHJvamVjdHM6IEdldFByb2plY3RzID0gYXN5bmMgKG9wdGlvbnMpOiBQcm9taXNlPFByb2plY3RbXT4gPT4ge1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCBhcGk8UHJvamVjdFtdPih7XG4gICAgcGF0aDogJ2FwaS9wcm9qZWN0cycsXG4gICAgaG9zdDogZ2V0VVJMKG9wdGlvbnMuaG9zdCksXG4gICAgYXBpS2V5OiBvcHRpb25zLmFwaUtleSxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICB9KVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUZpcnN0UHJvamVjdDogQ3JlYXRlRmlyc3RQcm9qZWN0ID0gYXN5bmMgb3B0aW9ucyA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFwaTxQcm9qZWN0Pih7XG4gICAgcGF0aDogJ2FwaS9jbGkvaW5pdCcsXG4gICAgaG9zdDogZ2V0VVJMKG9wdGlvbnMuaG9zdCksXG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgcGF5bG9hZDogeyBuYW1lOiBvcHRpb25zLm5hbWUgfSxcbiAgICBhcGlLZXk6IG9wdGlvbnMuYXBpS2V5LFxuICB9KVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUVudjogQ3JlYXRlRW52ID0gYXN5bmMgb3B0aW9ucyA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFwaTxFbnY+KHtcbiAgICBwYXRoOiAnYXBpL3Byb2plY3RzL2NyZWF0ZUVudmlyb25tZW50JyxcbiAgICBob3N0OiBnZXRVUkwob3B0aW9ucy5ob3N0KSxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICBhcGlLZXk6IG9wdGlvbnMuYXBpS2V5LFxuICAgIHBheWxvYWQ6IG9wdGlvbnMuZW52aXJvbm1lbnQsXG4gIH0pXG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5leHBvcnQgY29uc3QgZ2V0QXV0aFRva2VuOiBHZXRBdXRoVG9rZW4gPSBhc3luYyBvcHRpb25zID0+IHtcbiAgY29uc3QgcmVzdWx0OiB7IHRva2VuOiB7IHZhbHVlOiBzdHJpbmcgfSB9ID0gYXdhaXQgYXBpPHsgdG9rZW46IHsgdmFsdWU6IHN0cmluZyB9IH0+KHtcbiAgICBwYXRoOiAnYXBpL2NsaS90b2tlbicsXG4gICAgaG9zdDogZ2V0VVJMKG9wdGlvbnMuaG9zdCksXG4gIH0pXG4gIHJldHVybiByZXN1bHQudG9rZW4udmFsdWVcbn1cblxuZXhwb3J0IGNvbnN0IGF1dGhlbnRpY2F0ZTogQXV0aGVudGljYXRlID0gYXN5bmMgb3B0aW9ucyA9PiB7XG4gIGNvbnN0IHBvbGxUaW1lb3V0ID0gNTAgKiA2MCAqIDEwMCAvLyBwb2xsIGZvciBhdCBtb3N0IDUgbWluc1xuICBjb25zdCBodHRwVGltZW91dCA9IDMwMDBcblxuICBjb25zdCBwb2xsID0gbmV3IFBvbGwoeyBzdG9wT25GYWlsdXJlOiB0cnVlLCBpbnRlcnZhbDogMTAwMCwgdGltZW91dDogcG9sbFRpbWVvdXQgfSlcblxuICByZXR1cm4gcG9sbC5leGVjdXRlKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZXN1bHQ6IEF1dGhSZXN1bHQgPSBhd2FpdCBhcGk8QXV0aFJlc3VsdD4oe1xuICAgICAgcGF0aDogJ2FwaS9jbGkvc3dhcCcsXG4gICAgICBob3N0OiBnZXRVUkwob3B0aW9ucy5ob3N0KSxcbiAgICAgIHBheWxvYWQ6IHsgdG9rZW46IG9wdGlvbnMudG9rZW4gfSxcbiAgICAgIHRpbWVvdXQ6IGh0dHBUaW1lb3V0LCAvLyBodHRwIHRpbWVvdXRcbiAgICB9KVxuXG4gICAgaWYgKHJlc3VsdCAmJiByZXN1bHQua2V5ICYmIHJlc3VsdC51c2VyKSB7XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUFQSUtleSA9IGFzeW5jIChvcHRpb25zOiB7XG4gIGhvc3Q6IHN0cmluZ1xuICBhcGlLZXk6IHN0cmluZ1xuICBuYW1lOiBzdHJpbmdcbn0pOiBQcm9taXNlPHsgbmFtZTogc3RyaW5nOyBrZXk6IHN0cmluZyB9PiA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFwaTx7IG5hbWU6IHN0cmluZzsga2V5OiBzdHJpbmcgfT4oe1xuICAgIHBhdGg6ICdhcGkvY2xpL2tleScsXG4gICAgaG9zdDogZ2V0VVJMKG9wdGlvbnMuaG9zdCksXG4gICAgYXBpS2V5OiBvcHRpb25zLmFwaUtleSxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICBwYXlsb2FkOiB7IG5hbWU6IG9wdGlvbnMubmFtZSB9LFxuICB9KVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGNvbnN0IHJldHJpZXZlQVBJS2V5czogUmV0cmlldmVBUElLZXlzID0gYXN5bmMgKG9wdGlvbnMpOiBQcm9taXNlPHsgYXBpS2V5czogQXBpS2V5W10gfT4gPT4ge1xuICBjb25zdCByZXN1bHQ6IHsgYXBpS2V5czogQXBpS2V5W10gfSA9IGF3YWl0IGFwaTx7IGFwaUtleXM6IEFwaUtleVtdIH0+KHtcbiAgICBwYXRoOiAnYXBpL2NsaS9hcGlrZXlzJyxcbiAgICBob3N0OiBnZXRVUkwob3B0aW9ucy5ob3N0KSxcbiAgICBhcGlLZXk6IG9wdGlvbnMuYXBpS2V5LFxuICAgIHByb2plY3Q6IG9wdGlvbnMucHJvamVjdCxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICB9KVxuXG4gIHJldHVybiByZXN1bHRcbn1cbiJdfQ==