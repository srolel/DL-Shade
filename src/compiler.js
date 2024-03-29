var parser       = require('./parser').parser,
    fs           = require('fs'),
    nodes        = require('./nodes'),
    lexer        = require('./lexer'),
    rewriter     = require('./rewriter'),
    astValidator = require('./ast-validator'),
    jsCompiler   = require('./js-compiler'),
    util         = require('util');

parser.yy = nodes;

parser.lexer = {

    lex: function()
    {
        var token = this.tokens[this.pos] ? this.tokens[this.pos++] : ['EOF'];
        this.yytext = token[1];
        this.yylineno = token[2];
        return token[0];
    },

    setInput: function(tokens)
    {
        this.tokens = tokens;
        this.pos = 0;
    },

    upcomingInput: function()
    {
        return "";
    }

};

exports.parser = parser;

exports.compile = function(code) {
    var tokens = lexer.tokenise(code);
    //tokens = rewriter.rewrite(tokens);
    console.log(tokens);
    var ast = parser.parse(tokens);
    /*var valid = astValidator.validate(ast);
3
    if (!valid) {
        console.log("Didn't compile due to code error");
    }
          */
    var js = jsCompiler.compile(ast);

    return js;
};