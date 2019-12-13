import SourcePos from "../SourcePos.js"
import Deque from "../../Deque.js";

const returnType = Object.freeze({
    UNIT : 0,
    BOOL : 'BOOL',
    INT : 'INT'
})

const AsebaBinaryOperator = Object.freeze({
    ASEBA_OP_ADD : 0,//"ASEBA_OP_ADD",			        // TOKEN_OP_ADD_EQUAL
    ASEBA_OP_SUB : 1,//"ASEBA_OP_SUB",			        // TOKEN_OP_NEG_EQUAL
    ASEBA_OP_MULT : 2,//"ASEBA_OP_MULT"	,		        // TOKEN_OP_MULT_EQUAL
    ASEBA_OP_DIV : 3,//"ASEBA_OP_DIV",			        // TOKEN_OP_DIV_EQUAL
    ASEBA_OP_MOD : 4,//"ASEBA_OP_MOD",			        // TOKEN_OP_MOD_EQUAL
    ASEBA_OP_SHIFT_LEFT : 5,//"ASEBA_OP_SHIFT_LEFT",	// TOKEN_OP_SHIFT_LEFT_EQUAL
    ASEBA_OP_SHIFT_RIGHT : 6,//"ASEBA_OP_SHIFT_RIGHT",	// TOKEN_OP_SHIFT_RIGHT_EQUAL
    ASEBA_OP_BIT_OR : 7,//"ASEBA_OP_BIT_OR",		    // TOKEN_OP_BIT_OR_EQUAL
    ASEBA_OP_BIT_XOR : 8,//"ASEBA_OP_BIT_XOR",		    // TOKEN_OP_BIT_XOR_EQUAL
    ASEBA_OP_BIT_AND : 9,//"ASEBA_OP_BIT_AND"		    // TOKEN_OP_BIT_AND_EQUAL
})

class Node {
    constructor(pos){
        this.pos = new SourcePos();
        this.pos.setValues(pos);

        this.children = new Deque();
    }

    checkVectorSize(){
        console.error("Based unimplemented checkVectorSize method.");
    }
    expandAbstractNodes(){
        console.error("Based unimplemented expandAbstractNodes method.");
    }
    expandVectorialNodes(dump, compiler, index){
        console.error("Based unimplemented expandVectorialNodes method.");
    }
    typeCheck(){
        console.error("Based unimplemented typeCheck method.");
    }
    optimize(){
        console.error("Based unimplemented optimize method.");
    }
    getStackDepth(){
        console.error("Based unimplemented getStackDepth method.");
    }
    emit(preLinkByteCode){
        console.error("Based unimplemented emit method.");
    }
    toNodeName(){
        console.error("Based unimplemented toNodeName method.");
    }
    dump(){
        console.error("Based unimplemented dump method.");
    }
    getVectorSize() {
        var size = 65535;
        var new_size = 65535;

        /*
        for (let index = 0; index < this.children.size(); index++) {
            const child = this.children.getAt(index);
            console.log("Child: ",child);
            
            new_size = child.getVectorSize();
            if(size === 65535)
                size = new_size;
            else if (size !=new_size)
                console.error("Array size mismatch at: "+this.pos);
        }*/
        for (const child in this.children.items) {
            console.log("Child: ",child);
            
            new_size = child.getVectorSize();
            if(size === 65535)
                size = new_size;
            else if (size !=new_size)
                console.error("Array size mismatch at: "+this.pos);
            
        }

        return size;
    }
}

class BlockNode extends Node {
    constructor(pos){
        super(pos);
    }

    toString(){return "Block"}
    toNodeName(){return "block"}

    emit(preLinkByteCode) {
        for (const child in this.children) {
            child.emit(preLinkByteCode);
        }
    }
}

class ProgramNode extends BlockNode {
    constructor(pos){
        super(pos);
    }

    toString(){return "ProgramBlock"}
    toNodeName(){return "program block"}

    emit(preLinkByteCode) {
        super.emit(preLinkByteCode);
    }

    expandVectorialNodes(dump, compiler, index){
        return super.expandVectorialNodes(dump, compiler, index);
    }
}

class AssignementNode extends Node {
    constructor(pos, left, right){
        super(pos);
        this.children.addRear(left);
        this.children.addRear(right);
    }

    toString(){return "Assign"}
    toNodeName(){return "assignment"}
}

class IfWhenNode extends Node {

}

class FoldedIfWhenNode extends Node {

}

class WhileNode extends Node {

}

class FoldedWhileNode extends Node {

}

class EventDeclNode extends Node {

}

class EmitNode extends Node {

}

class SubDeclNode extends Node {

}

class CallSubNode extends Node {

}

class BinaryArithmeticNode extends Node {
    constructor(pos, operation, left, right){
        super(pos);
        this.operation = operation;
        this.children.addRear(left);
        this.children.addRear(right);
    }

}

class UnaryArithmeticNode extends Node {
    constructor(pos, op, child){
        super(pos);
        this.op = op;
        this.children.addRear(child);
    }
}

class ImmediateNode extends Node {
    constructor(pos, value){
        super(pos);
        this.value = value;
    }

    getVectorSize(){
        return 1;
    }
}

class StoreNode extends Node {

}

class LoadNode extends Node {

}

class ArrayWriteNode extends Node {

}

class ArrayReadNode extends Node {

}

class LoadNativeArgNode extends Node {

}

class CallNode extends Node {
    
}

class ReturnNode extends Node {

}

class AbstractTreeNode extends Node {
    constructor(pos){
        super(pos);
    }

    expandAbstractNodes(dump){
        console.error("Should not be performed on abstraction Node.");
    }
    emit(preLinkByteCode){
        console.error("Should not be performed on abstraction Node.");
    }
}

class TupleVectorNode extends AbstractTreeNode {
    constructor(pos, value){
        super(pos);
        this.children.addRear(new ImmediateNode(pos, value));
    }

    getVectorSize(){
        var size = 0;

        for (let index = 0; index < this.children.size(); index++) {
            size += this.children.getAt(index).getVectorSize();
            
        }
        return size;
    }

    isImmediateVector(){
        for (let index = 0; index < this.children.size(); index++) {
            const element = this.children.getAt(index);
            var node = element;
            if (!node) return false;          
        }
        return true;
    }

    getImmediateValue(index){
        /*
        assert(index < getVectorSize());
		assert(isImmediateVector());
		auto* node = dynamic_cast<ImmediateNode*>(children[index]);
		assert(node);
		return node->value;
        */
    }

    addImmediateValue(value){
        this.children.addRear(new ImmediateNode(pos, value));
    }
}

class MemoryVectorNode extends AbstractTreeNode {
    constructor(varPos, varAddr, varSize, varName){
        super(varPos);
        this.arrayAddr = varAddr;
        this.arraySize = varSize;
        this.arrayName = varName;
        this.write = false;
    };

    toNodeName(){ return "vector access";}

    expandAbstractNodes(dump) {

    }
    expandVectorialNodes(dump, compiler, index) {

    }

    getVectorAddr() {
        if (!(this.children.size() <= 1))
        {
            return false;
        }

        var shift = 0;

        if(this.children.size() === 1)
        {
            var index = new TupleVectorNode(this.children[0].pos, this.children[0].value);
            if (index)
            {
                shift = index.getImmediateValue(0);
            }
            else return 65535;
        }

        if (shift < 0 || shift >= this.arraySize)
        {
            return false;
        }
        return this.arrayAddr + shift;
    }

    getVectorSize() {
        if(!(this.children.size() <=1))
        {
            return false;
        }

        if(this.children.size() === 1)
        {
            var index = new TupleVectorNode(this.children[0].pos, this.children[0].value);
            if (index)
            {
                var numberOfIndex = index.getVectorSize();

                if(numberOfIndex === 1)
                {
                    return 1;
                }
                else if(numberOfIndex === 2)
                {
                    var im0 = index.getImmediateValue(0);
                    var im1 = index.getImmediateValue(1);
                    if(im1 < 0 || im1 >= this.arraySize)
                    {
                        return false;
                    }
                    return im1 - im0 + 1;
                }
                else
                    return false;
            }
            else 
                return 1;
        }
        return this.arraySize;
    }

    setWrite(write) {
        this.write = write;
    }
}

class ArithmeticAssignmentNode extends Node {

}

class UnaryArithmeticAssignementNode extends Node {

}

export{
    Node, BlockNode, ProgramNode, AssignementNode, IfWhenNode, FoldedIfWhenNode,
    WhileNode, FoldedWhileNode, EventDeclNode, EmitNode, SubDeclNode,
    CallSubNode, BinaryArithmeticNode, UnaryArithmeticNode, ImmediateNode,
    StoreNode, LoadNode, ArrayWriteNode, ArrayReadNode, LoadNativeArgNode,
    CallNode, ReturnNode, AbstractTreeNode, TupleVectorNode, MemoryVectorNode,
    ArithmeticAssignmentNode, UnaryArithmeticAssignementNode,
    AsebaBinaryOperator
}