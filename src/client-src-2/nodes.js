//parser sends here after a node has been classified
var Nodes = {

    // 4 + 3
    Math: function(left, right, operator) {
        this._type    = "Math";
        this.left     = left;
        this.right    = right;
        this.operator = operator;
    },

    // 2
    Long: function(value) {
        this._type = "Long";
        this.value = value;
    },

    Double: function(value) {
        this._type = "Double";
        this.value = value;
    },

    // "yoyo"
    String: function(value) {
        this._type = "String";
        this.value = value;
    },

    // [element, element, ...]
    Array: function(elements) {
        this._type = "Array";
        this.elements = elements;
    },

    // print expr
    Print: function(expr) {
        this._type = "Print";
        this.expr = expr;
    },

    // (expr)
    BracketBlock: function(expr) {
        this._type = "BracketBlock";
        this.expr = expr;
    },

    // var name = expr
    AssignVariable: function(name, expr, assignType) {
        this._type = "AssignVariable";
        this.name = name;
        this.expr = expr;
        this.assignType = assignType;
    },

    // val name = expr
    AssignValue: function(name, expr, assignType) {
        this._type = "AssignValue";
        this.name = name;
        this.expr = expr;
        this.assignType = assignType;
    },

    // name = expr
    SetVariable: function(name, expr, assignType) {
        this._type = "SetVariable";
        this.name = name;
        this.expr = expr;
        this.assignType = assignType;
    },

    // name
    CallVariable: function(name) {
        this._type = "CallVariable";
        this.name = name;
    },

    // left == right
    Comparison: function(left, right, comparator) {
        this._type = "Comparison";
        this.left = left;
        this.right = right;
        this.comparator = comparator;
    },

    // if (true) { [expr] } else { [expr] }
    IfBlock: function(evaluation, trueBlock, falseBlock, elseIfs) {
        this._type = "IfBlock";
        this.evaluation = evaluation;
        this.trueBlock = trueBlock;
        this.falseBlock = falseBlock;
        this.elseIfs = elseIfs;
    },

    // else if (true) { [expr] }
    ElseIfBlock: function(evaluation, trueBlock) {
        this._type = "ElseIfBlock";
        this.evaluation = evaluation;
        this.trueBlock = trueBlock;
    },

    // fun(paramaters):ReturnType { [expr] }
    Closure: function(body, parameters, returnType) {
        this._type = "Closure";
        this.body = body;
        this.parameters = parameters;
        this.returnType = returnType;
    },

    // var name: Type
    VariableParameter: function(name, type) {
        this._type = "VariableParameter";
        this.name = name;
        this.type = type;
    },

    // val name: Type
    ValueParameter: function(name, type) {
        this._type = "ValueParameter";
        this.name = name;
        this.type = type;
    },

    // name([args])
    CallFunction: function(name, args) {
        this._type = "CallFunction";
        this.name = [name];
        this.args = args || [];
    },

    // class { [body] }
    Class: function(name, body) {
        this._type = "Class";
        this.name = name;
        this.body = body;
    },

    // visisiblity name(parameters)
    Method: function(visibility, name, body, parameters) {
        this._type = "Method";
        this.visibility = visibility;
        this.name = name;
        this.body = body;
        this.parameters = parameters;
    },

    // new Name([args])
    ClassInstantiation: function(name, args) {
        this._type = "ClassInstantiation";
        this.name = name;
        this.args = args || [];
    },

    // true|false
    Boolean: function(value) {
        this._type = "Boolean";
        this.value = value;
    },

    // (x == y) ? "eq : "neq"
    Ternary: function(test, equal, nequal) {
        this._type = "Ternary";
        this.test = test;
        this.equal = equal;
        this.nequal = nequal;
    },

    Namespace: function(ns) {
        this._type = "Namespace";
        this.name = ns;
    }
};

module.exports = Nodes;