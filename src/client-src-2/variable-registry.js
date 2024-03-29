﻿var parser = require('./calculator').parser,
    CalcHandlers = require('./calc-handlers');
    
//variable registry which holds each variable in an entry

var VariableRegistry = function() {
    this.initialise.apply(this, arguments);
};
VariableRegistry.prototype = {

    initialise: function()
    {
        _.bindAll(this);
    },

    addToEntry: function(entry)
    {
        var _entry = new VariableEntry(entry);
        this[entry.name] = _entry.concat(this[entry.name] || {});
    },

    set: function(name,value)
    {
        this[name].set(value);
		this.evaluate(name);
    },

    unset: function(name,value)
    {
        this[name].unset();
    },

    //resolve each variable's value according to its expression
    evaluate: function(changed)
    {
   
		parser.yy = CalcHandlers(this);
		var start = changed ? this.sorted.indexOf(changed)+1 : 0;
		for (var i = 0; i< this.sorted.length-start; i++){
			var entry = this[this.sorted[start+i]];
			if (entry.hasOwnProperty('dependsOn')) {
				var value = parser.parse(entry.expr);
				this[this.sorted[start+i]].value = value		
			}
		}	
	},

	sortDependencies: function()
	{
        //resolve dependencies
        this.edges = this.getEdges();
        //topological sort
		this.sorted = tsort(this.edges);
	},


	
    //get graph edges (source->target) from dependencies 
	getEdges: function()
	{
		var edges = [];
		for (var v in this) {
			var entry = this[v];
			if (entry.hasOwnProperty('dependedOnBy'))
				for (var i=0; i<entry.dependedOnBy.length;i++)
					edges.push([v,entry.dependedOnBy[i]]);
		}
		return edges;
	}

};

var VariableEntry = function(entry) {
    
    this.initialise.apply(this, arguments);
    
    if (!entry) {
        this.name = "";
        this.expr = "";
        this.value = null;
		this.setValue = null;
        this.dependsOn = [];
        this.dependedOnBy = [];
    }
    else
    {    
        this.expr = entry.expr || "";
        this.value = entry.value ||null;
		this.setValue = entry.setValue || null;
        this.dependsOn = entry.dependsOn || [];
        this.dependedOnBy = entry.dependedOnBy || [];
    }

   
        
};
VariableEntry.prototype = {

    initialise: function()
    {
        _.bindAll(this);
    },

    concat: function(entry) 
    {
        if(entry) {
                this.expr = entry.expr ? entry.expr : this.expr;
                this.value = entry.value ? entry.value : this.value;
				this.setValue = entry.setValue ? entry.setValue : this.setValue;
                this.dependsOn = this.dependsOn.concat(entry.dependsOn || []);
                this.dependedOnBy = this.dependedOnBy.concat(entry.dependedOnBy || []);
        }
        return this;
    },

    set: function(value)
    {
        this.setValue = value;
    },

    unset: function()
    {
        this.setValue = null;
    },
    
    
};

function tsort(edges) {
  var nodes   = {}, // hash: stringified id of the node => { id: id, afters: lisf of ids }
      sorted  = [], // sorted list of IDs ( returned value )
      visited = {}; // hash: id of already visited node => true
 
  var Node = function(id) {
    this.id = id;
    this.afters = [];
  }
 
  // 1. build data structures
  edges.forEach(function(v) {
    var from = v[0], to = v[1];
    if (!nodes[from]) nodes[from] = new Node(from);
    if (!nodes[to]) nodes[to]     = new Node(to);
    nodes[from].afters.push(to);
  });
 
  // 2. topological sort
  Object.keys(nodes).forEach(function visit(idstr, ancestors) {
    var node = nodes[idstr],
        id   = node.id;
 
    // if already exists, do nothing
    if (visited[idstr]) return;
 
    if (!Array.isArray(ancestors)) ancestors = [];
 
    ancestors.push(id);
 
    visited[idstr] = true;
 
    node.afters.forEach(function(afterID) {
      if (ancestors.indexOf(afterID) >= 0)  // if already in ancestors, a closed chain exists.
        throw new Error('closed chain : ' +  afterID + ' is in ' + id);
 
      visit(afterID.toString(), ancestors.map(function(v) { return v })); // recursive call
    });
 
    sorted.unshift(id);
  });
 
  return sorted;
}
exports.VariableEntry = VariableEntry;
exports.VariableRegistry = VariableRegistry;