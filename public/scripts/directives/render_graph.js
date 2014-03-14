// Generated by CoffeeScript 1.7.1
(function() {
  angular.module('DLApp').directive('renderGraph', function() {
    return {
      restrict: 'E',
      require: '?ngModel',
      scope: false,
      controller: function($scope, $rootScope, $element, $compile, graphService) {
        $scope.gshow = false;
        $scope.themes = ['Graph', 'Table'];
        $scope.elems = {};
        $scope.elems['Table'] = $compile('<div ng-hide="gshow"></div>')($scope);
        $scope.elems['Graph'] = $compile('<div ng-show="gshow"></div>')($scope);
        _.each($scope.elems, function(value) {
          return $element.append(value);
        });
        $rootScope.$on('Run', function() {
          return _.each($scope.themes, function(value) {
            graphService.deleteGraph(value);
            return graphService.drawGraph[value]($scope.$parent.graph, $scope.elems[value][0]);
          });
        });
        return $scope.setTheme = function(name) {
          var _ref, _ref1;
          graphService.deleteGraph((_ref = name === 'Graph') != null ? _ref : {
            'Table': 'Graph'
          });
          graphService.drawGraph[name]($scope.$parent.graph, $scope.elems[name][0]);
          return $scope.gshow = (_ref1 = name === 'Graph') != null ? _ref1 : {
            "true": false
          };
        };
      }
    };
  });

}).call(this);

//# sourceMappingURL=render_graph.map
