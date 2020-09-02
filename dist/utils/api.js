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
      path: `api/${options.environment.project}/createEnvironment`,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9hcGkudHMiXSwibmFtZXMiOlsiUFJPRF9VUkwiLCJpc1VuYXV0aG9yaXplZCIsImVycm9yIiwibmFtZSIsInJlc3BvbnNlIiwic3RhdHVzQ29kZSIsImdldFVSTCIsImhvc3QiLCJhcGkiLCJvcHRpb25zIiwiY29uZmlnIiwicHJlZml4VXJsIiwidGltZW91dCIsImFwaUtleSIsImhlYWRlcnMiLCJhdXRob3JpemF0aW9uIiwicGF5bG9hZCIsImpzb24iLCJwcm9qZWN0IiwibWV0aG9kIiwicmVzdWx0IiwiZ290IiwicGF0aCIsImRhdGEiLCJvcGVuQXV0aFdpbmRvdyIsInRva2VuIiwiY2hlY2tBUElLZXkiLCJnZXRQcm9qZWN0cyIsImNyZWF0ZUZpcnN0UHJvamVjdCIsImNyZWF0ZUVudiIsImVudmlyb25tZW50IiwiZ2V0QXV0aFRva2VuIiwidmFsdWUiLCJhdXRoZW50aWNhdGUiLCJwb2xsVGltZW91dCIsImh0dHBUaW1lb3V0IiwicG9sbCIsIlBvbGwiLCJzdG9wT25GYWlsdXJlIiwiaW50ZXJ2YWwiLCJleGVjdXRlIiwia2V5IiwidXNlciIsImNyZWF0ZUFQSUtleSIsInJldHJpZXZlQVBJS2V5cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLE1BQU1BLFFBQVEsR0FBRywyQkFBakI7O0FBRUEsTUFBTUMsY0FBYyxHQUFJQyxLQUFELElBQ3JCQSxLQUFLLENBQUNDLElBQU4sS0FBZSxXQUFmLElBQStCRCxLQUFELENBQXFCRSxRQUFyQixDQUE4QkMsVUFBOUIsS0FBNkMsR0FEN0U7O0FBR0EsTUFBTUMsTUFBTSxHQUFJQyxJQUFELElBQTJCQSxJQUFJLEdBQUdBLElBQUgsR0FBVVAsUUFBeEQ7O1NBRWVRLEc7Ozs7OzJCQUFmLFdBQXNCQyxPQUF0QixFQUFzRDtBQUNwRCxVQUFNQyxNQUFXLEdBQUc7QUFBRUMsTUFBQUEsU0FBUyxFQUFF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QU0sU0FBU1osR0FBRyxDQUFnQztBQUN0RGMsTUFBQUEsSUFBSSxFQUFFLGFBRGdEO0FBRXREZixNQUFBQSxJQUFJLEVBQUVELE1BQU0sQ0FBQ0csT0FBTyxDQUFDRixJQUFULENBRjBDO0FBR3RETSxNQUFBQSxNQUFNLEVBQUVKLE9BQU8sQ0FBQ0ksTUFIc0M7QUFJdERNLE1BQUFBLE1BQU0sRUFBRSxNQUo4QztBQUt0REgsTUFBQUEsT0FBTyxFQUFFO0FBQUViLFFBQUFBLElBQUksRUFBRU0sT0FBTyxDQUFDTjtBQUFoQjtBQUw2QyxLQUFoQyxDQUF4QjtBQVFBLFdBQU9pQixNQUFQO0FBQ0QsR0Fkd0I7O0FBQUEsa0JBQVp1QixZQUFZO0FBQUE7QUFBQTtBQUFBLEdBQWxCOzs7O0FBZ0JBLE1BQU1DLGVBQWdDO0FBQUE7QUFBQTtBQUFBLGlDQUFHLFdBQU9uQyxPQUFQLEVBQXNDO0FBQ3BGLFVBQU1XLE1BQWdCLFNBQVNaLEdBQUcsQ0FBVztBQUMzQ2MsTUFBQUEsSUFBSSxFQUFFLGlCQURxQztBQUUzQ2YsTUFBQUEsSUFBSSxFQUFFRCxNQUFNLENBQUNHLE9BQU8sQ0FBQ0YsSUFBVCxDQUYrQjtBQUczQ00sTUFBQUEsTUFBTSxFQUFFSixPQUFPLENBQUNJLE1BSDJCO0FBSTNDSyxNQUFBQSxPQUFPLEVBQUVULE9BQU8sQ0FBQ1MsT0FKMEI7QUFLM0NDLE1BQUFBLE1BQU0sRUFBRTtBQUxtQyxLQUFYLENBQWxDO0FBUUEsV0FBT0MsTUFBUDtBQUNELEdBVjRDOztBQUFBLGtCQUFoQ3dCLGVBQWdDO0FBQUE7QUFBQTtBQUFBLEdBQXRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBvbGwgZnJvbSAncG9sbC11bnRpbC1wcm9taXNlJ1xuaW1wb3J0IGdvdCwgeyBIVFRQRXJyb3IgfSBmcm9tICdnb3QnXG5pbXBvcnQgb3BlbiBmcm9tICdvcGVuJ1xuaW1wb3J0IHsgQ2hpbGRQcm9jZXNzIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCB7IGFzeW5jV3JhcCB9IGZyb20gJy4vYXN5bmMnXG5pbXBvcnQge1xuICBQcm9qZWN0LFxuICBFbnYsXG4gIENyZWF0ZUVudixcbiAgQXV0aGVudGljYXRlLFxuICBBUElDb25maWcsXG4gIEF1dGhSZXN1bHQsXG4gIEdldEF1dGhUb2tlbixcbiAgQ3JlYXRlRmlyc3RQcm9qZWN0LFxuICBHZXRQcm9qZWN0cyxcbiAgQ2hlY2tBUElLZXksXG4gIFJldHJpZXZlQVBJS2V5cyxcbiAgQXBpS2V5LFxuICBBUElFcnJvcixcbiAgSFRUUE1ldGhvZCxcbn0gZnJvbSAnLi4vdHlwZXMnXG5cbmNvbnN0IFBST0RfVVJMID0gJ2h0dHBzOi8vYXBpLmFkbWluLnRpcGUuaW8nXG5cbmNvbnN0IGlzVW5hdXRob3JpemVkID0gKGVycm9yOiBBUElFcnJvcik6IGJvb2xlYW4gPT5cbiAgZXJyb3IubmFtZSA9PT0gJ0hUVFBFcnJvcicgJiYgKGVycm9yIGFzIEhUVFBFcnJvcikucmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gNDAxXG5cbmNvbnN0IGdldFVSTCA9IChob3N0OiBzdHJpbmcpOiBzdHJpbmcgPT4gKGhvc3QgPyBob3N0IDogUFJPRF9VUkwpXG5cbmFzeW5jIGZ1bmN0aW9uIGFwaTxUPihvcHRpb25zOiBBUElDb25maWcpOiBQcm9taXNlPFQ+IHtcbiAgY29uc3QgY29uZmlnOiBhbnkgPSB7IHByZWZpeFVybDogZ2V0VVJMKG9wdGlvbnMuaG9zdCkgfVxuXG4gIGlmIChvcHRpb25zLnRpbWVvdXQpIHtcbiAgICBjb25maWcudGltZW91dCA9IG9wdGlvbnMudGltZW91dFxuICB9XG5cbiAgaWYgKG9wdGlvbnMuYXBpS2V5KSB7XG4gICAgY29uZmlnLmhlYWRlcnMgPSB7IGF1dGhvcml6YXRpb246IG9wdGlvbnMuYXBpS2V5IH1cbiAgfVxuXG4gIGlmIChvcHRpb25zLnBheWxvYWQpIHtcbiAgICBjb25maWcuanNvbiA9IG9wdGlvbnMucGF5bG9hZFxuICB9XG5cbiAgaWYgKG9wdGlvbnMucHJvamVjdCAmJiBvcHRpb25zLm1ldGhvZCAhPT0gJ2dldCcpIHtcbiAgICBpZiAoY29uZmlnLmpzb24pIHtcbiAgICAgIGNvbmZpZy5qc29uID0geyAuLi5jb25maWcuanNvbiwgcHJvamVjdDogb3B0aW9ucy5wcm9qZWN0IH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlnLmpzb24gPSB7IHByb2plY3Q6IG9wdGlvbnMucHJvamVjdCB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgbWV0aG9kOiBIVFRQTWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgJ3Bvc3QnXG4gIGNvbnN0IHJlc3VsdDogYW55ID0gYXdhaXQgZ290W21ldGhvZF0ob3B0aW9ucy5wYXRoLCBjb25maWcpLmpzb24oKVxuICByZXR1cm4gcmVzdWx0LmRhdGFcbn1cblxuZXhwb3J0IGNvbnN0IG9wZW5BdXRoV2luZG93ID0gKGNvbmZpZzogeyBob3N0OiBzdHJpbmc7IHRva2VuOiBzdHJpbmcgfSk6IFByb21pc2U8Q2hpbGRQcm9jZXNzPiA9PlxuICBvcGVuKGAke2dldFVSTChjb25maWcuaG9zdCl9L2FwaS9jbGkvc2lnbnVwP2NsaV90b2tlbj0ke2NvbmZpZy50b2tlbn1gKVxuXG5leHBvcnQgY29uc3QgY2hlY2tBUElLZXk6IENoZWNrQVBJS2V5ID0gYXN5bmMgb3B0aW9ucyA9PiB7XG4gIGNvbnN0IFtlcnJvcl0gPSBhd2FpdCBhc3luY1dyYXA8YW55PihcbiAgICBhcGk8YW55Pih7XG4gICAgICBwYXRoOiAnYXBpL2NsaS9jaGVjaycsXG4gICAgICBob3N0OiBnZXRVUkwob3B0aW9ucy5ob3N0KSxcbiAgICAgIGFwaUtleTogb3B0aW9ucy5hcGlLZXksXG4gICAgfSksXG4gIClcblxuICBpZiAoZXJyb3IpIHtcbiAgICBpZiAoaXNVbmF1dGhvcml6ZWQoZXJyb3IgYXMgQVBJRXJyb3IpKSByZXR1cm4gZmFsc2VcbiAgICB0aHJvdyBlcnJvclxuICB9XG5cbiAgcmV0dXJuIHRydWVcbn1cbmV4cG9ydCBjb25zdCBnZXRQcm9qZWN0czogR2V0UHJvamVjdHMgPSBhc3luYyAob3B0aW9ucyk6IFByb21pc2U8UHJvamVjdFtdPiA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFwaTxQcm9qZWN0W10+KHtcbiAgICBwYXRoOiAnYXBpL3Byb2plY3RzJyxcbiAgICBob3N0OiBnZXRVUkwob3B0aW9ucy5ob3N0KSxcbiAgICBhcGlLZXk6IG9wdGlvbnMuYXBpS2V5LFxuICAgIG1ldGhvZDogJ2dldCcsXG4gIH0pXG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5leHBvcnQgY29uc3QgY3JlYXRlRmlyc3RQcm9qZWN0OiBDcmVhdGVGaXJzdFByb2plY3QgPSBhc3luYyBvcHRpb25zID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgYXBpPFByb2plY3Q+KHtcbiAgICBwYXRoOiAnYXBpL2NsaS9pbml0JyxcbiAgICBob3N0OiBnZXRVUkwob3B0aW9ucy5ob3N0KSxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICBwYXlsb2FkOiB7IG5hbWU6IG9wdGlvbnMubmFtZSB9LFxuICAgIGFwaUtleTogb3B0aW9ucy5hcGlLZXksXG4gIH0pXG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5leHBvcnQgY29uc3QgY3JlYXRlRW52OiBDcmVhdGVFbnYgPSBhc3luYyBvcHRpb25zID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgYXBpPEVudj4oe1xuICAgIHBhdGg6IGBhcGkvJHtvcHRpb25zLmVudmlyb25tZW50LnByb2plY3R9L2NyZWF0ZUVudmlyb25tZW50YCxcbiAgICBob3N0OiBnZXRVUkwob3B0aW9ucy5ob3N0KSxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICBhcGlLZXk6IG9wdGlvbnMuYXBpS2V5LFxuICAgIHBheWxvYWQ6IG9wdGlvbnMuZW52aXJvbm1lbnQsXG4gIH0pXG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5leHBvcnQgY29uc3QgZ2V0QXV0aFRva2VuOiBHZXRBdXRoVG9rZW4gPSBhc3luYyBvcHRpb25zID0+IHtcbiAgY29uc3QgcmVzdWx0OiB7IHRva2VuOiB7IHZhbHVlOiBzdHJpbmcgfSB9ID0gYXdhaXQgYXBpPHsgdG9rZW46IHsgdmFsdWU6IHN0cmluZyB9IH0+KHtcbiAgICBwYXRoOiAnYXBpL2NsaS90b2tlbicsXG4gICAgaG9zdDogZ2V0VVJMKG9wdGlvbnMuaG9zdCksXG4gIH0pXG4gIHJldHVybiByZXN1bHQudG9rZW4udmFsdWVcbn1cblxuZXhwb3J0IGNvbnN0IGF1dGhlbnRpY2F0ZTogQXV0aGVudGljYXRlID0gYXN5bmMgb3B0aW9ucyA9PiB7XG4gIGNvbnN0IHBvbGxUaW1lb3V0ID0gNTAgKiA2MCAqIDEwMCAvLyBwb2xsIGZvciBhdCBtb3N0IDUgbWluc1xuICBjb25zdCBodHRwVGltZW91dCA9IDMwMDBcblxuICBjb25zdCBwb2xsID0gbmV3IFBvbGwoeyBzdG9wT25GYWlsdXJlOiB0cnVlLCBpbnRlcnZhbDogMTAwMCwgdGltZW91dDogcG9sbFRpbWVvdXQgfSlcblxuICByZXR1cm4gcG9sbC5leGVjdXRlKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZXN1bHQ6IEF1dGhSZXN1bHQgPSBhd2FpdCBhcGk8QXV0aFJlc3VsdD4oe1xuICAgICAgcGF0aDogJ2FwaS9jbGkvc3dhcCcsXG4gICAgICBob3N0OiBnZXRVUkwob3B0aW9ucy5ob3N0KSxcbiAgICAgIHBheWxvYWQ6IHsgdG9rZW46IG9wdGlvbnMudG9rZW4gfSxcbiAgICAgIHRpbWVvdXQ6IGh0dHBUaW1lb3V0LCAvLyBodHRwIHRpbWVvdXRcbiAgICB9KVxuXG4gICAgaWYgKHJlc3VsdCAmJiByZXN1bHQua2V5ICYmIHJlc3VsdC51c2VyKSB7XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUFQSUtleSA9IGFzeW5jIChvcHRpb25zOiB7XG4gIGhvc3Q6IHN0cmluZ1xuICBhcGlLZXk6IHN0cmluZ1xuICBuYW1lOiBzdHJpbmdcbn0pOiBQcm9taXNlPHsgbmFtZTogc3RyaW5nOyBrZXk6IHN0cmluZyB9PiA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFwaTx7IG5hbWU6IHN0cmluZzsga2V5OiBzdHJpbmcgfT4oe1xuICAgIHBhdGg6ICdhcGkvY2xpL2tleScsXG4gICAgaG9zdDogZ2V0VVJMKG9wdGlvbnMuaG9zdCksXG4gICAgYXBpS2V5OiBvcHRpb25zLmFwaUtleSxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICBwYXlsb2FkOiB7IG5hbWU6IG9wdGlvbnMubmFtZSB9LFxuICB9KVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGNvbnN0IHJldHJpZXZlQVBJS2V5czogUmV0cmlldmVBUElLZXlzID0gYXN5bmMgKG9wdGlvbnMpOiBQcm9taXNlPEFwaUtleVtdPiA9PiB7XG4gIGNvbnN0IHJlc3VsdDogQXBpS2V5W10gPSBhd2FpdCBhcGk8QXBpS2V5W10+KHtcbiAgICBwYXRoOiAnYXBpL2NsaS9hcGlrZXlzJyxcbiAgICBob3N0OiBnZXRVUkwob3B0aW9ucy5ob3N0KSxcbiAgICBhcGlLZXk6IG9wdGlvbnMuYXBpS2V5LFxuICAgIHByb2plY3Q6IG9wdGlvbnMucHJvamVjdCxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICB9KVxuXG4gIHJldHVybiByZXN1bHRcbn1cbiJdfQ==