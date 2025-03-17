import {
    TOK_OR, TOK_AND, TOK_NE, TOK_EQEQ, TOK_GT, TOK_GE, TOK_LT, TOK_LE,
    TOK_PLUS, TOK_MINUS, TOK_STAR, TOK_SLASH, TOK_MOD, TOK_NOT, TOK_CARET,
    TOK_INTEGER,TOK_FLOAT, TOK_TRUE, TOK_FALSE, TOK_STRING, TOK_LPAREN, TOK_RPAREN, TOK_PRINT, TOK_PRINTLN, TOK_ASSIGN,
} from './tokens.mjs'

import {LogicalOp, BinOp, UnOp, Integer, Float, Bool, Str, Grouping, Assignment, PrintStmt, Stmts, Identifier, IfStmt, WhileStmt, ForStmt, Param, FuncDecl, FuncCall, FuncCallStmt, RetStmt} from './model.mjs'

const bp = {
    '*': 2,
    '/': 2,
    '+': 1,
    '-': 1,
    '(': 0,
    ')': 0
}


export default class PrattParser{
    constructor(tokens){
        this.tokens = tokens;
        this.curr = 0;
    }

    advance(){
        let token = this.tokens[this.curr]
        this.curr = this.curr + 1;
        return token;
    }

    peek(){
        return this.tokens[this.curr];
    }

    is_next(expected_type){
        if( this.curr >= this.tokens.length ){
            return false
        }
        return this.peek().token_type == expected_type;
    }

    expect(expected_type){
        if( this.curr >= this.tokens.length ){
            throw new Error(`Found ${this.previous_token().lexeme} at the end of parsing at line ${this.previous_token().line}`);
        }else if( this.peek().token_type == expected_type){
            let token = this.advance();
            return token;
        }else{
            throw new Error(`Expected ${expected_type}, found ${this.peek().lexeme}, at line ${this.peek().line}`);
        }
    }

    previous_token(){
        return this.tokens[this.curr - 1];
    }

    match(expected_type){
        if( this.curr >= this.tokens.length ){
            return false
        }

        if( this.peek().token_type != expected_type){
            return false
        }

        this.curr = this.curr + 1;
        return true;
    }

    nud(){

        if( this.match(TOK_LPAREN) ){
            let inner = this.expr( bp['('] );
            this.expect(TOK_RPAREN)
            return new Grouping( inner, this.previous_token().line )
        }

        if( this.match(TOK_INTEGER) ){
            return new Integer( parseInt(this.previous_token().lexeme), this.previous_token().line );
        }

        if( this.match( TOK_FLOAT ) ){
            return new Float( parseFloat(this.previous_token().lexeme), this.previous_token().line );
        }
    }

    led(left){
        if( this.match( TOK_PLUS ) || this.match( TOK_MINUS ) || this.match( TOK_SLASH ) || this.match( TOK_STAR ) ){
            let op = this.previous_token()
            // console.log('op: ', op)
            let right = this.expr(bp[op.lexeme])
            return new BinOp( op, left, right, op.line )
        }
    }

    // 3 + 4 * 2
    expr(rbp=0){
        let left = this.nud();

        while( this.curr < this.tokens.length &&  bp[this.peek().lexeme] > rbp ){
            let idx = this.curr
            console.log('Before: 当前第'+this.curr+'个token: ', this.tokens[this.curr].lexeme, ', rbp: ', rbp, ', this.peek().lexeme: ', this.curr < this.tokens.length && this.peek().lexeme + ', 位置: ' + this.curr);
            left = this.led( left )
            console.log('After:  当前第'+idx+'个token: ', this.tokens[idx].lexeme, ', rbp: ', rbp, ', this.peek().lexeme: ', this.curr < this.tokens.length && this.peek().lexeme + ', 位置: ' + this.curr);
        }
        return left;
    }

    // 解析入口函数
    parse(){
        let ast = this.expr(0)
        return ast
    }

}



