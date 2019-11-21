import Model from "./Model.js";

export default class Environment extends Model  {
    constructor(name, properties){
        super(name, properties);
        this.className = 'Environment';
        this.playground = [];
        this.thymio = [];
    }

    addPlayground(playground) {
        playground.parent = this;
        this.playground.push(playground);
        this.emit('PlaygroundAdded', {playground});
    }

    removePlayground(playground) {
        const index = this.playground.indexOf(playground);
        
        if(index !== -1) {
            this.playground.splice(index, 1);
            this.emit('PlaygroundRemoved', {playground});
        }
    }

    addThymio(thymio) {
        thymio.parent = this;
        this.thymio.push(thymio);
        this.emit("ThymiosAdded", {thymio});
    }

    removeThymio(thymio) {
        const index = this.thymio.indexOf(thymio);

        if(index !== 1) {
            this.thymio.splice(index, 1);
            this.emit("ThymiosRemoved", {thymio});
        }
    }

    [Symbol.iterator]() {
        return this.playground.values();
    }
}