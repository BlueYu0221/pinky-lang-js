export function print_pretty_ast( ast_text ){
    let i = 0;
    let newline = false;

    for( let ch of ast_text.toString() ){
        if( '(' == ch ){
            if( !newline ){
                process.stdout.write('');
            }

            process.stdout.write(ch+'\r\n');
            i += 2;
            newline = true;
        }else if( ')' == ch ){
            if( !newline ){
                process.stdout.write('\r\n');
            }

            i -= 2;
            newline = true;
            process.stdout.write( ''.padStart(i, ' ') + ch +'\r\n');
        }else{
            if( newline ){
                process.stdout.write(''.padStart(i, ' '));
            }

            process.stdout.write(ch + '');
            newline = false;
        }
    }

}