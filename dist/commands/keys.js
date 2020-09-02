"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keys = void 0;

var _core = require("@caporal/core");

var _cliTable = _interopRequireDefault(require("cli-table"));

var _ora = _interopRequireDefault(require("ora"));

var _config = _interopRequireDefault(require("../utils/config"));

var _prints = _interopRequireDefault(require("../utils/prints"));

var _api = require("../utils/api");

var _options = require("../utils/options");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const keys = {
  command: 'keys',
  description: 'create or list apikeys',
  options: [..._options.globalOptions, {
    option: '--list [list]',
    description: 'List All your API keys',
    config: {
      validator: _core.program.BOOLEAN
    }
  }, {
    option: '--name [name]',
    description: 'Name your API Key',
    config: {
      validator: _core.program.STRING
    }
  }],

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
        return logger.info(_prints.default.notAuthenticated);
      }

      if (options.list) {
        const _ref = yield (0, _api.retrieveAPIKeys)({
          host: options.host,
          project: options.project,
          apiKey: userKey
        }),
              apiKeys = _ref.apiKeys;

        const table = new _cliTable.default({
          head: ['Name', 'Key']
        });
        table.push(...apiKeys.map(key => [key.name, key.value]));
        console.log(table.toString());
        return;
      }

      if (!options.name) {
        logger.error('🚫');
        logger.error('To create an API Key, you must supply a name');
        logger.error('To list your API Keys, use the "--list" flag');
        return;
      }

      try {
        const spinner = (0, _ora.default)(_prints.default.creatingAPIKey).start();

        const _ref2 = yield (0, _api.createAPIKey)({
          host: options.host,
          apiKey: userKey,
          name: options.name
        }),
              key = _ref2.key,
              name = _ref2.name;

        spinner.succeed();
        const table = new _cliTable.default({
          head: ['Name', 'Key']
        });
        table.push([name, key]);
        console.log(table.toString());
      } catch (e) {
        logger.error(_prints.default.errorCreatingAPIKey);
      }
    })();
  }

};
exports.keys = keys;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9rZXlzLnRzIl0sIm5hbWVzIjpbImtleXMiLCJjb21tYW5kIiwiZGVzY3JpcHRpb24iLCJvcHRpb25zIiwiZ2xvYmFsT3B0aW9ucyIsIm9wdGlvbiIsImNvbmZpZyIsInZhbGlkYXRvciIsInByb2dyYW0iLCJCT09MRUFOIiwiU1RSSU5HIiwiYWN0aW9uIiwibG9nZ2VyIiwidXNlcktleSIsImdldEF1dGgiLCJ2YWxpZEtleSIsImhvc3QiLCJhcGlLZXkiLCJpbmZvIiwicHJpbnRzIiwibm90QXV0aGVudGljYXRlZCIsImxpc3QiLCJwcm9qZWN0IiwiYXBpS2V5cyIsInRhYmxlIiwiVGFibGUiLCJoZWFkIiwicHVzaCIsIm1hcCIsImtleSIsIm5hbWUiLCJ2YWx1ZSIsImNvbnNvbGUiLCJsb2ciLCJ0b1N0cmluZyIsImVycm9yIiwic3Bpbm5lciIsImNyZWF0aW5nQVBJS2V5Iiwic3RhcnQiLCJzdWNjZWVkIiwiZSIsImVycm9yQ3JlYXRpbmdBUElLZXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFTyxNQUFNQSxJQUFtQixHQUFHO0FBQ2pDQyxFQUFBQSxPQUFPLEVBQUUsTUFEd0I7QUFFakNDLEVBQUFBLFdBQVcsRUFBRSx3QkFGb0I7QUFHakNDLEVBQUFBLE9BQU8sRUFBRSxDQUNQLEdBQUdDLHNCQURJLEVBRVA7QUFBRUMsSUFBQUEsTUFBTSxFQUFFLGVBQVY7QUFBMkJILElBQUFBLFdBQVcsRUFBRSx3QkFBeEM7QUFBa0VJLElBQUFBLE1BQU0sRUFBRTtBQUFFQyxNQUFBQSxTQUFTLEVBQUVDLGNBQVFDO0FBQXJCO0FBQTFFLEdBRk8sRUFHUDtBQUFFSixJQUFBQSxNQUFNLEVBQUUsZUFBVjtBQUEyQkgsSUFBQUEsV0FBVyxFQUFFLG1CQUF4QztBQUE2REksSUFBQUEsTUFBTSxFQUFFO0FBQUVDLE1BQUFBLFNBQVMsRUFBRUMsY0FBUUU7QUFBckI7QUFBckUsR0FITyxDQUh3Qjs7QUFRM0JDLEVBQUFBLE1BQU4sQ0FBYTtBQUFFUixJQUFBQSxPQUFGO0FBQVdTLElBQUFBO0FBQVgsR0FBYixFQUFrQztBQUFBO0FBQ2hDLFlBQU1DLE9BQU8sR0FBR1AsZ0JBQU9RLE9BQVAsRUFBaEI7O0FBQ0EsVUFBSUMsUUFBUSxHQUFHLEtBQWY7O0FBRUEsVUFBSUYsT0FBSixFQUFhO0FBQ1hFLFFBQUFBLFFBQVEsU0FBUyxzQkFBWTtBQUFFQyxVQUFBQSxJQUFJLEVBQUViLE9BQU8sQ0FBQ2EsSUFBaEI7QUFBc0JDLFVBQUFBLE1BQU0sRUFBRUo7QUFBOUIsU0FBWixDQUFqQjtBQUNEOztBQUVELFVBQUksQ0FBQ0EsT0FBRCxJQUFZLENBQUNFLFFBQWpCLEVBQTJCO0FBQ3pCLGVBQU9ILE1BQU0sQ0FBQ00sSUFBUCxDQUFZQyxnQkFBT0MsZ0JBQW5CLENBQVA7QUFDRDs7QUFFRCxVQUFJakIsT0FBTyxDQUFDa0IsSUFBWixFQUFrQjtBQUFBLDJCQUNVLDBCQUFnQjtBQUN4Q0wsVUFBQUEsSUFBSSxFQUFFYixPQUFPLENBQUNhLElBRDBCO0FBRXhDTSxVQUFBQSxPQUFPLEVBQUVuQixPQUFPLENBQUNtQixPQUZ1QjtBQUd4Q0wsVUFBQUEsTUFBTSxFQUFFSjtBQUhnQyxTQUFoQixDQURWO0FBQUEsY0FDUlUsT0FEUSxRQUNSQSxPQURROztBQU1oQixjQUFNQyxLQUFLLEdBQUcsSUFBSUMsaUJBQUosQ0FBVTtBQUN0QkMsVUFBQUEsSUFBSSxFQUFFLENBQUMsTUFBRCxFQUFTLEtBQVQ7QUFEZ0IsU0FBVixDQUFkO0FBSUFGLFFBQUFBLEtBQUssQ0FBQ0csSUFBTixDQUFXLEdBQUdKLE9BQU8sQ0FBQ0ssR0FBUixDQUFZQyxHQUFHLElBQUksQ0FBQ0EsR0FBRyxDQUFDQyxJQUFMLEVBQVdELEdBQUcsQ0FBQ0UsS0FBZixDQUFuQixDQUFkO0FBQ0FDLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZVCxLQUFLLENBQUNVLFFBQU4sRUFBWjtBQUNBO0FBQ0Q7O0FBRUQsVUFBSSxDQUFDL0IsT0FBTyxDQUFDMkIsSUFBYixFQUFtQjtBQUNqQmxCLFFBQUFBLE1BQU0sQ0FBQ3VCLEtBQVAsQ0FBYSxJQUFiO0FBQ0F2QixRQUFBQSxNQUFNLENBQUN1QixLQUFQLENBQWEsOENBQWI7QUFDQXZCLFFBQUFBLE1BQU0sQ0FBQ3VCLEtBQVAsQ0FBYSw4Q0FBYjtBQUNBO0FBQ0Q7O0FBRUQsVUFBSTtBQUNGLGNBQU1DLE9BQU8sR0FBRyxrQkFBSWpCLGdCQUFPa0IsY0FBWCxFQUEyQkMsS0FBM0IsRUFBaEI7O0FBREUsNEJBRTBCLHVCQUFhO0FBQUV0QixVQUFBQSxJQUFJLEVBQUViLE9BQU8sQ0FBQ2EsSUFBaEI7QUFBc0JDLFVBQUFBLE1BQU0sRUFBRUosT0FBOUI7QUFBdUNpQixVQUFBQSxJQUFJLEVBQUUzQixPQUFPLENBQUMyQjtBQUFyRCxTQUFiLENBRjFCO0FBQUEsY0FFTUQsR0FGTixTQUVNQSxHQUZOO0FBQUEsY0FFV0MsSUFGWCxTQUVXQSxJQUZYOztBQUdGTSxRQUFBQSxPQUFPLENBQUNHLE9BQVI7QUFFQSxjQUFNZixLQUFLLEdBQUcsSUFBSUMsaUJBQUosQ0FBVTtBQUN0QkMsVUFBQUEsSUFBSSxFQUFFLENBQUMsTUFBRCxFQUFTLEtBQVQ7QUFEZ0IsU0FBVixDQUFkO0FBSUFGLFFBQUFBLEtBQUssQ0FBQ0csSUFBTixDQUFXLENBQUNHLElBQUQsRUFBT0QsR0FBUCxDQUFYO0FBQ0FHLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZVCxLQUFLLENBQUNVLFFBQU4sRUFBWjtBQUNELE9BWEQsQ0FXRSxPQUFPTSxDQUFQLEVBQVU7QUFDVjVCLFFBQUFBLE1BQU0sQ0FBQ3VCLEtBQVAsQ0FBYWhCLGdCQUFPc0IsbUJBQXBCO0FBQ0Q7QUEvQytCO0FBZ0RqQzs7QUF4RGdDLENBQTVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHJvZ3JhbSB9IGZyb20gJ0BjYXBvcmFsL2NvcmUnXG5pbXBvcnQgeyBDb21tYW5kQ29uZmlnIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgVGFibGUgZnJvbSAnY2xpLXRhYmxlJ1xuaW1wb3J0IG9yYSBmcm9tICdvcmEnXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL3V0aWxzL2NvbmZpZydcbmltcG9ydCBwcmludHMgZnJvbSAnLi4vdXRpbHMvcHJpbnRzJ1xuaW1wb3J0IHsgY2hlY2tBUElLZXksIGNyZWF0ZUFQSUtleSwgcmV0cmlldmVBUElLZXlzIH0gZnJvbSAnLi4vdXRpbHMvYXBpJ1xuaW1wb3J0IHsgZ2xvYmFsT3B0aW9ucyB9IGZyb20gJy4uL3V0aWxzL29wdGlvbnMnXG5cbmV4cG9ydCBjb25zdCBrZXlzOiBDb21tYW5kQ29uZmlnID0ge1xuICBjb21tYW5kOiAna2V5cycsXG4gIGRlc2NyaXB0aW9uOiAnY3JlYXRlIG9yIGxpc3QgYXBpa2V5cycsXG4gIG9wdGlvbnM6IFtcbiAgICAuLi5nbG9iYWxPcHRpb25zLFxuICAgIHsgb3B0aW9uOiAnLS1saXN0IFtsaXN0XScsIGRlc2NyaXB0aW9uOiAnTGlzdCBBbGwgeW91ciBBUEkga2V5cycsIGNvbmZpZzogeyB2YWxpZGF0b3I6IHByb2dyYW0uQk9PTEVBTiB9IH0sXG4gICAgeyBvcHRpb246ICctLW5hbWUgW25hbWVdJywgZGVzY3JpcHRpb246ICdOYW1lIHlvdXIgQVBJIEtleScsIGNvbmZpZzogeyB2YWxpZGF0b3I6IHByb2dyYW0uU1RSSU5HIH0gfSxcbiAgXSxcbiAgYXN5bmMgYWN0aW9uKHsgb3B0aW9ucywgbG9nZ2VyIH0pIHtcbiAgICBjb25zdCB1c2VyS2V5ID0gY29uZmlnLmdldEF1dGgoKVxuICAgIGxldCB2YWxpZEtleSA9IGZhbHNlXG5cbiAgICBpZiAodXNlcktleSkge1xuICAgICAgdmFsaWRLZXkgPSBhd2FpdCBjaGVja0FQSUtleSh7IGhvc3Q6IG9wdGlvbnMuaG9zdCwgYXBpS2V5OiB1c2VyS2V5IH0gYXMgYW55KVxuICAgIH1cblxuICAgIGlmICghdXNlcktleSB8fCAhdmFsaWRLZXkpIHtcbiAgICAgIHJldHVybiBsb2dnZXIuaW5mbyhwcmludHMubm90QXV0aGVudGljYXRlZClcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5saXN0KSB7XG4gICAgICBjb25zdCB7IGFwaUtleXMgfSA9IGF3YWl0IHJldHJpZXZlQVBJS2V5cyh7XG4gICAgICAgIGhvc3Q6IG9wdGlvbnMuaG9zdCxcbiAgICAgICAgcHJvamVjdDogb3B0aW9ucy5wcm9qZWN0LFxuICAgICAgICBhcGlLZXk6IHVzZXJLZXksXG4gICAgICB9IGFzIGFueSlcbiAgICAgIGNvbnN0IHRhYmxlID0gbmV3IFRhYmxlKHtcbiAgICAgICAgaGVhZDogWydOYW1lJywgJ0tleSddLFxuICAgICAgfSlcblxuICAgICAgdGFibGUucHVzaCguLi5hcGlLZXlzLm1hcChrZXkgPT4gW2tleS5uYW1lLCBrZXkudmFsdWVdKSlcbiAgICAgIGNvbnNvbGUubG9nKHRhYmxlLnRvU3RyaW5nKCkpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMubmFtZSkge1xuICAgICAgbG9nZ2VyLmVycm9yKCfwn5qrJylcbiAgICAgIGxvZ2dlci5lcnJvcignVG8gY3JlYXRlIGFuIEFQSSBLZXksIHlvdSBtdXN0IHN1cHBseSBhIG5hbWUnKVxuICAgICAgbG9nZ2VyLmVycm9yKCdUbyBsaXN0IHlvdXIgQVBJIEtleXMsIHVzZSB0aGUgXCItLWxpc3RcIiBmbGFnJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBzcGlubmVyID0gb3JhKHByaW50cy5jcmVhdGluZ0FQSUtleSkuc3RhcnQoKVxuICAgICAgY29uc3QgeyBrZXksIG5hbWUgfSA9IGF3YWl0IGNyZWF0ZUFQSUtleSh7IGhvc3Q6IG9wdGlvbnMuaG9zdCwgYXBpS2V5OiB1c2VyS2V5LCBuYW1lOiBvcHRpb25zLm5hbWUgfSBhcyBhbnkpXG4gICAgICBzcGlubmVyLnN1Y2NlZWQoKVxuXG4gICAgICBjb25zdCB0YWJsZSA9IG5ldyBUYWJsZSh7XG4gICAgICAgIGhlYWQ6IFsnTmFtZScsICdLZXknXSxcbiAgICAgIH0pXG5cbiAgICAgIHRhYmxlLnB1c2goW25hbWUsIGtleV0pXG4gICAgICBjb25zb2xlLmxvZyh0YWJsZS50b1N0cmluZygpKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihwcmludHMuZXJyb3JDcmVhdGluZ0FQSUtleSlcbiAgICB9XG4gIH0sXG59XG4iXX0=