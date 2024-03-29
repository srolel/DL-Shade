

%left 'MATH' 'COMPARE' 'BOOLOP' 'TERNARY'

%start program
%%

program
    : EOF
        {  }
    | body EOF
        { return $1; }
    ;


body
    : line -> [$1]
    | body TERMINATOR line
        { $$ = $1; $1.push($3); }
    | body TERMINATOR
    | TERMINATOR
    ;

line
    : PRINT expr -> new yy.Print($2)
    | classdef
    | assignment
    | ifblocks
    | expr
    ;

ifblocks
    : IF '(' expr ')' block -> new yy.IfBlock($3, $5)
    | IF '(' expr ')' block ELSE block -> new yy.IfBlock($3, $5, $7)
    | IF '(' expr ')' block elseifs
        { $$ = new yy.IfBlock($3, $5, false, $6); }
    | IF '(' expr ')' block elseifs ELSE block
        { $$ = new yy.IfBlock($3, $5, $8, $6); }
    ;

elseifs
    : ELSE IF '(' expr ')' block
        { $$ = [new yy.ElseIfBlock($4, $6)]; }
    | elseifs ELSE IF '(' expr ')' block
        { $$ = $1; $1.push(new yy.ElseIfBlock($5, $7)); }
    ;

block
    : '{' '}'
        { $$ = []; }
    | '{' body '}'
        { $$ = $2; }
    ;

assignment
    : VAR IDENTIFIER ASSIGN expr
        { $$ = new yy.AssignVariable($2, $4, $3); }
    | VAL IDENTIFIER ASSIGN expr
        { $$ = new yy.AssignValue($2, $4, $3); }
    | IDENTIFIER ASSIGN expr
        { $$ = new yy.SetVariable($1, $3, $2); }
    ;

expr
    : '(' expr ')' -> new yy.BracketBlock($2)
    | expr MATH expr -> new yy.Math($1, $3, $2)
    | expr COMPARE expr -> new yy.Comparison($1, $3, $2)
    | expr BOOLOP expr -> new yy.Comparison($1, $3, $2)
	| expr TERNARY expr ':' expr -> new yy.Ternary($1, $3, $5)
    | closure
    | instantiation
    | variablecall
    | type
    | namespace
    ;

namespace
    : '$cx' IDENTIFIER -> new yy.Namespace($2)
    ;

parameters
    : parameter
        { $$ = [$1] }
    | parameters ',' parameter
        { $$ = $1; $1.push($3) }
    ;

parameter
    : IDENTIFIER ':' IDENTIFIER -> new yy.ValueParameter($1, $3)
    | VAL IDENTIFIER ':' IDENTIFIER -> new yy.ValueParameter($2, $4)
    | VAR IDENTIFIER ':' IDENTIFIER -> new yy.VariableParameter($2, $4)
    ;

arguments
    : expr
        { $$ = [$1]; }
    | arguments ',' expr
        { $$ = $1; $1.push($3); }
    ;

closure
    : FUN '('')'':' IDENTIFIER block                -> new yy.Closure($6, $5)
    | FUN '(' parameters ')' ':' IDENTIFIER block   -> new yy.Closure($7, $3, $6)
    ;

classdef
    : CLASS IDENTIFIER '{' classbody '}' -> new yy.Class($2, $4)
    ;

classbody
    : classline
        { $$ = [$1]; }
    | classbody TERMINATOR classline
        { $$ = $1; $1.push($3); }
    | classbody TERMINATOR
    ;

classline
    : method
    ;

method
    : PUBLIC FUN IDENTIFIER '('')'':' IDENTIFIER block              -> new yy.Method($1, $3, $8)
    | PUBLIC FUN IDENTIFIER '(' parameters ')' ':' IDENTIFIER block -> new yy.Method($1, $3, $9, $5)
    ;

instantiation
    : NEW IDENTIFIER '('')' -> new yy.ClassInstantiation($2)
    ;

variablecall
    : objectref '('')'              -> new yy.CallFunction($1)
    | objectref '(' arguments ')'   -> new yy.CallFunction($1, $3)
    | objectref                     -> new yy.CallVariable($1)
    ;

objectref
    : IDENTIFIER
        { $$ = [$1]; }
    |   objectref '.' IDENTIFIER
        { $$ = $1; $$.push($3); }
    ;

type
    : LONG              -> new yy.Long($1)
	| DOUBLE            -> new yy.Double($1)
    | STRING            -> new yy.String($1)
    | BOOLEAN           -> new yy.Boolean($1)
    | '{' csv '}'       -> new yy.Array($csv)
	| NULL				-> new yy.Null($1)
    ;

csv
    : expr -> [$expr]
    | csv "," expr
        { $csv.push($expr); $$ = $csv; }
    ;




%%

parser._performAction = parser.performAction;
parser.performAction = function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {
    var ret = parser._performAction.call(this, yytext, yyleng, yylineno, yy, yystate, $$, _$);
    if (this.$._type) {
        this.$.lineNo = yylineno;
    }
    return ret;
};
