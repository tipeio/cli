"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeEnvs = exports.getFramework = exports.isYarn = exports.isReact = exports.isNext = exports.isGatsby = exports.detect = exports.getFrameworkByName = exports.frameworks = exports.createTipeFolder = exports.createPreviewRoutes = exports.createPages = void 0;

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _templates = require("./templates");

var _prints = _interopRequireDefault(require("./prints"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const Pages = {
  IndexPage: 'index',
  DocsPage: 'docs',
  SigninPage: 'signin',
  EditorPage: 'editor',
  TypePage: 'types',
  MediaPage: 'assets'
};

const resolveToCWD = (...p) => _path.default.join(process.cwd(), ...p);

const hasTipeFolder = folder => _fsExtra.default.pathExists(resolveToCWD(folder));

const hasSchema = folder => _fsExtra.default.pathExists(resolveToCWD(folder, 'schema.js'));

const hasFieldsFolder = folder => _fsExtra.default.pathExists(resolveToCWD(folder, 'fields'));

const hasFields = folder => _fsExtra.default.pathExists(resolveToCWD(folder, 'fields', 'index.js'));

const normalizeUrl = url => url.replace(/^\/|\/$/g, '');

const createPages =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (options) {
    const schemaPath = '../../tipe/schema';
    const customFieldsPath = '../../tipe/fields';
    const mountPath = normalizeUrl(options.mountPath);

    try {
      yield _fsExtra.default.mkdir(resolveToCWD('/pages', mountPath));
    } catch (e) {}

    const pageOptions = _objectSpread({}, options, {
      customFieldsPath,
      schemaPath,
      mountPath
    });

    yield Promise.all(Object.entries(Pages).map(([editorPage, fileName]) => {
      const pathToFile = resolveToCWD('/pages', mountPath, `${fileName}.js`);
      const file = (0, _templates.pageTemplate)(editorPage, pageOptions);
      return _fsExtra.default.writeFile(pathToFile, file);
    }));
  });

  return function createPages(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.createPages = createPages;

const createPreviewRoutes =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* () {
    try {
      yield _fsExtra.default.mkdir(resolveToCWD('/pages/api'));
    } catch (e) {}

    return _fsExtra.default.writeFile(resolveToCWD('/pages/api', 'preview.js'), (0, _templates.previewRouteTemplate)());
  });

  return function createPreviewRoutes() {
    return _ref2.apply(this, arguments);
  };
}();

exports.createPreviewRoutes = createPreviewRoutes;

const createTipeFolder =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (folder = 'tipe') {
    const hasFolder = yield hasTipeFolder(folder);
    const deps = [];

    if (!hasFolder) {
      yield _fsExtra.default.mkdir(resolveToCWD(folder));
    }

    if (!(yield hasSchema(folder))) {
      yield _fsExtra.default.writeFile(resolveToCWD(folder, 'schema.js'), _templates.schemaTemplate.string);
      deps.push(..._templates.schemaTemplate.deps);
    }

    if (!(yield hasFieldsFolder(folder))) {
      yield _fsExtra.default.mkdir(resolveToCWD(folder, 'fields'));
    }

    if (!(yield hasFields(folder))) {
      yield _fsExtra.default.writeFile(resolveToCWD(folder, 'fields', 'index.js'), _templates.fieldsTemplate.string);
      deps.push(..._templates.fieldsTemplate.deps);
    }

    return deps;
  });

  return function createTipeFolder() {
    return _ref3.apply(this, arguments);
  };
}();

exports.createTipeFolder = createTipeFolder;
const frameworks = {
  gatsby: {
    name: 'Gatsby JS',
    lib: 'gatsby',
    supported: true,
    finalSteps: _prints.default.gatsbyJsDone,
    deps: ['@tipe/gatsby-source-plugin']
  },
  next: {
    name: 'Next JS',
    lib: 'next',
    supported: true,
    finalSteps: _prints.default.nextJsDone,
    deps: ['@tipe/next', '@tipe/react-editor']
  },
  react: {
    name: 'React',
    lib: 'react',
    supported: true,
    finalSteps: _prints.default.reactDone,
    deps: ['@tipe/react-editor']
  }
};
exports.frameworks = frameworks;

const getFrameworkByName = name => Object.keys(frameworks).map(f => frameworks[f]).find(f => f.name === name);

exports.getFrameworkByName = getFrameworkByName;

const userPjson = () => require(resolveToCWD('package.json'));

const detect = lib => {
  try {
    const pjson = userPjson();
    return Boolean(pjson.dependencies[lib]);
  } catch (e) {
    return false;
  }
};

exports.detect = detect;

const isGatsby = () => detect(frameworks.gatsby.lib);

exports.isGatsby = isGatsby;

const isNext = () => detect(frameworks.next.lib);

exports.isNext = isNext;

const isReact = () => detect(frameworks.react.lib);

exports.isReact = isReact;

const isYarn = () => _fsExtra.default.pathExists(resolveToCWD('yarn.lock'));

exports.isYarn = isYarn;

const getFramework =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(function* () {
    if (yield isNext()) {
      return {
        modules: frameworks.next.deps,
        name: frameworks.next.name
      };
    } else if (yield isGatsby()) {
      return {
        modules: frameworks.gatsby.deps,
        name: frameworks.gatsby.name
      };
    } else if (yield isReact()) {
      return {
        modules: frameworks.react.deps,
        name: frameworks.react.name
      };
    } else {
      return {
        modules: [],
        name: null
      };
    }
  });

  return function getFramework() {
    return _ref4.apply(this, arguments);
  };
}();

exports.getFramework = getFramework;

const writeEnvs =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(function* (envs) {
    const envString = '\n' + envs.map(env => `${env.name}=${env.value}`).join('\n');

    try {
      yield _fsExtra.default.appendFile(_path.default.join(process.cwd(), '.env.local'), envString);
      return {
        error: false
      };
    } catch (e) {
      try {
        yield _fsExtra.default.appendFile(_path.default.join(process.cwd(), '.env'), envString);
        return {
          error: false
        };
      } catch (e) {
        return {
          error: true
        };
      }
    }
  });

  return function writeEnvs(_x2) {
    return _ref5.apply(this, arguments);
  };
}();

exports.writeEnvs = writeEnvs;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kZXRlY3QudHMiXSwibmFtZXMiOlsiUGFnZXMiLCJJbmRleFBhZ2UiLCJEb2NzUGFnZSIsIlNpZ25pblBhZ2UiLCJFZGl0b3JQYWdlIiwiVHlwZVBhZ2UiLCJNZWRpYVBhZ2UiLCJyZXNvbHZlVG9DV0QiLCJwIiwicGF0aCIsImpvaW4iLCJwcm9jZXNzIiwiY3dkIiwiaGFzVGlwZUZvbGRlciIsImZvbGRlciIsImZzIiwicGF0aEV4aXN0cyIsImhhc1NjaGVtYSIsImhhc0ZpZWxkc0ZvbGRlciIsImhhc0ZpZWxkcyIsIm5vcm1hbGl6ZVVybCIsInVybCIsInJlcGxhY2UiLCJjcmVhdGVQYWdlcyIsIm9wdGlvbnMiLCJzY2hlbWFQYXRoIiwiY3VzdG9tRmllbGRzUGF0aCIsIm1vdW50UGF0aCIsIm1rZGlyIiwiZSIsInBhZ2VPcHRpb25zIiwiUHJvbWlzZSIsImFsbCIsIk9iamVjdCIsImVudHJpZXMiLCJtYXAiLCJlZGl0b3JQYWdlIiwiZmlsZU5hbWUiLCJwYXRoVG9GaWxlIiwiZmlsZSIsIndyaXRlRmlsZSIsImNyZWF0ZVByZXZpZXdSb3V0ZXMiLCJjcmVhdGVUaXBlRm9sZGVyIiwiaGFzRm9sZGVyIiwiZGVwcyIsInNjaGVtYVRlbXBsYXRlIiwic3RyaW5nIiwicHVzaCIsImZpZWxkc1RlbXBsYXRlIiwiZnJhbWV3b3JrcyIsImdhdHNieSIsIm5hbWUiLCJsaWIiLCJzdXBwb3J0ZWQiLCJmaW5hbFN0ZXBzIiwicHJpbnRzIiwiZ2F0c2J5SnNEb25lIiwibmV4dCIsIm5leHRKc0RvbmUiLCJyZWFjdCIsInJlYWN0RG9uZSIsImdldEZyYW1ld29ya0J5TmFtZSIsImtleXMiLCJmIiwiZmluZCIsInVzZXJQanNvbiIsInJlcXVpcmUiLCJkZXRlY3QiLCJwanNvbiIsIkJvb2xlYW4iLCJkZXBlbmRlbmNpZXMiLCJpc0dhdHNieSIsImlzTmV4dCIsImlzUmVhY3QiLCJpc1lhcm4iLCJnZXRGcmFtZXdvcmsiLCJtb2R1bGVzIiwid3JpdGVFbnZzIiwiZW52cyIsImVudlN0cmluZyIsImVudiIsInZhbHVlIiwiYXBwZW5kRmlsZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsTUFBTUEsS0FBSyxHQUFHO0FBQ1pDLEVBQUFBLFNBQVMsRUFBRSxPQURDO0FBRVpDLEVBQUFBLFFBQVEsRUFBRSxNQUZFO0FBR1pDLEVBQUFBLFVBQVUsRUFBRSxRQUhBO0FBSVpDLEVBQUFBLFVBQVUsRUFBRSxRQUpBO0FBS1pDLEVBQUFBLFFBQVEsRUFBRSxPQUxFO0FBTVpDLEVBQUFBLFNBQVMsRUFBRTtBQU5DLENBQWQ7O0FBU0EsTUFBTUMsWUFBWSxHQUFHLENBQUMsR0FBR0MsQ0FBSixLQUE0QkMsY0FBS0MsSUFBTCxDQUFVQyxPQUFPLENBQUNDLEdBQVIsRUFBVixFQUF5QixHQUFHSixDQUE1QixDQUFqRDs7QUFDQSxNQUFNSyxhQUFhLEdBQUlDLE1BQUQsSUFBb0JDLGlCQUFHQyxVQUFILENBQWNULFlBQVksQ0FBQ08sTUFBRCxDQUExQixDQUExQzs7QUFDQSxNQUFNRyxTQUFTLEdBQUlILE1BQUQsSUFBb0JDLGlCQUFHQyxVQUFILENBQWNULFlBQVksQ0FBQ08sTUFBRCxFQUFTLFdBQVQsQ0FBMUIsQ0FBdEM7O0FBQ0EsTUFBTUksZUFBZSxHQUFJSixNQUFELElBQW9CQyxpQkFBR0MsVUFBSCxDQUFjVCxZQUFZLENBQUNPLE1BQUQsRUFBUyxRQUFULENBQTFCLENBQTVDOztBQUNBLE1BQU1LLFNBQVMsR0FBSUwsTUFBRCxJQUFvQkMsaUJBQUdDLFVBQUgsQ0FBY1QsWUFBWSxDQUFDTyxNQUFELEVBQVMsUUFBVCxFQUFtQixVQUFuQixDQUExQixDQUF0Qzs7QUFDQSxNQUFNTSxZQUFZLEdBQUlDLEdBQUQsSUFBaUJBLEdBQUcsQ0FBQ0MsT0FBSixDQUFZLFVBQVosRUFBd0IsRUFBeEIsQ0FBdEM7O0FBRU8sTUFBTUMsV0FBVztBQUFBO0FBQUE7QUFBQSwrQkFBRyxXQUFNQyxPQUFOLEVBQWlCO0FBQzFDLFVBQU1DLFVBQVUsR0FBRyxtQkFBbkI7QUFDQSxVQUFNQyxnQkFBZ0IsR0FBRyxtQkFBekI7QUFDQSxVQUFNQyxTQUFTLEdBQUdQLFlBQVksQ0FBQ0ksT0FBTyxDQUFDRyxTQUFULENBQTlCOztBQUVBLFFBQUk7QUFDRixZQUFNWixpQkFBR2EsS0FBSCxDQUFTckIsWUFBWSxDQUFDLFFBQUQsRUFBV29CLFNBQVgsQ0FBckIsQ0FBTjtBQUNELEtBRkQsQ0FFRSxPQUFPRSxDQUFQLEVBQVUsQ0FBRTs7QUFFZCxVQUFNQyxXQUFXLHFCQUNaTixPQURZO0FBRWZFLE1BQUFBLGdCQUZlO0FBR2ZELE1BQUFBLFVBSGU7QUFJZkUsTUFBQUE7QUFKZSxNQUFqQjs7QUFPQSxVQUFNSSxPQUFPLENBQUNDLEdBQVIsQ0FDSkMsTUFBTSxDQUFDQyxPQUFQLENBQWVsQyxLQUFmLEVBQXNCbUMsR0FBdEIsQ0FBMEIsQ0FBQyxDQUFDQyxVQUFELEVBQWFDLFFBQWIsQ0FBRCxLQUE0QjtBQUNwRCxZQUFNQyxVQUFVLEdBQUcvQixZQUFZLENBQUMsUUFBRCxFQUFXb0IsU0FBWCxFQUF1QixHQUFFVSxRQUFTLEtBQWxDLENBQS9CO0FBQ0EsWUFBTUUsSUFBSSxHQUFHLDZCQUFhSCxVQUFiLEVBQXlCTixXQUF6QixDQUFiO0FBRUEsYUFBT2YsaUJBQUd5QixTQUFILENBQWFGLFVBQWIsRUFBeUJDLElBQXpCLENBQVA7QUFDRCxLQUxELENBREksQ0FBTjtBQVFELEdBeEJ1Qjs7QUFBQSxrQkFBWGhCLFdBQVc7QUFBQTtBQUFBO0FBQUEsR0FBakI7Ozs7QUEwQkEsTUFBTWtCLG1CQUFtQjtBQUFBO0FBQUE7QUFBQSxnQ0FBRyxhQUEwQjtBQUMzRCxRQUFJO0FBQ0YsWUFBTTFCLGlCQUFHYSxLQUFILENBQVNyQixZQUFZLENBQUMsWUFBRCxDQUFyQixDQUFOO0FBQ0QsS0FGRCxDQUVFLE9BQU9zQixDQUFQLEVBQVUsQ0FBRTs7QUFDZCxXQUFPZCxpQkFBR3lCLFNBQUgsQ0FBYWpDLFlBQVksQ0FBQyxZQUFELEVBQWUsWUFBZixDQUF6QixFQUF1RCxzQ0FBdkQsQ0FBUDtBQUNELEdBTCtCOztBQUFBLGtCQUFuQmtDLG1CQUFtQjtBQUFBO0FBQUE7QUFBQSxHQUF6Qjs7OztBQU9BLE1BQU1DLGdCQUFnQjtBQUFBO0FBQUE7QUFBQSxnQ0FBRyxXQUFPNUIsTUFBTSxHQUFHLE1BQWhCLEVBQXlDO0FBQ3ZFLFVBQU02QixTQUFTLFNBQVM5QixhQUFhLENBQUNDLE1BQUQsQ0FBckM7QUFDQSxVQUFNOEIsSUFBSSxHQUFHLEVBQWI7O0FBRUEsUUFBSSxDQUFDRCxTQUFMLEVBQWdCO0FBQ2QsWUFBTTVCLGlCQUFHYSxLQUFILENBQVNyQixZQUFZLENBQUNPLE1BQUQsQ0FBckIsQ0FBTjtBQUNEOztBQUVELFFBQUksUUFBUUcsU0FBUyxDQUFDSCxNQUFELENBQWpCLENBQUosRUFBZ0M7QUFDOUIsWUFBTUMsaUJBQUd5QixTQUFILENBQWFqQyxZQUFZLENBQUNPLE1BQUQsRUFBUyxXQUFULENBQXpCLEVBQWdEK0IsMEJBQWVDLE1BQS9ELENBQU47QUFDQUYsTUFBQUEsSUFBSSxDQUFDRyxJQUFMLENBQVUsR0FBR0YsMEJBQWVELElBQTVCO0FBQ0Q7O0FBRUQsUUFBSSxRQUFRMUIsZUFBZSxDQUFDSixNQUFELENBQXZCLENBQUosRUFBc0M7QUFDcEMsWUFBTUMsaUJBQUdhLEtBQUgsQ0FBU3JCLFlBQVksQ0FBQ08sTUFBRCxFQUFTLFFBQVQsQ0FBckIsQ0FBTjtBQUNEOztBQUVELFFBQUksUUFBUUssU0FBUyxDQUFDTCxNQUFELENBQWpCLENBQUosRUFBZ0M7QUFDOUIsWUFBTUMsaUJBQUd5QixTQUFILENBQWFqQyxZQUFZLENBQUNPLE1BQUQsRUFBUyxRQUFULEVBQW1CLFVBQW5CLENBQXpCLEVBQXlEa0MsMEJBQWVGLE1BQXhFLENBQU47QUFDQUYsTUFBQUEsSUFBSSxDQUFDRyxJQUFMLENBQVUsR0FBR0MsMEJBQWVKLElBQTVCO0FBQ0Q7O0FBRUQsV0FBT0EsSUFBUDtBQUNELEdBdkI0Qjs7QUFBQSxrQkFBaEJGLGdCQUFnQjtBQUFBO0FBQUE7QUFBQSxHQUF0Qjs7O0FBeUJBLE1BQU1PLFVBQXNCLEdBQUc7QUFDcENDLEVBQUFBLE1BQU0sRUFBRTtBQUNOQyxJQUFBQSxJQUFJLEVBQUUsV0FEQTtBQUVOQyxJQUFBQSxHQUFHLEVBQUUsUUFGQztBQUdOQyxJQUFBQSxTQUFTLEVBQUUsSUFITDtBQUlOQyxJQUFBQSxVQUFVLEVBQUVDLGdCQUFPQyxZQUpiO0FBS05aLElBQUFBLElBQUksRUFBRSxDQUFDLDRCQUFEO0FBTEEsR0FENEI7QUFRcENhLEVBQUFBLElBQUksRUFBRTtBQUNKTixJQUFBQSxJQUFJLEVBQUUsU0FERjtBQUVKQyxJQUFBQSxHQUFHLEVBQUUsTUFGRDtBQUdKQyxJQUFBQSxTQUFTLEVBQUUsSUFIUDtBQUlKQyxJQUFBQSxVQUFVLEVBQUVDLGdCQUFPRyxVQUpmO0FBS0pkLElBQUFBLElBQUksRUFBRSxDQUFDLFlBQUQsRUFBZSxvQkFBZjtBQUxGLEdBUjhCO0FBZXBDZSxFQUFBQSxLQUFLLEVBQUU7QUFDTFIsSUFBQUEsSUFBSSxFQUFFLE9BREQ7QUFFTEMsSUFBQUEsR0FBRyxFQUFFLE9BRkE7QUFHTEMsSUFBQUEsU0FBUyxFQUFFLElBSE47QUFJTEMsSUFBQUEsVUFBVSxFQUFFQyxnQkFBT0ssU0FKZDtBQUtMaEIsSUFBQUEsSUFBSSxFQUFFLENBQUMsb0JBQUQ7QUFMRDtBQWY2QixDQUEvQjs7O0FBd0JBLE1BQU1pQixrQkFBa0IsR0FBSVYsSUFBRCxJQUNoQ2xCLE1BQU0sQ0FBQzZCLElBQVAsQ0FBWWIsVUFBWixFQUNHZCxHQURILENBQ080QixDQUFDLElBQUlkLFVBQVUsQ0FBQ2MsQ0FBRCxDQUR0QixFQUVHQyxJQUZILENBRVFELENBQUMsSUFBSUEsQ0FBQyxDQUFDWixJQUFGLEtBQVdBLElBRnhCLENBREs7Ozs7QUFLUCxNQUFNYyxTQUFTLEdBQUcsTUFBV0MsT0FBTyxDQUFDM0QsWUFBWSxDQUFDLGNBQUQsQ0FBYixDQUFwQzs7QUFFTyxNQUFNNEQsTUFBTSxHQUFJZixHQUFELElBQTZCO0FBQ2pELE1BQUk7QUFDRixVQUFNZ0IsS0FBSyxHQUFHSCxTQUFTLEVBQXZCO0FBQ0EsV0FBT0ksT0FBTyxDQUFDRCxLQUFLLENBQUNFLFlBQU4sQ0FBbUJsQixHQUFuQixDQUFELENBQWQ7QUFDRCxHQUhELENBR0UsT0FBT3ZCLENBQVAsRUFBVTtBQUNWLFdBQU8sS0FBUDtBQUNEO0FBQ0YsQ0FQTTs7OztBQVNBLE1BQU0wQyxRQUFRLEdBQUcsTUFBZUosTUFBTSxDQUFDbEIsVUFBVSxDQUFDQyxNQUFYLENBQWtCRSxHQUFuQixDQUF0Qzs7OztBQUNBLE1BQU1vQixNQUFNLEdBQUcsTUFBZUwsTUFBTSxDQUFDbEIsVUFBVSxDQUFDUSxJQUFYLENBQWdCTCxHQUFqQixDQUFwQzs7OztBQUNBLE1BQU1xQixPQUFPLEdBQUcsTUFBZU4sTUFBTSxDQUFDbEIsVUFBVSxDQUFDVSxLQUFYLENBQWlCUCxHQUFsQixDQUFyQzs7OztBQUNBLE1BQU1zQixNQUFNLEdBQUcsTUFBd0IzRCxpQkFBR0MsVUFBSCxDQUFjVCxZQUFZLENBQUMsV0FBRCxDQUExQixDQUF2Qzs7OztBQUVBLE1BQU1vRSxZQUFZO0FBQUE7QUFBQTtBQUFBLGdDQUFHLGFBQVk7QUFDdEMsY0FBVUgsTUFBTSxFQUFoQixFQUFvQjtBQUNsQixhQUFPO0FBQUVJLFFBQUFBLE9BQU8sRUFBRTNCLFVBQVUsQ0FBQ1EsSUFBWCxDQUFnQmIsSUFBM0I7QUFBaUNPLFFBQUFBLElBQUksRUFBRUYsVUFBVSxDQUFDUSxJQUFYLENBQWdCTjtBQUF2RCxPQUFQO0FBQ0QsS0FGRCxNQUVPLFVBQVVvQixRQUFRLEVBQWxCLEVBQXNCO0FBQzNCLGFBQU87QUFBRUssUUFBQUEsT0FBTyxFQUFFM0IsVUFBVSxDQUFDQyxNQUFYLENBQWtCTixJQUE3QjtBQUFtQ08sUUFBQUEsSUFBSSxFQUFFRixVQUFVLENBQUNDLE1BQVgsQ0FBa0JDO0FBQTNELE9BQVA7QUFDRCxLQUZNLE1BRUEsVUFBVXNCLE9BQU8sRUFBakIsRUFBcUI7QUFDMUIsYUFBTztBQUFFRyxRQUFBQSxPQUFPLEVBQUUzQixVQUFVLENBQUNVLEtBQVgsQ0FBaUJmLElBQTVCO0FBQWtDTyxRQUFBQSxJQUFJLEVBQUVGLFVBQVUsQ0FBQ1UsS0FBWCxDQUFpQlI7QUFBekQsT0FBUDtBQUNELEtBRk0sTUFFQTtBQUNMLGFBQU87QUFBRXlCLFFBQUFBLE9BQU8sRUFBRSxFQUFYO0FBQWV6QixRQUFBQSxJQUFJLEVBQUU7QUFBckIsT0FBUDtBQUNEO0FBQ0YsR0FWd0I7O0FBQUEsa0JBQVp3QixZQUFZO0FBQUE7QUFBQTtBQUFBLEdBQWxCOzs7O0FBWUEsTUFBTUUsU0FBUztBQUFBO0FBQUE7QUFBQSxnQ0FBRyxXQUFPQyxJQUFQLEVBQTZFO0FBQ3BHLFVBQU1DLFNBQVMsR0FBRyxPQUFPRCxJQUFJLENBQUMzQyxHQUFMLENBQVM2QyxHQUFHLElBQUssR0FBRUEsR0FBRyxDQUFDN0IsSUFBSyxJQUFHNkIsR0FBRyxDQUFDQyxLQUFNLEVBQXpDLEVBQTRDdkUsSUFBNUMsQ0FBaUQsSUFBakQsQ0FBekI7O0FBRUEsUUFBSTtBQUNGLFlBQU1LLGlCQUFHbUUsVUFBSCxDQUFjekUsY0FBS0MsSUFBTCxDQUFVQyxPQUFPLENBQUNDLEdBQVIsRUFBVixFQUF5QixZQUF6QixDQUFkLEVBQXNEbUUsU0FBdEQsQ0FBTjtBQUNBLGFBQU87QUFBRUksUUFBQUEsS0FBSyxFQUFFO0FBQVQsT0FBUDtBQUNELEtBSEQsQ0FHRSxPQUFPdEQsQ0FBUCxFQUFVO0FBQ1YsVUFBSTtBQUNGLGNBQU1kLGlCQUFHbUUsVUFBSCxDQUFjekUsY0FBS0MsSUFBTCxDQUFVQyxPQUFPLENBQUNDLEdBQVIsRUFBVixFQUF5QixNQUF6QixDQUFkLEVBQWdEbUUsU0FBaEQsQ0FBTjtBQUNBLGVBQU87QUFDTEksVUFBQUEsS0FBSyxFQUFFO0FBREYsU0FBUDtBQUdELE9BTEQsQ0FLRSxPQUFPdEQsQ0FBUCxFQUFVO0FBQ1YsZUFBTztBQUNMc0QsVUFBQUEsS0FBSyxFQUFFO0FBREYsU0FBUDtBQUdEO0FBQ0Y7QUFDRixHQWxCcUI7O0FBQUEsa0JBQVROLFNBQVM7QUFBQTtBQUFBO0FBQUEsR0FBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnXG5pbXBvcnQgeyBGcmFtZXdvcmtzLCBGcmFtZXdvcmsgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB7IHNjaGVtYVRlbXBsYXRlLCBmaWVsZHNUZW1wbGF0ZSwgcGFnZVRlbXBsYXRlLCBwcmV2aWV3Um91dGVUZW1wbGF0ZSB9IGZyb20gJy4vdGVtcGxhdGVzJ1xuaW1wb3J0IHByaW50cyBmcm9tICcuL3ByaW50cydcblxuY29uc3QgUGFnZXMgPSB7XG4gIEluZGV4UGFnZTogJ2luZGV4JyxcbiAgRG9jc1BhZ2U6ICdkb2NzJyxcbiAgU2lnbmluUGFnZTogJ3NpZ25pbicsXG4gIEVkaXRvclBhZ2U6ICdlZGl0b3InLFxuICBUeXBlUGFnZTogJ3R5cGVzJyxcbiAgTWVkaWFQYWdlOiAnYXNzZXRzJyxcbn1cblxuY29uc3QgcmVzb2x2ZVRvQ1dEID0gKC4uLnA6IHN0cmluZ1tdKTogc3RyaW5nID0+IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAuLi5wKVxuY29uc3QgaGFzVGlwZUZvbGRlciA9IChmb2xkZXI6IHN0cmluZykgPT4gZnMucGF0aEV4aXN0cyhyZXNvbHZlVG9DV0QoZm9sZGVyKSlcbmNvbnN0IGhhc1NjaGVtYSA9IChmb2xkZXI6IHN0cmluZykgPT4gZnMucGF0aEV4aXN0cyhyZXNvbHZlVG9DV0QoZm9sZGVyLCAnc2NoZW1hLmpzJykpXG5jb25zdCBoYXNGaWVsZHNGb2xkZXIgPSAoZm9sZGVyOiBzdHJpbmcpID0+IGZzLnBhdGhFeGlzdHMocmVzb2x2ZVRvQ1dEKGZvbGRlciwgJ2ZpZWxkcycpKVxuY29uc3QgaGFzRmllbGRzID0gKGZvbGRlcjogc3RyaW5nKSA9PiBmcy5wYXRoRXhpc3RzKHJlc29sdmVUb0NXRChmb2xkZXIsICdmaWVsZHMnLCAnaW5kZXguanMnKSlcbmNvbnN0IG5vcm1hbGl6ZVVybCA9ICh1cmw6IHN0cmluZykgPT4gdXJsLnJlcGxhY2UoL15cXC98XFwvJC9nLCAnJylcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVBhZ2VzID0gYXN5bmMgb3B0aW9ucyA9PiB7XG4gIGNvbnN0IHNjaGVtYVBhdGggPSAnLi4vLi4vdGlwZS9zY2hlbWEnXG4gIGNvbnN0IGN1c3RvbUZpZWxkc1BhdGggPSAnLi4vLi4vdGlwZS9maWVsZHMnXG4gIGNvbnN0IG1vdW50UGF0aCA9IG5vcm1hbGl6ZVVybChvcHRpb25zLm1vdW50UGF0aClcblxuICB0cnkge1xuICAgIGF3YWl0IGZzLm1rZGlyKHJlc29sdmVUb0NXRCgnL3BhZ2VzJywgbW91bnRQYXRoKSlcbiAgfSBjYXRjaCAoZSkge31cblxuICBjb25zdCBwYWdlT3B0aW9ucyA9IHtcbiAgICAuLi5vcHRpb25zLFxuICAgIGN1c3RvbUZpZWxkc1BhdGgsXG4gICAgc2NoZW1hUGF0aCxcbiAgICBtb3VudFBhdGgsXG4gIH1cblxuICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBPYmplY3QuZW50cmllcyhQYWdlcykubWFwKChbZWRpdG9yUGFnZSwgZmlsZU5hbWVdKSA9PiB7XG4gICAgICBjb25zdCBwYXRoVG9GaWxlID0gcmVzb2x2ZVRvQ1dEKCcvcGFnZXMnLCBtb3VudFBhdGgsIGAke2ZpbGVOYW1lfS5qc2ApXG4gICAgICBjb25zdCBmaWxlID0gcGFnZVRlbXBsYXRlKGVkaXRvclBhZ2UsIHBhZ2VPcHRpb25zKVxuXG4gICAgICByZXR1cm4gZnMud3JpdGVGaWxlKHBhdGhUb0ZpbGUsIGZpbGUpXG4gICAgfSksXG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVByZXZpZXdSb3V0ZXMgPSBhc3luYyAoKTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgdHJ5IHtcbiAgICBhd2FpdCBmcy5ta2RpcihyZXNvbHZlVG9DV0QoJy9wYWdlcy9hcGknKSlcbiAgfSBjYXRjaCAoZSkge31cbiAgcmV0dXJuIGZzLndyaXRlRmlsZShyZXNvbHZlVG9DV0QoJy9wYWdlcy9hcGknLCAncHJldmlldy5qcycpLCBwcmV2aWV3Um91dGVUZW1wbGF0ZSgpKVxufVxuXG5leHBvcnQgY29uc3QgY3JlYXRlVGlwZUZvbGRlciA9IGFzeW5jIChmb2xkZXIgPSAndGlwZScpOiBQcm9taXNlPGFueT4gPT4ge1xuICBjb25zdCBoYXNGb2xkZXIgPSBhd2FpdCBoYXNUaXBlRm9sZGVyKGZvbGRlcilcbiAgY29uc3QgZGVwcyA9IFtdXG5cbiAgaWYgKCFoYXNGb2xkZXIpIHtcbiAgICBhd2FpdCBmcy5ta2RpcihyZXNvbHZlVG9DV0QoZm9sZGVyKSlcbiAgfVxuXG4gIGlmICghKGF3YWl0IGhhc1NjaGVtYShmb2xkZXIpKSkge1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShyZXNvbHZlVG9DV0QoZm9sZGVyLCAnc2NoZW1hLmpzJyksIHNjaGVtYVRlbXBsYXRlLnN0cmluZylcbiAgICBkZXBzLnB1c2goLi4uc2NoZW1hVGVtcGxhdGUuZGVwcylcbiAgfVxuXG4gIGlmICghKGF3YWl0IGhhc0ZpZWxkc0ZvbGRlcihmb2xkZXIpKSkge1xuICAgIGF3YWl0IGZzLm1rZGlyKHJlc29sdmVUb0NXRChmb2xkZXIsICdmaWVsZHMnKSlcbiAgfVxuXG4gIGlmICghKGF3YWl0IGhhc0ZpZWxkcyhmb2xkZXIpKSkge1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShyZXNvbHZlVG9DV0QoZm9sZGVyLCAnZmllbGRzJywgJ2luZGV4LmpzJyksIGZpZWxkc1RlbXBsYXRlLnN0cmluZylcbiAgICBkZXBzLnB1c2goLi4uZmllbGRzVGVtcGxhdGUuZGVwcylcbiAgfVxuXG4gIHJldHVybiBkZXBzXG59XG5cbmV4cG9ydCBjb25zdCBmcmFtZXdvcmtzOiBGcmFtZXdvcmtzID0ge1xuICBnYXRzYnk6IHtcbiAgICBuYW1lOiAnR2F0c2J5IEpTJyxcbiAgICBsaWI6ICdnYXRzYnknLFxuICAgIHN1cHBvcnRlZDogdHJ1ZSxcbiAgICBmaW5hbFN0ZXBzOiBwcmludHMuZ2F0c2J5SnNEb25lLFxuICAgIGRlcHM6IFsnQHRpcGUvZ2F0c2J5LXNvdXJjZS1wbHVnaW4nXSxcbiAgfSxcbiAgbmV4dDoge1xuICAgIG5hbWU6ICdOZXh0IEpTJyxcbiAgICBsaWI6ICduZXh0JyxcbiAgICBzdXBwb3J0ZWQ6IHRydWUsXG4gICAgZmluYWxTdGVwczogcHJpbnRzLm5leHRKc0RvbmUsXG4gICAgZGVwczogWydAdGlwZS9uZXh0JywgJ0B0aXBlL3JlYWN0LWVkaXRvciddLFxuICB9LFxuICByZWFjdDoge1xuICAgIG5hbWU6ICdSZWFjdCcsXG4gICAgbGliOiAncmVhY3QnLFxuICAgIHN1cHBvcnRlZDogdHJ1ZSxcbiAgICBmaW5hbFN0ZXBzOiBwcmludHMucmVhY3REb25lLFxuICAgIGRlcHM6IFsnQHRpcGUvcmVhY3QtZWRpdG9yJ10sXG4gIH0sXG59XG5cbmV4cG9ydCBjb25zdCBnZXRGcmFtZXdvcmtCeU5hbWUgPSAobmFtZTogc3RyaW5nKSA9PlxuICBPYmplY3Qua2V5cyhmcmFtZXdvcmtzKVxuICAgIC5tYXAoZiA9PiBmcmFtZXdvcmtzW2ZdKVxuICAgIC5maW5kKGYgPT4gZi5uYW1lID09PSBuYW1lKVxuXG5jb25zdCB1c2VyUGpzb24gPSAoKTogYW55ID0+IHJlcXVpcmUocmVzb2x2ZVRvQ1dEKCdwYWNrYWdlLmpzb24nKSlcblxuZXhwb3J0IGNvbnN0IGRldGVjdCA9IChsaWI6IEZyYW1ld29yayk6IGJvb2xlYW4gPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHBqc29uID0gdXNlclBqc29uKClcbiAgICByZXR1cm4gQm9vbGVhbihwanNvbi5kZXBlbmRlbmNpZXNbbGliXSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBpc0dhdHNieSA9ICgpOiBib29sZWFuID0+IGRldGVjdChmcmFtZXdvcmtzLmdhdHNieS5saWIpXG5leHBvcnQgY29uc3QgaXNOZXh0ID0gKCk6IGJvb2xlYW4gPT4gZGV0ZWN0KGZyYW1ld29ya3MubmV4dC5saWIpXG5leHBvcnQgY29uc3QgaXNSZWFjdCA9ICgpOiBib29sZWFuID0+IGRldGVjdChmcmFtZXdvcmtzLnJlYWN0LmxpYilcbmV4cG9ydCBjb25zdCBpc1lhcm4gPSAoKTogUHJvbWlzZTxib29sZWFuPiA9PiBmcy5wYXRoRXhpc3RzKHJlc29sdmVUb0NXRCgneWFybi5sb2NrJykpXG5cbmV4cG9ydCBjb25zdCBnZXRGcmFtZXdvcmsgPSBhc3luYyAoKSA9PiB7XG4gIGlmIChhd2FpdCBpc05leHQoKSkge1xuICAgIHJldHVybiB7IG1vZHVsZXM6IGZyYW1ld29ya3MubmV4dC5kZXBzLCBuYW1lOiBmcmFtZXdvcmtzLm5leHQubmFtZSB9XG4gIH0gZWxzZSBpZiAoYXdhaXQgaXNHYXRzYnkoKSkge1xuICAgIHJldHVybiB7IG1vZHVsZXM6IGZyYW1ld29ya3MuZ2F0c2J5LmRlcHMsIG5hbWU6IGZyYW1ld29ya3MuZ2F0c2J5Lm5hbWUgfVxuICB9IGVsc2UgaWYgKGF3YWl0IGlzUmVhY3QoKSkge1xuICAgIHJldHVybiB7IG1vZHVsZXM6IGZyYW1ld29ya3MucmVhY3QuZGVwcywgbmFtZTogZnJhbWV3b3Jrcy5yZWFjdC5uYW1lIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4geyBtb2R1bGVzOiBbXSwgbmFtZTogbnVsbCB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHdyaXRlRW52cyA9IGFzeW5jIChlbnZzOiB7IG5hbWU6IHN0cmluZzsgdmFsdWU6IGFueSB9W10pOiBQcm9taXNlPHsgZXJyb3I6IGJvb2xlYW4gfT4gPT4ge1xuICBjb25zdCBlbnZTdHJpbmcgPSAnXFxuJyArIGVudnMubWFwKGVudiA9PiBgJHtlbnYubmFtZX09JHtlbnYudmFsdWV9YCkuam9pbignXFxuJylcblxuICB0cnkge1xuICAgIGF3YWl0IGZzLmFwcGVuZEZpbGUocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICcuZW52LmxvY2FsJyksIGVudlN0cmluZylcbiAgICByZXR1cm4geyBlcnJvcjogZmFsc2UgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGZzLmFwcGVuZEZpbGUocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICcuZW52JyksIGVudlN0cmluZylcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVycm9yOiBmYWxzZSxcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==