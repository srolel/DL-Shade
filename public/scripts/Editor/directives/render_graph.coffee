#Render Graph directive
#=====

#Renders a table or graph view for the DL graph-text
#-----
angular.module('DLApp')

.directive 'renderGraph', () ->
  restrict: 'E'
  require: '?ngModel'
  scope: false

  controller: ($scope, $rootScope, $element, $compile, graphService, $document) ->
  
      $scope.gshow = false;

      $scope.themes = ['Graph','Table']
      $scope.elems = {}
      $scope.elems['Table']=$compile('<div ng-hide="gshow"></div>')($scope)
      $scope.elems['Graph']=$compile('<div ng-show="gshow"></div>')($scope)

      _.each($scope.elems, (value) ->
        $element.append(value))

      $rootScope.$on 'Run', () ->
        _.each($scope.themes, (value) ->
          #redraw graph/table
          graphService.deleteGraph(value)
          graphService.drawGraph[value]($scope.graph,$scope.elems[value][0]))

      $scope.setTheme = (name) ->
        graphService.deleteGraph(name is 'Graph' ? 'Table' : 'Graph' )
        graphService.drawGraph[name]($scope.graph,$scope.elems[name][0])
        $scope.gshow = name is 'Graph' ? true : false
