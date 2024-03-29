// Generated by CoffeeScript 1.7.1
(function() {
  angular.module('ShadeApp').factory('vTextProvider', function() {
    return function(template) {
      this.restrict = 'ACE';
      this.transclude = !!template.match('ng-transclude');
      this.replace = true;
      this.scope = true;
      this.template = template.replace(/\/?>/, function(match) {
        return ' ng-model="vars[vText].model" ' + match;
      });
      this.link = function(scope, elm, attr) {
        scope.vText = attr.vText;
        if (attr.label) {
          return elm.after('<span>' + attr.label + '</span>');
        }
      };
    };
  });

}).call(this);

//# sourceMappingURL=vTextProvider.map
