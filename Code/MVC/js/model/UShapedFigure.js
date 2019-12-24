import Model from "./Model.js";

export default class UShapeFigure extends Model {
    constructor(name, properties){
        super(name, properties);
        this.className = 'UShapedFigure';
    }
}