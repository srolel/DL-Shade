// Generated by CoffeeScript 1.7.1
(function() {
  angular.module('ShadeApp', []).directive('testDl', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      templateUrl: 'directive-templates/testdl.html',
      link: function(scope, elm, attrs) {
        scope.toSet;
        scope.variable = attrs.vdl;
        return scope.setDLVar = function() {
          return scope.graph.set(scope.variable, Number(scope.toSet));
        };
      }
    };
  }).directive('numEdit', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      template: '<input type="text" />',
      link: function(scope, elm, attrs) {}
    };
  }).directive('renderPanel', function($compile, shadeTemplate) {
    return {
      restrict: 'A',
      replace: true,
      template: '<div class="render-panel"></div>',
      scope: true,
      link: function(scope, elm, attrs) {
        scope.vars = [];
        scope.$watch(attrs.renderPanel, function(shade) {
          var data;
          data = shadeTemplate.toHTML(shade);
          if (data) {
            elm.empty();
            elm.append('<style>' + data.styles + '</style>', $compile(data.body)(scope));
            return prettyPrint();
          }
        });
        scope.$on("Run", function() {
          return scope.graph = scope.$parent.$parent.$parent.graph;
        });
        return scope.setDLVar = function(variable) {
          return scope.graph.set(variable, parseInt(scope.vars[variable]));
        };
      }
    };
  }).directive('prettyPrintPanel', function($filter, shadeTemplate) {
    return {
      restrict: 'A',
      replace: true,
      template: '<div class="pp-panel"></div>',
      scope: true,
      link: function(scope, elm, attrs) {
        return scope.$watch(attrs.prettyPrintPanel, function(shade) {
          var code, pre, raw_html;
          raw_html = shadeTemplate.toHTML(shade).body;
          pre = angular.element('<pre class="prettyprint lang-html" style="font-size:0.75em"></pre>');
          code = angular.element('<code></code>');
          code.html($filter('escapeHTML')(raw_html));
          pre.append(code);
          elm.html(pre);
          return prettyPrint();
        });
      },
      controller: function($scope, $http) {
        var theme;
        $scope.$parent.theme = theme = {
          list: ['google-code-light', 'solarized-dark', 'solarized-light', 'sons-of-obsidian-dark', 'tomorrow-night-blue', 'tomorrow-night-dark', 'tomorrow-night-light', 'tomorrow-night-eighties'],
          selected: 'google-code-light'
        };
        return $scope.$watch('theme.selected', function(theme_name) {
          var url;
          url = "styles/gprettify/" + theme_name + ".css";
          return $http.get(url).then(function(response) {
            return theme.css = response.data;
          });
        });
      }
    };
  }).service('shadeTemplate', function($http, x2js, ShadeParser, ShadeDictionary) {
    var template;
    template = function() {};
    $http.get('/scripts/ng_template_shd.js').success(function(data) {
      _.templateSettings.variable = "shd";
      return template = _.template(data);
    }).error(function() {
      return console.log("could not retrieve shade template");
    });
    this.toHTML = function(shade) {
      var parsed;
      parsed = ShadeParser.parse(x2js.xml2json(shade));
      _.extend(parsed, ShadeDictionary);
      return {
        'body': template(parsed),
        'styles': (parsed || {}).styles
      };
    };
    return this;
  });

}).call(this);

//# sourceMappingURL=shade_module.map
