// Generated by CoffeeScript 1.7.1
(function() {
  angular.module('ShadeApp').service('shadeTemplate', function($http, x2js, ShadeParser, ShadeAttrDictionary) {
    var template;
    template = function() {};
    $http.get('/scripts/Shade/ng_template_shd.ejs').success(function(data) {
      _.templateSettings.variable = "shd";
      return template = _.template(data);
    }).error(function() {
      return console.log("Could not retrieve shade template");
    });
    this.toHTML = function(shade) {
      var parsed;
      if (!angular.isObject(shade)) {
        shade = x2js.xml2json(shade);
      }
      parsed = ShadeParser.parse(shade) || {};
      _.extend(parsed, ShadeAttrDictionary);
      return {
        body: template(parsed),
        styles: parsed.styles,
        elementsById: parsed.elementsById
      };
    };
    return this;
  });

}).call(this);
