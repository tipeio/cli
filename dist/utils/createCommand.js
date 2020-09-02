"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCommands = exports.createCommand = void 0;

const createCommand = (prog, config) => {
  var _config$options;

  const command = prog.command(config.command, config.description);

  if ((_config$options = config.options) === null || _config$options === void 0 ? void 0 : _config$options.length) {
    config.options.forEach(option => {
      command.option(option.option, option.description, option.config || {});
    });
  }

  command.action(config.action);
  return command;
};

exports.createCommand = createCommand;

const createCommands = (prog, configs) => {
  configs.forEach(c => createCommand(prog, c));
  return prog;
};

exports.createCommands = createCommands;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jcmVhdGVDb21tYW5kLnRzIl0sIm5hbWVzIjpbImNyZWF0ZUNvbW1hbmQiLCJwcm9nIiwiY29uZmlnIiwiY29tbWFuZCIsImRlc2NyaXB0aW9uIiwib3B0aW9ucyIsImxlbmd0aCIsImZvckVhY2giLCJvcHRpb24iLCJhY3Rpb24iLCJjcmVhdGVDb21tYW5kcyIsImNvbmZpZ3MiLCJjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR08sTUFBTUEsYUFBYSxHQUFHLENBQUNDLElBQUQsRUFBZ0JDLE1BQWhCLEtBQW1EO0FBQUE7O0FBQzlFLFFBQU1DLE9BQU8sR0FBR0YsSUFBSSxDQUFDRSxPQUFMLENBQWFELE1BQU0sQ0FBQ0MsT0FBcEIsRUFBNkJELE1BQU0sQ0FBQ0UsV0FBcEMsQ0FBaEI7O0FBRUEseUJBQUlGLE1BQU0sQ0FBQ0csT0FBWCxvREFBSSxnQkFBZ0JDLE1BQXBCLEVBQTRCO0FBQzFCSixJQUFBQSxNQUFNLENBQUNHLE9BQVAsQ0FBZUUsT0FBZixDQUF1QkMsTUFBTSxJQUFJO0FBQy9CTCxNQUFBQSxPQUFPLENBQUNLLE1BQVIsQ0FBZUEsTUFBTSxDQUFDQSxNQUF0QixFQUE4QkEsTUFBTSxDQUFDSixXQUFyQyxFQUFrREksTUFBTSxDQUFDTixNQUFQLElBQWlCLEVBQW5FO0FBQ0QsS0FGRDtBQUdEOztBQUVEQyxFQUFBQSxPQUFPLENBQUNNLE1BQVIsQ0FBZVAsTUFBTSxDQUFDTyxNQUF0QjtBQUNBLFNBQU9OLE9BQVA7QUFDRCxDQVhNOzs7O0FBYUEsTUFBTU8sY0FBYyxHQUFHLENBQUNULElBQUQsRUFBZ0JVLE9BQWhCLEtBQXNEO0FBQ2xGQSxFQUFBQSxPQUFPLENBQUNKLE9BQVIsQ0FBZ0JLLENBQUMsSUFBSVosYUFBYSxDQUFDQyxJQUFELEVBQU9XLENBQVAsQ0FBbEM7QUFDQSxTQUFPWCxJQUFQO0FBQ0QsQ0FITSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1hbmRDb25maWcgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB7IFByb2dyYW0sIENvbW1hbmQgfSBmcm9tICdAY2Fwb3JhbC9jb3JlJ1xuXG5leHBvcnQgY29uc3QgY3JlYXRlQ29tbWFuZCA9IChwcm9nOiBQcm9ncmFtLCBjb25maWc6IENvbW1hbmRDb25maWcpOiBDb21tYW5kID0+IHtcbiAgY29uc3QgY29tbWFuZCA9IHByb2cuY29tbWFuZChjb25maWcuY29tbWFuZCwgY29uZmlnLmRlc2NyaXB0aW9uKVxuXG4gIGlmIChjb25maWcub3B0aW9ucz8ubGVuZ3RoKSB7XG4gICAgY29uZmlnLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgY29tbWFuZC5vcHRpb24ob3B0aW9uLm9wdGlvbiwgb3B0aW9uLmRlc2NyaXB0aW9uLCBvcHRpb24uY29uZmlnIHx8IHt9KVxuICAgIH0pXG4gIH1cblxuICBjb21tYW5kLmFjdGlvbihjb25maWcuYWN0aW9uKVxuICByZXR1cm4gY29tbWFuZFxufVxuXG5leHBvcnQgY29uc3QgY3JlYXRlQ29tbWFuZHMgPSAocHJvZzogUHJvZ3JhbSwgY29uZmlnczogQ29tbWFuZENvbmZpZ1tdKTogUHJvZ3JhbSA9PiB7XG4gIGNvbmZpZ3MuZm9yRWFjaChjID0+IGNyZWF0ZUNvbW1hbmQocHJvZywgYykpXG4gIHJldHVybiBwcm9nXG59XG4iXX0=