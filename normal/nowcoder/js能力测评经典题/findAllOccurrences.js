function findAllOccurrences(arr, target) {
  var array = [];

	arr.map(function (item, index) {
    if (item == target) {
      array.push(index);
    }
	});

  return array;
}

console.log(findAllOccurrences(['a', 'b', 'c', 'd', 'e', 'f', 'a', 'b', 'c'], 'a'));
