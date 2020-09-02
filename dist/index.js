"use strict";

var _core = require("@caporal/core");

var _package = _interopRequireDefault(require("../package.json"));

var _createCommand = require("./utils/createCommand");

var _commands = _interopRequireDefault(require("./commands"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core.program.version(_package.default.version);

(0, _createCommand.createCommands)(_core.program, _commands.default);

_core.program.run(process.argv.slice(2));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJwcm9ncmFtIiwidmVyc2lvbiIsInBqc29uIiwiY29tbWFuZHMiLCJydW4iLCJwcm9jZXNzIiwiYXJndiIsInNsaWNlIl0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUFBLGNBQVFDLE9BQVIsQ0FBZ0JDLGlCQUFNRCxPQUF0Qjs7QUFDQSxtQ0FBZUQsYUFBZixFQUF3QkcsaUJBQXhCOztBQUVBSCxjQUFRSSxHQUFSLENBQVlDLE9BQU8sQ0FBQ0MsSUFBUixDQUFhQyxLQUFiLENBQW1CLENBQW5CLENBQVoiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcm9ncmFtIH0gZnJvbSAnQGNhcG9yYWwvY29yZSdcbmltcG9ydCBwanNvbiBmcm9tICcuLi9wYWNrYWdlLmpzb24nXG5pbXBvcnQgeyBjcmVhdGVDb21tYW5kcyB9IGZyb20gJy4vdXRpbHMvY3JlYXRlQ29tbWFuZCdcbmltcG9ydCBjb21tYW5kcyBmcm9tICcuL2NvbW1hbmRzJ1xuXG5wcm9ncmFtLnZlcnNpb24ocGpzb24udmVyc2lvbilcbmNyZWF0ZUNvbW1hbmRzKHByb2dyYW0sIGNvbW1hbmRzKVxuXG5wcm9ncmFtLnJ1bihwcm9jZXNzLmFyZ3Yuc2xpY2UoMikpXG4iXX0=