import fs from 'fs';

import Lexer from './lexer.mjs'
import Parser from './parser.mjs'
import { print_pretty_ast } from './utils.mjs';
import Interpreter from './interpreter.mjs';

;(async()=>{
    let source = await fs.promises.readFile('./myscript.pinky');
    // console.log(source.toString());

    // console.log(Lexer)
    let tokens = new Lexer( source.toString() ).tokenize();
    console.log('*******************************Lexer*******************************************');
    console.log(tokens);

    console.log('*******************************Parser*******************************************');
    let ast = new Parser(tokens).parse();
    // console.log( ast.toString() );

    print_pretty_ast( ast );


    console.log('*******************************INTERPRETER*******************************************');
    let interpreter = new Interpreter();
    let val = interpreter.interpret_ast(ast);

   // console.log(val);

})();