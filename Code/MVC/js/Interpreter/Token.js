export default class Token {
    constructor(type, pos, value) {
        if (value === undefined)
            value = "";
        this.type = type;
        this.pos = pos;
        this.value = value;

        
    }

      
}