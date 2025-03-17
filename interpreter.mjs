import Token, {
    TOK_LPAREN, TOK_RPAREN, TOK_LCURLY, TOK_RCURLY, TOK_LSQUAR, TOK_RSQUAR,
    TOK_DOT, TOK_COMMA, TOK_PLUS, TOK_STAR, TOK_CARET, TOK_SLASH, TOK_SEMICOLON,
    TOK_QUESTION, TOK_MINUS, TOK_EQEQ, TOK_EQ, TOK_NE, TOK_NOT, TOK_LE, TOK_LT, TOK_GE, TOK_GT,
    TOK_ASSIGN, TOK_COLON, TOK_STRING, TOK_INTEGER, TOK_FLOAT,TOK_IDENTIFIER,
    TOK_OR, TOK_AND, TOK_MOD
} from './tokens.mjs'
import {LogicalOp, BinOp, UnOp, Integer, Float, Bool, Str, Grouping, Assignment, PrintStmt, Stmts, Identifier, IfStmt, WhileStmt, ForStmt, FuncDecl, FuncCall, RetStmt, FuncCallStmt} from './model.mjs'
import Environment from './state.mjs'

const TYPE_NUMBER = 'TYPE_NUMBER'
const TYPE_STRING = 'TYPE_STRING'
const TYPE_BOOL = 'TYPE_BOOL'


export default class Interpreter{
    interpret(node, env){
        if( node instanceof Integer ){
            return [ TYPE_NUMBER, parseFloat(node.value) ];
        }else if( node instanceof Float ){
            return [ TYPE_NUMBER, parseFloat(node.value) ];
        }else if( node instanceof Str ){
            return [ TYPE_STRING, String(node.value) ];
        }else if( node instanceof Bool ){
            return [TYPE_BOOL, node.value]
        }else if( node instanceof Grouping ){
            return this.interpret( node.value, env );
        }else if( node instanceof Identifier ){
            let value = env.get_var( node.name );
            if( !value ){
                throw new Error(`Undeclared identifier ${node.name}, at line ${node.line}`);
            }

            if( value[1] == undefined ){
                throw new Error(`Uninitialized identifier ${node.name}, at line ${node.line}`);
            }
            return value
        }else if( node instanceof Assignment ){
            let [righttype, rightval] = this.interpret(node.right, env)
            env.set_var( node.left.name, [righttype, rightval] )
        }else if( node instanceof BinOp ){
            let [lefttype, leftval] = this.interpret( node.left, env );
            let [righttype, rightval] = this.interpret( node.right, env );

            if( node.op.token_type == TOK_PLUS ){

                if( lefttype == TYPE_NUMBER && righttype == TYPE_NUMBER){
                    return [ TYPE_NUMBER, leftval + rightval ];
                }else if( lefttype == TYPE_STRING || righttype == TYPE_STRING){
                    return [ TYPE_STRING, String( leftval ) + String( rightval ) ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} between ${lefttype} and ${righttype}. at Line ${node.op.line}`);
                }

            }else if( node.op.token_type == TOK_MINUS ){
                if( lefttype == TYPE_NUMBER && righttype == TYPE_NUMBER){
                    return [ TYPE_NUMBER, leftval - rightval ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} between ${lefttype} and ${righttype}. at Line ${node.op.line}`);
                }
            }else if( node.op.token_type == TOK_STAR ){
                if( lefttype == TYPE_NUMBER && righttype == TYPE_NUMBER){
                    return [ TYPE_NUMBER, leftval * rightval ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} between ${lefttype} and ${righttype}. at Line ${node.op.line}`);
                }
            }else if( node.op.token_type == TOK_SLASH ){
                if( rightval == 0 ){ // 除0错误
                    throw new Error(`Division by zero. at Line ${node.op.line}`);
                }

                if( lefttype == TYPE_NUMBER && righttype == TYPE_NUMBER){
                    return [ TYPE_NUMBER, leftval / rightval ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} between ${lefttype} and ${righttype}. at Line ${node.op.line}`);
                }
            }else if( node.op.token_type == TOK_MOD ){
                if( lefttype == TYPE_NUMBER && righttype == TYPE_NUMBER){
                    return [ TYPE_NUMBER, leftval % rightval ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} between ${lefttype} and ${righttype}. at Line ${node.op.line}`);
                }
            }else if( node.op.token_type == TOK_CARET ){
                if( lefttype == TYPE_NUMBER && righttype == TYPE_NUMBER){
                    return [ TYPE_NUMBER, leftval ** rightval ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} between ${lefttype} and ${righttype}. at Line ${node.op.line}`);
                }
            }else if( node.op.token_type == TOK_GT ){
                if( (lefttype == TYPE_NUMBER && righttype == TYPE_NUMBER) || ( lefttype == TYPE_STRING && righttype == TYPE_STRING ) ){
                    return [ TYPE_BOOL, leftval > rightval ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} between ${lefttype} and ${righttype}. at Line ${node.op.line}`);
                }
            }else if( node.op.token_type == TOK_GE ){
                if( (lefttype == TYPE_NUMBER && righttype == TYPE_NUMBER) || ( lefttype == TYPE_STRING && righttype == TYPE_STRING ) ){
                    return [ TYPE_BOOL, leftval >= rightval ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} between ${lefttype} and ${righttype}. at Line ${node.op.line}`);
                }
            }else if( node.op.token_type == TOK_LT ){
                if( (lefttype == TYPE_NUMBER && righttype == TYPE_NUMBER) || ( lefttype == TYPE_STRING && righttype == TYPE_STRING ) ){
                    return [ TYPE_BOOL, leftval < rightval ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} between ${lefttype} and ${righttype}. at Line ${node.op.line}`);
                }
            }else if( node.op.token_type == TOK_LE ){
                if( (lefttype == TYPE_NUMBER && righttype == TYPE_NUMBER) || ( lefttype == TYPE_STRING && righttype == TYPE_STRING ) ){
                    return [ TYPE_BOOL, leftval <= rightval ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} between ${lefttype} and ${righttype}. at Line ${node.op.line}`);
                }
            }else if( node.op.token_type == TOK_EQEQ ){
                if( (lefttype == TYPE_NUMBER && righttype == TYPE_NUMBER) || ( lefttype == TYPE_STRING && righttype == TYPE_STRING ) ){
                    return [ TYPE_BOOL, leftval == rightval ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} between ${lefttype} and ${righttype}. at Line ${node.op.line}`);
                }
            }else if( node.op.token_type == TOK_NE ){
                if( (lefttype == TYPE_NUMBER && righttype == TYPE_NUMBER) || ( lefttype == TYPE_STRING && righttype == TYPE_STRING ) ){
                    return [ TYPE_BOOL, leftval != rightval ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} between ${lefttype} and ${righttype}. at Line ${node.op.line}`);
                }
            }

        }else if( node instanceof UnOp ){
            let [operandtype, operandval] = this.interpret( node.operand, env );
            if( node.op.token_type == TOK_MINUS ){
                if( operandtype == TYPE_NUMBER ){
                    return [ TYPE_NUMBER, -operandval ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} with ${operandtype}. at Line ${node.op.line}`);
                }
            }

            if( node.op.token_type == TOK_PLUS ){
                if( operandtype == TYPE_NUMBER ){
                    return [ TYPE_NUMBER, +operandval ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} with ${operandtype}. at Line ${node.op.line}`);
                }
            }

            if( node.op.token_type == TOK_NOT ){
                if( operandtype == TYPE_BOOL ){
                    return [ TYPE_BOOL, !operandval ];
                }else{
                    throw new Error(`Unsupported operator ${node.op.lexeme} with ${operandtype}. at Line ${node.op.line}`);
                }
            }
        }else if( node instanceof LogicalOp ){
            // 考虑 布尔运算 短路操作
            let [ lefttype, leftval ] = this.interpret( node.left, env );
            if( node.op.token_type == TOK_OR ){
                if( leftval ){
                    return [lefttype, leftval]
                }
            }else if( node.op.token_type == TOK_AND ){
                if( !leftval ){
                    return [lefttype, leftval]
                }
            }

            return this.interpret( node.right, env );
        }else if( node instanceof Stmts ){
            for( const stmt of node.stmts ){
                this.interpret(stmt, env)
            }
        }else if( node instanceof PrintStmt ){
            let [exprtype, exprval] = this.interpret(node.value, env)
            let end = node.end
            process.stdout.write(exprval+end);
        }else if( node instanceof IfStmt ){
            let [testtype, testval] = this.interpret(node.test, env)
            if( TYPE_BOOL != testtype ){
                throw new Error(`Condition test is not a boolean expression. at line ${node.line}`)
            }

            if( testval ){
                this.interpret(node.then_stmts, env.new_env())
            }else{
                this.interpret(node.else_stmts, env.new_env())
            }
        }else if( node instanceof WhileStmt ){
            let new_env = env.new_env()
            while( true ){
                let [testtype, testval] = this.interpret(node.test, env);
                if( testtype != TYPE_BOOL ){
                    throw new Error(`While test is not a boolean expression. at line ${node.line}`)
                }

                if( !testval ){
                    break
                }

                this.interpret(node.body_stmts, new_env);
            }
        }else if(  node instanceof ForStmt){
            let varname = node.ident.name;
            let [itype, i] = this.interpret( node.start, env );
            let [endtype, end] = this.interpret( node.end, env );

            let block_new_env = env.new_env();
            if( i < end ){
                let delta = 1
                if( node.step ){
                    let [steptype, step] = this.interpret(node.step, env)
                    delta = step
                }

                while( i <= end ){
                    let newval = [TYPE_NUMBER, i]
                    env.set_var(varname, newval);
                    this.interpret(node.body_stmts, block_new_env);
                    i += delta;
                }

            }else{
                let delta = -1
                if( node.step ){
                    let [steptype, step] = this.interpret( node.step, env );
                    delta = step;
                }

                while(i >= end ){
                    let newval = [TYPE_NUMBER, i ]
                    env.set_var(varname, newval);
                    this.interpret(node.body_stmts, block_new_env);
                    i += delta;
                }
            }
        }else if( node instanceof FuncDecl ){
            env.set_func( node.name, [ node, env ])
        }else if( node instanceof FuncCall ){
            let func = env.get_func(node.name)
            if( !func ){
                throw new Error(`Function ${node.name} not declared. at line ${node.line}.`);
            }

            let func_decl = func[0]
            let func_env = func[1]

            if( node.args.length != func_decl.params.length ){
                throw new Error(`Function ${func_decl.name} expected ${func_decl.params.length} params but ${node.args.length} args were passed. at line ${node.line}`)
            }

            let args = []
            for( let arg of node.args ){
                args.push( this.interpret( arg, env ) )
            }

            // 给函数体一个新的作用域环境
            let new_func_env = func_env.new_env()

            for( let i = 0; i < func_decl.params.length; i ++ ){
                new_func_env.set_local( func_decl.params[i].name, args[i] )
            } // for i

            // 执行函数, 通过抛出异常来捕获到函数返回结果
            try{
                this.interpret( func_decl.body_stmts, new_func_env )
                return [ TYPE_NUMBER, 0 ]
            }catch(e){
                // console.log('产生错误对象了: ', e.message, ' <>', e)
                let str = e.message
                let pos = str.indexOf(',')
                let retStr = str.substring(pos+1)
                let rettype = str.substring(0, pos)

                return [rettype, retStr];
            }

        }else if( node instanceof FuncCallStmt ){
            this.interpret( node.expr, env )
        }else if( node instanceof RetStmt ){
            throw new Error( this.interpret( node.value, env ) )
        }
    }

    interpret_ast( node ){
        let env = new Environment()
        this.interpret(node, env)
    }
}
