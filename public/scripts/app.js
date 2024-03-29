// Generated by CoffeeScript 1.7.1
(function() {
  'use strict';
  angular.module('DLApp', ['ShadeApp']).config([
    '$httpProvider', function($httpProvider) {
      $httpProvider.defaults.useXDomain = true;
      return delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
  ]);

  _.kill_event = function(e) {
    if (_.isObject(e)) {
      e.cancelBubble = true;
      e.stopPropagation();
      return e.preventDefault();
    }
  };

  _.corsproxy = function(css_url) {
    var m;
    m = css_url.match(/https?:\/\/(.+)/);
    if (!m) {
      return false;
    }
    return "http://www.corsproxy.com/" + m[1];
  };

  _.position = function(elm) {
    var p;
    p = {
      x: elm.offsetLeft || 0,
      y: elm.offsetTop || 0
    };
    while (elm = elm.offsetParent) {
      p.x += elm.offsetLeft;
      p.y += elm.offsetTop;
    }
    return p;
  };

  String.prototype.toDash = function() {
    return this.replace(/([A-Z])/g, function($1) {
      return "-" + $1.toLowerCase();
    });
  };

  _.toDash = function(str) {
    return str.replace(/([A-Z])/g, function($1) {
      return "-" + $1.toLowerCase();
    });
  };

  _.mapKeys = function(object, callback, thisArg) {
    var result;
    result = {};
    callback = _.createCallback(callback, thisArg, 3);
    _.forOwn(object, function(value, key, object) {
      result[callback(value, key, object)] = value;
    });
    return result;
  };

}).call(this);
