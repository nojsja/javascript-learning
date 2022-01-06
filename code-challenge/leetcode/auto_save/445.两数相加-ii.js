/*
 * @lc app=leetcode.cn id=445 lang=javascript
 *
 * [445] 两数相加 II
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
  var maxLink, l;
  var index = 0;
  var num1 = '';
  var num2 = '';
  var num3 = '';
  var newNode;
  var tmp1, tmp2, tmp;
  var plus = 0;

  l = l1;

  // 生成 num1 字符
  while(l) {
    num1 += l.val;
    index++;
    l = l.next;
  }

  l = l2;
  maxLink = index;
  index = 0;

  // 生成 num2 字符
  while(l) {
    num2 += l.val;
    index++;
    l = l.next;
  }

  maxLink = (maxLink >= index) ? l1 : l2;
  index = 0;
  tmp1 = num1.slice(-1);
  tmp2 = num2.slice(-1);

  // 倒序遍历字符，累加
  while (tmp1 !== '' || tmp2 !== '') {
    tmp = (+tmp1) + (+tmp2) + plus;
    plus = tmp >= 10 ? 1 : 0;
    tmp = tmp % 10;
    num3 = String(tmp) + num3;
    index++;
    tmp1 = num1.slice(-(index + 1), -index);
    tmp2 = num2.slice(-(index + 1), -index);
  }

  // 进位
  num3 = plus ? plus + num3 : num3;

  // 进位后新增节点
  if (num3.length > Math.max(num1.length, num2.length)) {
    newNode = new ListNode();
    newNode.next = maxLink;
    maxLink = newNode;
  }

  l = maxLink;
  index = 0;

  // 将 num3 字符映射到链表上
  while(l) {
    l.val = Number(num3[index]);
    index++;
    l = l.next;
  }

  return maxLink;
};
// @lc code=end

