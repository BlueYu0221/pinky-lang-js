export default class Environment{
    constructor( parent = null ){
        this.vars = {} // 变量字典
        this.funcs = {} // 函数字典
        this.parent = parent // 父级作用域
    }

    get_var( name ){
        let _this = this
        while( _this ){
            let value = _this.vars[name]
            if( value ){
                return value
            }else{
                _this = _this.parent
            }
        }

        return null
    }

    set_var(name, value){
        let original_env = this
        let _this = this
        while( _this ){
            if( name in _this.vars ){
                _this.vars[name] = value
                return value
            }
            _this = _this.parent
        }

        original_env.vars[name] = value
    }

    set_local(name, value){
        this.vars[name] = value
    }

    get_func(name){
        let _this = this
        while( _this ){
            let value = _this.funcs[name]
            if( value ){
                return value
            }else{
                _this = _this.parent
            }
        }
        return null
    }

    set_func( name, value ){
        this.funcs[name] = value
    }

    new_env(){
        return new Environment(this)
    }

}