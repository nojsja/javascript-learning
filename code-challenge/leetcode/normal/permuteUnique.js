/* -------------------------------------------------------
  description:

  给定一个可包含重复数字的序列 nums ，按任意顺序 返回所有不重复的全排列。

  示例 1：

  输入：nums = [1,1,2]
  输出：
  [[1,1,2],
  [1,2,1],
  [2,1,1]]
  示例 2：

  输入：nums = [1,2,3]
  输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]


  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/permutations-ii
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

------------------------------------------------------- */

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function(nums) {
  var res = [];
  var check = new Array(nums.length).fill(false);
  // 使用排序让重复数相邻
  nums = nums.sort();

  var backtrack = function(list) {
    if (list.length === nums.length) {
      res.push(list.slice());
      return;
    }
    for (var i = 0; i < nums.length; i++) {
      // 注意不能是同一层级树节点重复使用
      if (check[i] || (i > 0 && nums[i] === nums[i-1] && !check[i-1]) ) {
        continue;
      }
      list.push(nums[i]);
      check[i] = true;
      backtrack(list);
      check[i] = false;
      list.pop();
    }
  };

  backtrack([], {});

  return res;
};