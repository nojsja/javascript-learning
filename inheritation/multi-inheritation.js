/*
  多继承 -- 属性复制
 */
function mix(){

    var i = 1,
        len = arguments.length,
        target  = arguments[0],
        arg;

    for(i; i < len; i++){
        arg = arguments[i];
        for(var property in arg){
            target[property] = arg[property];
        }
    }

    return target;
}
