function curtail(arr) {
  var array;
  array = [].concat(arr);
  array.splice(0, 1);
  return array;
}