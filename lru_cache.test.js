const LRUCache = require('./lru_cache')

INVALID = 'invalid_key'

test('insert', () => {
    const cache = new LRUCache(5);
    cache.put(13, 100);
    expect(cache.get(13)).toBe(100);
})

test('invalid key', () => {
    const cache = new LRUCache(5);
    try {
        cache.get(85);
    }
    catch (err) {
        expect(err).toBe(INVALID);
    }
})

test('evict', () => {
    const cache = new LRUCache(5);
    // fill up the cache
    cache.put(1, 100);
    cache.put(2, 200);
    cache.put(3, 300);
    cache.put(4, 400);
    cache.put(5, 500);
    // this one should evict 1
    cache.put(6, 600);

    expect(cache.get(2)).toBe(200);
    try {
        cache.get(1);
    }
    catch (err) {
        expect(err).toBe(INVALID);
    }

    expect(cache.cache.has(1)).toBe(false);
    expect(cache.cache.has(2)).toBe(true);
    expect(cache.cache.has(3)).toBe(true);
    expect(cache.cache.has(4)).toBe(true);
    expect(cache.cache.has(5)).toBe(true);
    expect(cache.cache.has(6)).toBe(true);

})

test('promote', () => {
    const cache = new LRUCache(5);
    // fill up the cache
    cache.put(1, 100);
    cache.put(2, 200);
    cache.put(3, 300);
    cache.put(4, 400);
    cache.put(5, 500);
    console.log(cache.dll.display())

    // put 1 again so it becomes the most recent
    cache.put(1, 101);
    // get 2 again so it becomes the new most recent
    expect(cache.get(2)).toBe(200)

    // everything should still be in the cache
    // cheating and inspecting the actual underlying Map
    // since using get() on everything will promote everything around again
    expect(cache.cache.has(1)).toBe(true);
    expect(cache.cache.has(2)).toBe(true);
    expect(cache.cache.has(3)).toBe(true);
    expect(cache.cache.has(4)).toBe(true);
    expect(cache.cache.has(5)).toBe(true);

    // add a new item, which should evict 3
    // since we promoted 1 and 2
    expect(cache.cache.size).toBe(5)
    cache.put(6, 600);
    expect(cache.cache.size).toBe(5)

    // everything should still be in the cache except 3
    expect(cache.get(1)).toBe(101);
    expect(cache.get(2)).toBe(200);
    expect(cache.get(4)).toBe(400);
    expect(cache.get(5)).toBe(500);
    expect(cache.get(6)).toBe(600);

    // 3 shouldn't be in the cache anymore
    expect(cache.cache.has(3)).toBe(false);
    try {
        cache.get(3);
    }
    catch (err) {
        expect(err).toBe(INVALID);
    }

    // now the least recent is 1 since we did all those get() calls
    // so we can evict that just to be super sure
    cache.put(7, 700);
    expect(cache.cache.size).toBe(5);
    expect(cache.get(2)).toBe(200);
    expect(cache.get(4)).toBe(400);
    expect(cache.get(5)).toBe(500);
    expect(cache.get(6)).toBe(600);
    expect(cache.get(7)).toBe(700);

    // 1 shouldn't be in the cache anymore
    expect(cache.cache.has(1)).toBe(false);
    try {
        cache.get(1);
    }
    catch (err) {
        expect(err).toBe(INVALID);
    }

})