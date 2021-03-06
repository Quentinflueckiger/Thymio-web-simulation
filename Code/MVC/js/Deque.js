export default class Deque {
    constructor() {
        this.items = [];
    }

    isEmpty() {
        return !Boolean(this.items.length);
    }

    addFront(item) {
        this.items.unshift(item);
    }

    addRear(item) {
        this.items.push(item);
    }

    removeFront() {
        return this.items.shift();
    }

    removeRear() {
        return this.items.pop();
    }

    front() {
        return this.items[0];
    }

    end() {
        return this.items[this.items.length-1];
    }

    getAt(pos) {
        return this.items[pos];
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items.length = 0;
    }
}