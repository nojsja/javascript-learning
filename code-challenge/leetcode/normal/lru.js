/* -------------------------------------------------------
  description:
  运用你所掌握的数据结构，设计和实现一个  LRU (最近最少使用) 缓存机制 。
  实现 LRUCache 类：

  LRUCache(int capacity) 以正整数作为容量 capacity 初始化 LRU 缓存
  int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
  void put(int key, int value) 如果关键字已经存在，则变更其数据值；如果关键字不存在，则插入该组「关键字-值」。当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间。
   

  进阶：你是否可以在 O(1) 时间复杂度内完成这两种操作？

   

  示例：

  输入
  ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
  [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
  输出
  [null, null, null, 1, null, -1, null, -1, 3, 4]

  解释
  LRUCache lRUCache = new LRUCache(2);
  lRUCache.put(1, 1); // 缓存是 {1=1}
  lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
  lRUCache.get(1);    // 返回 1
  lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
  lRUCache.get(2);    // 返回 -1 (未找到)
  lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
  lRUCache.get(1);    // 返回 -1 (未找到)
  lRUCache.get(3);    // 返回 3
  lRUCache.get(4);    // 返回 4
   

  提示：

  1 <= capacity <= 3000
  0 <= key <= 3000
  0 <= value <= 104
  最多调用 3 * 104 次 get 和 put


  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/lru-cache
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

class DoubleLinkedListNode {
  constructor(key, value) {
      this.key = key;
      this.value = value;
      this.prev = null;
      this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
      this.capacity = capacity;
      // Mappings of key->node.
      this.hashmap = {};
      // Use two dummy nodes so that we don't have to deal with the head/tail seperately.
      this.dummyHead = new DoubleLinkedListNode(null, null);
      this.dummyTail = new DoubleLinkedListNode(null, null);
      this.dummyHead.next = this.dummyTail;
      this.dummyTail.prev = this.dummyHead;
  }

  _isFull() {
      return Object.keys(this.hashmap).length === this.capacity;
  }

  _removeNode(node) {
      node.prev.next = node.next;
      node.next.prev = node.prev;
      node.prev = null;
      node.next = null;
      return node;
  }

  _addToHead(node) {
      const head = this.dummyHead.next;
      node.next = head;
      head.prev = node;
      node.prev = this.dummyHead;
      this.dummyHead.next = node;
  }

  get(key) {
      if (key in this.hashmap) {
          const node = this.hashmap[key];
          this._addToHead(this._removeNode(node));
          return node.value;
      } else {
          return -1;
      }
  }

  put(key, value) {
      if (key in this.hashmap) {
          // If key exists, update the corresponding node and move it to the head.
          const node = this.hashmap[key];
          node.value = value;
          this._addToHead(this._removeNode(node));
      } else {
          // If it's a new key.
          if (this._isFull()) {
              // If the cache is full, remove the tail node.
              const node = this.dummyTail.prev;
              delete this.hashmap[node.key];
              this._removeNode(node);
          }
          // Create a new node and add it to the head.
          const node = new DoubleLinkedListNode(key, value);
          this.hashmap[key] = node;
          this._addToHead(node);
      }
  }
}

/**
* Your LRUCache object will be instantiated and called as such:
* var obj = new LRUCache(capacity)
* var param_1 = obj.get(key)
* obj.put(key,value)
*/

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */

/* 
["LRUCache","get","put","get","put","put","get","get"]
[[2],[2],[2,6],[1],[1,5],[1,2],[1],[2]]
[null,-1,null,-1,null,null,2,6]

["LRUCache","put","put","put","put","get","get"]
[[2],[2,1],[1,1],[2,3],[4,1],[1],[2]]
[null,null,null,null,null,-1,3]
*/



var lRUCache = new LRUCache(2);
lRUCache.put(2, 1); // 缓存是 {1=1, 2=2}
lRUCache.put(1, 1); // 缓存是 {1=1, 2=2}
lRUCache.put(2, 3); // 缓存是 {1=1, 2=2}
lRUCache.put(4, 1);    // 返回 1
lRUCache.get(1);    // 返回 -1 (未找到)
lRUCache.get(2);    // 返回 3