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
                    block.children.addRear(child);
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

        return temp;
    }

    //! Parse "binary or" grammar element.
    parseBinaryOrExpression(){
        console.log("Level 0");
        var node = this.parseBinaryXorExpression();

        while(this.tokens.front().type === TT.type.TOKEN_OP_BIT_OR)
        {
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseBinaryAndExpression();
            var temp = new Node.BinaryArithmeticNode(pos, Node.AsebaBinaryOperator.ASEBA_OP_BIT_XOR, node, subExpression);
            node = temp;
        }

        return node;
    }

    //! Parse "binary xor" grammar element.
    parseBinaryXorExpression(){
        console.log("Level 1");
        var node = this.parseBinaryAndExpression();

        while(this.tokens.front().type === TT.type.TOKEN_OP_BIT_XOR)
        {
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseBinaryAndExpression();
            var temp = new Node.BinaryArithmeticNode(pos, Node.AsebaBinaryOperator.ASEBA_OP_BIT_XOR, node, subExpression);
            node = temp;
        }

        return node;
    }

    //! Parse "binary and" grammar element.
    parseBinaryAndExpression(){
        console.log("Level 2");
        var node = this.parseShiftExpression();

        while(this.tokens.front().type === TT.type.TOKEN_OP_BIT_AND)
        {
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseShiftExpression();
            var temp = new Node.BinaryArithmeticNode(pos, Node.AsebaBinaryOperator.ASEBA_OP_BIT_AND, node, subExpression);
            node = temp;
        }

        return node;
    }

    //! Parse "shift_expression" grammar element.
    parseShiftExpression(){
        console.log("Level 3");
        var node = this.parseAddExpression();

        while((this.tokens.front().type === TT.type.TOKEN_OP_SHIFT_LEFT) || (this.tokens.front().type === TT.type.TOKEN_OP_SHIFT_RIGHT))
        {
            var op = this.tokens.front();
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseAddExpression();
            var temp = new Node.BinaryArithmeticNode(pos, this.getAsebaBinaryOperator(op, TT.type.TOKEN_OP_SHIFT_LEFT, Node.AsebaBinaryOperator.ASEBA_OP_SHIFT_LEFT), node, subExpression);
            node = temp;
        }

        return node;
    }

    //! Parse "add_expression" grammar element.
    parseAddExpression(){
        console.log("Level 4");
        var node = this.parseMultExpression();

        while((this.tokens.front().type === TT.type.TOKEN_OP_ADD) || (this.tokens.front().type === TT.type.TOKEN_OP_NEG))
        {
            var op = this.tokens.front();
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseMultExpression();
            var temp = new Node.BinaryArithmeticNode(pos, this.getAsebaBinaryOperator(op, TT.type.TOKEN_OP_ADD, Node.AsebaBinaryOperator.ASEBA_OP_ADD), node, subExpression);
            node = temp;
        }

        return node;
    }

    //! Parse "mult_expression" grammar element.
    parseMultExpression(){
        console.log("Level 5");
        var node = this.parseUnaryExpression();

        while((this.tokens.front().type === TT.type.TOKEN_OP_MULT) || (this.tokens.front().type === TT.type.TOKEN_OP_DIV) || (this.tokens.front().type === TT.type.TOKEN_OP_MOD))
        {
            var op = this.tokens.front();
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseUnaryExpression();
            var temp = new Node.BinaryArithmeticNode(pos, this.getAsebaBinaryOperator(op, TT.type.TOKEN_OP_MULT, Node.AsebaBinaryOperator.ASEBA_OP_MULT), node, subExpression);
            node = temp;
        }

        return node;
    }

    //! Parse "unary_expression" grammar element.
    parseUnaryExpression(){
        console.log("Level 6");
        if (!((this.tokens.front().type === TT.type.TOKEN_PAR_OPEN) || (this.tokens.front().type === TT.type.TOKEN_BRACKET_OPEN) || 
            (this.tokens.front().type === TT.type.TOKEN_OP_NEG) || (this.tokens.front().type === TT.type.TOKEN_OP_BIT_NOT) || 
            (this.tokens.front().type === TT.type.TOKEN_STR_abs) || (this.tokens.front().type === TT.type.TOKEN_STRING_LITERAL) || 
            (this.tokens.front().type === TT.type.TOKEN_INT_LITERAL)
        ))
        {
            console.log("Token not expected.");
            return false;
        }

        var pos = new SourcePos();
        pos.setValues(this.tokens.front().pos);

        switch (this.tokens.front().type)
        {
            case TT.type.TOKEN_PAR_OPEN:
            {
                this.tokens.removeFront();
                var expression = this.parseOr();
                if (!(this.tokens.front().type === TT.type.TOKEN_PAR_CLOSE))
                {
                    console.error("No par_close token found.");
                }
                this.tokens.removeFront();
                return expression;
            }

            case TT.type.TOKEN_BRACKET_OPEN:
            {
                return this.parseTupleVector();
            }

            case TT.type.TOKEN_OP_NEG:
            {
                if(this.tokens.size() >=2 && this.tokens.getAt(1).type === TT.type.TOKEN_INT_LITERAL)
                {
                    this.tokens.removeFront();
                    this.tokens.getAt(0).iValue = -1;
                    this.tokens.getAt(0).sValue = "-" + this.tokens.getAt(0).sValue;
                    return this.parseUnaryExpression();
                }
                else
                {
                    this.tokens.removeFront();
                    return new Node.UnaryArithmeticNode(pos, Node.AsebaBinaryOperator.ASEBA_UNARY_OP_SUB, this.parseUnaryExpression());
                }
            }

            case TT.type.TOKEN_OP_BIT_NOT:
            {
                this.tokens.removeFront();

                return new Node.UnaryArithmeticNode(pos, Node.AsebaBinaryOperator.ASEBA_UNARY_OP_BIT_NOT, this.parseUnaryExpression());
            }

            case TT.type.TOKEN_STR_abs:
            {
                this.tokens.removeFront();

                return new Node.UnaryArithmeticNode(pos, Node.AsebaBinaryOperator.ASEBA_UNARY_OP_ABS, this.parseUnaryExpression());
            }

            case TT.type.TOKEN_INT_LITERAL:
            {
                var arrayCtor = new Node.TupleVectorNode(pos, this.expectInt16Literal());
                this.tokens.removeFront();
                return arrayCtor;
            }

            case TT.type.TOKEN_STRING_LITERAL:
            {
                return this.parseConstantAndVariable();
            }

            default:
                return console.error("Internal Compiler error at pos: "+pos);

        }
    }

    parseOr(){

    }
    
    parseStatement(){

    }

    parseConstantAndVariable(){
        
        console.log("Level 9");

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

            console.log("Rval: "+rValue);
            if (memoryVectorNode.getVectorSize() === 65535)
            {
                console.log("MVN: ", rValue);
                // infere the variable's size based on the initialization
                memoryVectorNode.arraySize = rValue.getVectorSize();
            }

            return new Node.AssignementNode(pos, memoryVectorNode, rValue);
        }

        return null;
    }

    //! Parse "[ .... ]" grammar element
    parseTupleVector(compatibility) {
        console.log("Level 7");

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

    // Replace static_cast<AsebaBinaryOperator>((op - Compiler::Token::) + AsebaBinaryOperator)
    // Difficult as enums don't exist in JavaScript we can't calcul the position the way they did
    getAsebaBinaryOperator(op, token, asebaOP){
        
        var tokenIndex = op - token;

        var asebaIndex = tokenIndex + asebaOP;
        
        console.log("TokenIndex: "+token+" asebaIndex: "+asebaIndex);
        var resultAsebaOP = Node.AsebaBinaryOperator.ASEBA_OP_ADD;

        return resultAsebaOP;
    }

    // To be enhanced with actual logic
    expectInt16Literal(){
        console.log("Level 8");
        var result = 2;

        return result;
    }

    link() {

    }
}