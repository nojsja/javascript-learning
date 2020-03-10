function count(arr, item) {
  var count = 0;
  arr.forEach(function(elem, index){
    if(item == elem)
      count++;
  });

  return count;
}
