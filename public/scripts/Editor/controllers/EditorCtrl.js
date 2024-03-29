// Generated by CoffeeScript 1.7.1
(function() {
  'use strict';
  var default_lc;

  default_lc = "/* Welcome to Dependency Language in JavaScript!\n Features:\n -Supported Formats:\n Numbers, Strings, arrays\n -Namespaces (format: '$ns') -Built-in Functions:\n f.abs, f.avg\n -Themes for the editor\n -Graph or table presentation of the graph\n -Click 'Run' above or alt+R \n -Alt + [1-5] toggles the panels*/\n \n x=1;\n y=2;\n z=f.avg(x,y,6);";

  angular.module('DLApp').controller('DLCtrl', function($scope, $rootScope, $http, $filter, $element, $document, $timeout, Graph) {
    var DLpath;
    $scope.DLcode = {
      code: default_lc
    };
    DLpath = 'DLcode/test.txt';
    $http.get(DLpath).then(function(response) {
      return $scope.DLcode = {
        code: response.data
      };
    });
    $document.keyup(function(e) {
      var col;
      if (e.altKey) {
        if (e.keyCode === 82) {
          $scope.DLrun(e);
        }
        if (col = $scope.cols[e.keyCode - 49]) {
          return $scope.$apply(col.show = !col.show);
        }
      }
    });
    $scope.styles = {
      active: 'basics',
      sheets: {
        basics: {
          source: 'XML/shade.xml',
          "native": true
        },
        control: {
          source: 'XML/control.xml',
          "native": true
        },
        menu: {
          source: 'XML/menu.xml',
          "native": true
        }
      },
      external: '',
      editor: ''
    };
    $scope.copy_style = function(e, style_name) {
      var copy, i, name;
      _.kill_event(e);
      copy = _.clone($scope.styles.sheets[style_name]);
      style_name = style_name.match(/(.*?)(:? copy(:? \d+)?)?$/)[1];
      name = "" + style_name + " copy";
      i = 0;
      while (name in $scope.styles.sheets) {
        name = "" + style_name + " copy " + (++i);
      }
      copy["native"] = false;
      $scope.styles.sheets[name] = copy;
      return $scope.styles.active = name;
    };
    $scope.delete_style = function(e, style_name) {
      _.kill_event(e);
      delete $scope.styles.sheets[style_name];
      if ($scope.styles.active === style_name) {
        return $scope.styles.active = Object.keys($scope.styles.sheets)[0];
      }
    };
    $scope.DLrun = function(e) {
      if (e) {
        _.kill_event(e);
      }
      return Graph.getGraph($scope.DLcode.code, $scope.styles, function(graph) {
        $scope.graph = graph.evaluate();
        return $rootScope.$broadcast("Run");
      });
    };
    $document.ready(function() {
      return $timeout($scope.DLrun, 100);
    });
    $scope.$watch('styles.active', function() {
      var styles;
      if ($scope.styles.active in $scope.styles.sheets) {
        styles = $scope.styles.sheets[$scope.styles.active];
        if (styles.xml) {
          return $scope.styles.editor = $filter('prettifyCSS')($filter('deSassify')(styles.xml));
        } else {
          return $http.get(styles.source).then(function(response) {
            styles.xml = response.data;
            return $scope.styles.editor = $filter('prettifyCSS')($filter('deSassify')(styles.xml));
          });
        }
      }
    });
    $scope.$watch('styles.editor', function() {
      if ($scope.styles.sheets[$scope.styles.active]) {
        return $scope.styles.sheets[$scope.styles.active].xml = $scope.styles.editor;
      }
    });
    return $scope.$watch('styles.external', function() {
      if (!($scope.styles.external && /^(https?:\/\/)?(\w+\.)+[\w\/]+/.test($scope.styles.external))) {
        return;
      }
      return $http.get(_.corsproxy($scope.styles.external)).then(function(response) {
        var file_name, i, name;
        i = 0;
        file_name = $scope.styles.external.match(/.+?\/(\w+)\.shd/);
        name = file_name && file_name[1] || "external";
        while (name in $scope.styles.sheets) {
          name = "external " + (++i);
        }
        $scope.styles.sheets[name] = {
          source: $scope.styles.external,
          xml: response.data,
          external: true,
          edited: false
        };
        $scope.styles.active = name;
        return $scope.styles.external = '';
      });
    });
  }).directive('menu', function($compile, $rootScope) {
    return {
      scope: {
        col: '=',
        themes: '=',
        setTheme: '&'
      },
      restrict: 'C',
      controller: function($scope) {
        $scope.menuitems || ($scope.menuitems = {
          show: false
        });
        return $scope.$on('bg_click', function() {
          return $scope.$apply(function() {
            return $scope.menuitems.show = false;
          });
        });
      },
      link: function(scope, elm, attrs) {
        var menu_items;
        elm.children('.menu-title').bind('click', function(e) {
          var show;
          _.kill_event(e);
          show = !scope.menuitems.show;
          $rootScope.$broadcast('bg_click');
          return scope.$apply(function() {
            return scope.menuitems.show = show;
          });
        });
        menu_items = elm.children('.menu-items');
        menu_items.attr('ng-class', "{in:menuitems.show}");
        menu_items.bind('click', _.kill_event);
        return $compile(menu_items)(scope);
      }
    };
  });

}).call(this);

//# sourceMappingURL=EditorCtrl.map
