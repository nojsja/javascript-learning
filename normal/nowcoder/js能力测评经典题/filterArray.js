function remove(arr, item) {
	return arr.filter(function(ai){
    if(ai == item)
      return false;
    else 
      return true;
    });
}