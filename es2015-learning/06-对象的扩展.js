import { newBlock } from './public';

inst-comment
{
  let foo = 'bar';
  let baz = {foo};
  baz == {foo: 'bar'};  // true

  // 方法也可以简写
  let hello = {
    method() {
      return 'hello';
    }
  };
  // 等同于
  let hello2 = {
    method: function () {
      return 'hello';
    }
  };
}
