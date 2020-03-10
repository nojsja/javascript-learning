function insert(arr, item, index) {
  var array = [];
  arr.forEach(function(elem, ind) {
    array.push(elem);
    if((index - 1) == ind){
      array.push(item);
    }
  });

  return array;
}