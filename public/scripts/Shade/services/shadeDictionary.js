// Generated by CoffeeScript 1.7.1
(function() {
  angular.module("ShadeApp").service("ShadeIdentifiers", function(ShadeStaticHandlers, ShadeHandlers) {
    var sh, sw;
    sh = ShadeStaticHandlers;
    sw = ShadeHandlers;
    return (function(key, an, av, sn, sv, c, cb, mn) {
      return {
        attrNames: {
          type: "Attribute Name",
          keys: key(an || {})
        },
        attrValues: {
          type: "Attribute Value",
          keys: key(av || {})
        },
        styleNames: {
          type: "Style Name",
          keys: key(sn || {})
        },
        styleValues: {
          type: "Style Value",
          keys: key(sv || {})
        },
        controls: {
          type: "Control",
          keys: key(c || {})
        },
        controlBlocks: {
          type: "Control Block",
          keys: key(cb || {})
        },
        mainNodes: {
          type: "",
          keys: key(mn || {})
        }
      };
    })(Object.keys, sh.attrNameHandlers, sh.attrValueHandlers, sh.styleNameHandlers, sh.styleValueHandlers, sw.UIHandlers, sw.CbHandlers, sw.nodeHandlers);
  }).service("ShadeAttrDictionary", function(ShadeStaticHandlers) {
    return {
      attrNameHandlers: ShadeStaticHandlers.attrNameHandlers,
      attrValueHandlers: ShadeStaticHandlers.attrValueHandlers
    };
  });

}).call(this);
