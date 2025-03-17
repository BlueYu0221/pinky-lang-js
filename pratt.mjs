import fs from 'fs';

import Lexer from './lexer.mjs'
// import Parser from './parser.mjs'
import Parser from './pratt-parser.mjs';
import { print_pretty_ast } from './utils.mjs';

;(async()=>{
    let source = await fs.promises.readFile('./pratt.pinky');

    let tokens = new Lexer( source.toString() ).tokenize();
    console.log('*******************************Lexer*******************************************');
    console.log(tokens);

    console.log('*******************************Pratt-Parser*******************************************');
    let ast = new Parser(tokens).parse();
    // console.log( ast.toString() );

    print_pretty_ast( ast );


})();