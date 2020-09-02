"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signout = void 0;

var _config = _interopRequireDefault(require("../utils/config"));

var _prints = _interopRequireDefault(require("../utils/prints"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signout = {
  command: 'signout',
  description: 'Signout from Tipe',

  action() {
    const auth = _config.default.getAuth();

    if (!auth) {
      return console.log(`You're not signed in`);
    }

    _config.default.removeAuth();

    console.log(_prints.default.signedout);
  }

};
exports.signout = signout;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9zaWdub3V0LnRzIl0sIm5hbWVzIjpbInNpZ25vdXQiLCJjb21tYW5kIiwiZGVzY3JpcHRpb24iLCJhY3Rpb24iLCJhdXRoIiwiY29uZmlnIiwiZ2V0QXV0aCIsImNvbnNvbGUiLCJsb2ciLCJyZW1vdmVBdXRoIiwicHJpbnRzIiwic2lnbmVkb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7Ozs7QUFFTyxNQUFNQSxPQUFzQixHQUFHO0FBQ3BDQyxFQUFBQSxPQUFPLEVBQUUsU0FEMkI7QUFFcENDLEVBQUFBLFdBQVcsRUFBRSxtQkFGdUI7O0FBR3BDQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxVQUFNQyxJQUFJLEdBQUdDLGdCQUFPQyxPQUFQLEVBQWI7O0FBRUEsUUFBSSxDQUFDRixJQUFMLEVBQVc7QUFDVCxhQUFPRyxPQUFPLENBQUNDLEdBQVIsQ0FBYSxzQkFBYixDQUFQO0FBQ0Q7O0FBRURILG9CQUFPSSxVQUFQOztBQUNBRixJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUUsZ0JBQU9DLFNBQW5CO0FBQ0Q7O0FBWm1DLENBQS9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbWFuZENvbmZpZyB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi91dGlscy9jb25maWcnXG5pbXBvcnQgcHJpbnRzIGZyb20gJy4uL3V0aWxzL3ByaW50cydcblxuZXhwb3J0IGNvbnN0IHNpZ25vdXQ6IENvbW1hbmRDb25maWcgPSB7XG4gIGNvbW1hbmQ6ICdzaWdub3V0JyxcbiAgZGVzY3JpcHRpb246ICdTaWdub3V0IGZyb20gVGlwZScsXG4gIGFjdGlvbigpIHtcbiAgICBjb25zdCBhdXRoID0gY29uZmlnLmdldEF1dGgoKVxuXG4gICAgaWYgKCFhdXRoKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coYFlvdSdyZSBub3Qgc2lnbmVkIGluYClcbiAgICB9XG5cbiAgICBjb25maWcucmVtb3ZlQXV0aCgpXG4gICAgY29uc29sZS5sb2cocHJpbnRzLnNpZ25lZG91dClcbiAgfSxcbn1cbiJdfQ==