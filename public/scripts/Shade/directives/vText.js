// Generated by CoffeeScript 1.7.1
(function() {
  angular.module('ShadeApp').directive('listBox', function(vTextProvider) {
    return new vTextProvider('<select multiple ng-transclude />');
  }).directive('inputs', function(vTextProvider) {
    return new vTextProvider('<input />');
  }).directive('shdDatePicker', function(vTextProvider) {
    return new vTextProvider('<input type="text" datepicker-popup close-on-date-selection="false" />');
  }).directive('timePicker', function(vTextProvider) {
    return new vTextProvider('<div><timepicker /></div>');
  });

}).call(this);