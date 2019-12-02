import * as TT from './TokenType.js';
import Deque from '../Deque.js';
import SourcePos from './SourcePos.js';

export default class Parser{
    constructor(compiler){
        this.tokens = [];
        this.compiler = compiler;
    }

    parseProgram(tokens){
        this.tokens = tokens;
        var block = new Deque();

		// parse all declarations for constants
        while (this.tokens.front() === TT.type.TOKEN_STR_const) 
        {
            console.log("Here");
            this.parseConstDef();
        }
        /*
        // parse all vars declarations
        while(this.tokens.front() === TT.type.TOKEN_STR_var)
        {
            var child = this.parseVarDef();
            if(child)
            {
                // block.children.addRear(child);
                block.addRear(child);
            }
        }

		// parse the rest of the code
        while(this.tokens.front() !== TT.type.TOKEN_END_OF_STREAM)
        {
            var child = this.parseStatement();
            // block.children.addRear(child);
            block.addRear(child);
        }*/

        while(this.tokens.size() > 1){
            if (this.tokens.front().type === TT.type.TOKEN_STR_const)
            {
                console.log("Constant");
                this.parseConstDef();
            }
            else {
                console.log("Deleted : ", this.tokens.front());
                this.tokens.removeFront();

            }
        }
        //return block.release();
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
        // Not working properly
        if (this.compiler.constantsMap.find(function(element){
                return element.constName === constName
            }))
        {
            console.error("Constant "+constName+" already exist.");
        }

        // mandatory assignation, must resolve to a constant expression
        if(this.tokens.front().type !== TT.type.TOKEN_ASSIGN)
        {
            console.error("Expecting assignement at pos: ", this.tokens.front().pos);
        }

        this.tokens.removeFront();
        var constValue = this.expectConstantExpression(constPos, this.parseBinaryOrExpression());

        /*
        console.log(items[0].constName)
        items[constName] = constVal;
        */
        // save constant
        this.compiler.constantsMap.push({constantName : constName, constantValue : constValue});
    }

    parseVarDef(){

    }

    parseStatement(){

    }

    expectConstantExpression(constPos, tree){
        var result = 0;
        return result;
    }

    parseBinaryOrExpression(){

    }
}