import Token, {
    TOK_LPAREN, TOK_RPAREN, TOK_LCURLY, TOK_RCURLY, TOK_LSQUAR, TOK_RSQUAR,
    TOK_DOT, TOK_COMMA, TOK_PLUS, TOK_STAR, TOK_CARET, TOK_SLASH, TOK_SEMICOLON,
    TOK_QUESTION, TOK_MINUS, TOK_EQEQ, TOK_EQ, TOK_NE, TOK_NOT, TOK_LE, TOK_LT, TOK_GE, TOK_GT,
    TOK_ASSIGN, TOK_COLON, TOK_STRING, TOK_INTEGER, TOK_FLOAT,TOK_IDENTIFIER,  keywords
} from './tokens.mjs'

export default class Lexer{
    constructor(source){
        this.source = source;
        this.start = 0
        this.curr = 0
        this.line = 1
        this.tokens = [] // 源文件中的token符号
    }

    advance(){
        let ch = this.source[this.curr];
        // advance要消费掉一个位置
        this.curr = this.curr + 1;
        return ch;
    }

    peek(){
        if( this.curr >= this.source.length ){
            return '\0'
        }
        return this.source[this.curr];
    }

    lookahead(n=1){
        if( this.curr >= this.source.length ){
            return '\0'
        }
        return this.source[this.curr+n];
    }

    match( expected ){
        if( this.curr >= this.source.length ){
            return false;
        }

        if( this.source[this.curr] != expected ){
            return false;
        }

        // match顺利完成 要消费 一个位置
        this.curr = 1 + this.curr;
        return true;
    }

    handle_number(){
        while( /\d/.test( this.peek() ) ){
            this.advance();
        }

        if( '.' == this.peek() && /\d/.test( this.lookahead() ) ){
            this.advance(); // 消化 小数点 .
            while( /\d/.test( this.peek() ) ){
                this.advance();
            }
            this.add_token( TOK_FLOAT );
        }else{
            this.add_token(TOK_INTEGER);
        }
    }

    handle_string(start_quote){
        while( this.peek() != start_quote && this.curr < this.source.length ){
            this.advance();
        }

        if( this.curr >= this.source.length ){
            throw new Error( `Unterminated string. at line ${this.line}` );
        }

        this.advance(); // 消化掉字符串最后一个定界符
        this.add_token(TOK_STRING);
    }

    handle_identifier(){
        while( /\w/.test(this.peek()) ){
            this.advance(); 
        }

        let text = this.source.slice( this.start, this.curr );
        let keyword_type = keywords[text]
        if( !keyword_type ){
            this.add_token( TOK_IDENTIFIER );
        }else{
            this.add_token(keyword_type);
        }
    }

    add_token(token_type){
        this.tokens.push( new Token( token_type, this.source.slice(this.start, this.curr), this.line ) );
    }

    tokenize(){
        while( this.curr < this.source.length ){
            this.start = this.curr;
            let ch = this.advance();
            if( '\n' == ch ){
                this.line = this.line + 1;
            }else if( ' ' == ch ){
                // pass
            }else if( '\t' == ch ){
                // pass
            }else if( '\r' == ch ){
                // pass
            }else if( '(' == ch ){
                this.add_token(TOK_LPAREN);
            }else if( ')' == ch ){
                this.add_token(TOK_RPAREN);
            }else if( '{' == ch ){
                this.add_token(TOK_LCURLY);
            }else if( '}' == ch ){
                this.add_token(TOK_RCURLY);
            }else if( '[' == ch ){
                this.add_token(TOK_LSQUAR);
            }else if( ']' == ch ){
                this.add_token(TOK_RSQUAR);
            }else if( '.' == ch ){
                this.add_token(TOK_DOT);
            }else if( ',' == ch ){
                this.add_token(TOK_COMMA);
            }else if('+' == ch){
                this.add_token(TOK_PLUS);
            }else if( '*' == ch ){
                this.add_token(TOK_STAR);
            }else if('^' == ch){
                this.add_token(TOK_CARET);
            }else if( '/' == ch ){
                this.add_token(TOK_SLASH);
            }else if(';' == ch){
                this.add_token(TOK_SEMICOLON);
            }else if( '?' == ch ){
                this.add_token(TOK_QUESTION);
            }else if( '%' == ch ){
                this.add_token(TOK_MOD);   
            }else if( '-' == ch ){
                if( this.match('-') ){
                    while( this.peek() != '\n' && this.curr < this.source.length ){
                        this.advance();
                    }
                }else{
                    this.add_token(TOK_MINUS);
                }
            }else if( '=' == ch ){
                if( this.match('=') ){
                    this.add_token(TOK_EQEQ);
                }else{
                    this.add_token(TOK_EQ);
                }
            }else if( '~' == ch ){
                if( this.match('=') ){
                    thia.add_token(TOK_NE)
                }else{
                    this.add_token(TOK_NOT);
                }
            }else if( '<' == ch ){
                if( this.match('=') ){
                    this.add_token(TOK_LE);
                }else{
                    this.add_token(TOK_LT);
                }
            }else if( '>' == ch ){
                if( this.match('=') ){
                    this.add_token(TOK_GE);
                }else{
                    this.add_token(TOK_GT);
                }
            }else if( ':' == ch ){
                if( this.match('=') ){
                    this.add_token(TOK_ASSIGN);
                }else{
                    this.add_token(TOK_COLON);
                }
            }else if( '"' == ch || "'" == ch ){
                this.handle_string(ch);
            }else if( /\d/.test( ch ) ){
                this.handle_number();
            }else if( /[a-zA-Z_]/.test( ch ) ){
                this.handle_identifier();
            }else{
                throw new Error(`Error at ${ch}: Unexpected character. At line ${line}`);
            }

        } // while( this.curr < this.source.length )

        return this.tokens;
    }

}