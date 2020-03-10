var centralTimer = {
  timers: [],
  timerID: null,

  add: function (fn) {
    this.timers.push(fn);
  },

  start: function () {
    if (this.timerID) return;

    if (this.timers.length) {
      for (var i = 0; i < this.timers.length; i++) {
        if (this.timers[i]() === false) {
          this.timers.splice(i, 1);
          i--;
        }
      }
      this.timerID = setTimeout(this.start);
    }
  },

  stop: function () {
    clearTimeout(this.timerID);
    this.timerID = null;
  }
};
