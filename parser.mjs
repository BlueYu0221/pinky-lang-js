import {
    TOK_OR, TOK_AND, TOK_NE, TOK_EQEQ, TOK_GT, TOK_GE, TOK_LT, TOK_LE,
    TOK_PLUS, TOK_MINUS, TOK_STAR, TOK_SLASH, TOK_MOD, TOK_NOT, TOK_CARET,
    TOK_INTEGER,TOK_FLOAT, TOK_TRUE, TOK_FALSE, TOK_STRING, TOK_LPAREN, TOK_RPAREN, TOK_PRINT, TOK_PRINTLN, TOK_ASSIGN,
    TOK_ELSE,
    TOK_END,
    TOK_IDENTIFIER,
    TOK_IF,
    TOK_THEN,
    TOK_WHILE,
    TOK_DO,
    TOK_FOR,
    TOK_COMMA,
    TOK_FUNC,
    TOK_RET
} from './tokens.mjs'

import {LogicalOp, BinOp, UnOp, Integer, Float, Bool, Str, Grouping, Assignment, PrintStmt, Stmts, Identifier, IfStmt, WhileStmt, ForStmt, Param, FuncDecl, FuncCall, FuncCallStmt, RetStmt} from './model.mjs'

export default class Parser {
    constructor(tokens){
        this.tokens = tokens;
        this.curr = 0;
    }

    advance(){
        let token = this.tokens[this.curr];
        // 消化掉一个位置
        this.curr = this.curr + 1;
        return token;
    }

    peek(){
        return this.tokens[this.curr];
    }

    is_next(expected_type){
        if( this.curr >= this.tokens.length ){
            return false;
        }
        return this.peek().token_type == expected_type;
    }

    previous_token(){
        return this.tokens[this.curr - 1];
    }

    expect(expected_type){
        if( this.curr >= this.tokens.length ){
            throw new Error(`Found ${this.previous_token().lexeme} at the end of Parsing, At line ${this.previous_token().line}`);
        }else if( this.peek().token_type == expected_type ){
            let token = this.advance();
            return token;
        }else{
            throw new Error(`Expected ${expected_type}, found ${this.peek().lexeme}, At line ${this.peek().line}`);
        }
    }

    match(expected_type){
        if( this.curr >= this.tokens.length ){
            return false;
        }

        if( this.peek().token_type != expected_type ){
            return false;
        }
        this.curr = this.curr + 1;
        return true;
    }

    primary(){
        if( this.match( TOK_INTEGER ) ){
            return new Integer( parseInt(this.previous_token().lexeme), this.previous_token().line );
        }else if( this.match( TOK_FLOAT ) ){
            return new Float( parseFloat(this.previous_token().lexeme), this.previous_token().line );
        }else if( this.match( TOK_TRUE ) ){
            return new Bool( true, this.previous_token().line );
        }else if( this.match( TOK_FALSE ) ){
            return new Bool( false, this.previous_token().line );
        }else if( this.match( TOK_STRING ) ){
            return new Str( this.previous_token().lexeme.slice(1, -1), this.previous_token().line );
        }else if( this.match( TOK_LPAREN ) ){
            let val = this.expr();
            if( !this.match( TOK_RPAREN ) ){
                throw new Error( `Error: ")" expected. at Line ${this.previous_token().line}` );
            }else{
                return new Grouping( val, this.previous_token().line );
            }
        }else{
            let identifier = this.expect(TOK_IDENTIFIER)
            if( this.match( TOK_LPAREN ) ){
                // 函数调用
                let args = this.args()
                this.expect(TOK_RPAREN)
                return new FuncCall( identifier.lexeme, args, this.previous_token().line );
            }else{
                return new Identifier( identifier.lexeme, this.previous_token().line );
            }
            
        }
    }

    exponent(){
        let val = this.primary();
        while( this.match( TOK_CARET ) ){
            let op = this.previous_token();
            let right = this.exponent();
            val = new BinOp( op, val, right, op.line );
        }
        return val;
    }

    unary(){
        while( this.match( TOK_NOT ) || this.match( TOK_MINUS ) || this.match( TOK_PLUS)){
            let op = this.previous_token();
            let operand = this.unary();
            return new UnOp( op, operand, op.line );
        }

        return this.exponent();
    }

    modulo(){
        let val = this.unary();
        while( this.match(TOK_MOD) ){
            let op = this.previous_token();
            let right = this.unary();
            val = new BinOp( op, val, right, op.line );
        }
        return val;
    }

    multiplication(){
        let val = this.modulo();
        while( this.match( TOK_STAR ) || this.match( TOK_SLASH ) ){
            let op = this.previous_token();
            let right = this.modulo();
            val = new BinOp( op, val, right, op.line );
        }
        return val;
    }

    addition(){
        let val = this.multiplication();
        while( this.match( TOK_PLUS ) || this.match( TOK_MINUS ) ){
            let op = this.previous_token();
            let right = this.multiplication();
            val = new BinOp( op, val, right, op.line );
        }
        return val;
    }

    comparison(){
        let val = this.addition();
        while( this.match(TOK_GT) || this.match(TOK_GE) || this.match(TOK_LT) || this.match(TOK_LE) ){
            let op = this.previous_token();
            let right = this.addition();
            val = new BinOp( op, val, right, op.line );
        }
        return val;
    }

    equality(){
        let val = this.comparison();
        while( this.match( TOK_NE ) || this.match( TOK_EQEQ )){
            let op = this.previous_token();
            let right = this.comparison();
            val = new BinOp( op, val, right, op.line );
        }
        return val;
    }

    logical_and(){
        let val = this.equality();
        while( this.match( TOK_AND ) ){
            let op = this.previous_token();
            let right = this.equality();

            val = new LogicalOp( op, val, right, op.line );
        }
        return val;
    }

    logical_or(){
        let val = this.logical_and();
        while( this.match( TOK_OR ) ){
            let op = this.previous_token();
            let right = this.logical_and();
            val = new LogicalOp( op, val, right, op.line );
        }
        return val;
    }


    expr(){
        return this.logical_or();
    }

    print_stmt(end){
        if( this.match( TOK_PRINT ) || this.match(TOK_PRINTLN) ){
            let val = this.expr();
            return new PrintStmt(val, end, this.previous_token().line)
        }
    }

    if_stmt(){
        this.expect(TOK_IF)
        let test = this.expr();
        this.expect(TOK_THEN);
        let then_stmts = this.stmts();
        let else_stmts = null;

        if( this.is_next(TOK_ELSE) ){
            this.advance();
            else_stmts = this.stmts();
        }

        this.expect(TOK_END)

        return new IfStmt(test, then_stmts, else_stmts, this.previous_token().line)
    }

    while_stmt(){
        this.expect(TOK_WHILE)
        let test = this.expr();
        this.expect(TOK_DO);
        let body_stmts = this.stmts();
        this.expect(TOK_END);
        return new WhileStmt( test, body_stmts, this.previous_token().line );
    }

    for_stmt(){
        this.expect(TOK_FOR);
        let identifier = this.primary();
        this.expect(TOK_ASSIGN);
        let start = this.expr();
        this.expect(TOK_COMMA);
        let end = this.expr();
        let step = null
        if( this.is_next(TOK_COMMA) ){
            this.advance()
            step = this.expr();
        }
        this.expect(TOK_DO);
        let body_stmts = this.stmts();
        this.expect(TOK_END);
        return new ForStmt( identifier, start, end, step, body_stmts, this.previous_token().line );
    }

    args(){
        let args = []
        while( !this.is_next(TOK_RPAREN) ){
            args.push( this.expr() )
            if( !this.is_next( TOK_RPAREN ) ){
                this.expect(TOK_COMMA)
            }
        }
        return args
    }

    params(){
        let params = [];
        let numparams = 0;
        while( !this.is_next( TOK_RPAREN ) ){
            let name = this.expect( TOK_IDENTIFIER )
            numparams += 1
            if( numparams > 255 ){
                throw new Error(`Functions cannot have more than 255 parameters. at line ${name.line}`);
            }
            params.push( new Param( name.lexeme, this.previous_token().line ) )
            if( !this.is_next( TOK_RPAREN )  ){
                this.expect( TOK_COMMA )
            }
        }
        return params;
    }

    func_decl(){
        this.expect(TOK_FUNC)
        let name = this.expect(TOK_IDENTIFIER)
        this.expect(TOK_LPAREN)
        let params = this.params()
        this.expect(TOK_RPAREN)
        let body_stmts = this.stmts()
        this.expect(TOK_END)
        return new FuncDecl(name.lexeme, params, body_stmts, name.line )
    }

    ret_stmt(){
        this.expect(TOK_RET)
        let value = this.expr();
        return new RetStmt( value, this.previous_token().line);
    }

    stmt(){
        if( this.peek().token_type == TOK_PRINT ){
            return this.print_stmt('')
        }else if( this.peek().token_type == TOK_PRINTLN ){
            return this.print_stmt('\r\n')
        }else if( this.peek().token_type == TOK_IF ){
            return this.if_stmt();
        }else if( this.peek().token_type == TOK_WHILE ){
            return this.while_stmt();
        }else if( this.peek().token_type == TOK_FOR ){
            return this.for_stmt();
        }else if( this.peek().token_type == TOK_FUNC){
            return this.func_decl();
        }else if( this.peek().token_type == TOK_RET){
            return this.ret_stmt();
        }else{
            let left = this.expr();
            if( this.match( TOK_ASSIGN ) ){
                // 赋值语句
                let right = this.expr();
                return new Assignment(left, right, this.previous_token().line)
            }else{
                return new FuncCallStmt(left)
            }
        }
    }

    stmts(){
        let stmts = []
        while( this.curr < this.tokens.length && !this.is_next(TOK_ELSE) && !this.is_next(TOK_END) ){
            let stmt = this.stmt();
            stmts.push(stmt);
        }

        return new Stmts( stmts, this.previous_token() ? this.previous_token().line : -1 );
    }

    program(){
        let stmts = this.stmts()
        return stmts
    }

    // 解析方法
    parse(){
        let ast = this.program();
        return ast;
    }
}