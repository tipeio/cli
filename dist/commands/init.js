"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = void 0;

var _ora = _interopRequireDefault(require("ora"));

var _async = require("../utils/async");

var _config = _interopRequireDefault(require("../utils/config"));

var _prints = _interopRequireDefault(require("../utils/prints"));

var _install = require("../utils/install");

var _prompts = require("../utils/prompts");

var _options = require("../utils/options");

var _detect = require("../utils/detect");

var _core = require("@caporal/core");

var _changeCase = require("change-case");

var _uuid = require("uuid");

var _api = require("../utils/api");

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

const defaultOptions = {
  environment: 'Production',
  contentHost: 'https://content.tipe.io',
  adminHost: 'https://api.admin.tipe.io',
  assetHost: 'https://upload.tipe.io',
  mountPath: 'cms',
  previews: true,
  previewSecret: (0, _uuid.v4)()
};
const excludeEnvIfDefault = {
  contentHost: true,
  adminHost: true,
  assetHost: true
};

const promptHooks = cliOptions => ({
  onCreateProject(options) {
    return _asyncToGenerator(function* () {
      const apiKey = _config.default.getAuth();

      const spinner = (0, _ora.default)(_prints.default.creatingFirstProject).start();

      try {
        const project = yield (0, _api.createFirstProject)({
          apiKey,
          name: options.name,
          host: cliOptions.adminHost
        });
        spinner.succeed(_prints.default.createdFirstProject`${project.name} ${project.environments[0].name}`);
        return project;
      } catch (e) {
        spinner.fail('Oops, we could not create you a Project');
      }
    })();
  },

  onCreateEnv(options) {
    return _asyncToGenerator(function* () {
      const spinner = (0, _ora.default)(_prints.default.creatingEnv).start();

      const apiKey = _config.default.getAuth();

      const environment = yield (0, _api.createEnv)({
        apiKey,
        host: cliOptions.adminHost,
        environment: options
      });
      spinner.succeed(_prints.default.createdEnv);
      return environment;
    })();
  }

});

const init = {
  command: 'init',
  default: true,
  description: 'Create a new Tipe project',
  options: [..._options.globalOptions, {
    option: '--contentHost [contentHost]',
    description: 'content api host to use',
    config: {
      validator: _core.program.STRING
    }
  }, {
    option: '--assetHost [assetHost]',
    description: 'content api host to use',
    config: {
      validator: _core.program.STRING
    }
  }],
  alias: [''],

  action({
    options,
    logger
  }) {
    return _asyncToGenerator(function* () {
      console.log(_prints.default.header);
      console.log(_prints.default.intro);

      let userKey = _config.default.getAuth();

      let validKey = false;

      if (userKey) {
        validKey = yield (0, _api.checkAPIKey)({
          host: options.adminHost,
          apiKey: userKey
        });
      }

      if (!userKey || !validKey) {
        const spinner = (0, _ora.default)(_prints.default.openingAuth).start();

        const _ref = yield (0, _async.asyncWrap)((0, _api.getAuthToken)({
          host: options.adminHost
        })),
              _ref2 = _slicedToArray(_ref, 2),
              error = _ref2[0],
              token = _ref2[1];

        if (error) {
          return spinner.fail(_prints.default.authError);
        }

        yield (0, _api.openAuthWindow)({
          token,
          host: options.adminHost
        });
        spinner.text = _prints.default.waitingForAuth;

        const _ref3 = yield (0, _async.asyncWrap)((0, _api.authenticate)({
          host: options.adminHost,
          token
        })),
              _ref4 = _slicedToArray(_ref3, 2),
              userError = _ref4[0],
              user = _ref4[1];

        if (userError) {
          return spinner.fail(_prints.default.authError);
        }

        _config.default.setAuth(user.key);

        userKey = user.key;
        spinner.succeed(_prints.default.authenticated`${user.user.email}`);
      } else {
        console.log(_prints.default.foundAuth);
      }

      const spinner = (0, _ora.default)(_prints.default.gettingProjects).start();
      let projects;

      try {
        projects = yield (0, _api.getProjects)({
          host: options.adminHost,
          apiKey: userKey
        });
      } catch (e) {
        spinner.fail('Oops, could not get your projects.');
        return;
      }

      spinner.succeed(_prints.default.projectsLoaded);
      const answers = yield (0, _prompts.initPrompts)(projects, promptHooks(options));

      const envConfig = _objectSpread({}, defaultOptions, {}, options, {
        projectId: answers.project.id,
        environment: answers.env.name
      });

      const envs = Object.keys(envConfig).filter(env => {
        const value = envConfig[env];
        return !(excludeEnvIfDefault[env] && value === defaultOptions[env]);
      }).map(env => ({
        name: (0, _changeCase.constantCase)(`TIPE_${env}`).toUpperCase(),
        value: envConfig[env]
      }));
      let installSpinner;
      let envError;
      installSpinner = (0, _ora.default)(_prints.default.detectingFramework).start();

      const _ref5 = yield (0, _detect.getFramework)(),
            modules = _ref5.modules,
            name = _ref5.name;

      if (name) {
        installSpinner.succeed(`${name} app detected`);
        let schemaModules;

        try {
          installSpinner = (0, _ora.default)(`Setting up tipe for ${name}`).start();

          if (answers.writeEnv) {
            const result = yield (0, _detect.writeEnvs)(envs);
            envError = result.error;
          }

          yield (0, _detect.createPages)(envConfig);
          yield (0, _detect.createPreviewRoutes)();
          schemaModules = yield (0, _detect.createTipeFolder)();
          installSpinner.succeed(`Tipe setup with ${name}`);
        } catch (e) {
          console.log(e);
          installSpinner.fail('Could not setup tipe integration');
          return;
        }

        try {
          installSpinner = (0, _ora.default)('Installing modules').start();
          yield (0, _install.installModules)([...modules, ...schemaModules]);
          installSpinner.succeed('Modules installed');

          if (!answers.writeEnv || envError) {
            console.log(_prints.default.done(`
  Copy and paste these env vars into
  your ".env.local" or ".env" file
  
  ${envs.map(env => `\n${env.name}=${env.value}`)}
  `));
          }
        } catch (e) {
          console.log(e);
          installSpinner.fail('Could not install modules');
          return;
        }
      } else {
        installSpinner.warn(_prints.default.unsupportedFrameworks(Object.keys(_detect.frameworks).map(f => _detect.frameworks[f])));
      }
    })();
  }

};
exports.init = init;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9pbml0LnRzIl0sIm5hbWVzIjpbImRlZmF1bHRPcHRpb25zIiwiZW52aXJvbm1lbnQiLCJjb250ZW50SG9zdCIsImFkbWluSG9zdCIsImFzc2V0SG9zdCIsIm1vdW50UGF0aCIsInByZXZpZXdzIiwicHJldmlld1NlY3JldCIsImV4Y2x1ZGVFbnZJZkRlZmF1bHQiLCJwcm9tcHRIb29rcyIsImNsaU9wdGlvbnMiLCJvbkNyZWF0ZVByb2plY3QiLCJvcHRpb25zIiwiYXBpS2V5IiwiY29uZmlnIiwiZ2V0QXV0aCIsInNwaW5uZXIiLCJwcmludHMiLCJjcmVhdGluZ0ZpcnN0UHJvamVjdCIsInN0YXJ0IiwicHJvamVjdCIsIm5hbWUiLCJob3N0Iiwic3VjY2VlZCIsImNyZWF0ZWRGaXJzdFByb2plY3QiLCJlbnZpcm9ubWVudHMiLCJlIiwiZmFpbCIsIm9uQ3JlYXRlRW52IiwiY3JlYXRpbmdFbnYiLCJjcmVhdGVkRW52IiwiaW5pdCIsImNvbW1hbmQiLCJkZWZhdWx0IiwiZGVzY3JpcHRpb24iLCJnbG9iYWxPcHRpb25zIiwib3B0aW9uIiwidmFsaWRhdG9yIiwicHJvZ3JhbSIsIlNUUklORyIsImFsaWFzIiwiYWN0aW9uIiwibG9nZ2VyIiwiY29uc29sZSIsImxvZyIsImhlYWRlciIsImludHJvIiwidXNlcktleSIsInZhbGlkS2V5Iiwib3BlbmluZ0F1dGgiLCJlcnJvciIsInRva2VuIiwiYXV0aEVycm9yIiwidGV4dCIsIndhaXRpbmdGb3JBdXRoIiwidXNlckVycm9yIiwidXNlciIsInNldEF1dGgiLCJrZXkiLCJhdXRoZW50aWNhdGVkIiwiZW1haWwiLCJmb3VuZEF1dGgiLCJnZXR0aW5nUHJvamVjdHMiLCJwcm9qZWN0cyIsInByb2plY3RzTG9hZGVkIiwiYW5zd2VycyIsImVudkNvbmZpZyIsInByb2plY3RJZCIsImlkIiwiZW52IiwiZW52cyIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJ2YWx1ZSIsIm1hcCIsInRvVXBwZXJDYXNlIiwiaW5zdGFsbFNwaW5uZXIiLCJlbnZFcnJvciIsImRldGVjdGluZ0ZyYW1ld29yayIsIm1vZHVsZXMiLCJzY2hlbWFNb2R1bGVzIiwid3JpdGVFbnYiLCJyZXN1bHQiLCJkb25lIiwid2FybiIsInVuc3VwcG9ydGVkRnJhbWV3b3JrcyIsImZyYW1ld29ya3MiLCJmIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBUUE7O0FBQ0E7O0FBQ0E7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVQSxNQUFNQSxjQUFtQixHQUFHO0FBQzFCQyxFQUFBQSxXQUFXLEVBQUUsWUFEYTtBQUUxQkMsRUFBQUEsV0FBVyxFQUFFLHlCQUZhO0FBRzFCQyxFQUFBQSxTQUFTLEVBQUUsMkJBSGU7QUFJMUJDLEVBQUFBLFNBQVMsRUFBRSx3QkFKZTtBQUsxQkMsRUFBQUEsU0FBUyxFQUFFLEtBTGU7QUFNMUJDLEVBQUFBLFFBQVEsRUFBRSxJQU5nQjtBQU8xQkMsRUFBQUEsYUFBYSxFQUFFO0FBUFcsQ0FBNUI7QUFVQSxNQUFNQyxtQkFBd0IsR0FBRztBQUMvQk4sRUFBQUEsV0FBVyxFQUFFLElBRGtCO0FBRS9CQyxFQUFBQSxTQUFTLEVBQUUsSUFGb0I7QUFHL0JDLEVBQUFBLFNBQVMsRUFBRTtBQUhvQixDQUFqQzs7QUFNQSxNQUFNSyxXQUFXLEdBQUlDLFVBQUQsS0FBbUM7QUFDL0NDLEVBQUFBLGVBQU4sQ0FBc0JDLE9BQXRCLEVBQWlEO0FBQUE7QUFDL0MsWUFBTUMsTUFBTSxHQUFHQyxnQkFBT0MsT0FBUCxFQUFmOztBQUNBLFlBQU1DLE9BQU8sR0FBRyxrQkFBSUMsZ0JBQU9DLG9CQUFYLEVBQWlDQyxLQUFqQyxFQUFoQjs7QUFDQSxVQUFJO0FBQ0YsY0FBTUMsT0FBTyxTQUFTLDZCQUFtQjtBQUFFUCxVQUFBQSxNQUFGO0FBQVVRLFVBQUFBLElBQUksRUFBRVQsT0FBTyxDQUFDUyxJQUF4QjtBQUE4QkMs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LFVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZbEIsQ0FBWjtBQUNBbUQsVUFBQUEsY0FBYyxDQUFDbEQsSUFBZixDQUFvQiwyQkFBcEI7QUFDQTtBQUNEO0FBQ0YsT0ExQ0QsTUEwQ087QUFDTGtELFFBQUFBLGNBQWMsQ0FBQ1EsSUFBZixDQUFvQnBFLGdCQUFPcUUscUJBQVAsQ0FBNkJmLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZZSxrQkFBWixFQUF3QlosR0FBeEIsQ0FBNkJhLENBQUQsSUFBWUQsbUJBQVdDLENBQVgsQ0FBeEMsQ0FBN0IsQ0FBcEI7QUFDRDtBQW5IK0I7QUFvSGpDOztBQXRJZ0MsQ0FBNUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgb3JhIGZyb20gJ29yYSdcbmltcG9ydCB7IGFzeW5jV3JhcCB9IGZyb20gJy4uL3V0aWxzL2FzeW5jJ1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi91dGlscy9jb25maWcnXG5pbXBvcnQgcHJpbnRzIGZyb20gJy4uL3V0aWxzL3ByaW50cydcbmltcG9ydCB7IGluc3RhbGxNb2R1bGVzIH0gZnJvbSAnLi4vdXRpbHMvaW5zdGFsbCdcbmltcG9ydCB7IGluaXRQcm9tcHRzIH0gZnJvbSAnLi4vdXRpbHMvcHJvbXB0cydcbmltcG9ydCB7IGdsb2JhbE9wdGlvbnMgfSBmcm9tICcuLi91dGlscy9vcHRpb25zJ1xuaW1wb3J0IHsgQ29tbWFuZENvbmZpZywgUHJvbXB0SG9va3MsIEVudiwgUHJvamVjdCB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHtcbiAgZ2V0RnJhbWV3b3JrLFxuICBjcmVhdGVUaXBlRm9sZGVyLFxuICBmcmFtZXdvcmtzLFxuICBjcmVhdGVQYWdlcyxcbiAgd3JpdGVFbnZzLFxuICBjcmVhdGVQcmV2aWV3Um91dGVzLFxufSBmcm9tICcuLi91dGlscy9kZXRlY3QnXG5pbXBvcnQgeyBwcm9ncmFtIH0gZnJvbSAnQGNhcG9yYWwvY29yZSdcbmltcG9ydCB7IGNvbnN0YW50Q2FzZSB9IGZyb20gJ2NoYW5nZS1jYXNlJ1xuaW1wb3J0IHsgdjQgfSBmcm9tICd1dWlkJ1xuXG4vLyBpbXBvcnQgeyBncmVlbkNoZWNrIH0gZnJvbSAnLi4vdXRpbHMvc3ltYm9scydcbmltcG9ydCB7XG4gIGNoZWNrQVBJS2V5LFxuICBnZXRQcm9qZWN0cyxcbiAgZ2V0QXV0aFRva2VuLFxuICBhdXRoZW50aWNhdGUsXG4gIG9wZW5BdXRoV2luZG93LFxuICBjcmVhdGVGaXJzdFByb2plY3QsXG4gIGNyZWF0ZUVudixcbn0gZnJvbSAnLi4vdXRpbHMvYXBpJ1xuXG5jb25zdCBkZWZhdWx0T3B0aW9uczogYW55ID0ge1xuICBlbnZpcm9ubWVudDogJ1Byb2R1Y3Rpb24nLFxuICBjb250ZW50SG9zdDogJ2h0dHBzOi8vY29udGVudC50aXBlLmlvJyxcbiAgYWRtaW5Ib3N0OiAnaHR0cHM6Ly9hcGkuYWRtaW4udGlwZS5pbycsXG4gIGFzc2V0SG9zdDogJ2h0dHBzOi8vdXBsb2FkLnRpcGUuaW8nLFxuICBtb3VudFBhdGg6ICdjbXMnLFxuICBwcmV2aWV3czogdHJ1ZSxcbiAgcHJldmlld1NlY3JldDogdjQoKSxcbn1cblxuY29uc3QgZXhjbHVkZUVudklmRGVmYXVsdDogYW55ID0ge1xuICBjb250ZW50SG9zdDogdHJ1ZSxcbiAgYWRtaW5Ib3N0OiB0cnVlLFxuICBhc3NldEhvc3Q6IHRydWUsXG59XG5cbmNvbnN0IHByb21wdEhvb2tzID0gKGNsaU9wdGlvbnM6IGFueSk6IFByb21wdEhvb2tzID0+ICh7XG4gIGFzeW5jIG9uQ3JlYXRlUHJvamVjdChvcHRpb25zKTogUHJvbWlzZTxQcm9qZWN0PiB7XG4gICAgY29uc3QgYXBpS2V5ID0gY29uZmlnLmdldEF1dGgoKVxuICAgIGNvbnN0IHNwaW5uZXIgPSBvcmEocHJpbnRzLmNyZWF0aW5nRmlyc3RQcm9qZWN0KS5zdGFydCgpXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHByb2plY3QgPSBhd2FpdCBjcmVhdGVGaXJzdFByb2plY3QoeyBhcGlLZXksIG5hbWU6IG9wdGlvbnMubmFtZSwgaG9zdDogY2xpT3B0aW9ucy5hZG1pbkhvc3QgfSlcbiAgICAgIHNwaW5uZXIuc3VjY2VlZChwcmludHMuY3JlYXRlZEZpcnN0UHJvamVjdGAke3Byb2plY3QubmFtZX0gJHtwcm9qZWN0LmVudmlyb25tZW50c1swXS5uYW1lfWApXG4gICAgICByZXR1cm4gcHJvamVjdFxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNwaW5uZXIuZmFpbCgnT29wcywgd2UgY291bGQgbm90IGNyZWF0ZSB5b3UgYSBQcm9qZWN0JylcbiAgICB9XG4gIH0sXG4gIGFzeW5jIG9uQ3JlYXRlRW52KG9wdGlvbnMpOiBQcm9taXNlPEVudj4ge1xuICAgIGNvbnN0IHNwaW5uZXIgPSBvcmEocHJpbnRzLmNyZWF0aW5nRW52KS5zdGFydCgpXG4gICAgY29uc3QgYXBpS2V5ID0gY29uZmlnLmdldEF1dGgoKVxuXG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBhd2FpdCBjcmVhdGVFbnYoeyBhcGlLZXksIGhvc3Q6IGNsaU9wdGlvbnMuYWRtaW5Ib3N0LCBlbnZpcm9ubWVudDogb3B0aW9ucyB9KVxuXG4gICAgc3Bpbm5lci5zdWNjZWVkKHByaW50cy5jcmVhdGVkRW52KVxuICAgIHJldHVybiBlbnZpcm9ubWVudFxuICB9LFxufSlcblxuZXhwb3J0IGNvbnN0IGluaXQ6IENvbW1hbmRDb25maWcgPSB7XG4gIGNvbW1hbmQ6ICdpbml0JyxcbiAgZGVmYXVsdDogdHJ1ZSxcbiAgZGVzY3JpcHRpb246ICdDcmVhdGUgYSBuZXcgVGlwZSBwcm9qZWN0JyxcbiAgb3B0aW9uczogW1xuICAgIC4uLmdsb2JhbE9wdGlvbnMsXG4gICAge1xuICAgICAgb3B0aW9uOiAnLS1jb250ZW50SG9zdCBbY29udGVudEhvc3RdJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnY29udGVudCBhcGkgaG9zdCB0byB1c2UnLFxuICAgICAgY29uZmlnOiB7IHZhbGlkYXRvcjogcHJvZ3JhbS5TVFJJTkcgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG9wdGlvbjogJy0tYXNzZXRIb3N0IFthc3NldEhvc3RdJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnY29udGVudCBhcGkgaG9zdCB0byB1c2UnLFxuICAgICAgY29uZmlnOiB7IHZhbGlkYXRvcjogcHJvZ3JhbS5TVFJJTkcgfSxcbiAgICB9LFxuICBdLFxuICBhbGlhczogWycnXSxcbiAgYXN5bmMgYWN0aW9uKHsgb3B0aW9ucywgbG9nZ2VyIH0pIHtcbiAgICBjb25zb2xlLmxvZyhwcmludHMuaGVhZGVyKVxuICAgIGNvbnNvbGUubG9nKHByaW50cy5pbnRybylcblxuICAgIGxldCB1c2VyS2V5ID0gY29uZmlnLmdldEF1dGgoKVxuICAgIGxldCB2YWxpZEtleSA9IGZhbHNlXG5cbiAgICBpZiAodXNlcktleSkge1xuICAgICAgdmFsaWRLZXkgPSBhd2FpdCBjaGVja0FQSUtleSh7IGhvc3Q6IG9wdGlvbnMuYWRtaW5Ib3N0LCBhcGlLZXk6IHVzZXJLZXkgfSBhcyBhbnkpXG4gICAgfVxuXG4gICAgaWYgKCF1c2VyS2V5IHx8ICF2YWxpZEtleSkge1xuICAgICAgY29uc3Qgc3Bpbm5lciA9IG9yYShwcmludHMub3BlbmluZ0F1dGgpLnN0YXJ0KClcbiAgICAgIGNvbnN0IFtlcnJvciwgdG9rZW5dID0gYXdhaXQgYXN5bmNXcmFwKGdldEF1dGhUb2tlbih7IGhvc3Q6IG9wdGlvbnMuYWRtaW5Ib3N0IH0gYXMgYW55KSlcblxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBzcGlubmVyLmZhaWwocHJpbnRzLmF1dGhFcnJvcilcbiAgICAgIH1cblxuICAgICAgYXdhaXQgb3BlbkF1dGhXaW5kb3coeyB0b2tlbiwgaG9zdDogb3B0aW9ucy5hZG1pbkhvc3QgfSBhcyBhbnkpXG5cbiAgICAgIHNwaW5uZXIudGV4dCA9IHByaW50cy53YWl0aW5nRm9yQXV0aFxuICAgICAgY29uc3QgW3VzZXJFcnJvciwgdXNlcl0gPSBhd2FpdCBhc3luY1dyYXAoYXV0aGVudGljYXRlKHsgaG9zdDogb3B0aW9ucy5hZG1pbkhvc3QsIHRva2VuIH0gYXMgYW55KSlcblxuICAgICAgaWYgKHVzZXJFcnJvcikge1xuICAgICAgICByZXR1cm4gc3Bpbm5lci5mYWlsKHByaW50cy5hdXRoRXJyb3IpXG4gICAgICB9XG5cbiAgICAgIGNvbmZpZy5zZXRBdXRoKHVzZXIua2V5KVxuICAgICAgdXNlcktleSA9IHVzZXIua2V5XG4gICAgICBzcGlubmVyLnN1Y2NlZWQocHJpbnRzLmF1dGhlbnRpY2F0ZWRgJHt1c2VyLnVzZXIuZW1haWx9YClcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2cocHJpbnRzLmZvdW5kQXV0aClcbiAgICB9XG5cbiAgICBjb25zdCBzcGlubmVyID0gb3JhKHByaW50cy5nZXR0aW5nUHJvamVjdHMpLnN0YXJ0KClcbiAgICBsZXQgcHJvamVjdHNcblxuICAgIHRyeSB7XG4gICAgICBwcm9qZWN0cyA9IGF3YWl0IGdldFByb2plY3RzKHsgaG9zdDogb3B0aW9ucy5hZG1pbkhvc3QsIGFwaUtleTogdXNlcktleSB9IGFzIGFueSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzcGlubmVyLmZhaWwoJ09vcHMsIGNvdWxkIG5vdCBnZXQgeW91ciBwcm9qZWN0cy4nKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc3Bpbm5lci5zdWNjZWVkKHByaW50cy5wcm9qZWN0c0xvYWRlZClcblxuICAgIGNvbnN0IGFuc3dlcnMgPSBhd2FpdCBpbml0UHJvbXB0cyhwcm9qZWN0cywgcHJvbXB0SG9va3Mob3B0aW9ucykpXG4gICAgY29uc3QgZW52Q29uZmlnOiBhbnkgPSB7XG4gICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBwcm9qZWN0SWQ6IGFuc3dlcnMucHJvamVjdC5pZCxcbiAgICAgIGVudmlyb25tZW50OiBhbnN3ZXJzLmVudi5uYW1lLFxuICAgIH1cblxuICAgIGNvbnN0IGVudnMgPSBPYmplY3Qua2V5cyhlbnZDb25maWcpXG4gICAgICAuZmlsdGVyKGVudiA9PiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gZW52Q29uZmlnW2Vudl1cbiAgICAgICAgcmV0dXJuICEoZXhjbHVkZUVudklmRGVmYXVsdFtlbnZdICYmIHZhbHVlID09PSBkZWZhdWx0T3B0aW9uc1tlbnZdKVxuICAgICAgfSlcbiAgICAgIC5tYXAoZW52ID0+ICh7XG4gICAgICAgIG5hbWU6IGNvbnN0YW50Q2FzZShgVElQRV8ke2Vudn1gKS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICB2YWx1ZTogZW52Q29uZmlnW2Vudl0sXG4gICAgICB9KSlcblxuICAgIGxldCBpbnN0YWxsU3Bpbm5lclxuICAgIGxldCBlbnZFcnJvclxuICAgIGluc3RhbGxTcGlubmVyID0gb3JhKHByaW50cy5kZXRlY3RpbmdGcmFtZXdvcmspLnN0YXJ0KClcblxuICAgIGNvbnN0IHsgbW9kdWxlcywgbmFtZSB9ID0gYXdhaXQgZ2V0RnJhbWV3b3JrKClcblxuICAgIGlmIChuYW1lKSB7XG4gICAgICBpbnN0YWxsU3Bpbm5lci5zdWNjZWVkKGAke25hbWV9IGFwcCBkZXRlY3RlZGApXG4gICAgICBsZXQgc2NoZW1hTW9kdWxlc1xuXG4gICAgICB0cnkge1xuICAgICAgICBpbnN0YWxsU3Bpbm5lciA9IG9yYShgU2V0dGluZyB1cCB0aXBlIGZvciAke25hbWV9YCkuc3RhcnQoKVxuXG4gICAgICAgIGlmIChhbnN3ZXJzLndyaXRlRW52KSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgd3JpdGVFbnZzKGVudnMpXG4gICAgICAgICAgZW52RXJyb3IgPSByZXN1bHQuZXJyb3JcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IGNyZWF0ZVBhZ2VzKGVudkNvbmZpZylcbiAgICAgICAgYXdhaXQgY3JlYXRlUHJldmlld1JvdXRlcygpXG4gICAgICAgIHNjaGVtYU1vZHVsZXMgPSBhd2FpdCBjcmVhdGVUaXBlRm9sZGVyKClcbiAgICAgICAgaW5zdGFsbFNwaW5uZXIuc3VjY2VlZChgVGlwZSBzZXR1cCB3aXRoICR7bmFtZX1gKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICBpbnN0YWxsU3Bpbm5lci5mYWlsKCdDb3VsZCBub3Qgc2V0dXAgdGlwZSBpbnRlZ3JhdGlvbicpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBpbnN0YWxsU3Bpbm5lciA9IG9yYSgnSW5zdGFsbGluZyBtb2R1bGVzJykuc3RhcnQoKVxuICAgICAgICBhd2FpdCBpbnN0YWxsTW9kdWxlcyhbLi4ubW9kdWxlcywgLi4uc2NoZW1hTW9kdWxlc10pXG5cbiAgICAgICAgaW5zdGFsbFNwaW5uZXIuc3VjY2VlZCgnTW9kdWxlcyBpbnN0YWxsZWQnKVxuICAgICAgICBpZiAoIWFuc3dlcnMud3JpdGVFbnYgfHwgZW52RXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIHByaW50cy5kb25lKGBcbiAgQ29weSBhbmQgcGFzdGUgdGhlc2UgZW52IHZhcnMgaW50b1xuICB5b3VyIFwiLmVudi5sb2NhbFwiIG9yIFwiLmVudlwiIGZpbGVcbiAgXG4gICR7ZW52cy5tYXAoZW52ID0+IGBcXG4ke2Vudi5uYW1lfT0ke2Vudi52YWx1ZX1gKX1cbiAgYCksXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgIGluc3RhbGxTcGlubmVyLmZhaWwoJ0NvdWxkIG5vdCBpbnN0YWxsIG1vZHVsZXMnKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaW5zdGFsbFNwaW5uZXIud2FybihwcmludHMudW5zdXBwb3J0ZWRGcmFtZXdvcmtzKE9iamVjdC5rZXlzKGZyYW1ld29ya3MpLm1hcCgoZjogYW55KSA9PiBmcmFtZXdvcmtzW2ZdKSkpXG4gICAgfVxuICB9LFxufVxuIl19