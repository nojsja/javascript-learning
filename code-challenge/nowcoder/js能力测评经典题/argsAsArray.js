var fn = function (greeting, name, punctuation) {
  return greeting + ', ' + name + (punctuation || '!');
};
var str = ['Hello', 'Ellie', '!'];

function argsAsArray(fn, arr) {
  return fn.apply(null, arr);
}

console.log(argsAsArray(fn, str));
