// setTimeout是在当前执行单元都执行完才开始计时，而setInterval是在设定完计时器后就立马计时

// 需要执行20ms的工作单元
function act(functionName) {
    console.log(functionName, Date.now() - scriptBegin);
    let begin = Date.now();
    while(Date.now() - begin < 20);
}
function fun1() {
    let fun3 = () => act("fun3");
    setTimeout(fun3, 0);
    act("fun1");
}
function fun2() {
  var timer;
  act("fun2 - 1");
  var fun4 = () => {
    act("fun4");
    clearInterval(timer);
  };
  timer = setInterval(fun4, 20);
  act("fun2 - 2");
}

let scriptBegin = Date.now();
fun1();
fun2();

// fun1 --> fun2-1 --> fun2-2 --> fun3 --> fun4

// fun1 8
// fun2 - 1 29
// fun2 - 2 50
// fun3 70
// fun4 90
