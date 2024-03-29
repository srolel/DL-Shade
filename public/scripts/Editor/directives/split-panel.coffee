angular.module('DLApp')

#Split Row directive
#=====

#The element that holds the panels
#-----

.directive 'splitRow', () ->
  restrict: 'E'
  transclude: true
  scope:
    styles: '='
    graph: '='
    cols: '='
    col: '='
    DLcode: '='
  replace: true
  template: '<div class="split-row" ng-transclude></div>'
  controller: ($scope, $element, $compile, $rootScope) ->
    $scope.row = $element[0]
    cols = $scope.cols = []

    $scope.col = (name) ->
      (c for c in cols when c.name is name)[0]

    body = document.getElementsByTagName("body")[0]
    body.addEventListener 'click', (e) ->
      #_.kill_event(e) TODO: find possible bugs, this causes checkboxes not to work etc.
      $rootScope.$broadcast 'bg_click'
    $(document).keyup (e) ->
      $rootScope.$broadcast 'bg_click' if e.keyCode is 27 # esc

    #Used by panels to find their initial part of the view width
    this.equalCols = (ncols) ->
      ncols ||= (c for c in cols when c.show).length
      new_ratio = 1/ncols
      for c in cols
        if c.show
          c.ratio = new_ratio
        else
          c.ratio = 0

    #Used to find the last panel, so that its drag-area can be hidden
    this.findLastCol = () ->
      return unless cols.length
      last_shown = null
      for c in cols
        c.last_shown = false
        last_shown = c if c.show
      console.log(last_shown)
      last_shown.last_shown = true if last_shown


    #Used by panels to add themselves to the row's controller, and add a drag area
    this.addCol = (col) ->
      $scope.$apply () =>
        col.index = cols.length
        cols.push col
        this.equalCols()
        col.div.append $compile('<drag-area ng-show="!last_shown"></drag-area>')(col)

    #Function that calculates panel widths
    dragged = (x) =>
      $scope.$apply () =>
        before = $scope.dragging
        after = cols[i = before.index+1]
        after = cols[++i] until after.show 
        cumRatio = (c.ratio for c in cols when c.index < before.index).reduce(((t, s) -> t + s), 0)
        before.ratio = (x-$scope.row.offsetLeft) / this.row_width - cumRatio

        if before.ratio < 0.1
          before.ratio = 0.1
        after.ratio = 1 - (cols[i].ratio for i of cols when parseInt(i) isnt after.index).reduce(((t, s) -> t + s), 0)
        if after.ratio < 0.1
          after.ratio = 0.1
          before.ratio = 1 - (cols[i].ratio for i of cols when parseInt(i) isnt before.index).reduce(((t, s) -> t + s), 0)

        before.div[0].onresize() if before.div[0].onresize
        after.div[0].onresize() if after.div[0].onresize
        $rootScope.$broadcast 'panel_resized'

    ($scope.row.onresize = () => this.row_width = $scope.row.offsetWidth)()

    this.start_drag = (col, e) ->
      _.kill_event(e)
      $scope.dragging = col

    document.onmousemove = (e) ->
      e.preventDefault();
      dragged(e.clientX) if $scope.dragging
      # trigger mousemoved broadcast unless a resizablePanel has already caught and handled this event
      unless e.caughtBy
        $rootScope.$broadcast 'mousemoved'

    document.onmouseup = () -> 
      $scope.dragging = null
      

    return

#Resizable panel directive
#=====

#Panel element
#-----

.directive 'resizablePanel', ($rootScope, $timeout) ->
  require: '^splitRow'
  restrict: 'E'
  transclude: true
  scope:
    name: '@'
    show: '@'
  replace: true
  template: '<div class="resizable-panel" ng-transclude ng-style="{width: \'\'+(ratio*100)+\'%\'}" ng-show="show"></div>'
  controller: ($scope, $rootScope) ->
    #If toggled
    $scope.$watch 'show', () ->
      $scope.show = !!$scope.show
      $scope.ctrl.equalCols()
      $scope.ctrl.findLastCol()
      setTimeout -> 
        $rootScope.$broadcast 'panel_resized'
  link: (scope, elm, attrs, splitRowCtrl) ->
    scope.themes = []
    scope.div = elm
    scope.ctrl = splitRowCtrl
    scope.mouseover = false
    #Adds itself to the row of panels
    setTimeout (() ->
      scope.show = !!scope.show
      splitRowCtrl.addCol scope
      splitRowCtrl.equalCols()
      splitRowCtrl.findLastCol())
      , 0

    elm.bind 'mousemove', (e) ->
      e.originalEvent.caughtBy = scope.name
      unless scope.mouseover
        $rootScope.$broadcast 'mousemoved', scope.name
    scope.$on 'mousemoved', (e, name) ->
      $timeout () -> scope.mouseover = name is scope.name


#drag area directive
#=====

.directive 'dragArea', () ->
  restrict: 'E'
  replace: true
  template: '<div class="drag-area"></div>'
  scope: false
  link: (scope, elm, attrs) ->
    elm.bind 'mousedown', (e) -> scope.ctrl.start_drag(scope, e)

