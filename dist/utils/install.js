"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installModules = exports.repoInstall = exports.npmInstall = exports.yarnInstall = void 0;

var _crossSpawn = _interopRequireDefault(require("cross-spawn"));

var _detect = require("./detect");

var _downloadGitRepo = _interopRequireDefault(require("download-git-repo"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const spawnStdio = ['pipe', 'pipe', 'pipe'];

const addDeps = libs => {
  const psjonPath = _path.default.join(process.cwd(), 'package.json');

  const pjson = JSON.parse(_fs.default.readFileSync(psjonPath, {
    encoding: 'utf-8'
  }).toString());
  libs.forEach(lib => pjson.dependencies[lib] = '*');

  _fs.default.writeFileSync(psjonPath, JSON.stringify(pjson, null, 2));
};

const yarnInstall = libs => new Promise((resolve, reject) => {
  addDeps(libs);
  const child = (0, _crossSpawn.default)('yarn', {
    stdio: spawnStdio
  });
  child.on('close', code => {
    if (code !== 0) {
      reject();
    } else {
      resolve();
    }
  });
});

exports.yarnInstall = yarnInstall;

const npmInstall = libs => new Promise((resolve, reject) => {
  addDeps(libs);
  const child = (0, _crossSpawn.default)('npm', {
    stdio: spawnStdio
  });
  child.on('close', code => {
    if (code !== 0) {
      reject();
    } else {
      resolve();
    }
  });
});

exports.npmInstall = npmInstall;

const repoInstall = (repo, where) => new Promise((resolve, reject) => {
  (0, _downloadGitRepo.default)(repo, where, e => {
    if (e) reject(e);
    resolve();
  });
});

exports.repoInstall = repoInstall;

const installModules =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (libs) {
    const yarn = yield (0, _detect.isYarn)(); // TODO: create prompt

    if (yarn) return yarnInstall(libs);
    return npmInstall(libs);
  });

  return function installModules(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.installModules = installModules;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9pbnN0YWxsLnRzIl0sIm5hbWVzIjpbInNwYXduU3RkaW8iLCJhZGREZXBzIiwibGlicyIsInBzam9uUGF0aCIsInBhdGgiLCJqb2luIiwicHJvY2VzcyIsImN3ZCIsInBqc29uIiwiSlNPTiIsInBhcnNlIiwiZnMiLCJyZWFkRmlsZVN5bmMiLCJlbmNvZGluZyIsInRvU3RyaW5nIiwiZm9yRWFjaCIsImxpYiIsImRlcGVuZGVuY2llcyIsIndyaXRlRmlsZVN5bmMiLCJzdHJpbmdpZnkiLCJ5YXJuSW5zdGFsbCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY2hpbGQiLCJzdGRpbyIsIm9uIiwiY29kZSIsIm5wbUluc3RhbGwiLCJyZXBvSW5zdGFsbCIsInJlcG8iLCJ3aGVyZSIsImUiLCJpbnN0YWxsTW9kdWxlcyIsInlhcm4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxNQUFNQSxVQUFpQixHQUFHLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsTUFBakIsQ0FBMUI7O0FBQ0EsTUFBTUMsT0FBTyxHQUFHQyxJQUFJLElBQUk7QUFDdEIsUUFBTUMsU0FBUyxHQUFHQyxjQUFLQyxJQUFMLENBQVVDLE9BQU8sQ0FBQ0MsR0FBUixFQUFWLEVBQXlCLGNBQXpCLENBQWxCOztBQUNBLFFBQU1DLEtBQUssR0FBR0MsSUFBSSxDQUFDQyxLQUFMLENBQVdDLFlBQUdDLFlBQUgsQ0FBZ0JULFNBQWhCLEVBQTJCO0FBQUVVLElBQUFBLFFBQVEsRUFBRTtBQUFaLEdBQTNCLEVBQWtEQyxRQUFsRCxFQUFYLENBQWQ7QUFFQVosRUFBQUEsSUFBSSxDQUFDYSxPQUFMLENBQWFDLEdBQUcsSUFBS1IsS0FBSyxDQUFDUyxZQUFOLENBQW1CRCxHQUFuQixJQUEwQixHQUEvQzs7QUFFQUwsY0FBR08sYUFBSCxDQUFpQmYsU0FBakIsRUFBNEJNLElBQUksQ0FBQ1UsU0FBTCxDQUFlWCxLQUFmLEVBQXNCLElBQXRCLEVBQTRCLENBQTVCLENBQTVCO0FBQ0QsQ0FQRDs7QUFTTyxNQUFNWSxXQUFXLEdBQUlsQixJQUFELElBQ3pCLElBQUltQixPQUFKLENBQVksQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEtBQXFCO0FBQy9CdEIsRUFBQUEsT0FBTyxDQUFDQyxJQUFELENBQVA7QUFDQSxRQUFNc0IsS0FBSyxHQUFHLHlCQUFNLE1BQU4sRUFBYztBQUFFQyxJQUFBQSxLQUFLLEVBQUV6QjtBQUFULEdBQWQsQ0FBZDtBQUVBd0IsRUFBQUEsS0FBSyxDQUFDRSxFQUFOLENBQVMsT0FBVCxFQUFtQkMsSUFBRCxJQUFrQjtBQUNsQyxRQUFJQSxJQUFJLEtBQUssQ0FBYixFQUFnQjtBQUNkSixNQUFBQSxNQUFNO0FBQ1AsS0FGRCxNQUVPO0FBQ0xELE1BQUFBLE9BQU87QUFDUjtBQUNGLEdBTkQ7QUFPRCxDQVhELENBREs7Ozs7QUFjQSxNQUFNTSxVQUFVLEdBQUkxQixJQUFELElBQ3hCLElBQUltQixPQUFKLENBQVksQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEtBQXFCO0FBQy9CdEIsRUFBQUEsT0FBTyxDQUFDQyxJQUFELENBQVA7QUFDQSxRQUFNc0IsS0FBSyxHQUFHLHlCQUFNLEtBQU4sRUFBYTtBQUFFQyxJQUFBQSxLQUFLLEVBQUV6QjtBQUFULEdBQWIsQ0FBZDtBQUVBd0IsRUFBQUEsS0FBSyxDQUFDRSxFQUFOLENBQVMsT0FBVCxFQUFtQkMsSUFBRCxJQUFrQjtBQUNsQyxRQUFJQSxJQUFJLEtBQUssQ0FBYixFQUFnQjtBQUNkSixNQUFBQSxNQUFNO0FBQ1AsS0FGRCxNQUVPO0FBQ0xELE1BQUFBLE9BQU87QUFDUjtBQUNGLEdBTkQ7QUFPRCxDQVhELENBREs7Ozs7QUFjQSxNQUFNTyxXQUFXLEdBQUcsQ0FBQ0MsSUFBRCxFQUFlQyxLQUFmLEtBQ3pCLElBQUlWLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDL0IsZ0NBQVNPLElBQVQsRUFBZUMsS0FBZixFQUF1QkMsQ0FBRCxJQUFjO0FBQ2xDLFFBQUlBLENBQUosRUFBT1QsTUFBTSxDQUFDUyxDQUFELENBQU47QUFDUFYsSUFBQUEsT0FBTztBQUNSLEdBSEQ7QUFJRCxDQUxELENBREs7Ozs7QUFRQSxNQUFNVyxjQUFjO0FBQUE7QUFBQTtBQUFBLCtCQUFHLFdBQU8vQixJQUFQLEVBQXdDO0FBQ3BFLFVBQU1nQyxJQUFJLFNBQVMscUJBQW5CLENBRG9FLENBRXBFOztBQUNBLFFBQUlBLElBQUosRUFBVSxPQUFPZCxXQUFXLENBQUNsQixJQUFELENBQWxCO0FBRVYsV0FBTzBCLFVBQVUsQ0FBQzFCLElBQUQsQ0FBakI7QUFDRCxHQU4wQjs7QUFBQSxrQkFBZCtCLGNBQWM7QUFBQTtBQUFBO0FBQUEsR0FBcEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3Bhd24gZnJvbSAnY3Jvc3Mtc3Bhd24nXG5pbXBvcnQgeyBpc1lhcm4gfSBmcm9tICcuL2RldGVjdCdcbmltcG9ydCBkb3dubG9hZCBmcm9tICdkb3dubG9hZC1naXQtcmVwbydcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmNvbnN0IHNwYXduU3RkaW86IGFueVtdID0gWydwaXBlJywgJ3BpcGUnLCAncGlwZSddXG5jb25zdCBhZGREZXBzID0gbGlicyA9PiB7XG4gIGNvbnN0IHBzam9uUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncGFja2FnZS5qc29uJylcbiAgY29uc3QgcGpzb24gPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwc2pvblBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkudG9TdHJpbmcoKSlcblxuICBsaWJzLmZvckVhY2gobGliID0+IChwanNvbi5kZXBlbmRlbmNpZXNbbGliXSA9ICcqJykpXG5cbiAgZnMud3JpdGVGaWxlU3luYyhwc2pvblBhdGgsIEpTT04uc3RyaW5naWZ5KHBqc29uLCBudWxsLCAyKSlcbn1cblxuZXhwb3J0IGNvbnN0IHlhcm5JbnN0YWxsID0gKGxpYnM6IHN0cmluZ1tdKTogUHJvbWlzZTxhbnk+ID0+XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBhZGREZXBzKGxpYnMpXG4gICAgY29uc3QgY2hpbGQgPSBzcGF3bigneWFybicsIHsgc3RkaW86IHNwYXduU3RkaW8gfSlcblxuICAgIGNoaWxkLm9uKCdjbG9zZScsIChjb2RlOiBudW1iZXIpID0+IHtcbiAgICAgIGlmIChjb2RlICE9PSAwKSB7XG4gICAgICAgIHJlamVjdCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKClcbiAgICAgIH1cbiAgICB9KVxuICB9KVxuXG5leHBvcnQgY29uc3QgbnBtSW5zdGFsbCA9IChsaWJzOiBzdHJpbmdbXSk6IFByb21pc2U8YW55PiA9PlxuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgYWRkRGVwcyhsaWJzKVxuICAgIGNvbnN0IGNoaWxkID0gc3Bhd24oJ25wbScsIHsgc3RkaW86IHNwYXduU3RkaW8gfSlcblxuICAgIGNoaWxkLm9uKCdjbG9zZScsIChjb2RlOiBudW1iZXIpID0+IHtcbiAgICAgIGlmIChjb2RlICE9PSAwKSB7XG4gICAgICAgIHJlamVjdCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKClcbiAgICAgIH1cbiAgICB9KVxuICB9KVxuXG5leHBvcnQgY29uc3QgcmVwb0luc3RhbGwgPSAocmVwbzogc3RyaW5nLCB3aGVyZTogc3RyaW5nKTogUHJvbWlzZTxhbnk+ID0+XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBkb3dubG9hZChyZXBvLCB3aGVyZSwgKGU6IEVycm9yKSA9PiB7XG4gICAgICBpZiAoZSkgcmVqZWN0KGUpXG4gICAgICByZXNvbHZlKClcbiAgICB9KVxuICB9KVxuXG5leHBvcnQgY29uc3QgaW5zdGFsbE1vZHVsZXMgPSBhc3luYyAobGliczogc3RyaW5nW10pOiBQcm9taXNlPGFueT4gPT4ge1xuICBjb25zdCB5YXJuID0gYXdhaXQgaXNZYXJuKClcbiAgLy8gVE9ETzogY3JlYXRlIHByb21wdFxuICBpZiAoeWFybikgcmV0dXJuIHlhcm5JbnN0YWxsKGxpYnMpXG5cbiAgcmV0dXJuIG5wbUluc3RhbGwobGlicylcbn1cbiJdfQ==