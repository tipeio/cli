"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.projects = void 0;

var _ora = _interopRequireDefault(require("ora"));

var _logSymbols = _interopRequireDefault(require("log-symbols"));

var _cliTable = _interopRequireDefault(require("cli-table"));

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

const formatEnvs = envs => envs.reduce((result, env) => {
  return `${result}
${env.id}: ${env.name}: ${env.private ? 'Private' : 'Public'}  
`;
}, '');

const projects = {
  command: 'projects',
  description: 'List all your Tipe projects',
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

      if (!userKey || !validKey) {
        return logger.warn(_prints.default.needToAuth);
      }

      const spinner = (0, _ora.default)(_prints.default.gettingProjects).start();

      const _ref = yield (0, _async.asyncWrap)((0, _api.getProjects)({
        host: options.host,
        apiKey: userKey
      })),
            _ref2 = _slicedToArray(_ref, 2),
            error = _ref2[0],
            _ref2$ = _ref2[1],
            projects = _ref2$ === void 0 ? [] : _ref2$;

      if (error) {
        return spinner.fail(_prints.default.projectsError);
      }

      if (!projects.length) {
        return spinner.stopAndPersist({
          text: _prints.default.noProjects,
          prefixText: _logSymbols.default.warning
        });
      }

      const table = new _cliTable.default({
        head: ['id', 'Name', 'Environments'],
        colWidths: [30, 50, 50]
      });
      table.push(...projects.map(project => [project.id, project.name, formatEnvs(project.environments)]));
      spinner.succeed(_prints.default.projectsLoaded);
      console.log(table.toString());
    })();
  }

};
exports.projects = projects;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9wcm9qZWN0cy50cyJdLCJuYW1lcyI6WyJmb3JtYXRFbnZzIiwiZW52cyIsInJlZHVjZSIsInJlc3VsdCIsImVudiIsImlkIiwibmFtZSIsInByaXZhdGUiLCJwcm9qZWN0cyIsImNvbW1hbmQiLCJkZXNjcmlwdGlvbiIsIm9wdGlvbnMiLCJnbG9iYWxPcHRpb25zIiwiYWN0aW9uIiwibG9nZ2VyIiwidXNlcktleSIsImNvbmZpZyIsImdldEF1dGgiLCJ2YWxpZEtleSIsImhvc3QiLCJhcGlLZXkiLCJ3YXJuIiwicHJpbnRzIiwibmVlZFRvQXV0aCIsInNwaW5uZXIiLCJnZXR0aW5nUHJvamVjdHMiLCJzdGFydCIsImVycm9yIiwiZmFpbCIsInByb2plY3RzRXJyb3IiLCJsZW5ndGgiLCJzdG9wQW5kUGVyc2lzdCIsInRleHQiLCJub1Byb2plY3RzIiwicHJlZml4VGV4dCIsImxzIiwid2FybmluZyIsInRhYmxlIiwiVGFibGUiLCJoZWFkIiwiY29sV2lkdGhzIiwicHVzaCIsIm1hcCIsInByb2plY3QiLCJlbnZpcm9ubWVudHMiLCJzdWNjZWVkIiwicHJvamVjdHNMb2FkZWQiLCJjb25zb2xlIiwibG9nIiwidG9TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLE1BQU1BLFVBQVUsR0FBSUMsSUFBRCxJQUNqQkEsSUFBSSxDQUFDQyxNQUFMLENBQVksQ0FBQ0MsTUFBRCxFQUFTQyxHQUFULEtBQWlCO0FBQzNCLFNBQVEsR0FBRUQsTUFBTztFQUNuQkMsR0FBRyxDQUFDQyxFQUFHLEtBQUlELEdBQUcsQ0FBQ0UsSUFBSyxLQUFJRixHQUFHLENBQUNHLE9BQUosR0FBYyxTQUFkLEdBQTBCLFFBQVM7Q0FEekQ7QUFHRCxDQUpELEVBSUcsRUFKSCxDQURGOztBQU9PLE1BQU1DLFFBQXVCLEdBQUc7QUFDckNDLEVBQUFBLE9BQU8sRUFBRSxVQUQ0QjtBQUVyQ0MsRUFBQUEsV0FBVyxFQUFFLDZCQUZ3QjtBQUdyQ0MsRUFBQUEsT0FBTyxFQUFFLENBQUMsR0FBR0Msc0JBQUosQ0FINEI7O0FBSS9CQyxFQUFBQSxNQUFOLENBQWE7QUFBRUYsSUFBQUEsT0FBRjtBQUFXRyxJQUFBQTtBQUFYLEdBQWIsRUFBa0M7QUFBQTtBQUNoQyxZQUFNQyxPQUFPLEdBQUdDLGdCQUFPQyxPQUFQLEVBQWhCOztBQUNBLFVBQUlDLFFBQVEsR0FBRyxLQUFmOztBQUVBLFVBQUlILE9BQUosRUFBYTtBQUNYRyxRQUFBQSxRQUFRLFNBQVMsc0JBQVk7QUFBRUMsVUFBQUEsSUFBSSxFQUFFUixPQUFPLENBQUNRLElBQWhCO0FBQXNCQyxVQUFBQSxNQUFNLEVBQUVMO0FBQTlCLFNBQVosQ0FBakI7QUFDRDs7QUFFRCxVQUFJLENBQUNBLE9BQUQsSUFBWSxDQUFDRyxRQUFqQixFQUEyQjtBQUN6QixlQUFPSixNQUFNLENBQUNPLElBQVAsQ0FBWUMsZ0JBQU9DLFVBQW5CLENBQVA7QUFDRDs7QUFFRCxZQUFNQyxPQUFPLEdBQUcsa0JBQUlGLGdCQUFPRyxlQUFYLEVBQTRCQyxLQUE1QixFQUFoQjs7QUFaZ0MseUJBYUssc0JBQ25DLHNCQUFZO0FBQ1ZQLFFBQUFBLElBQUksRUFBRVIsT0FBTyxDQUFDUSxJQURKO0FBRVZDLFFBQUFBLE1BQU0sRUFBRUw7QUFGRSxPQUFaLENBRG1DLENBYkw7QUFBQTtBQUFBLFlBYXpCWSxLQWJ5QjtBQUFBO0FBQUEsWUFhbEJuQixRQWJrQix1QkFhUCxFQWJPOztBQW9CaEMsVUFBSW1CLEtBQUosRUFBVztBQUNULGVBQU9ILE9BQU8sQ0FBQ0ksSUFBUixDQUFhTixnQkFBT08sYUFBcEIsQ0FBUDtBQUNEOztBQUVELFVBQUksQ0FBQ3JCLFFBQVEsQ0FBQ3NCLE1BQWQsRUFBc0I7QUFDcEIsZUFBT04sT0FBTyxDQUFDTyxjQUFSLENBQXVCO0FBQzVCQyxVQUFBQSxJQUFJLEVBQUVWLGdCQUFPVyxVQURlO0FBRTVCQyxVQUFBQSxVQUFVLEVBQUVDLG9CQUFHQztBQUZhLFNBQXZCLENBQVA7QUFJRDs7QUFFRCxZQUFNQyxLQUFLLEdBQUcsSUFBSUMsaUJBQUosQ0FBVTtBQUN0QkMsUUFBQUEsSUFBSSxFQUFFLENBQUMsSUFBRCxFQUFPLE1BQVAsRUFBZSxjQUFmLENBRGdCO0FBRXRCQyxRQUFBQSxTQUFTLEVBQUUsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQ7QUFGVyxPQUFWLENBQWQ7QUFLQUgsTUFBQUEsS0FBSyxDQUFDSSxJQUFOLENBQVcsR0FBR2pDLFFBQVEsQ0FBQ2tDLEdBQVQsQ0FBY0MsT0FBRCxJQUFrQixDQUFDQSxPQUFPLENBQUN0QyxFQUFULEVBQWFzQyxPQUFPLENBQUNyQyxJQUFyQixFQUEyQk4sVUFBVSxDQUFDMkMsT0FBTyxDQUFDQyxZQUFULENBQXJDLENBQS9CLENBQWQ7QUFDQXBCLE1BQUFBLE9BQU8sQ0FBQ3FCLE9BQVIsQ0FBZ0J2QixnQkFBT3dCLGNBQXZCO0FBRUFDLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZWCxLQUFLLENBQUNZLFFBQU4sRUFBWjtBQXZDZ0M7QUF3Q2pDOztBQTVDb0MsQ0FBaEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgb3JhIGZyb20gJ29yYSdcbmltcG9ydCBscyBmcm9tICdsb2ctc3ltYm9scydcbmltcG9ydCBUYWJsZSBmcm9tICdjbGktdGFibGUnXG5pbXBvcnQgeyBDb21tYW5kQ29uZmlnLCBFbnYgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB7IGFzeW5jV3JhcCB9IGZyb20gJy4uL3V0aWxzL2FzeW5jJ1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi91dGlscy9jb25maWcnXG5pbXBvcnQgcHJpbnRzIGZyb20gJy4uL3V0aWxzL3ByaW50cydcbmltcG9ydCB7IGdldFByb2plY3RzLCBjaGVja0FQSUtleSB9IGZyb20gJy4uL3V0aWxzL2FwaSdcbmltcG9ydCB7IGdsb2JhbE9wdGlvbnMgfSBmcm9tICcuLi91dGlscy9vcHRpb25zJ1xuXG5jb25zdCBmb3JtYXRFbnZzID0gKGVudnM6IEVudltdKTogc3RyaW5nID0+XG4gIGVudnMucmVkdWNlKChyZXN1bHQsIGVudikgPT4ge1xuICAgIHJldHVybiBgJHtyZXN1bHR9XG4ke2Vudi5pZH06ICR7ZW52Lm5hbWV9OiAke2Vudi5wcml2YXRlID8gJ1ByaXZhdGUnIDogJ1B1YmxpYyd9ICBcbmBcbiAgfSwgJycpXG5cbmV4cG9ydCBjb25zdCBwcm9qZWN0czogQ29tbWFuZENvbmZpZyA9IHtcbiAgY29tbWFuZDogJ3Byb2plY3RzJyxcbiAgZGVzY3JpcHRpb246ICdMaXN0IGFsbCB5b3VyIFRpcGUgcHJvamVjdHMnLFxuICBvcHRpb25zOiBbLi4uZ2xvYmFsT3B0aW9uc10sXG4gIGFzeW5jIGFjdGlvbih7IG9wdGlvbnMsIGxvZ2dlciB9KSB7XG4gICAgY29uc3QgdXNlcktleSA9IGNvbmZpZy5nZXRBdXRoKClcbiAgICBsZXQgdmFsaWRLZXkgPSBmYWxzZVxuXG4gICAgaWYgKHVzZXJLZXkpIHtcbiAgICAgIHZhbGlkS2V5ID0gYXdhaXQgY2hlY2tBUElLZXkoeyBob3N0OiBvcHRpb25zLmhvc3QsIGFwaUtleTogdXNlcktleSB9IGFzIGFueSlcbiAgICB9XG5cbiAgICBpZiAoIXVzZXJLZXkgfHwgIXZhbGlkS2V5KSB7XG4gICAgICByZXR1cm4gbG9nZ2VyLndhcm4ocHJpbnRzLm5lZWRUb0F1dGgpXG4gICAgfVxuXG4gICAgY29uc3Qgc3Bpbm5lciA9IG9yYShwcmludHMuZ2V0dGluZ1Byb2plY3RzKS5zdGFydCgpXG4gICAgY29uc3QgW2Vycm9yLCBwcm9qZWN0cyA9IFtdXSA9IGF3YWl0IGFzeW5jV3JhcChcbiAgICAgIGdldFByb2plY3RzKHtcbiAgICAgICAgaG9zdDogb3B0aW9ucy5ob3N0LFxuICAgICAgICBhcGlLZXk6IHVzZXJLZXksXG4gICAgICB9IGFzIGFueSksXG4gICAgKVxuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gc3Bpbm5lci5mYWlsKHByaW50cy5wcm9qZWN0c0Vycm9yKVxuICAgIH1cblxuICAgIGlmICghcHJvamVjdHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gc3Bpbm5lci5zdG9wQW5kUGVyc2lzdCh7XG4gICAgICAgIHRleHQ6IHByaW50cy5ub1Byb2plY3RzLFxuICAgICAgICBwcmVmaXhUZXh0OiBscy53YXJuaW5nLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCB0YWJsZSA9IG5ldyBUYWJsZSh7XG4gICAgICBoZWFkOiBbJ2lkJywgJ05hbWUnLCAnRW52aXJvbm1lbnRzJ10sXG4gICAgICBjb2xXaWR0aHM6IFszMCwgNTAsIDUwXSxcbiAgICB9KVxuXG4gICAgdGFibGUucHVzaCguLi5wcm9qZWN0cy5tYXAoKHByb2plY3Q6IGFueSkgPT4gW3Byb2plY3QuaWQsIHByb2plY3QubmFtZSwgZm9ybWF0RW52cyhwcm9qZWN0LmVudmlyb25tZW50cyldKSlcbiAgICBzcGlubmVyLnN1Y2NlZWQocHJpbnRzLnByb2plY3RzTG9hZGVkKVxuXG4gICAgY29uc29sZS5sb2codGFibGUudG9TdHJpbmcoKSlcbiAgfSxcbn1cbiJdfQ==