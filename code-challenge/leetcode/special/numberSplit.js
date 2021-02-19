/* -------------------------------------------------------
  description:
  数字千分位函数：1,234,567,890
------------------------------------------------------- */
// 遍历法
function format(num){
  num = String(num);//数字转字符串  
  var start = num.length - 1;
  var str = ''; //字符串累加 
  if (num.indexOf('.') !== -1) {
    start = num.indexOf('.') - 1;
  };
  for (j = 1; start >= 0; start--, j++){  
      str = num[start] + str; //倒着累加数字
      if (j%3 == 0 && start != 0) str = ',' + str;
  }  
  return str + num.substr(num.indexOf('.')); //字符串=>数组=>反转=>字符串  
}

console.log(format(1888333234243333.1555));

// 正则法
/* 
说明：如果想知道具体怎样的分组方式，可在 [https://regexper.com/](https://regexper.com/) 上测试
1. ?= 表示正向引用
2. $& 表示与正则表达式相匹配的内容，可查看replace()
3. \B 非单词边界

分组语法 捕获
(exp) 匹配exp,并捕获文本到自动命名的组里
(?<name>exp) 匹配exp,并捕获文本到名称为name的组里，也可以写成(?'name'exp)
(?:exp) 匹配exp,不捕获匹配的文本
位置指定
(?=exp) 匹配exp前面的位置
(?<=exp) 匹配exp后面的位置
(?!exp) 匹配后面跟的不是exp的位置
(?<!exp) 匹配前面不是exp的位置
 */
let num = 1234567890;
let reg = /\d{1,3}(?=(\d{3})+$)/g;   
console.log(String(num).replace(reg, '$&,')); //"1,234,567,890"