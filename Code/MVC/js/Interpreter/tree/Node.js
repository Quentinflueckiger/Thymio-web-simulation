import SourcePos from "../SourcePos.js"
import Deque from "../../Deque.js";

const returnType = Object.freeze({
    UNIT : 0,
    BOOL : 'BOOL',
    INT : 'INT'
})

const AsebaBinaryOperator = Object.freeze({
    ASEBA_OP_ADD : "ASEBA_OP_ADD",			        // TOKEN_OP_ADD_EQUAL
    ASEBA_OP_SUB : "ASEBA_OP_SUB",			        // TOKEN_OP_NEG_EQUAL
    ASEBA_OP_MULT : "ASEBA_OP_MULT"	,		        // TOKEN_OP_MULT_EQUAL
    ASEBA_OP_DIV : "ASEBA_OP_DIV",			        // TOKEN_OP_DIV_EQUAL
    ASEBA_OP_MOD : "ASEBA_OP_MOD",			        // TOKEN_OP_MOD_EQUAL
    ASEBA_OP_SHIFT_LEFT : "ASEBA_OP_SHIFT_LEFT",	// TOKEN_OP_SHIFT_LEFT_EQUAL
    ASEBA_OP_SHIFT_RIGHT : "ASEBA_OP_SHIFT_RIGHT",	// TOKEN_OP_SHIFT_RIGHT_EQUAL
    ASEBA_OP_BIT_OR : "ASEBA_OP_BIT_OR",		    // TOKEN_OP_BIT_OR_EQUAL
    ASEBA_OP_BIT_XOR : "ASEBA_OP_BIT_XOR",		    // TOKEN_OP_BIT_XOR_EQUAL
    ASEBA_OP_BIT_AND : "ASEBA_OP_BIT_AND"		    // TOKEN_OP_BIT_AND_EQUAL
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
    toString(){
        console.error("Based unimplemented toString method.");
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

        for (const child in this.children) {
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
        for (let index = 0; index != this.children.end(); index++) {
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
        return this.arrayAddr;
    }

    getVectorSize() {
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