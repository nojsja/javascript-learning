# JS字符串截取函数slice,substring,substr

### 在JS中,slice()、substring()、substr()都有截取字符串的作用，那他们有哪些用法上的区别呢？如果你也有疑惑，这篇文章或许能够帮助到你。

### 一、substring()

`substring()`方法返回一个索引和另一个索引之间的字符串，语法如下：

> str.substring(indexStart, [indexEnd])

下面有六点需要注意：

> * substring()从提取的字符indexStart可达但不包括 indexEnd
> * 如果indexStart 等于indexEnd，substring()返回一个空字符串。
> * 如果indexEnd省略，则将substring()字符提取到字符串的末尾。
> * 如果任一参数小于0或是NaN，它被视为为0。
> * 如果任何一个参数都大于stringName.length，则被视为是stringName.length。
> * 如果indexStart大于indexEnd，那么效果substring()就好像这两个论点被交换了一样； 例如，str.substring(1, 0) == str.substring(0, 1)

以下是一些示例代码：

```hljs
var str = 'abcdefghij';
console.log('(1, 2): '   + str.substring(1, 2));   // '(1, 2): b'
console.log('(1, 1): '   + str.substring(1, 1));   // '(1, 1): '
console.log('(-3, 2): '  + str.substring(-3, 2));  // '(-3, 2): ab'
console.log('(-3): '     + str.substring(-3));     // '(-3): abcdefghij'
console.log('(1): '      + str.substring(1));      // '(1): bcdefghij'
console.log('(-20, 2): ' + str.substring(-20, 2)); // '(-20, 2): ab'
console.log('(2, 20): '  + str.substring(2, 20));  // '(2, 20): cdefghij'
console.log('(20, 2): '  + str.substring(20, 2));  // '(20, 2): cdefghij'复制代码
```

### 二、substr()

`substr()`方法返回从指定位置开始的字符串中指定字符数的字符，语法如下：

> str.substr(start, [length])

下面有四点需要注意：

> * `substr()`会从`start`获取长度为`length`字符（如果截取到字符串的末尾，则会停止截取）。
> * 如果`start`是正的并且大于或等于字符串的长度，则`substr()`返回一个空字符串。
> * 若`start`为负数,则将该值加上字符串长度后再进行计算（如果加上字符串的长度后还是负数，则从0开始截取）。
> * 如果`length`为0或为负数，`substr()`返回一个空字符串。如果`length`省略，则将`substr()`字符提取到字符串的末尾。

以下是一些示例代码：

```hljs
var str = 'abcdefghij';
console.log('(1, 2): '   + str.substr(1, 2));   // '(1, 2): bc'
console.log('(-3, 2): '  + str.substr(-3, 2));  // '(-3, 2): hi'
console.log('(-3): '     + str.substr(-3));     // '(-3): hij'
console.log('(1): '      + str.substr(1));      // '(1): bcdefghij'
console.log('(-20, 2): ' + str.substr(-20, 2)); // '(-20, 2): ab'
console.log('(20, 2): '  + str.substr(20, 2));  // '(20, 2): '复制代码
```

> 需要注意的是，Microsoft的JScript不支持起始索引的负值。如果要使用此功能，可以使用以下兼容性代码来解决此错误：

```hljs
// only run when the substr() function is broken
if ('ab'.substr(-1) != 'b') {
  /**
   *  Get the substring of a string
   *  @param  {integer}  start   where to start the substring
   *  @param  {integer}  length  how many characters to return
   *  @return {string}
   */
  String.prototype.substr = function(substr) {
    return function(start, length) {
      // call the original method
      return substr.call(this,
          // did we get a negative start, calculate how much it is from the beginning of the string
        // adjust the start parameter for negative value
        start < 0 ? this.length + start : start,
        length)
    }
  }(String.prototype.substr);
}复制代码
```

### 三、substring()与substr()的主要区别

`substring()`方法的参数表示起始和结束索引，`substr()`方法的参数表示起始索引和要包含在生成的字符串中的字符的长度,示例如下：

```hljs
var text = 'Mozilla';
console.log(text.substring(2,5)); // => "zil"
console.log(text.substr(2,3)); // => "zil"复制代码
```

### 四、slice()

`slice()`方法返回一个索引和另一个索引之间的字符串，语法如下：

> str.slice(beginIndex[, endIndex])

下面有三点需要注意：

> * 若`beginIndex`为负数,则将该值加上字符串长度后再进行计算（如果加上字符串的长度后还是负数，则从0开始截取）。
> * 如果`beginIndex`大于或等于字符串的长度，则`slice()`返回一个空字符串。
> * 如果`endIndex`省略，则将`slice()`字符提取到字符串的末尾。如果为负，它被视为`strLength + endIndex`其中`strLength`是字符串的长度。

以下是一些示例代码：

```hljs
var str = 'abcdefghij';
console.log('(1, 2): '   + str.slice(1, 2));   // '(1, 2): b'
console.log('(-3, 2): '  + str.slice(-3, 2));  // '(-3, 2): '
console.log('(-3, 9): '  + str.slice(-3, 9));  // '(-3, 9): hi'
console.log('(-3): '     + str.slice(-3));     // '(-3): hij'
console.log('(-3，-1): ' + str.slice(-3，-1));     // '(-3，-1): hi'
console.log('(0，-1): '  + str.slice(0，-1));     // '(0，-1): abcdefghi'
console.log('(1): '      + str.slice(1));      // '(1): bcdefghij'
console.log('(-20, 2): ' + str.slice(-20, 2)); // '(-20, 2): ab'
console.log('(20): '     + str.slice(20));  // '(20): '
console.log('(20, 2): '  + str.slice(20, 2));  // '(20, 2): '
```