import Model from "./Model.js";

export default class Environment extends Model  {
    constructor(name, properties){
        super(name, properties);
        this.className = 'Environment';
        this.playground = [];
    }

    addPlayground(playground) {
        playground.parent = this;
        this.playground.push(playground);
        this.emit('PlaygroudAdded', {playground});
    }

    removePlayground(playground) {
        const index = this.playground.indexOf(playground);
        
        if(index !== -1) {
            this.playground.splice(inde, 1);
            this.emit('PlaygroundRemoved', {playground});
        }
    }

    [Symbol.iterator]() {
        return this.playground.values();
    }
}