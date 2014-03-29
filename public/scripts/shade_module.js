// Generated by CoffeeScript 1.7.1

/*
.directive 'popup', ($templateCache) ->
    restrict: 'E'
    scope: false
    link:
      pre: (scope, elm, attr) ->
        $templateCache.put attr.id, elm.html()

  .directive 'popup', () ->
    restrict: 'E'
    transclude: true
    scope: false
    template: '<div class="popupt" ng-transclude/>'
 */

(function() {
  angular.module('ShadeApp', ['ShadeServices', 'ngGrid', 'mgcrea.ngStrap.popover', 'ui.bootstrap']).directive('btn', function($compile, $timeout, $templateCache) {
    return {
      restrict: 'C',
      replace: true,
      scope: false,
      transclude: true,
      template: function(elm, attr) {
        var cbs, events, handlers, toAppend;
        toAppend = '';
        if (attr.controlBlock) {
          cbs = (function() {
            var cb_arr, obj;
            obj = {};
            cb_arr = attr.controlBlock.split(';');
            cb_arr = _.map(cb_arr, function(str) {
              return str.split(/\s?,\s?/);
            });
            _.each(cb_arr, function(arr) {
              obj[arr[0]] = obj[arr[0]] || [];
              return obj[arr[0]].push(arr.slice(1));
            });
            return obj;
          })();
          events = {
            Click: 'ng-click='
          };
          handlers = {
            setDL: function(name, val) {
              return 'vars[&quot;' + name + '&quot;].model=' + val + ';';
            },
            popup: function(popup, location) {
              return "popup('" + popup + "','" + location + "')";
            }
          };
          _.each(cbs, function(cb, name) {
            return toAppend += (events[name] || events.Click) + '"' + (_.map(cb, function(el) {
              return handlers[el[0]](el[1], el[2]);
            })).join('') + '" ';
          });
        }
        return '<button ' + toAppend + 'ng-transclude></button>';
      },
      link: function(scope) {
        return scope.popup = function(id, elm) {
          var clone, popup;
          popup = angular.element('#' + id);
          if (popup.attr('container') !== '#' + elm) {
            popup.triggerHandler('leave');
            clone = popup.clone();
            popup.after(clone).remove();
            clone.children().removeAttr('ng-transclude');
            clone.attr({
              'container': '#' + elm,
              'bs-popover': '',
              'trigger': 'manual',
              'template': angular.element('<div />').append(angular.element('<div />').append(angular.element('<div class="popupt"/>').append(clone.children()))).html()
            });
            popup = $compile(clone)(scope);
          }
          $timeout((function() {
            return popup.triggerHandler('popup');
          }), 50);
        };
      }
    };
  }).directive('testDl', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      templateUrl: 'directive-templates/testdl.html',
      link: function(scope, elm, attrs) {
        scope.variable = attrs.vDL;
        scope.setDLVar = function() {
          return scope.graph.set(scope.variable, Number(scope.toSet));
        };
        return scope.unsetDLVar = function() {
          return scope.graph.unset(scope.variable, Number(scope.toSet));
        };
      }
    };
  }).directive('vText', function() {
    return {
      restrict: 'EAC',
      replace: true,
      scope: true,
      template: '<div><input type="text" ng-model="vars[vText].model"></div>',
      link: {
        pre: function(scope, elm, attr) {
          return scope.vText = attr.vText;
        }
      }
    };
  }).directive('vActiveTabIndex', function() {
    return {
      restrict: 'A',
      link: function(scope, elm, attr) {
        scope.vactive = attr.vActiveTabIndex;
        scope.$watch('vars[vactive].model', function(vactive) {
          vactive = Number(vactive);
          if (angular.isDefined(scope.tabs[vactive])) {
            return _.each(scope.tabs, function(tab, ind) {
              tab.active = false;
              if (ind === vactive) {
                return tab.active = true;
              }
            });
          }
        });
        return scope.$watch('active', function(active) {
          return scope.vars[scope.vactive].model = active;
        });
      }
    };
  }).directive('dropDown', function($rootScope, ngGridFlexibleHeightPlugin) {
    return {
      restrict: 'E',
      scope: true,
      template: '<ul class="dropdown" ng-click="dropdown($event,ghide)"><div class="selectedItems">{{selected}}</div> <div class="gridStyle" ng-grid="gridOptions" ng-class="{hide:ghide}" ng-click="select($event)" ></div></ul>',
      link: {
        pre: function(scope, elm, attr) {
          var header, items;
          header = attr.header.split('|');
          items = attr.items.split(',').map(function(elm) {
            return elm.split('|');
          });
          scope.myData = items.map(function(elm) {
            return elm.reduce((function(obj, el, ind) {
              obj[header[ind]] = el;
              return obj;
            }), {});
          });
          scope.selected = ["Click me"];
          scope.gridOptions = {
            data: 'myData',
            selectedItems: scope.selected,
            multiSelect: !!attr.multiSelect,
            plugins: [
              new ngGridFlexibleHeightPlugin({
                maxHeight: 300
              })
            ],
            enableSorting: false,
            rowHeight: 27
          };
          scope.ghide = true;
          scope.dropdown = function($event, state) {
            _.kill_event($event);
            return scope.ghide = !state;
          };
          scope.select = function($event) {
            return _.kill_event($event);
          };
          $rootScope.$on('bg_click', function() {
            return scope.dropdown();
          });
          if (!attr.multiSelect) {
            return scope.$watchCollection('selected', function() {
              return scope.ghide = true;
            });
          }
        }
      }
    };
  }).directive('renderPanel', function($compile, $rootScope, shadeTemplate) {
    return {
      restrict: 'E',
      scope: {
        vars: '=',
        graph: '=',
        styles: '='
      },
      link: function(scope, elm) {
        return $rootScope.$on('Run', function() {
          if (scope.data = shadeTemplate.toHTML(scope.styles)) {
            elm.html('<style>' + scope.data.styles + '</style>' + scope.data.body);
            return $compile(elm.contents())(scope);
          }
        });
      }
    };
  }).directive('prettyPrintPanel', function($filter, shadeTemplate) {
    return {
      restrict: 'A',
      replace: true,
      template: '<div class="pp-panel"></div>',
      link: function(scope, elm, attrs) {
        return scope.$watch(attrs.prettyPrintPanel, function(shade) {
          var code, pre, raw_html;
          raw_html = $filter('indentHTML')((shadeTemplate.toHTML(shade) || {
            body: ''
          }).body);
          pre = angular.element('<pre class="prettyprint lang-html" style="font-size:0.75em"></pre>');
          code = angular.element('<code></code>');
          code.html($filter('escapeHTML')(raw_html));
          pre.append(code);
          elm.html(pre);
          return prettyPrint();
        });
      },
      controller: function($scope, $http) {
        var themes;
        $scope.themes = themes = {
          list: ['google-code-light', 'solarized-dark', 'solarized-light', 'sons-of-obsidian-dark', 'tomorrow-night-blue', 'tomorrow-night-dark', 'tomorrow-night-light', 'tomorrow-night-eighties'],
          selected: 'google-code-light'
        };
        return $scope.$watch('themes.selected', function(theme_name) {
          var url;
          url = "styles/gprettify/" + theme_name + ".css";
          return $http.get(url).then(function(response) {
            return themes.css = response.data;
          });
        });
      }
    };
  }).service('shadeTemplate', function($http, x2js, ShadeParser, ShadeAttrDictionary) {
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
      _.extend(parsed, ShadeAttrDictionary);
      return {
        'body': template(parsed || {}),
        'styles': (parsed || {
          styles: ''
        }).styles
      };
    };
    return this;
  }).factory('ngGridFlexibleHeightPlugin', function() {
    var ngGridFlexibleHeightPlugin;
    return ngGridFlexibleHeightPlugin = function(opts) {
      var self;
      self = this;
      self.grid = null;
      self.scope = null;
      self.init = function(scope, grid, services) {
        var innerRecalcForData, recalcHeightForData;
        self.domUtilityService = services.DomUtilityService;
        self.grid = grid;
        self.scope = scope;
        recalcHeightForData = function() {
          setTimeout(innerRecalcForData, 1);
        };
        innerRecalcForData = function() {
          var extraHeight, footerPanelSel, gridId, naturalHeight, newViewportHeight;
          gridId = self.grid.gridId;
          footerPanelSel = "." + gridId + " .ngFooterPanel";
          extraHeight = self.grid.$topPanel.height() + $(footerPanelSel).height();
          naturalHeight = self.grid.$canvas.height() + 1;
          if (opts != null) {
            if ((opts.minHeight != null) && (naturalHeight + extraHeight) < opts.minHeight) {
              naturalHeight = opts.minHeight - extraHeight - 2;
            }
            if ((opts.maxHeight != null) && (naturalHeight + extraHeight) > opts.maxHeight) {
              naturalHeight = opts.maxHeight - extraHeight - 2;
            }
          }
          newViewportHeight = naturalHeight + 2;
          if (!self.scope.baseViewportHeight || self.scope.baseViewportHeight !== newViewportHeight) {
            self.grid.$viewport.css("height", newViewportHeight + "px");
            self.grid.$root.css("height", (newViewportHeight + extraHeight) + "px");
            self.scope.baseViewportHeight = newViewportHeight;
            self.domUtilityService.RebuildGrid(self.scope, self.grid);
          }
        };
        self.scope.catHashKeys = function() {
          var hash, idx;
          hash = "";
          idx = void 0;
          for (idx in self.scope.renderedRows) {
            hash += self.scope.renderedRows[idx].$$hashKey;
          }
          return hash;
        };
        self.scope.$watch("catHashKeys()", innerRecalcForData);
        self.scope.$watch(self.grid.config.data, recalcHeightForData);
      };
    };
  });

}).call(this);
