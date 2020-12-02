/* 实现Function.prototype.call/apply */

/* -------------- define call -------------- */
Function.prototype.call_nojsja = function(context) {
  var args = [];
  var result;
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  context.call_nojsja_exec = this;
  result = eval('context.call_nojsja_exec('+ args.join() +')');
  // result = context.call_nojsja_exec(...args);
  delete context.call_nojsja_exec;

  return result;
};

/* -------------- define apply -------------- */
Function.prototype.apply_nojsja = function(context, args) {
  var result;
  args = args || [];
  if (!(args instanceof Array)) throw new Error('The args of apply must be an array.');

  context.apply_nojsja = this;
  result = eval('context.apply_nojsja('+ args.join() +')');
  // result = context.apply_nojsja(...args);
  delete context.apply_nojsja

  return result;
};

/* test */

var a = {
  value: 1
};

var test = function test(v1, v2) {
  console.log(this.value, v1, v2);
};

test.call_nojsja(a, 2, 3);
test.apply_nojsja(a, [2, 3]);