var theThing = null;
var mark = true;

var replaceThing = function () {
  var originalThing = theThing;
  var unused = function () {
    if (originalThing) console.log('hi')  //引用了originalThing
  };

  theThing = {
    longStr: new Array(1000000).join('*'),
    someMethod: function (){
      console.log('message');
      console.log(mark);
 
    }
  };

  return theThing;
};

replaceThing().someMethod();
