"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.auth = void 0;

var _ora = _interopRequireDefault(require("ora"));

var _async = require("../utils/async");

var _config = _interopRequireDefault(require("../utils/config"));

var _prints = _interopRequireDefault(require("../utils/prints"));

var _api = require("../utils/api");

var _options = require("../utils/options");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const auth = {
  command: 'auth',
  description: 'Signin or Signup',
  options: [..._options.globalOptions],

  action({
    options,
    logger
  }) {
    return _asyncToGenerator(function* () {
      const userKey = _config.default.getAuth();

      let validKey = false;

      if (userKey) {
        validKey = yield (0, _api.checkAPIKey)({
          host: options.host,
          apiKey: userKey
        });
      }

      if (userKey || validKey) {
        return logger.info(_prints.default.alreadyAuth);
      }

      const spinner = (0, _ora.default)(_prints.default.openingAuth).start();

      const _ref = yield (0, _async.asyncWrap)((0, _api.getAuthToken)({
        host: options.host
      })),
            _ref2 = _slicedToArray(_ref, 2),
            error = _ref2[0],
            token = _ref2[1];

      if (error) {
        return spinner.fail(_prints.default.authError);
      }

      yield (0, _api.openAuthWindow)({
        token,
        host: options.host
      });
      spinner.text = _prints.default.waitingForAuth;

      const _ref3 = yield (0, _async.asyncWrap)((0, _api.authenticate)({
        host: options.host,
        token
      })),
            _ref4 = _slicedToArray(_ref3, 2),
            userError = _ref4[0],
            result = _ref4[1];

      if (userError) {
        return spinner.fail(_prints.default.authError);
      }

      _config.default.setAuth(result.key);

      spinner.succeed(_prints.default.authenticated`${result.user.email}`);
    })();
  }

};
exports.auth = auth;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9hdXRoLnRzIl0sIm5hbWVzIjpbImF1dGgiLCJjb21tYW5kIiwiZGVzY3JpcHRpb24iLCJvcHRpb25zIiwiZ2xvYmFsT3B0aW9ucyIsImFjdGlvbiIsImxvZ2dlciIsInVzZXJLZXkiLCJjb25maWciLCJnZXRBdXRoIiwidmFsaWRLZXkiLCJob3N0IiwiYXBpS2V5IiwiaW5mbyIsInByaW50cyIsImFscmVhZHlBdXRoIiwic3Bpbm5lciIsIm9wZW5pbmdBdXRoIiwic3RhcnQiLCJlcnJvciIsInRva2VuIiwiZmFpbCIsImF1dGhFcnJvciIsInRleHQiLCJ3YWl0aW5nRm9yQXV0aCIsInVzZXJFcnJvciIsInJlc3VsdCIsInNldEF1dGgiLCJrZXkiLCJzdWNjZWVkIiwiYXV0aGVudGljYXRlZCIsInVzZXIiLCJlbWFpbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRU8sTUFBTUEsSUFBbUIsR0FBRztBQUNqQ0MsRUFBQUEsT0FBTyxFQUFFLE1BRHdCO0FBRWpDQyxFQUFBQSxXQUFXLEVBQUUsa0JBRm9CO0FBR2pDQyxFQUFBQSxPQUFPLEVBQUUsQ0FBQyxHQUFHQyxzQkFBSixDQUh3Qjs7QUFJM0JDLEVBQUFBLE1BQU4sQ0FBYTtBQUFFRixJQUFBQSxPQUFGO0FBQVdHLElBQUFBO0FBQVgsR0FBYixFQUFrQztBQUFBO0FBQ2hDLFlBQU1DLE9BQU8sR0FBR0MsZ0JBQU9DLE9BQVAsRUFBaEI7O0FBQ0EsVUFBSUMsUUFBUSxHQUFHLEtBQWY7O0FBRUEsVUFBSUgsT0FBSixFQUFhO0FBQ1hHLFFBQUFBLFFBQVEsU0FBUyxzQkFBWTtBQUFFQyxVQUFBQSxJQUFJLEVBQUVSLE9BQU8sQ0FBQ1EsSUFBaEI7QUFBc0JDLFVBQUFBLE1BQU0sRUFBRUw7QUFBOUIsU0FBWixDQUFqQjtBQUNEOztBQUVELFVBQUlBLE9BQU8sSUFBSUcsUUFBZixFQUF5QjtBQUN2QixlQUFPSixNQUFNLENBQUNPLElBQVAsQ0FBWUMsZ0JBQU9DLFdBQW5CLENBQVA7QUFDRDs7QUFFRCxZQUFNQyxPQUFPLEdBQUcsa0JBQUlGLGdCQUFPRyxXQUFYLEVBQXdCQyxLQUF4QixFQUFoQjs7QUFaZ0MseUJBYUgsc0JBQVUsdUJBQWE7QUFBRVAsUUFBQUEsSUFBSSxFQUFFUixPQUFPLENBQUNRO0FBQWhCLE9BQWIsQ0FBVixDQWJHO0FBQUE7QUFBQSxZQWF6QlEsS0FieUI7QUFBQSxZQWFsQkMsS0Fia0I7O0FBZWhDLFVBQUlELEtBQUosRUFBVztBQUNULGVBQU9ILE9BQU8sQ0FBQ0ssSUFBUixDQUFhUCxnQkFBT1EsU0FBcEIsQ0FBUDtBQUNEOztBQUVELFlBQU0seUJBQWU7QUFBRUYsUUFBQUEsS0FBRjtBQUFTVCxRQUFBQSxJQUFJLEVBQUVSLE9BQU8sQ0FBQ1E7QUFBdkIsT0FBZixDQUFOO0FBRUFLLE1BQUFBLE9BQU8sQ0FBQ08sSUFBUixHQUFlVCxnQkFBT1UsY0FBdEI7O0FBckJnQywwQkF1QkUsc0JBQVUsdUJBQWE7QUFBRWIsUUFBQUEsSUFBSSxFQUFFUixPQUFPLENBQUNRLElBQWhCO0FBQXNCUyxRQUFBQTtBQUF0QixPQUFiLENBQVYsQ0F2QkY7QUFBQTtBQUFBLFlBdUJ6QkssU0F2QnlCO0FBQUEsWUF1QmRDLE1BdkJjOztBQXlCaEMsVUFBSUQsU0FBSixFQUFlO0FBQ2IsZUFBT1QsT0FBTyxDQUFDSyxJQUFSLENBQWFQLGdCQUFPUSxTQUFwQixDQUFQO0FBQ0Q7O0FBRURkLHNCQUFPbUIsT0FBUCxDQUFlRCxNQUFNLENBQUNFLEdBQXRCOztBQUNBWixNQUFBQSxPQUFPLENBQUNhLE9BQVIsQ0FBZ0JmLGdCQUFPZ0IsYUFBYyxHQUFFSixNQUFNLENBQUNLLElBQVAsQ0FBWUMsS0FBTSxFQUF6RDtBQTlCZ0M7QUErQmpDOztBQW5DZ0MsQ0FBNUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgb3JhIGZyb20gJ29yYSdcbmltcG9ydCB7IENvbW1hbmRDb25maWcsIEVudiB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHsgYXN5bmNXcmFwIH0gZnJvbSAnLi4vdXRpbHMvYXN5bmMnXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL3V0aWxzL2NvbmZpZydcbmltcG9ydCBwcmludHMgZnJvbSAnLi4vdXRpbHMvcHJpbnRzJ1xuaW1wb3J0IHsgY2hlY2tBUElLZXksIGdldEF1dGhUb2tlbiwgb3BlbkF1dGhXaW5kb3csIGF1dGhlbnRpY2F0ZSB9IGZyb20gJy4uL3V0aWxzL2FwaSdcbmltcG9ydCB7IGdsb2JhbE9wdGlvbnMgfSBmcm9tICcuLi91dGlscy9vcHRpb25zJ1xuXG5leHBvcnQgY29uc3QgYXV0aDogQ29tbWFuZENvbmZpZyA9IHtcbiAgY29tbWFuZDogJ2F1dGgnLFxuICBkZXNjcmlwdGlvbjogJ1NpZ25pbiBvciBTaWdudXAnLFxuICBvcHRpb25zOiBbLi4uZ2xvYmFsT3B0aW9uc10sXG4gIGFzeW5jIGFjdGlvbih7IG9wdGlvbnMsIGxvZ2dlciB9KSB7XG4gICAgY29uc3QgdXNlcktleSA9IGNvbmZpZy5nZXRBdXRoKClcbiAgICBsZXQgdmFsaWRLZXkgPSBmYWxzZVxuXG4gICAgaWYgKHVzZXJLZXkpIHtcbiAgICAgIHZhbGlkS2V5ID0gYXdhaXQgY2hlY2tBUElLZXkoeyBob3N0OiBvcHRpb25zLmhvc3QsIGFwaUtleTogdXNlcktleSB9KVxuICAgIH1cblxuICAgIGlmICh1c2VyS2V5IHx8IHZhbGlkS2V5KSB7XG4gICAgICByZXR1cm4gbG9nZ2VyLmluZm8ocHJpbnRzLmFscmVhZHlBdXRoKVxuICAgIH1cblxuICAgIGNvbnN0IHNwaW5uZXIgPSBvcmEocHJpbnRzLm9wZW5pbmdBdXRoKS5zdGFydCgpXG4gICAgY29uc3QgW2Vycm9yLCB0b2tlbl0gPSBhd2FpdCBhc3luY1dyYXAoZ2V0QXV0aFRva2VuKHsgaG9zdDogb3B0aW9ucy5ob3N0IH0pKVxuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gc3Bpbm5lci5mYWlsKHByaW50cy5hdXRoRXJyb3IpXG4gICAgfVxuXG4gICAgYXdhaXQgb3BlbkF1dGhXaW5kb3coeyB0b2tlbiwgaG9zdDogb3B0aW9ucy5ob3N0IH0pXG5cbiAgICBzcGlubmVyLnRleHQgPSBwcmludHMud2FpdGluZ0ZvckF1dGhcblxuICAgIGNvbnN0IFt1c2VyRXJyb3IsIHJlc3VsdF0gPSBhd2FpdCBhc3luY1dyYXAoYXV0aGVudGljYXRlKHsgaG9zdDogb3B0aW9ucy5ob3N0LCB0b2tlbiB9KSlcblxuICAgIGlmICh1c2VyRXJyb3IpIHtcbiAgICAgIHJldHVybiBzcGlubmVyLmZhaWwocHJpbnRzLmF1dGhFcnJvcilcbiAgICB9XG5cbiAgICBjb25maWcuc2V0QXV0aChyZXN1bHQua2V5KVxuICAgIHNwaW5uZXIuc3VjY2VlZChwcmludHMuYXV0aGVudGljYXRlZGAke3Jlc3VsdC51c2VyLmVtYWlsfWApXG4gIH0sXG59XG4iXX0=