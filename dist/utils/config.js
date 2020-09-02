"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _conf = _interopRequireDefault(require("conf"));

var _package = _interopRequireDefault(require("../../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const config = new _conf.default({
  projectName: 'tipe-cli',
  projectVersion: _package.default.version
});
var _default = {
  getAuth() {
    return config.get('tipe.auth');
  },

  setAuth(token) {
    config.set('tipe.auth', token);
  },

  removeAuth() {
    config.delete('tipe.auth');
  }

};
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jb25maWcudHMiXSwibmFtZXMiOlsiY29uZmlnIiwiQ29uZiIsInByb2plY3ROYW1lIiwicHJvamVjdFZlcnNpb24iLCJwanNvbiIsInZlcnNpb24iLCJnZXRBdXRoIiwiZ2V0Iiwic2V0QXV0aCIsInRva2VuIiwic2V0IiwicmVtb3ZlQXV0aCIsImRlbGV0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7O0FBRUEsTUFBTUEsTUFBTSxHQUFHLElBQUlDLGFBQUosQ0FBUztBQUN0QkMsRUFBQUEsV0FBVyxFQUFFLFVBRFM7QUFFdEJDLEVBQUFBLGNBQWMsRUFBRUMsaUJBQU1DO0FBRkEsQ0FBVCxDQUFmO2VBS2U7QUFDYkMsRUFBQUEsT0FBTyxHQUFXO0FBQ2hCLFdBQU9OLE1BQU0sQ0FBQ08sR0FBUCxDQUFXLFdBQVgsQ0FBUDtBQUNELEdBSFk7O0FBSWJDLEVBQUFBLE9BQU8sQ0FBQ0MsS0FBRCxFQUFzQjtBQUMzQlQsSUFBQUEsTUFBTSxDQUFDVSxHQUFQLENBQVcsV0FBWCxFQUF3QkQsS0FBeEI7QUFDRCxHQU5ZOztBQU9iRSxFQUFBQSxVQUFVLEdBQVM7QUFDakJYLElBQUFBLE1BQU0sQ0FBQ1ksTUFBUCxDQUFjLFdBQWQ7QUFDRDs7QUFUWSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbmYgZnJvbSAnY29uZidcbmltcG9ydCBwanNvbiBmcm9tICcuLi8uLi9wYWNrYWdlLmpzb24nXG5cbmNvbnN0IGNvbmZpZyA9IG5ldyBDb25mKHtcbiAgcHJvamVjdE5hbWU6ICd0aXBlLWNsaScsXG4gIHByb2plY3RWZXJzaW9uOiBwanNvbi52ZXJzaW9uLFxufSlcblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXRBdXRoKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGNvbmZpZy5nZXQoJ3RpcGUuYXV0aCcpXG4gIH0sXG4gIHNldEF1dGgodG9rZW46IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbmZpZy5zZXQoJ3RpcGUuYXV0aCcsIHRva2VuKVxuICB9LFxuICByZW1vdmVBdXRoKCk6IHZvaWQge1xuICAgIGNvbmZpZy5kZWxldGUoJ3RpcGUuYXV0aCcpXG4gIH0sXG59XG4iXX0=