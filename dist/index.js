'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _default = require('../default');

var _default2 = _interopRequireDefault(_default);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _htmlMinifier = require('html-minifier');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _sassdocExtras = require('sassdoc-extras');

var _sassdocExtras2 = _interopRequireDefault(_sassdocExtras);

var _denodeify = require('denodeify');

var _denodeify2 = _interopRequireDefault(_denodeify);

var _swig = require('./swig');

var _swig2 = _interopRequireDefault(_swig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var copy = (0, _denodeify2.default)(_fsExtra2.default.copy);
var renderFile = (0, _denodeify2.default)(_swig2.default.renderFile);
var writeFile = (0, _denodeify2.default)(_fsExtra2.default.writeFile);

var applyDefaults = function applyDefaults(ctx) {
  return (0, _extend2.default)({}, _default2.default, ctx, {
    groups: (0, _extend2.default)(_default2.default.groups, ctx.groups),
    display: (0, _extend2.default)(_default2.default.display, ctx.display)
  });
};

var shortcutIcon = function shortcutIcon(dest, ctx) {
  if (!ctx.shortcutIcon) {
    ctx.shortcutIcon = { type: 'internal', url: 'assets/images/favicon.png' };
  } else if (ctx.shortcutIcon.type === 'internal') {
    ctx.shortcutIcon.url = 'assets/images/' + ctx.shortcutIcon.url;

    return function () {
      return copy(ctx.shortcutIcon.path, _path2.default.resolve(dest, ctx.shortcutIcon.url));
    };
  }
};

exports.default = function (dest, ctx) {
  ctx = applyDefaults(ctx);
  (0, _sassdocExtras2.default)(ctx, 'description', 'markdown', 'display', 'groupName', 'shortcutIcon', 'sort', 'resolveVariables');
  ctx.data.byGroupAndType = _sassdocExtras2.default.byGroupAndType(ctx.data);

  var index = _path2.default.resolve(__dirname, '../views/documentation/index.html.swig');

  return _promise2.default.all([copy(_path2.default.resolve(__dirname, '../assets'), _path2.default.resolve(dest, 'assets')).then(shortcutIcon(dest, ctx)), renderFile(index, ctx).then(function (html) {
    return (0, _htmlMinifier.minify)(html, { collapseWhitespace: true });
  }).then(function (html) {
    return writeFile(_path2.default.resolve(dest, 'index.html'), html);
  })]);
};