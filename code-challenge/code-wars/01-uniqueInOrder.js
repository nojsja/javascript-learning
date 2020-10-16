/* -----------------------------------------------------------------------------
  Description:
  implement the function unique_in_order which takes as argument a sequence and
  returns a list of items without any elements with the same value next to each
  other and preserving the original order of elements.

  Example:
  uniqueInOrder('AAAABBBCCDAABBB') == ['A', 'B', 'C', 'D', 'A', 'B']
  uniqueInOrder('ABBCcAD')         == ['A', 'B', 'C', 'c', 'A', 'D']
  uniqueInOrder([1,2,2,3,3])       == [1,2,3]
----------------------------------------------------------------------------- */

function uniqueInOrder(obj) {
  // 目前保留的单个字符
  var now = '';
  var array = typeof obj == 'string' ?  obj.split('') : obj;

  for(var i = 0; i < array.length; i++) {
    if (array[i] == now) {
      array.splice(i, 1);
      i--;
    }else {
      now = array[i];
    }
  }
  return array;
}

// console.log(uniqueInOrder('112233'));
console.log(uniqueInOrder([1, 1, 2, 3, 4, 4]));
