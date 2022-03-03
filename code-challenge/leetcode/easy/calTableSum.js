/* -------------------------------------------------------
  description：
  数据表记录包含表索引和数值（int范围的整数），请对表索引相同的记录进行合并，即将相同索引的数值进行求和运算，输出按照key值升序进行输出。

  示例1

    输入

    4
    0 1
    0 2
    1 2
    3 4

    输出

    0 3
    1 2
    3 4

------------------------------------------------------- */

function calTableSum(array) {
  var res = [];
  for (var i = 0; i < array.length; i++) {
    res[array[i][0]] = (res[array[i][0]] || 0) + array[i][1];
  }
  for (var i = 0; i < res.length; i++) {
    if (res[i] !== undefined) {
      console.log(i, res[i]);
    }
  }
}

calTableSum([[0,1], [0,2], [1,2], [3,4]]);