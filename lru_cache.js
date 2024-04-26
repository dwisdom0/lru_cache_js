// node in a doubly linked list
class Node {
    constructor(val) {
        this.prev = NaN;
        this.next = NaN;
        this.val = val;
    }

    self_destruct() {
        // remove ourselves from the list
        this.prev.next = this.next
        this.next.prev = this.prev
    }
}

// doubly linked list
class DLL {
    constructor() {
        this.head = new Node(NaN);
        this.tail = new Node(NaN);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    append(val) {
        // put the new node at the end of the list
        // return a reference to the new node as well
        const new_node = new Node(val);

        new_node.next = this.tail;
        new_node.prev = this.tail.prev;

        this.tail.prev.next = new_node;
        this.tail.prev = new_node;
        return new_node;
    }

    popFirst() {
        // remove the first element in the list
        // and return it
        const ret = this.head.next.val;
        this.head.next.self_destruct();
        return ret
    }

    display() {
        // little print out for debugging
        let s = "";
        let cur = this.head;
        while (cur.next) {
            s += cur.val.toString();
            s += " -> ";
            cur = cur.next;
        }
        s += "NaN"
        return s
    }


}

class LRUCache {
    constructor(max_size) {
        this.max_size = max_size;
        this.dll = new DLL();
        this.cache = new Map();
        this.index = new Map();
    }

    put(k, v) {
        // if we have the value already, delete it from the DLL
        // and then append it again to make it the most recent
        // this is O(1) since we have a second mapping from cache_key -> DLL node
        if (this.index.has(k)) {
            this.index.get(k).self_destruct();
            const new_node = this.dll.append(k);
            this.index.set(k, new_node);
            this.cache.set(k, v);
            return;
        }

        // if the cache is full, drop the least recently used key/value 
        if (this.cache.size === this.max_size) {
            const popped = this.dll.popFirst();
            this.index.delete(popped);
            this.cache.delete(popped);
        }

        // insert the key/value into the cache
        // and recency DLL
        const new_node = this.dll.append(k);
        this.index.set(k, new_node);
        this.cache.set(k, v);

    }

    get(k) {
        if (!this.cache.has(k))
            // if we don't have the value, throw an error
            throw "invalid_key";

        // if we do have the value, delete it from the DLL
        // and then append it again to make it the most recent
        this.index.get(k).self_destruct();
        const new_node = this.dll.append(k);
        this.index.set(k, new_node);
        return this.cache.get(k)

    }

}

module.exports = LRUCache;