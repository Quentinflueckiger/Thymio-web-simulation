import * as TT from './TokenType.js';
import Deque from '../Deque.js';
import SourcePos from './SourcePos.js';
import * as Node from './tree/Node.js';

export default class Parser{
    constructor(compiler){
        this.tokens;
        this.compiler = compiler;
    }

    parseProgram(tokens){
        this.tokens = tokens;
        var block = new Node.ProgramNode(this.tokens.front().pos);
        console.log("Prog: ", block);
        while(this.tokens.size() > 1){
            // parse all declarations for constants
            if (this.tokens.front().type === TT.type.TOKEN_STR_const)
            {
                this.parseConstDef();
            }
            // discard all variables declaration
            else if (this.tokens.front().type === TT.type.TOKEN_STR_var)
            {   
                this.tokens.removeFront();
                if(this.tokens.front().type === TT.type.TOKEN_STRING_LITERAL)
                {
                    this.tokens.removeFront();
                    if(this.tokens.front().type === TT.type.TOKEN_STRING_LITERAL || this.tokens.front().type === TT.type.TOKEN_INT_LITERAL)
                        this.tokens.removeFront();
                }
            }
            // parse the rest of the code
            else {
                var child = this.parseStatement();
                console.log("Child: ",child);
                block.children.addRear(child);

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
        
        var constValue = this.expectConstantExpression(constPos);

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
        var varAddr = this.compiler.freeVariableIndex;
        var exist = false;
        // check if variable exists
        this.compiler.variablesMap.forEach(element => {
            if (element.variableName === varName)
                exist = true;;
        });
        // check if variable conflicts with a constant
        this.compiler.constantsMap.forEach(element => {
            if (element.constantName === varName)
                exist = true;
        });
        if (exist)
            return false;

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
        this.compiler.freeVariableIndex += varSize;

        return temp;
    }

    //! Parse "binary or" grammar element.
    parseBinaryOrExpression(){
        var node = this.parseBinaryXorExpression();

        while(this.tokens.front().type === TT.type.TOKEN_OP_BIT_OR)
        {
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseBinaryAndExpression();
            var temp = new Node.BinaryArithmeticNode(pos.getValues(), Node.AsebaBinaryOperator.ASEBA_OP_BIT_OR, node, subExpression);
            node = temp;
        }

        return node;
    }

    //! Parse "binary xor" grammar element.
    parseBinaryXorExpression(){
        var node = this.parseBinaryAndExpression();

        while(this.tokens.front().type === TT.type.TOKEN_OP_BIT_XOR)
        {
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseBinaryAndExpression();
            var temp = new Node.BinaryArithmeticNode(pos.getValues(), Node.AsebaBinaryOperator.ASEBA_OP_BIT_XOR, node, subExpression);
            node = temp;
        }

        return node;
    }

    //! Parse "binary and" grammar element.
    parseBinaryAndExpression(){
        var node = this.parseShiftExpression();

        while(this.tokens.front().type === TT.type.TOKEN_OP_BIT_AND)
        {
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseShiftExpression();
            var temp = new Node.BinaryArithmeticNode(pos.getValues(), Node.AsebaBinaryOperator.ASEBA_OP_BIT_AND, node, subExpression);
            node = temp;
        }

        return node;
    }

    //! Parse "shift_expression" grammar element.
    parseShiftExpression(){
        var node = this.parseAddExpression();

        while((this.tokens.front().type === TT.type.TOKEN_OP_SHIFT_LEFT) || (this.tokens.front().type === TT.type.TOKEN_OP_SHIFT_RIGHT))
        {
            var op = this.tokens.front();
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseAddExpression();
            var temp = new Node.BinaryArithmeticNode(pos.getValues(), this.getAsebaBinaryOperator(op, TT.type.TOKEN_OP_SHIFT_LEFT, Node.AsebaBinaryOperator.ASEBA_OP_SHIFT_LEFT), node, subExpression);
            node = temp;
        }

        return node;
    }

    //! Parse "add_expression" grammar element.
    parseAddExpression(){
        var node = this.parseMultExpression();

        while((this.tokens.front().type === TT.type.TOKEN_OP_ADD) || (this.tokens.front().type === TT.type.TOKEN_OP_NEG))
        {
            var op = this.tokens.front();
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseMultExpression();
            var temp = new Node.BinaryArithmeticNode(pos.getValues(), this.getAsebaBinaryOperator(op, TT.type.TOKEN_OP_ADD, Node.AsebaBinaryOperator.ASEBA_OP_ADD), node, subExpression);
            node = temp;
        }

        return node;
    }

    //! Parse "mult_expression" grammar element.
    parseMultExpression(){
        var node = this.parseUnaryExpression();

        while((this.tokens.front().type === TT.type.TOKEN_OP_MULT) || (this.tokens.front().type === TT.type.TOKEN_OP_DIV) || (this.tokens.front().type === TT.type.TOKEN_OP_MOD))
        {
            var op = this.tokens.front();
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseUnaryExpression();
            var temp = new Node.BinaryArithmeticNode(pos.getValues(), this.getAsebaBinaryOperator(op, TT.type.TOKEN_OP_MULT, Node.AsebaBinaryOperator.ASEBA_OP_MULT), node, subExpression);
            node = temp;
        }

        return node;
    }

    //! Parse "unary_expression" grammar element.
    parseUnaryExpression(){
        if (!((this.tokens.front().type === TT.type.TOKEN_PAR_OPEN) || (this.tokens.front().type === TT.type.TOKEN_BRACKET_OPEN) || 
            (this.tokens.front().type === TT.type.TOKEN_OP_NEG) || (this.tokens.front().type === TT.type.TOKEN_OP_BIT_NOT) || 
            (this.tokens.front().type === TT.type.TOKEN_STR_abs) || (this.tokens.front().type === TT.type.TOKEN_STRING_LITERAL) || 
            (this.tokens.front().type === TT.type.TOKEN_INT_LITERAL)
        ))
        {
            console.error("Token not expected.");
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
                    this.tokens.getAt(0).value = -1;
                    this.tokens.getAt(0).sValue = "-" + this.tokens.getAt(0).sValue;
                    return this.parseUnaryExpression();
                }
                else
                {
                    this.tokens.removeFront();
                    return new Node.UnaryArithmeticNode(pos.getValues(), Node.AsebaBinaryOperator.ASEBA_UNARY_OP_SUB, this.parseUnaryExpression());
                }
            }

            case TT.type.TOKEN_OP_BIT_NOT:
            {
                this.tokens.removeFront();

                return new Node.UnaryArithmeticNode(pos.getValues(), Node.AsebaBinaryOperator.ASEBA_UNARY_OP_BIT_NOT, this.parseUnaryExpression());
            }

            case TT.type.TOKEN_STR_abs:
            {
                this.tokens.removeFront();

                return new Node.UnaryArithmeticNode(pos.getValues(), Node.AsebaBinaryOperator.ASEBA_UNARY_OP_ABS, this.parseUnaryExpression());
            }

            case TT.type.TOKEN_INT_LITERAL:
            {
                var arrayCtor = new Node.TupleVectorNode(pos.getValues(), this.expectInt16Literal());
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

    //! Parse "or" grammar element.
    parseOr(){
        var node = this.parseAnd();

        while(this.tokens.front().type === TT.type.TOKEN_OP_OR)
        {
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseAnd();
            var temp = new Node.BinaryArithmeticNode(pos.getValues(), Node.AsebaBinaryOperator.ASEBA_OP_OR, node, subExpression);
            node = temp;
        }

        return node;
    }
    
    //! Parse "and" grammar element.
    parseAnd(){
        var node = this.parseNot();

        while(this.tokens.front().type === TT.type.TOKEN_OP_AND)
        {
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseAnd();
            var temp = new Node.BinaryArithmeticNode(pos.getValues(), Node.AsebaBinaryOperator.ASEBA_OP_AND, node, subExpression);
            node = temp;
        }

        return node;
    }

    //! Parse "not" grammar element.
    parseNot(){
        var pos = new SourcePos();
        pos.setValues(this.tokens.front().pos);

        var odd = false;
        while(this.tokens.front() === TT.type.TOKEN_OP_NOT)
        {
            odd = !odd;
            this.tokens.removeFront();
        }

        if(odd)
            return new Node.UnaryArithmeticNode(pos.getValues(), Node.AsebaBinaryOperator.ASEBA_UNARY_OP_NOT, this.parseCondition());
        else
            return this.parseCondition();
    }

    //! Parse "condition" grammar element.
    parseCondition(){
        var node = this.parseBinaryOrExpression();

        while((this.tokens.front().type === TT.type.TOKEN_OP_EQUAL) || (this.tokens.front().type === TT.type.TOKEN_OP_NOT_EQUAL) ||
            (this.tokens.front().type === TT.type.TOKEN_OP_BIGGER) || (this.tokens.front().type === TT.type.TOKEN_OP_BIGGER_EQUAL) ||
            (this.tokens.front().type === TT.type.TOKEN_OP_SMALLER) || (this.tokens.front().type === TT.type.TOKEN_OP_SMALLER_EQUAL)
        )
        {
            var op = this.tokens.front();
            var pos = new SourcePos();
            pos.setValues(this.tokens.front().pos);
            this.tokens.removeFront();
            var subExpression = this.parseBinaryOrExpression();
            var temp = new Node.BinaryArithmeticNode(pos.getValues(), this.getAsebaBinaryOperator(op, TT.type.TOKEN_OP_EQUAL, Node.AsebaBinaryOperator.ASEBA_OP_EQUAL), node, subExpression);
            node = temp;
        }

        return node;
    }

    //! Parse "if" grammar element.
    parseIfWhen(edgeSensitive){
        var ifNode = new Node.IfWhenNode(this.tokens.front().pos);

        // eat "if"/"when"
        ifNode.edgeSensitive = edgeSensitive;
        this.tokens.removeFront();
        
        // condition
        console.log("ParseOr: ", this.parseOr());
        // !!!!!!!!!!!!!!!!!!!! Have to look into parseOr() and the following 
        //ifNode.children.addRear(this.parseOr());

        // then keyworkd
        if (edgeSensitive)
            if(this.tokens.front().type !== TT.type.TOKEN_STR_do)
            {
                console.log("Token: ",this.tokens.front());
                return false;
            }
        else
            if(this.tokens.front().type !== TT.type.TOKEN_STR_then)
            {
                return false;
            }

        // parse true condition
        ifNode.children.addRear(new Node.BlockNode((this.tokens.front().pos)));
        while(!((this.tokens.front().type === TT.type.TOKEN_STR_else) || 
                (this.tokens.front().type === TT.type.TOKEN_STR_elseif) ||
                (this.tokens.front().type === TT.type.TOKEN_STR_end) 
        ))
        {
            ifNode.children.addRear(this.parseBlockStatement());
        }

        // parse false condition (only for if)
        /* To be translated if "if" is needed
        if (!edgeSensitive)
		{
			if (tokens.front() == Token::TOKEN_STR_else)
			{
				tokens.pop_front();

				ifNode->children.push_back(new BlockNode(tokens.front().pos));
				while (tokens.front() != Token::TOKEN_STR_end)
					ifNode->children[2]->children.push_back(parseBlockStatement());
			}
			// if elseif, queue new if directly after and return before parsing trailing end
			if (tokens.front() == Token::TOKEN_STR_elseif)
			{
				ifNode->children.push_back(parseIfWhen(false));
				return ifNode.release();
			}
        }
        */

        // end keyword
        ifNode.endLine = this.tokens.front().pos.row;
        if(!(this.tokens.front().type === TT.type.TOKEN_STR_end))
        {
            console.log("C");
            return false;
        }
        this.tokens.removeFront();

        return ifNode;

        //this.tokens.removeFront();
    }

    parseFor(){
        this.tokens.removeFront();
    }  

    parseWhile(){
        this.tokens.removeFront();
    }

    parseEmit(){
        this.tokens.removeFront();
    }

    parseFunctionCall(){
        this.tokens.removeFront();
    }

    parseCallSub(){
        this.tokens.removeFront();
    }

    parseAssignment(){
        this.tokens.removeFront();
    }

    //! Parse "statement" grammar element.
    parseStatement(){
        this.freeTemporaryMemory();

        switch(this.tokens.front().type)
        {
            case TT.type.TOKEN_STR_var:
                console.error("Misplaced vardef at ",this.tokens.front().pos);
                return false;
            case TT.type.TOKEN_STR_onevent:
                return this.parseOnEvent();
            case TT.type.TOKEN_STR_sub:
                return this.parseSubDecl();
            default: 
                return this.parseBlockStatement();
        }
    }
    
    //! Parse "block statement" grammar element.
    parseBlockStatement(){
        switch(this.tokens.front().type)
        {
            case TT.type.TOKEN_STR_if:
                return this.parseIfWhen(false);
            case TT.type.TOKEN_STR_when: 
                return this.parseIfWhen(true);
            case TT.type.TOKEN_STR_for: 
                return this.parseFor();
            case TT.type.TOKEN_STR_while: 
                return this.parseWhile();
            case TT.type.TOKEN_STR_emit: 
                return this.parseEmit();
            case TT.type.TOKEN_STR_hidden_emit: 
                return this.parseEmit(true);
            case TT.type.TOKEN_STR_call: 
                return this.parseFunctionCall();
            case TT.type.TOKEN_STR_callsub: 
                return this.parseCallSub();
            case TT.type.TOKEN_STR_return: 
                return this.parseReturn();
			default: return this.parseAssignment();
        }
    }

    //! Parse "onevent" grammar element
    parseOnEvent(){
        var pos = new SourcePos();
        pos.setValues(this.tokens.front().pos);
        this.tokens.removeFront();

        var eventId = this.expectAnyEventId();
        if(this.compiler.implementedEvents.find(element => element === eventId))
            console.error("Event already implemented.");
        this.compiler.implementedEvents.push(eventId);

        this.tokens.removeFront();

        return new Node.EventDeclNode(pos.getValues(), eventId);
    }

    //! Parse "sub" grammar element, declaration of subroutine
    parseSubDecl(){
        var pos = new SourcePos();
        pos.setValues(this.tokens.front().pos);
        this.tokens.removeFront();

        if(!(this.tokens.front().type === TT.type.TOKEN_STRING_LITERAL))
            return false;
        var name = this.tokens.front().sValue;
        var it = this.compiler.subroutineReverseTable.find(element => element.revName === name);

        if (it)
        {
            return false;
        }
        ({constantName : constName, constantValue : constValue});
        var subroutineId = this.compiler.subroutineTable.length;
        this.compiler.subroutineTable.push({subName : name, subAddress : 0, subLine : pos.row});
        this.compiler.subroutineReverseTable.push({revName : name, revId : subroutineId});

        this.tokens.removeFront();

        return new Node.SubDeclNode(pos.getValues(), subroutineId);
    }

    parseConstantAndVariable(){
        console.log("parseConstantAndVariable");
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

            return new Node.AssignementNode(pos.getValues(), memoryVectorNode, rValue);
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
                arrayCtor.children.addRear(this.parseTupleVector());
            }
            else
            {
                arrayCtor.children.addRear(this.parseBinaryOrExpression());
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
    //!!!!! To be enhanced when tree is ready
    expectConstantExpression(constPos){
        var result = 0;
        if (this.tokens.front().type === TT.type.TOKEN_INT_LITERAL)
        {
            result = this.tokens.front().value;
            this.tokens.removeFront();
        }
        return result;

        /*var result = 0;

        var tempTree1 = new Node.AssignementNode(constPos.getValues(), new Node.MemoryVectorNode(constPos.getValues(),0,1,"fake"), tree);

        tempTree1 = tempTree1.expandAbstractNodes();

        var tempTree2 = tempTree1.expandVectorialNodes(this.compiler, 1);

        //tempTree2.optimize();*/
    }

    // Replace static_cast<AsebaBinaryOperator>((op - Compiler::Token::) + AsebaBinaryOperator)
    // Difficult as enums don't exist in JavaScript we can't calcul the position the way they did
    getAsebaBinaryOperator(op, token, asebaOP){
        
        var tokenIndex = op - token;

        var asebaIndex = tokenIndex + asebaOP;
        
        console.log("TokenIndex: "+token+" asebaIndex: "+asebaIndex);
        //var resultAsebaOP = Node.AsebaBinaryOperator.asebaIndex;

        return resultAsebaOP;
        /*
        const arrAs = Object.values(AsebaBinaryOperator);
        const keys = Object.keys(AsebaBinaryOperator);
        var index = 0;
        var result;
        for(const val of arrAs)
        {
        if (val === 4)
        {
            var checkIndex = 0;
            for(const key of keys)
            {
            if (checkIndex === index)
            {
                result = key;
            }
            checkIndex++;
            }
        }
        index++;
        }

        console.log(result);
        console.log(AsebaBinaryOperator[result])
        */
    }

    //! Check and return a 16 bits signed integer
    expectInt16Literal(){
        if(this.tokens.front() === TT.type.TOKEN_OP_NEG)
        {
            this.tokens.removeFront();
            var result = -this.expectAbsoluteInt16Literal(true);  
            return result;
        }
        else
        {
            if(this.tokens.front().value < 0){
                this.tokens.front().value *= -1;
                var result = -this.expectAbsoluteInt16Literal(true); 
                return result;
            }
            else
            {
                var result = this.expectAbsoluteInt16Literal(false); 
                return result;
            }
        }

    }

    //! Check if next token is the absolute part of a 16 bits signed integer literal. If so, return it, if not, throw an exception
    expectAbsoluteInt16Literal(negative){
        if(!(this.tokens.front().type === TT.type.TOKEN_INT_LITERAL))
        {
            return false;
        }
        var limit = 32767;
        if(negative)
        {
            limit++;
        }
        if (this.tokens.front().value < 0 || this.tokens.front().value > limit)
        {
            console.error("Int out of range at pos: ", this.tokens.front().pos);
        }

        return this.tokens.front().value;
    }

    //! Check if next token is a known local or global event identifier
    expectAnyEventId(){
        if(!(this.tokens.front().type === TT.type.TOKEN_STRING_LITERAL))
        {
            console.error("Expected string for event declaration.");
            return false;
        }
        var name = this.tokens.front().value;
        var pos = new SourcePos();
        pos.setValues(this.tokens.front().pos);
        var eventId = this.findAnyEvent(name, pos.getValues());

        return eventId;
    }

    findAnyEvent(name, pos){
        return this.findInTable("allEvent", name, pos)
    }

    findInTable(map, name, pos){
        switch(map)
        {
            case "allEvent":
                var result;
                this.compiler.allEventsMap.forEach(element => {
                    if (element.eventName.localeCompare(name)===0){
                        result = element.eventId;
                    }
                });
                if(result)
                    return result;
                console.error("Event not found at pos:",pos);
                break;
        }
    }

    freeTemporaryMemory(){
        this.compiler.endVariableIndex = 0;
    }

    link() {

    }
}