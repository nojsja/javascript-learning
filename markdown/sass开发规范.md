### sass开发规范
---------------------------------

>author: NoJsJa

#### Contents
---------------------------------

1. sass语法  
2. 命名  
3. 书写顺序  
4. 代码嵌套  
5. 注释  

#### sass语法
---------------------------------

>sass是一门编程语言，支持css语法以及一般编程语言中的函数、宏、变量和各种逻辑语法等等，sass文件最终会被编译成css文件。  

1. 变量  
2. 计算功能    
3. 继承  
4. Mixin  
5. 函数  
6. 高级用法  

##### 变量  

Sass允许使用变量，所有变量以$开头：  

```scss
$blue: #1875e7;
　div {
　　　color: $blue;
　}
```

内嵌到字符串中的变量需要写在 ' #{} ' 中间：  

```scss
$side: left;
.rounded {
　border-#{$side}-radius: 5px;
}
```

##### 计算功能  

Sass允许在代码中使用算式：  

```scss
body {
　margin: (14px/2);
　top: 50px + 100px;
　right: $var * 10%;
}
```

##### 继承  

Sass允许一个选择器使用关键字 @extend 继承另一个选择器：  

```scss
.class1 {
　　border: 1px solid #ddd;
}

.class2 {
　 @extend .class1;
　 font-size:120%;
}
```

##### Mixin  

Mixin是可以重用的代码块，使用 @mixin 关键字定义一个代码块：  

```scss
@mixin left {
　float: left;
　margin-left: 10px;
}

```

使用 @include 调用这个mixin：  

```scss
div {
　 @include left;
}
```

mixin还能制定参数和参数默认值：  

```scss
@mixin left($value: 10px) {
　 float: left;
　 margin-right: $value;
}
```

使用的时候可以直接使用默认值或是加入参数值：  

```scss
div {
　　　　@include left(20px);
　　}
```

##### 函数  

Sass允许用户使用 @function 关键字编写自己的函数，函数可以直接使用：  

```scss
@function double($n) {
　 @return $n * 2;
}

#sidebar {
　width: double(5px);
}
```

##### 高级用法  

* 引入外部文件  
* 使用条件语句  
* 使用循环语句  

引入外部文件：  

```scss
@import "../foo.css";
```

使用条件语句：  
```scss
p {
　@if 1 + 1 == 2 { border: 1px solid; }
　@if 5 < 3 { border: 2px dotted; }
}

@if $color == '#fff' {
　background-color: #000;
} @else {
　background-color: #fff;
}
```

使用循环语句，支持for和while循环：　

```scss
@for $i from 1 to 10 {
　　.border-#{$i} {
　　　　border: #{$i}px solid blue;
　　}
}

$i: 6;
　　@while $i > 0 {
　　　　.item-#{$i} { width: 2em * $i; }
　　　　$i: $i - 2;
　　}
```

#### 命名
---------------------------------

1. ID命名  
2. Class命名  
3. 父元素和子元素的命名规则  

##### ID命名  

统一采用驼峰命名法(camelCase)，第一个首字母小写，其它单词的首字母大写：  

```scss
/* bad */
#rootlistitem {...}
#RootListItem {...}

/* good */
#rootListItem {...}
```

命名单词数最好不要超过3个：  

```scss
/* bad */
#rootListItemWrapper {...}

/* good */
#rootListWrapper {...}
```

##### Class命名  

类的命名统一使用连字符 '-' 连接各个单词，命名中不允许出现大写字母：  

```
/* bad */
.contentWrapper {...}

/* good */
.content-wrapper {...}
```

类名最好使用三个及三个以下的单词，至多不超过四个：  

```scss
/* bad */
.file-detail-list-item-wrapper {...}

/* not-good */
.file-detail-list-wrapper {...}

/* good */
.file-detail-wrapper {...}
.file-wrapper {...}

```

##### 父元素和子元素的命名规则  

父元素和多级子元素的命名需要体现元素在页面的功能、样式、或结构：  

```scss
.file-list-wrapper {

  .file-list-header {...}

  .file-list-body {

    .list-body-aside {

      .body-aside-left {...}
      .body-aside-right {...}
    }

    .list-body-main {...}
  }

  .file-list-footer {...}
}
```

#### 书写顺序
---------------------------------

内部属性书写顺序应该按照从上到下是 布局定位、盒模型属性、表现性属性和其它：  

```scss
.class {
  /* 布局定位 */
  position: absolute;
  top: 0;
  left: 0;

  /* 盒模型属性 */
  display: block;
  overflow: hidden;
  box-sizing: border-box;
  width: 1rem;
  height: 1rem;
  margin: 1em;
  padding: 1em;
  border: 3px solid #ddd;
  border-radius: 5px;

  /* 表现性属性 */
  font-family: 'Arial', sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1rem;
  word-break: break-all;
  word-wrap: break-word;
  background-color: #eee;
  color: #000;

  /* 其它 */
  z-index: 500;
}

```

#### 代码缩进和嵌套
---------------------------------

1. 代码缩进  
2. 多层嵌套  

##### 代码缩进  

代码缩进统一使用两个空格，不要用四个空格和tab(编辑器内可以自定义tab输出的空格数，不用手打两个空格)   

```scss
/* bad */
.class {
    position: fixed;
}

/* good */
.class {
  position: fixed;
}
```

选择器与花括号之间要保留一个空格，属性名之后的冒号与属性值之间要保留一个空格，选择符号两边各保留一个空格    

```scss
/* bad */
.class>div{
  position:fixed;
}

/* good */
.class > div {
  position: fixed;
}
```

##### 多层嵌套  

在Sass中你可以嵌套选择器，这可以使代码变得更模块化和可读，嵌套所有的选择器，但尽量避免嵌套没有任何内容的选择器(优先使用子选择器' > '，提高css查询性能)  

```scss
/* bad */
.content {
  display: block;
}

.content > .news-article > .title {
  font-size: 1.2em;

/* bad */
.content {
  display: block;

  > .news-article {
    > .title {
      font-size: 1.2em;
    }
  }

/* good */
content {
  display: block;

  > .news-article > .title {
    font-size: 1.2em;
  }
}
```

在Sass中，当你嵌套你的选择器时也可以使用上下文媒体查询，你可以在任何给定的嵌套层次中使用媒体查询  

```scss
/* bad */
.content-page {
  font-size: 1.2rem;

  > .main {
    background-color: whitesmoke;

    > .latest-news {
      padding: 1rem;

      > .news-article {
        padding: 1rem;

        > .title {
          font-size: 2rem;
        }
      }
    }

    > .content {
      margin-top: 2rem;
      padding: 1rem;
    }
  }

  > .page-footer {
    margin-top: 2rem;
    font-size: 1rem;
  }
}

@media screen and (min-width: 641px) {
  .content-page {
    font-size: 1rem;

    > .main > .latest-news > .news-article > .title {
      font-size: 3rem;
    }

    > .page-footer {
      font-size: 0.8rem;
    }
  }
}



/* good */
.content-page {
  font-size: 1.2rem;

  @media screen and (min-width: 641px) {
    font-size: 1rem;
  }

  > .main {
    background-color: whitesmoke;

    > .latest-news {
      padding: 1rem;

      > .news-article {
        padding: 1rem;

        > .title {
          font-size: 2rem;

          @media screen and (min-width: 641px) {
            font-size: 3rem;
          }
        }
      }
    }

    > .content {
      margin-top: 2rem;
      padding: 1rem;
    }
  }

  > .page-footer {
    margin-top: 2rem;
    font-size: 1rem;

    @media screen and (min-width: 641px) {
      font-size: 0.8rem;
    }
  }
}
```

嵌套顺序和选择器，以下是一个sass块应该具有的顺序：  

1. 当前选择器的样式属性  
2. 当前选择器的伪类选择器 (:first-letter, :hover, :active)伪类元素 (:before and :after)  
3. 当前选择器的声明样式 (.selected, .active, .enlarged)  
4. 用Sass的上下文媒体查询  
5. 子选择器作为最后的部分  

```scss
.product-teaser {
  /* 当前选择器的样式属性 */
  display: inline-block;
  padding: 1rem;
  background-color: whitesmoke;
  color: grey;

  /* 当前选择器的伪类选择器 */
  &:hover {
    color: black;
  }

  &:before {
    content: "";
    display: block;
    border-top: 1px solid grey;
  }

  &:after {
    content: "";
    display: block;
    border-top: 1px solid grey;
  }

  /* 当前选择器的声明样式 */
  &.active {
    background-color: pink;
    color: red;
  }

  /* 上下文媒体查询 */
  @media screen and (max-width: 640px) {
    display: block;
    font-size: 2em;
  }

  /* 子选择器 */
  > .content > .title {
    font-size: 1.2em;

    /* 子选择器上下文媒体查询 */
    @media screen and (max-width: 640px) {
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }
  }
}
```

#### 注释  
---------------------------------

>代码编辑器一般都可以自定义代码段(snippets)，通过编辑自定义代码段配置文件将快捷键绑定到一段自定义代码可以实现快捷插入代码段  

1. 组件注释  
2. 子组件注释  
3. 一般注释  

##### 组件注释  

一个大组件需要使用组件注释，体现页面结构。  

```scss
  /* ==========================================================
  父组件 file-list
  ============================================================= */
  .file-list {...}

```

##### 子组件注释  

一个组件的子组件需要使用子组件注释，体现组件整体结构。  

```scss
  /* 子组件 file-list-item
  ============================================================= */
  .file-list-item {...}

```

##### 一般注释  

使用块注释和行注释都行，重要的是体现代码结构和代码简洁度  

```scss
/* 块注释 */
.class1 {

  // 行注释
  .title {...}

  .content {  // 行注释2
    color: #fff;
  }
}
```
