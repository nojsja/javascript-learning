function truncate(arr) {
  return arr.filter(function(item, index){
    if(index == arr.length - 1)
      return false;
    return true;
  });  
}
