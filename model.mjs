import Token, {
    TOK_LPAREN, TOK_RPAREN, TOK_LCURLY, TOK_RCURLY, TOK_LSQUAR, TOK_RSQUAR,
    TOK_DOT, TOK_COMMA, TOK_PLUS, TOK_STAR, TOK_CARET, TOK_SLASH, TOK_SEMICOLON,
    TOK_QUESTION, TOK_MINUS, TOK_EQEQ, TOK_EQ, TOK_NE, TOK_NOT, TOK_LE, TOK_LT, TOK_GE, TOK_GT,
    TOK_ASSIGN, TOK_COLON, TOK_STRING, TOK_INTEGER, TOK_FLOAT,TOK_IDENTIFIER,  keywords
} from './tokens.mjs'

class Node{

}

class Expr extends Node{

}

class Stmt extends Node{

}

class Decl extends Node{

}

export class Integer extends Expr{
    constructor( value, line ){
        super()
        this.value = value
        this.line = line
    }

    toString(){
        return `Integer[${this.value}]`
    }
}

export class Float extends Expr{
    constructor( value, line ){
        super()
        this.value = value
        this.line = line
    }

    toString(){
        return `Float[${this.value}]`
    }
}

export class Bool extends Expr{
    constructor( value, line ){
        super()
        this.value = value
        this.line = line
    }

    toString(){
        return `Bool[${this.value}]`
    }
}

export class Str extends Expr{
    constructor( value, line ){
        super()
        this.value = value
        this.line = line
    }

    toString(){
        return `String[${this.value}]`
    }
}

export class UnOp extends Expr{
    constructor(op, operand, line){
        super()
        this.op = op
        this.operand = operand
        this.line = line
    }

    toString(){
        return `UnOp(${this.op.lexeme}, ${this.operand})`;
    }
}

export class BinOp extends Expr{
    constructor(op, left, right, line){
        super()
        this.op = op
        this.left = left
        this.right = right
        this.line = line
    }

    toString(){
        return `BinOp(${this.op.lexeme}, ${this.left}, ${this.right})`;
    }
}

export class LogicalOp extends Expr{
    constructor(op, left, right, line){
        super()
        this.op = op
        this.left = left
        this.right = right
        this.line = line
    }

    toString(){
        return `LogicalOp(${this.op.lexeme}, ${this.left}, ${this.right})`;
    }
}

export class Grouping extends Expr{
    constructor(value, line){
        super()
        this.value = value
        this.line = line
    }

    toString(){
        return `Grouping(${this.value})`
    }
}

export class Identifier extends Expr{
    constructor(name, line){
        super()
        this.name = name
        this.line = line
    }

    toString(){
        return `Identifier[${this.name}]`
    }
}

export class Stmts extends Node{
    constructor(stmts, line){
        super()
        this.stmts = stmts
        this.line = line
    }

    toString(){
        return `Stmts(${this.stmts})`
    }
}

export class PrintStmt extends Stmt{
    constructor( value, end, line ){
        super()
        this.value = value
        this.end = end
        this.line = line
    }

    toString(){
        return `PrintStmt(${this.value}, end=${this.end})`
    }
}

export class WhileStmt extends Stmt{
    constructor(test, body_stmts, line){
        super()
        this.test = test
        this.body_stmts = body_stmts
        this.line = line
    }

    toString(){
        return `WhileStmt(${this.test}, ${this.body_stmts})`
    }
}

export class Assignment extends Stmt{
    constructor( left, right, line ){
        super()
        this.left = left
        this.right = right
        this.line = line
    }

    toString(){
        return `Assignment(${this.left}, ${this.right})`
    }
}

export class IfStmt extends Stmt{
    constructor(test, then_stmts, else_stmts, line ){
        super()
        this.test = test
        this.then_stmts = then_stmts
        this.else_stmts = else_stmts
        this.line = line
    }

    toString(){
        return `IfStmt(${this.test}, then:${this.then_stmts}, else: ${this.else_stmts})`
    }
}

export class ForStmt extends Stmt{
    constructor(ident, start, end, step, body_stmts, line){
        super()
        this.ident = ident
        this.start = start
        this.end = end
        this.step = step
        this.body_stmts = body_stmts
        this.line = line
    }

    toString(){
        return `ForStmt(${this.ident}, ${this.start}, ${this.end}, ${this.step}, ${this.body_stmts})`
    }
}


export class FuncDecl extends Decl{
    constructor( name, params, body_stmts, line ){
        super()
        this.name = name
        this.params = params
        this.body_stmts = body_stmts
        this.line = line
    }

    toString(){
        return `FuncDecl(${this.name}, ${this.params}, ${this.body_stmts})`
    }
}

export class Param extends Decl{
    constructor(name, line){
        super()
        this.name = name
        this.line = line
    }

    toString(){
        return `Param[${this.name}]`
    }
}

export class FuncCall extends Expr{
    constructor( name, args, line ){
        super()
        this.name = name
        this.args = args
        this.line = line
    }

    toString(){
        return `FuncCall(${this.name}, ${this.args})`
    }
}

export class FuncCallStmt extends Stmt{
    constructor(expr){
        super()
        this.expr = expr
    }

    toString(){
        return `FuncCallStmt(${this.expr})`
    }
}

export class RetStmt extends Stmt{
    constructor(value, line){
        super()
        this.value = value
        this.line = line
    }

    toString(){
        return `RetStmt[${this.value}]`
    }
}