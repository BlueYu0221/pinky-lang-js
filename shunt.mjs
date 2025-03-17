let input = "8 + 9 * 2 - 6"
let precedence = {
    '^': 4,
    '*': 3,
    '/': 3,
    '+': 2,
    '-': 2
}

// 执行 Shunting-Yard 算法
let output = []
let opStack = []

let tokens = input.trim().split(/\s+/g)

for( let token of tokens ){
    if( token in precedence ){
        while( opStack.length > 0 ){
            let op = opStack[opStack.length - 1]
            if( precedence[token] > precedence[op] ){
                break
            }
            opStack.pop()
            output.push(op)
        }
        opStack.push(token)
    }else{
        output.push(token)
    }
} // for token


while( opStack.length > 0 ){
    output.push(opStack.pop())
}

console.log(output.join(' '))

// 开始解析 RPN form
let result = []

for( let elem of output ){
    if( !(elem in precedence) ){
        result.push(parseFloat(elem))
    }else{
        let right = result.pop()
        let left = result.pop()

        if( '+' === elem ){
            result.push( left + right )
        }

        if( '-' === elem ){
            result.push( left - right )
        }

        if( '*' === elem ){
            result.push( left * right )
        }

        if( '/' === elem ){
            result.push( left / right )
        }
    }
}// for elem

console.log('最终计算结果: ',  result.pop())