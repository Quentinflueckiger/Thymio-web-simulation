import * as TT from './TokenType.js';
import Deque from '../Deque.js';
import SourcePos from './SourcePos.js';
import * as Node from './tree/Node.js';

export default class Parser{
    constructor(compiler){
        this.tokens = [];
        this.compiler = compiler;
    }

    parseProgram(tokens){
        this.tokens = tokens;
        var block = new Node.ProgramNode(this.tokens.front().pos);

        while(this.tokens.size() > 1){
            // parse all declarations for constants
            if (this.tokens.front().type === TT.type.TOKEN_STR_const)
            {
                console.log("Constant");
                this.parseConstDef();
            }
            // parse all vars declarations
            else if (this.tokens.front().type === TT.type.TOKEN_STR_var)
            {   
                console.log("Variable");
                var child = this.parseVarDef();
                if(child)
                {
                    block.children.push(child);
                }
            }
            // parse the rest of the code
            else {
                console.log("Deleted : ", this.tokens.front());
                this.tokens.removeFront();
                //var child = this.parseStatement();
                //block.children.push(child);

            }
        }
        return block;
    }

    parseConstDef(){
        this.tokens.removeFront();

        // check for string literal
        if(this.tokens.front().type !== TT.type.TOKEN_STRING_LITERAL)
        {
            console.error("Expecting identifier at pos: ", this.tokens.front().pos);
        }
        
        var constName = this.tokens.front().value;
        var constPos = new SourcePos();
        constPos.setValues(this.tokens.front().pos);
        this.tokens.removeFront();


        // check if constant exists
        this.compiler.constantsMap.forEach(element => {
            if (element.constantName === constName)
                console.error("Constant "+constName+" already exist.");
        });

        // mandatory assignation, must resolve to a constant expression 
        if(this.tokens.front().type !== TT.type.TOKEN_ASSIGN)
        {
            console.error("Expecting assignement at pos: ", this.tokens.front().pos);
        }

        this.tokens.removeFront();
        var constValue = this.expectConstantExpression(constPos, this.parseBinaryOrExpression());

        // save constant
        this.compiler.constantsMap.push({constantName : constName, constantValue : constValue});
    }

    parseVarDef(){
        this.tokens.removeFront();

        // check for string literal
        if(this.tokens.front().type !== TT.type.TOKEN_STRING_LITERAL)
        {
            console.error("Expecting identifier at pos: ", this.tokens.front().pos);
        }

        var varName = this.tokens.front().value;
        var varPos = new SourcePos();
        varPos.setValues(this.tokens.front().pos);
        this.tokens.removeFront();
        var varSize = 65535;
        var varAddr = this.compiler.freeVariablesIndex;

        // check if variable exists
        this.compiler.variablesMap.forEach(element => {
            if (element.variableName === varName)
                console.error("Variable "+varName+" already exist.");
        });

        // check if variable conflicts with a constant
        this.compiler.constantsMap.forEach(element => {
            if (element.constantName === varName)
                console.error("A constant with the name "+varName+" already exist.")
        });

        // optional assignation
        var me = new Node.MemoryVectorNode(varPos, varAddr, varSize, varName);
        var temp = this.parseVarDefInit(me);
        if (temp)
        {
            varSize = me.getVectorSize();
        }

        // sanity check for array
        if (varSize === 0 || varSize === 65535) 
        {
            console.error("Undefined size for var "+varName+".");
        }
        
        // save variable
        this.compiler.variablesMap.push({variableName : varName, variableAddress : varAddr, variableSize : varSize});
        this.compiler.freeVariablesIndex += varSize;



    }

    parseStatement(){

    }

    parseBinaryOrExpression(){
        var node = this.parseBinaryXorExpression();

        while(this.tokens.front().type === TT.type.TOKEN_OP_BIT_OR)
        {
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            var subExpression = this.parseBinaryAndExpression();
            var temp = new Node.BinaryArithmeticNode(pos, Node.AsebaBinaryOperator.ASEBA_OP_BIT_XOR, node, subExpression);
            node = temp;
        }

        return node;
    }

    parseBinaryXorExpression(){

    }

    parseVarDefInit(memoryVectorNode) {
        if (this.tokens.front().type === TT.type.TOKEN_ASSIGN)
        {
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);

            this.tokens.removeFront();

            // try old style initialization 1,2,3
            var rValue = this.parseTupleVector(true);

            if (!rValue)
            {
                // no -> other type of initialization
                rValue = this.parseBinaryOrExpression();
            }

            if (memoryVectorNode.getVectorSize() === 65535)
            {
                // infere the variable's size based on the initialization
                memoryVectorNode.arraySize = rValue.getVectorSize();
            }

            return new Node.AssignementNode(pos, memoryVectorNode, rValue);
        }

        return null;
    }

    //! Parse "[ .... ]" grammar element
    parseTupleVector(compatibility) {

        if (!compatibility)
        {
            this.tokens.removeFront();
        }
        else
        {
            //check if 2nd token is a comma
            if (!(
                (this.tokens.size() >= 2 && this.tokens.getAt(1).type === TT.type.TOKEN_COMMA) ||
                (this.tokens.size() >= 3 && this.tokens.getAt(0).type === TT.type.TOKEN_OP_NEG && this.tokens.getAt(2).type === TT.type.TOKEN_COMMA)
            ))
            {
                return null;
            }
        }

        var varPos = new SourcePos();
        varPos.setValues(this.tokens.front().pos);
        var arrayCtor = new Node.TupleVectorNode(varPos);

        do {
            if (this.tokens.front().type === TT.type.TOKEN_BRACKET_OPEN)
            {
                //nested tuples
                arrayCtor.children.push(this.parseTupleVector());
            }
            else
            {
                arrayCtor.children.push(this.parseBinaryOrExpression());
            }

            if (this.tokens.front().type !== TT.type.TOKEN_COMMA)
            {
                break;
            }
            else 
                this.tokens.removeFront();
        } while (true);

        if(!compatibility)
        {
            this.tokens.removeFront();
        }

        return arrayCtor;
    }

    // Only works when type of token is of IN_LITERAL, and return 0 if the next isn't a token of this type.
    // To be enhanced when tree is ready
    expectConstantExpression(constPos, tree){
        var result = 0;
        if (this.tokens.front().type === TT.type.TOKEN_INT_LITERAL)
        {
            result = this.tokens.front().value;
            this.tokens.removeFront();
        }
        return result;
    }

    link() {

    }
}