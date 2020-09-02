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
        const apiKeys = yield (0, _api.retrieveAPIKeys)({
          host: options.host,
          project: options.project,
          apiKey: userKey
        });
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

        const _ref = yield (0, _api.createAPIKey)({
          host: options.host,
          apiKey: userKey,
          name: options.name
        }),
              key = _ref.key,
              name = _ref.name;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9rZXlzLnRzIl0sIm5hbWVzIjpbImtleXMiLCJjb21tYW5kIiwiZGVzY3JpcHRpb24iLCJvcHRpb25zIiwiZ2xvYmFsT3B0aW9ucyIsIm9wdGlvbiIsImNvbmZpZyIsInZhbGlkYXRvciIsInByb2dyYW0iLCJCT09MRUFOIiwiU1RSSU5HIiwiYWN0aW9uIiwibG9nZ2VyIiwidXNlcktleSIsImdldEF1dGgiLCJ2YWxpZEtleSIsImhvc3QiLCJhcGlLZXkiLCJpbmZvIiwicHJpbnRzIiwibm90QXV0aGVudGljYXRlZCIsImxpc3QiLCJhcGlLZXlzIiwicHJvamVjdCIsInRhYmxlIiwiVGFibGUiLCJoZWFkIiwicHVzaCIsIm1hcCIsImtleSIsIm5hbWUiLCJ2YWx1ZSIsImNvbnNvbGUiLCJsb2ciLCJ0b1N0cmluZyIsImVycm9yIiwic3Bpbm5lciIsImNyZWF0aW5nQVBJS2V5Iiwic3RhcnQiLCJzdWNjZWVkIiwiZSIsImVycm9yQ3JlYXRpbmdBUElLZXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFTyxNQUFNQSxJQUFtQixHQUFHO0FBQ2pDQyxFQUFBQSxPQUFPLEVBQUUsTUFEd0I7QUFFakNDLEVBQUFBLFdBQVcsRUFBRSx3QkFGb0I7QUFHakNDLEVBQUFBLE9BQU8sRUFBRSxDQUNQLEdBQUdDLHNCQURJLEVBRVA7QUFBRUMsSUFBQUEsTUFBTSxFQUFFLGVBQVY7QUFBMkJILElBQUFBLFdBQVcsRUFBRSx3QkFBeEM7QUFBa0VJLElBQUFBLE1BQU0sRUFBRTtBQUFFQyxNQUFBQSxTQUFTLEVBQUVDLGNBQVFDO0FBQXJCO0FBQTFFLEdBRk8sRUFHUDtBQUFFSixJQUFBQSxNQUFNLEVBQUUsZUFBVjtBQUEyQkgsSUFBQUEsV0FBVyxFQUFFLG1CQUF4QztBQUE2REksSUFBQUEsTUFBTSxFQUFFO0FBQUVDLE1BQUFBLFNBQVMsRUFBRUMsY0FBUUU7QUFBckI7QUFBckUsR0FITyxDQUh3Qjs7QUFRM0JDLEVBQUFBLE1BQU4sQ0FBYTtBQUFFUixJQUFBQSxPQUFGO0FBQVdTLElBQUFBO0FBQVgsR0FBYixFQUFrQztBQUFBO0FBQ2hDLFlBQU1DLE9BQU8sR0FBR1AsZ0JBQU9RLE9BQVAsRUFBaEI7O0FBQ0EsVUFBSUMsUUFBUSxHQUFHLEtBQWY7O0FBRUEsVUFBSUYsT0FBSixFQUFhO0FBQ1hFLFFBQUFBLFFBQVEsU0FBUyxzQkFBWTtBQUFFQyxVQUFBQSxJQUFJLEVBQUViLE9BQU8sQ0FBQ2EsSUFBaEI7QUFBc0JDLFVBQUFBLE1BQU0sRUFBRUo7QUFBOUIsU0FBWixDQUFqQjtBQUNEOztBQUVELFVBQUksQ0FBQ0EsT0FBRCxJQUFZLENBQUNFLFFBQWpCLEVBQTJCO0FBQ3pCLGVBQU9ILE1BQU0sQ0FBQ00sSUFBUCxDQUFZQyxnQkFBT0MsZ0JBQW5CLENBQVA7QUFDRDs7QUFFRCxVQUFJakIsT0FBTyxDQUFDa0IsSUFBWixFQUFrQjtBQUNoQixjQUFNQyxPQUFPLFNBQVMsMEJBQWdCO0FBQ3BDTixVQUFBQSxJQUFJLEVBQUViLE9BQU8sQ0FBQ2EsSUFEc0I7QUFFcENPLFVBQUFBLE9BQU8sRUFBRXBCLE9BQU8sQ0FBQ29CLE9BRm1CO0FBR3BDTixVQUFBQSxNQUFNLEVBQUVKO0FBSDRCLFNBQWhCLENBQXRCO0FBS0EsY0FBTVcsS0FBSyxHQUFHLElBQUlDLGlCQUFKLENBQVU7QUFDdEJDLFVBQUFBLElBQUksRUFBRSxDQUFDLE1BQUQsRUFBUyxLQUFUO0FBRGdCLFNBQVYsQ0FBZDtBQUlBRixRQUFBQSxLQUFLLENBQUNHLElBQU4sQ0FBVyxHQUFHTCxPQUFPLENBQUNNLEdBQVIsQ0FBWUMsR0FBRyxJQUFJLENBQUNBLEdBQUcsQ0FBQ0MsSUFBTCxFQUFXRCxHQUFHLENBQUNFLEtBQWYsQ0FBbkIsQ0FBZDtBQUNBQyxRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWVQsS0FBSyxDQUFDVSxRQUFOLEVBQVo7QUFDQTtBQUNEOztBQUVELFVBQUksQ0FBQy9CLE9BQU8sQ0FBQzJCLElBQWIsRUFBbUI7QUFDakJsQixRQUFBQSxNQUFNLENBQUN1QixLQUFQLENBQWEsSUFBYjtBQUNBdkIsUUFBQUEsTUFBTSxDQUFDdUIsS0FBUCxDQUFhLDhDQUFiO0FBQ0F2QixRQUFBQSxNQUFNLENBQUN1QixLQUFQLENBQWEsOENBQWI7QUFDQTtBQUNEOztBQUVELFVBQUk7QUFDRixjQUFNQyxPQUFPLEdBQUcsa0JBQUlqQixnQkFBT2tCLGNBQVgsRUFBMkJDLEtBQTNCLEVBQWhCOztBQURFLDJCQUUwQix1QkFBYTtBQUFFdEIsVUFBQUEsSUFBSSxFQUFFYixPQUFPLENBQUNhLElBQWhCO0FBQXNCQyxVQUFBQSxNQUFNLEVBQUVKLE9BQTlCO0FBQXVDaUIsVUFBQUEsSUFBSSxFQUFFM0IsT0FBTyxDQUFDMkI7QUFBckQsU0FBYixDQUYxQjtBQUFBLGNBRU1ELEdBRk4sUUFFTUEsR0FGTjtBQUFBLGNBRVdDLElBRlgsUUFFV0EsSUFGWDs7QUFHRk0sUUFBQUEsT0FBTyxDQUFDRyxPQUFSO0FBRUEsY0FBTWYsS0FBSyxHQUFHLElBQUlDLGlCQUFKLENBQVU7QUFDdEJDLFVBQUFBLElBQUksRUFBRSxDQUFDLE1BQUQsRUFBUyxLQUFUO0FBRGdCLFNBQVYsQ0FBZDtBQUlBRixRQUFBQSxLQUFLLENBQUNHLElBQU4sQ0FBVyxDQUFDRyxJQUFELEVBQU9ELEdBQVAsQ0FBWDtBQUNBRyxRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWVQsS0FBSyxDQUFDVSxRQUFOLEVBQVo7QUFDRCxPQVhELENBV0UsT0FBT00sQ0FBUCxFQUFVO0FBQ1Y1QixRQUFBQSxNQUFNLENBQUN1QixLQUFQLENBQWFoQixnQkFBT3NCLG1CQUFwQjtBQUNEO0FBL0MrQjtBQWdEakM7O0FBeERnQyxDQUE1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByb2dyYW0gfSBmcm9tICdAY2Fwb3JhbC9jb3JlJ1xuaW1wb3J0IHsgQ29tbWFuZENvbmZpZyB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IFRhYmxlIGZyb20gJ2NsaS10YWJsZSdcbmltcG9ydCBvcmEgZnJvbSAnb3JhJ1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi91dGlscy9jb25maWcnXG5pbXBvcnQgcHJpbnRzIGZyb20gJy4uL3V0aWxzL3ByaW50cydcbmltcG9ydCB7IGNoZWNrQVBJS2V5LCBjcmVhdGVBUElLZXksIHJldHJpZXZlQVBJS2V5cyB9IGZyb20gJy4uL3V0aWxzL2FwaSdcbmltcG9ydCB7IGdsb2JhbE9wdGlvbnMgfSBmcm9tICcuLi91dGlscy9vcHRpb25zJ1xuXG5leHBvcnQgY29uc3Qga2V5czogQ29tbWFuZENvbmZpZyA9IHtcbiAgY29tbWFuZDogJ2tleXMnLFxuICBkZXNjcmlwdGlvbjogJ2NyZWF0ZSBvciBsaXN0IGFwaWtleXMnLFxuICBvcHRpb25zOiBbXG4gICAgLi4uZ2xvYmFsT3B0aW9ucyxcbiAgICB7IG9wdGlvbjogJy0tbGlzdCBbbGlzdF0nLCBkZXNjcmlwdGlvbjogJ0xpc3QgQWxsIHlvdXIgQVBJIGtleXMnLCBjb25maWc6IHsgdmFsaWRhdG9yOiBwcm9ncmFtLkJPT0xFQU4gfSB9LFxuICAgIHsgb3B0aW9uOiAnLS1uYW1lIFtuYW1lXScsIGRlc2NyaXB0aW9uOiAnTmFtZSB5b3VyIEFQSSBLZXknLCBjb25maWc6IHsgdmFsaWRhdG9yOiBwcm9ncmFtLlNUUklORyB9IH0sXG4gIF0sXG4gIGFzeW5jIGFjdGlvbih7IG9wdGlvbnMsIGxvZ2dlciB9KSB7XG4gICAgY29uc3QgdXNlcktleSA9IGNvbmZpZy5nZXRBdXRoKClcbiAgICBsZXQgdmFsaWRLZXkgPSBmYWxzZVxuXG4gICAgaWYgKHVzZXJLZXkpIHtcbiAgICAgIHZhbGlkS2V5ID0gYXdhaXQgY2hlY2tBUElLZXkoeyBob3N0OiBvcHRpb25zLmhvc3QsIGFwaUtleTogdXNlcktleSB9IGFzIGFueSlcbiAgICB9XG5cbiAgICBpZiAoIXVzZXJLZXkgfHwgIXZhbGlkS2V5KSB7XG4gICAgICByZXR1cm4gbG9nZ2VyLmluZm8ocHJpbnRzLm5vdEF1dGhlbnRpY2F0ZWQpXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMubGlzdCkge1xuICAgICAgY29uc3QgYXBpS2V5cyA9IGF3YWl0IHJldHJpZXZlQVBJS2V5cyh7XG4gICAgICAgIGhvc3Q6IG9wdGlvbnMuaG9zdCxcbiAgICAgICAgcHJvamVjdDogb3B0aW9ucy5wcm9qZWN0LFxuICAgICAgICBhcGlLZXk6IHVzZXJLZXksXG4gICAgICB9IGFzIGFueSlcbiAgICAgIGNvbnN0IHRhYmxlID0gbmV3IFRhYmxlKHtcbiAgICAgICAgaGVhZDogWydOYW1lJywgJ0tleSddLFxuICAgICAgfSlcblxuICAgICAgdGFibGUucHVzaCguLi5hcGlLZXlzLm1hcChrZXkgPT4gW2tleS5uYW1lLCBrZXkudmFsdWVdKSlcbiAgICAgIGNvbnNvbGUubG9nKHRhYmxlLnRvU3RyaW5nKCkpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMubmFtZSkge1xuICAgICAgbG9nZ2VyLmVycm9yKCfwn5qrJylcbiAgICAgIGxvZ2dlci5lcnJvcignVG8gY3JlYXRlIGFuIEFQSSBLZXksIHlvdSBtdXN0IHN1cHBseSBhIG5hbWUnKVxuICAgICAgbG9nZ2VyLmVycm9yKCdUbyBsaXN0IHlvdXIgQVBJIEtleXMsIHVzZSB0aGUgXCItLWxpc3RcIiBmbGFnJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBzcGlubmVyID0gb3JhKHByaW50cy5jcmVhdGluZ0FQSUtleSkuc3RhcnQoKVxuICAgICAgY29uc3QgeyBrZXksIG5hbWUgfSA9IGF3YWl0IGNyZWF0ZUFQSUtleSh7IGhvc3Q6IG9wdGlvbnMuaG9zdCwgYXBpS2V5OiB1c2VyS2V5LCBuYW1lOiBvcHRpb25zLm5hbWUgfSBhcyBhbnkpXG4gICAgICBzcGlubmVyLnN1Y2NlZWQoKVxuXG4gICAgICBjb25zdCB0YWJsZSA9IG5ldyBUYWJsZSh7XG4gICAgICAgIGhlYWQ6IFsnTmFtZScsICdLZXknXSxcbiAgICAgIH0pXG5cbiAgICAgIHRhYmxlLnB1c2goW25hbWUsIGtleV0pXG4gICAgICBjb25zb2xlLmxvZyh0YWJsZS50b1N0cmluZygpKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihwcmludHMuZXJyb3JDcmVhdGluZ0FQSUtleSlcbiAgICB9XG4gIH0sXG59XG4iXX0=