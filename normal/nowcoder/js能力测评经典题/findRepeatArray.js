function duplicates(arr) {
  var arrayObject = {};
  var singleArray = [];

  arr.map(function (item) {
    if (!arrayObject[item]) {
      arrayObject[item] = 1;
    }else {
      arrayObject[item]++;
    }
  });

  Object.keys(arrayObject).map(function (item) {
    if (arrayObject[item] > 1) {
      singleArray.push(item);
    }
  });

  return singleArray;

}
