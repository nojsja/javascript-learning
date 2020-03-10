function count(start, end) {
  var timer;

  if (start <= end) {
    console.log(start);
    timer = setInterval(function () {
      console.log(++start);
      if (start >= end) {
        return clearInterval(timer);
      }
    }, 100);
  }

  return {
    cancel: function () {
      clearInterval(timer);
    }
  };
}

// 开始
var timer = count(6, 7);
setTimeout(function () {

  timer.cancel();

}, 1000)
