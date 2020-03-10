/* -----------------------------------------------------------------------------
  已知如下数组：
  var arr = [ [1,2,2], [3, 4, 5, 5], [6, 7, 8, 9, [ 11,12,[ 12,13,[14] ] ] ],10 ];
  编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组

----------------------------------------------------------------------------- */

/* ************************* es5实现 ************************* */
var flatWeightingSort = (function() {

  /* ------------------- 扁平 ------------------- */
  function flat(originArray) {

    var targetArray = [];

    function roll(array) {
      for(var i = 0; i < array.length; i++) {
        (function (i) {
          if (typeof array[i] == "number"){
            targetArray.push(array[i]);
          }else {
            roll(array[i]);
          }

        })(i);

      }
    }

    roll(originArray);

    return targetArray;
  }

  /* ------------------- 去重 ------------------- */
  function weighting(array) {
    var weightingMap = {};

    for(var i = 0; i < array.length; i++){
      if (!weightingMap[array[i]]) {
        weightingMap[ array[i] ] = 1;
      }else {
        weightingMap[ array[i] ]++;
        array.splice(i, 1);
        i--;
      }
    }

    return array;

  }

  /* ------------------- 选择排序 ------------------- */
  function sort(array) {
    var i, j, max, temp;

    for(i = 0; i <= array.length - 1 - 1; i++){
      max = 0;
      for(j = 1; j <= array.length - 1 - i; j++){
        if (array[j] > array[max]) {
          max = j;
        }
      }

      temp = array[j - 1];
      array[j - 1] = array[max];
      array[max] = temp;

    }

    return array;

  }

  // 返回调用接口
  return {
    flat: function (originArray) {
      var array = flat(originArray);
      console.log("flat: ", array);
      return array;
    },
    weighting: function (originArray) {
      var array = weighting(originArray);
      console.log("weighting: ", array);

      return array;
    },
    sort: function (originArray) {
      var array =  sort(originArray);
      console.log("sort: ", array);

      return array;
    },
    total: function (originArray) {
      var array;
      array =  flat(originArray);
      array = weighting(array);
      array = sort(array);
      console.log("flatWeightingSort: ", array);

      return array;
    }
  };


})();

/* ************************* es6实现 ************************* */

/* ------------------- 去重 ------------------- */
function (weighting) {
  var rusultArr = newArr.reduce(function(rusultArr,a){
    if(rusultArr.indexOf(a) == -1){
      rusultArr.push(a);
    }
    return rusultArr;
  }, []);

}

/* ------------------- 去重和排序 ------------------- */
function weightingSort(newArr) {
  rusultArr = Array.from( new Set(newArr) ).sort( function(a,b){ return a-b } );
}


/* ************************* MAIN ************************* */

flatWeightingSort.total([ 4, 9, 1, 2, 3, [1, 2], [ 7, 4, [5] ] ]);
return;
flatWeightingSort.flat([1, 2, 3, [4, 5], [6], [ [7, 8] ] ]);
flatWeightingSort.weighting([1, 9, 2, 3, 8, 5, 6, 7, 6]);
flatWeightingSort.sort([3, 6, 2, 1, 9, 8, 0]);


















//
