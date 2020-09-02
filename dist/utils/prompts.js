"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPrompts = void 0;

var _prompts = _interopRequireDefault(require("prompts"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const initPrompts =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (projects, hooks) {
    const _ref2 = yield (0, _prompts.default)({
      type: 'select',
      name: 'selectedProject',
      message: 'Select or create a Project',
      choices: [{
        title: 'CREATE NEW PROJECT',
        value: {
          id: 0
        }
      }, ...projects.map(p => ({
        title: `${_chalk.default.yellow(p.id)}   ${p.name}`,
        value: p
      }))]
    }),
          selectedProject = _ref2.selectedProject;

    let env, project;

    if (selectedProject.id === 0) {
      const _ref3 = yield (0, _prompts.default)({
        type: 'text',
        name: 'projectName',
        message: 'Give your project a name.',
        initial: 'My Tipe Project'
      }),
            projectName = _ref3.projectName;

      project = yield hooks.onCreateProject({
        name: projectName
      });
      env = project.environments[0];
    } else {
      project = selectedProject;

      const _ref4 = yield (0, _prompts.default)({
        type: 'select',
        name: 'selectedEnv',
        message: 'Select or create an Environment',
        choices: [{
          title: 'CREATE NEW ENVIRONMENT',
          value: {
            id: 0
          }
        }, ...project.environments.map(e => ({
          title: `${_chalk.default.yellow(e.id)}   ${e.name} (${e.private ? _chalk.default.red('Private') : _chalk.default.green('Public')})`,
          value: e
        }))]
      }),
            selectedEnv = _ref4.selectedEnv;

      if (selectedEnv.id === 0) {
        const _ref5 = yield (0, _prompts.default)({
          type: 'text',
          name: 'envName',
          message: 'Give your environment a name.',
          initial: 'production'
        }),
              envName = _ref5.envName;

        const _ref6 = yield (0, _prompts.default)({
          type: 'toggle',
          name: 'envPrivate',
          message: `Make "${envName}" private? (Will need an API to get content)`,
          initial: false,
          inactive: 'no',
          active: 'yes'
        }),
              envPrivate = _ref6.envPrivate;

        env = yield hooks.onCreateEnv({
          name: envName,
          project: project.id,
          private: envPrivate
        });
      } else {
        env = selectedEnv;
      }
    }

    const _ref7 = yield (0, _prompts.default)({
      type: 'confirm',
      name: 'writeEnv',
      message: 'Add tipe env variables to your .env file?',
      initial: true
    }),
          writeEnv = _ref7.writeEnv;

    return {
      project,
      env,
      writeEnv
    };
  });

  return function initPrompts(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.initPrompts = initPrompts;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9wcm9tcHRzLnRzIl0sIm5hbWVzIjpbImluaXRQcm9tcHRzIiwicHJvamVjdHMiLCJob29rcyIsInR5cGUiLCJuYW1lIiwibWVzc2FnZSIsImNob2ljZXMiLCJ0aXRsZSIsInZhbHVlIiwiaWQiLCJtYXAiLCJwIiwiY2hhbGsiLCJ5ZWxsb3ciLCJzZWxlY3RlZFByb2plY3QiLCJlbnYiLCJwcm9qZWN0IiwiaW5pdGlhbCIsInByb2plY3ROYW1lIiwib25DcmVhdGVQcm9qZWN0IiwiZW52aXJvbm1lbnRzIiwiZSIsInByaXZhdGUiLCJyZWQiLCJncmVlbiIsInNlbGVjdGVkRW52IiwiZW52TmFtZSIsImluYWN0aXZlIiwiYWN0aXZlIiwiZW52UHJpdmF0ZSIsIm9uQ3JlYXRlRW52Iiwid3JpdGVFbnYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7Ozs7Ozs7QUFFTyxNQUFNQSxXQUFXO0FBQUE7QUFBQTtBQUFBLCtCQUFHLFdBQU9DLFFBQVAsRUFBNEJDLEtBQTVCLEVBQTJFO0FBQUEsd0JBQ2xFLHNCQUFRO0FBQ3hDQyxNQUFBQSxJQUFJLEVBQUUsUUFEa0M7QUFFeENDLE1BQUFBLElBQUksRUFBRSxpQkFGa0M7QUFHeENDLE1BQUFBLE9BQU8sRUFBRSw0QkFIK0I7QUFJeENDLE1BQUFBLE9BQU8sRUFBRSxDQUNQO0FBQUVDLFFBQUFBLEtBQUssRUFBRSxvQkFBVDtBQUErQkMsUUFBQUEsS0FBSyxFQUFFO0FBQUVDLFVBQUFBLEVBQUUsRUFBRTtBQUFOO0FBQXRDLE9BRE8sRUFFUCxHQUFHUixRQUFRLENBQUNTLEdBQVQsQ0FBY0MsQ0FBRCxLQUFpQjtBQUMvQkosUUFBQUEsS0FBSyxFQUFHLEdBQUVLLGVBQU1DLE1BQU4sQ0FBYUYsQ0FBQyxDQUFDRixFQUFmLENBQW1CLE1BQUtFLENBQUMsQ0FBQ1AsSUFBSyxFQURWO0FBRS9CSSxRQUFBQSxLQUFLLEVBQUVHO0FBRndCLE9BQWpCLENBQWIsQ0FGSTtBQUorQixL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QjtBQUdqQ0MsTUFBQUEsT0FBTyxFQUFFLDJDQUh3QjtBQUlqQ1ksTUFBQUEsT0FBTyxFQUFFO0FBSndCLEtBQVIsQ0FoRXlFO0FBQUEsVUFnRTVGYyxRQWhFNEYsU0FnRTVGQSxRQWhFNEY7O0FBdUVwRyxXQUFPO0FBQUVmLE1BQUFBLE9BQUY7QUFBV0QsTUFBQUEsR0FBWDtBQUFnQmdCLE1BQUFBO0FBQWhCLEtBQVA7QUFDRCxHQXhFdUI7O0FBQUEsa0JBQVgvQixXQUFXO0FBQUE7QUFBQTtBQUFBLEdBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHByb21wdHMgZnJvbSAncHJvbXB0cydcbmltcG9ydCB7IFByb2plY3QsIEVudiwgUHJvbXB0SG9va3MsIFByb2plY3RDb25maWcgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsaydcblxuZXhwb3J0IGNvbnN0IGluaXRQcm9tcHRzID0gYXN5bmMgKHByb2plY3RzOiBQcm9qZWN0W10sIGhvb2tzOiBQcm9tcHRIb29rcyk6IFByb21pc2U8UHJvamVjdENvbmZpZz4gPT4ge1xuICBjb25zdCB7IHNlbGVjdGVkUHJvamVjdCB9ID0gYXdhaXQgcHJvbXB0cyh7XG4gICAgdHlwZTogJ3NlbGVjdCcsXG4gICAgbmFtZTogJ3NlbGVjdGVkUHJvamVjdCcsXG4gICAgbWVzc2FnZTogJ1NlbGVjdCBvciBjcmVhdGUgYSBQcm9qZWN0JyxcbiAgICBjaG9pY2VzOiBbXG4gICAgICB7IHRpdGxlOiAnQ1JFQVRFIE5FVyBQUk9KRUNUJywgdmFsdWU6IHsgaWQ6IDAgfSB9LFxuICAgICAgLi4ucHJvamVjdHMubWFwKChwOiBQcm9qZWN0KSA9PiAoe1xuICAgICAgICB0aXRsZTogYCR7Y2hhbGsueWVsbG93KHAuaWQpfSAgICR7cC5uYW1lfWAsXG4gICAgICAgIHZhbHVlOiBwLFxuICAgICAgfSkpLFxuICAgIF0sXG4gIH0pXG5cbiAgbGV0IGVudiwgcHJvamVjdFxuXG4gIGlmIChzZWxlY3RlZFByb2plY3QuaWQgPT09IDApIHtcbiAgICBjb25zdCB7IHByb2plY3ROYW1lIH0gPSBhd2FpdCBwcm9tcHRzKHtcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIG5hbWU6ICdwcm9qZWN0TmFtZScsXG4gICAgICBtZXNzYWdlOiAnR2l2ZSB5b3VyIHByb2plY3QgYSBuYW1lLicsXG4gICAgICBpbml0aWFsOiAnTXkgVGlwZSBQcm9qZWN0JyxcbiAgICB9KVxuXG4gICAgcHJvamVjdCA9IGF3YWl0IGhvb2tzLm9uQ3JlYXRlUHJvamVjdCh7IG5hbWU6IHByb2plY3ROYW1lIH0pXG4gICAgZW52ID0gcHJvamVjdC5lbnZpcm9ubWVudHNbMF1cbiAgfSBlbHNlIHtcbiAgICBwcm9qZWN0ID0gc2VsZWN0ZWRQcm9qZWN0XG4gICAgY29uc3QgeyBzZWxlY3RlZEVudiB9ID0gYXdhaXQgcHJvbXB0cyh7XG4gICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICAgIG5hbWU6ICdzZWxlY3RlZEVudicsXG4gICAgICBtZXNzYWdlOiAnU2VsZWN0IG9yIGNyZWF0ZSBhbiBFbnZpcm9ubWVudCcsXG4gICAgICBjaG9pY2VzOiBbXG4gICAgICAgIHsgdGl0bGU6ICdDUkVBVEUgTkVXIEVOVklST05NRU5UJywgdmFsdWU6IHsgaWQ6IDAgfSB9LFxuICAgICAgICAuLi5wcm9qZWN0LmVudmlyb25tZW50cy5tYXAoKGU6IEVudikgPT4gKHtcbiAgICAgICAgICB0aXRsZTogYCR7Y2hhbGsueWVsbG93KGUuaWQpfSAgICR7ZS5uYW1lfSAoJHtlLnByaXZhdGUgPyBjaGFsay5yZWQoJ1ByaXZhdGUnKSA6IGNoYWxrLmdyZWVuKCdQdWJsaWMnKX0pYCxcbiAgICAgICAgICB2YWx1ZTogZSxcbiAgICAgICAgfSkpLFxuICAgICAgXSxcbiAgICB9KVxuXG4gICAgaWYgKHNlbGVjdGVkRW52LmlkID09PSAwKSB7XG4gICAgICBjb25zdCB7IGVudk5hbWUgfSA9IGF3YWl0IHByb21wdHMoe1xuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIG5hbWU6ICdlbnZOYW1lJyxcbiAgICAgICAgbWVzc2FnZTogJ0dpdmUgeW91ciBlbnZpcm9ubWVudCBhIG5hbWUuJyxcbiAgICAgICAgaW5pdGlhbDogJ3Byb2R1Y3Rpb24nLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgeyBlbnZQcml2YXRlIH0gPSBhd2FpdCBwcm9tcHRzKHtcbiAgICAgICAgdHlwZTogJ3RvZ2dsZScsXG4gICAgICAgIG5hbWU6ICdlbnZQcml2YXRlJyxcbiAgICAgICAgbWVzc2FnZTogYE1ha2UgXCIke2Vudk5hbWV9XCIgcHJpdmF0ZT8gKFdpbGwgbmVlZCBhbiBBUEkgdG8gZ2V0IGNvbnRlbnQpYCxcbiAgICAgICAgaW5pdGlhbDogZmFsc2UsXG4gICAgICAgIGluYWN0aXZlOiAnbm8nLFxuICAgICAgICBhY3RpdmU6ICd5ZXMnLFxuICAgICAgfSlcblxuICAgICAgZW52ID0gYXdhaXQgaG9va3Mub25DcmVhdGVFbnYoeyBuYW1lOiBlbnZOYW1lLCBwcm9qZWN0OiBwcm9qZWN0LmlkLCBwcml2YXRlOiBlbnZQcml2YXRlIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGVudiA9IHNlbGVjdGVkRW52XG4gICAgfVxuICB9XG5cbiAgY29uc3QgeyB3cml0ZUVudiB9ID0gYXdhaXQgcHJvbXB0cyh7XG4gICAgdHlwZTogJ2NvbmZpcm0nLFxuICAgIG5hbWU6ICd3cml0ZUVudicsXG4gICAgbWVzc2FnZTogJ0FkZCB0aXBlIGVudiB2YXJpYWJsZXMgdG8geW91ciAuZW52IGZpbGU/JyxcbiAgICBpbml0aWFsOiB0cnVlLFxuICB9KVxuXG4gIHJldHVybiB7IHByb2plY3QsIGVudiwgd3JpdGVFbnYgfVxufVxuIl19