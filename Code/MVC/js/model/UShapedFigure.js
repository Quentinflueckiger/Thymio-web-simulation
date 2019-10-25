import Shape from "./Shape.js";

export default class UShapeFigure extends Shape {
    constructor(name, properties){
        super(name, properties);
        this.className = 'UShapedFigure';
    }
}