/**
 * @param {string} S
 * @return {string}
 */
var removeDuplicates = function(S) {
  var i;
  for(i=0; i<S.length; i++) {
    if (S[i] === S[i+1]) {
      S = S.substring(0, i) + S.slice(i+1+1);
      i = i-2 < 0 ? -1 : i-2;
    }
  }
  return S;
};

/**
 * @param {string} S
 * @return {string}
 */
var removeDuplicates2 = function(S) {
  var stack = [];
  for (var i = 0; i < S.length; i++) {
    if (stack[stack.length - 1] === S[i]) {
      stack.pop();
    } else {
      stack.push(S[i]);
    }
  }

  return stack.join('');
};

console.log(removeDuplicates("abbaca"));