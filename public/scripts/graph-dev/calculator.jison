﻿/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
true|false             return 'BOOLEAN'
(\$|[a-z])([a-z0-9_$])* return 'IDENTIFIER'
(\'|\")(\\.|[^\"])*(\'|\") return 'STRING'
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
"!"                   return '!'
"%"                   return '%'
"("                   return '('
")"                   return ')'
"{"                   return '{'
"}"                   return '}'
","                   return ','
"."                   return '.'
"PI"                  return 'PI'
"E"                   return 'E'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%right '!'
%right '%'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { typeof console !== 'undefined' ? console.log($1) : print($1);
          return $1; }
    ;

e
    : e '+' e
        {$$ = $1+$3;}
    | e '-' e
        {$$ = $1-$3;}
    | e '*' e
        {$$ = $1*$3;}
    | e '/' e
        {$$ = $1/$3;}
    | e '^' e
        {$$ = Math.pow($1, $3);}
    | e '!'
        {{
          $$ = (function fact (n) { return n==0 ? 1 : fact(n-1) * n })($1);
        }}
    | e '%'
        {$$ = $1/100;}
    | '-' e %prec UMINUS
        {$$ = -$2;}
    | '(' e ')'
        {$$ = $2;}
    | NUMBER
        {$$ = Number(yytext);}
    | BOOLEAN
        {$$ = (yytext === 'true');}
    | E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    | variablecall
    | STRING
        {$$ = yytext.substring(1,yytext.length-1);}
    | '{' csv '}'
        {$$ = yy.createArray($csv);}
    ;

csv
    : e -> [$e]
    | csv "," e
        { $csv.push($e); $$ = $csv; }
    ;

variablecall
    : objectref '('')'            
        {$$ = yy.callFunction($1);}  
    | objectref '(' arguments ')'   
        {$$ = yy.callFunction($1,$3);}
    | objectref                     
        {$$ = yy.getVariableValue($1);}
    ;

objectref
    : IDENTIFIER
        { $$ = [$1]; }
    |   objectref '.' IDENTIFIER
        { $$ = $1; $$.push($3); }
    ;

arguments
    : e
        { $$ = [$1]; }
    | arguments ',' e
        { $$ = $1; $1.push($3); }
    ;