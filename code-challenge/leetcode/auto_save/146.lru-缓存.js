/*
 * @lc app=leetcode.cn id=146 lang=javascript
 *
 * [146] LRU 缓存
 */

// @lc code=start

function DoublyLinkedList(val, key) {
  this.value = val;
  this.key = key;
  this.pre = null;
  this.next = null;
}

DoublyLinkedList.prototype.remove = function () {
  this.pre.next = this.next;
  this.next.pre = this.pre;
  return this;
};

DoublyLinkedList.prototype.add = function(node) {
  var next = this.next;
  this.next = node;
  node.pre = this;
  node.next = next;
  next.pre = node;
};


/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
  this.map = new Map();
  this.headNode = new DoublyLinkedList(null, null);
  this.tailNode = new DoublyLinkedList(null, null);
  this.headNode.next = this.tailNode;
  this.tailNode.pre = this.headNode;
  this.capacity = capacity;
};

LRUCache.prototype.size = function() {
  return this.map.size;
}

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
  if (this.map.has(key)) {
    var modNode = this.map.get(key).remove();
    this.headNode.add(modNode);
    return modNode.value;
  } else {
    return -1;
  }
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
  if (!this.map.has(key)) {
    if (this.size() === this.capacity) {
      var delNode = this.tailNode.pre.remove();
      this.map.delete(delNode.key);
    }
    this.map.set(key, new DoublyLinkedList(value, key));
    this.headNode.add(this.map.get(key));
  } else {
    this.map.get(key).value = value;
    this.headNode.add(this.map.get(key).remove());
  }
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
// @lc code=end

