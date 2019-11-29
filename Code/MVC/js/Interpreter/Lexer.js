import Token from './Token.js';
import Deque from '../Deque.js';
import SourcePos from './SourcePos.js';
import * as TT from './TokenType.js';

export default class Lexer {
    constructor(source) {
        this.source = source;
        this.tokens = new Deque();
        
    }
    
    getTokens() {
        return this.tokens;
    }

    // Translated from Lexer.cpp
    /*
        Aseba - an event-based framework for distributed robot control
        Copyright (C) 2007--2016:
            Stephane Magnenat <stephane at magnenat dot net>
            (http://stephane.magnenat.net)
            and other contributors, see authors.txt for details
        This program is free software: you can redistribute it and/or modify
        it under the terms of the GNU Lesser General Public License as published
        by the Free Software Foundation, version 3 of the License.
        This program is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU Lesser General Public License for more details.
        You should have received a copy of the GNU Lesser General Public License
        along with this program. If not, see <http://www.gnu.org/licenses/>.
    */

    tokenize() {
        
        this.tokens.clear();
        var pos = new SourcePos();
        const tabSize = 4;

        while(true) {
            if (pos.character === this.source.length-2){
                break;
            }

            pos.character++;
            var c = this.source[pos.character];
            pos.column++;

            switch (c) 
            {
                // simple cases of one character
                case ' ': break;
                //case '\t': pos.column += tabSize - 1; break;
                case '\t': break;
                case '\n': pos.row++; pos.column = -1; break; // -1 so next call to pos.column++ result set 0
                case '\r': pos.column = -1; break; // -1 so next call to pos.column++ result set 0
                case '(': this.tokens.addRear(new Token(TT.type.TOKEN_PAR_OPEN, pos.getValues())); break;
                case ')': this.tokens.addRear(new Token(TT.type.TOKEN_PAR_CLOSE, pos.getValues())); break;
                case '[': this.tokens.addRear(new Token(TT.type.TOKEN_BRACKET_OPEN, pos.getValues())); break;
                case ']': this.tokens.addRear(new Token(TT.type.TOKEN_BRACKET_CLOSE, pos.getValues())); break;
                case ':': this.tokens.addRear(new Token(TT.type.TOKEN_COLON, pos.getValues())); break;
                case ',': this.tokens.addRear(new Token(TT.type.TOKEN_COMMA, pos.getValues())); break;
                
                // special case for comment
                case '#':
                    {
                        console.log("Comment found");
                        // check if it's a comment block #* ... *#
                        if (this.source[pos.character + 1] === '*')
                        {
                            console.log("Comment block");
                            // comment block
                            // record position of the begining
                            var begin = new SourcePos();
                            begin.setValues(pos.getValues());
                            // move forward by 2 characters then search for the end
                            var step = 2;
                            while ((step > 0) || (c != '*') || (this.source[pos.character] != '#'))
                            {   
                                if (step)
                                    step--;
        
                                if (c == '\t')
                                {
                                    pos.column += tabSize;
                                }
                                else if (c == '\n')
                                {
                                    pos.row++;
                                    pos.column = 0;
                                }
                                else
                                    pos.column++;
                                c = this.source[pos.character];
                                pos.character++;
                                if (pos.character === this.source.length-2)
                                {
                                    // EOF -> unbalanced block
                                    throw "Unbalanced comment block";
                                }
                            }
                            // fetch the #
                            this.getNextCharacter(pos);
                        }
                        else
                        {
                            console.log("Simple comment");
                            // simple comment
                            while ((c != '\n') && (c != '\r') && (!(pos.character === this.source.length-2)))
                            {
                                if (c == '\t')
                                    pos.column += tabSize;
                                else
                                    pos.column++;
                                c = this.source[pos.character];
                                pos.character++;
                            }
                            if (c == '\n')
                            {
                                pos.row++;
                                pos.column = 0;
                            }
                            else if (c == '\r')
                                pos.column = 0;
                            
                        }
                    }
                    break;
                
                // cases that require one character look-ahead
                case '+':
                    if (this.testNextCharacter(pos, '=', TT.type.TOKEN_OP_ADD_EQUAL))
                        break;
                    if (this.testNextCharacter(pos, '+', TT.type.TOKEN_OP_PLUS_PLUS))
                        break;
                    this.tokens.addRear(new Token(type.TOKEN_OP_ADD,pos.getValues()));
                    break;

                case '-':
                    if (this.testNextCharacter(pos, '=', TT.type.TOKEN_OP_NEG_EQUAL))
                        break;
                    if (this.testNextCharacter(pos, '-', TT.type.TOKEN_OP_MINUS_MINUS))
                        break;
                    this.tokens.addRear(new Token(TT.type.TOKEN_OP_NEG, pos.getValues()));
                    break;

                case '*':
                    if (this.testNextCharacter(pos, '=', TT.type.TOKEN_OP_MULT_EQUAL))
                        break;
                    this.tokens.addRear(new Token(TT.type.TOKEN_OP_MULT, pos.getValues()));
                    break;

                case '/':
                    if (this.testNextCharacter(pos, '=', TT.type.TOKEN_OP_DIV_EQUAL))
                        break;
                    this.tokens.addRear(new Token(TT.type.TOKEN_OP_DIV, pos.getValues()));
                    break;

                case '%':
                    if (this.testNextCharacter(pos, '=', TT.type.TOKEN_OP_MOD_EQUAL))
                        break;
                    this.tokens.addRear(new Token(TT.type.TOKEN_OP_MOD, pos.getValues()));
                    break;

                case '|':
                    if (this.testNextCharacter(pos, '=', TT.type.TOKEN_OP_BIT_OR_EQUAL))
                        break;
                    this.tokens.addRear(new Token(TT.type.TOKEN_OP_BIT_OR, pos.getValues()));
                    break;

                case '^':
                    if (this.testNextCharacter(pos, '=', TT.type.TOKEN_OP_BIT_XOR_EQUAL))
                        break;
                    this.tokens.addRear(new Token(TT.type.TOKEN_OP_BIT_XOR, pos.getValues()));
                    break;

                case '&':
                    if (this.testNextCharacter(pos, '=', TT.type.TOKEN_OP_BIT_AND_EQUAL))
                        break;
                    this.tokens.addRear(new Token(TT.type.TOKEN_OP_BIT_AND, pos.getValues()));
                    break;

                case '~':
                    this.tokens.addRear(new Token(TT.type.TOKEN_OP_BIT_NOT, pos.getValues()));
                    break;

                case '!':
                    if (this.testNextCharacter(pos, '=', TT.type.TOKEN_OP_NOT_EQUAL))
                        break;
                    //throw "Syntax error with '!' character.";
                    this.tokens.addRear(new Token(TT.type.TOKEN_EXCLAMATION, pos.getValues()));
                    break;

                case '=':
                    if (this.testNextCharacter(pos, '=', TT.type.TOKEN_OP_EQUAL))
                        break;
                    this.tokens.addRear(new Token(TT.type.TOKEN_ASSIGN, pos.getValues()));
                    break;

                // cases that require two characters look-ahead
                case '<':
                    if (this.source[pos.character + 1] === '<')
                    {
                        // <<
                        this.getNextCharacter(pos);
                        if (this.testNextCharacter(pos, '=', TT.type.TOKEN_OP_SHIFT_LEFT_EQUAL))
                            break;
                        this.tokens.addRear(new Token(TT.type.TOKEN_OP_SHIFT_LEFT, pos.getValues()));
                        break;
                    }
                    // <
                    if (this.testNextCharacter(pos, '=', TT.type.TOKEN_OP_SMALLER_EQUAL))
                        break;
                    this.tokens.addRear(new Token(TT.type.TOKEN_OP_SMALLER, pos.getValues()));
                    break;

                case '>':
                    if (this.source[pos.character + 1] === '>')
                    {
                        // >>
                        this.getNextCharacter(pos);
                        if (this.testNextCharacter(pos, '=', TT.type.TOKEN_OP_SHIFT_RIGHT_EQUAL))
                            break;
                        this.tokens.addRear(new Token(TT.type.TOKEN_OP_SHIFT_RIGHT, pos.getValues()));
                        break;
                    }
                    // >
                    if (this.testNextCharacter(pos, '=', TT.type.TOKEN_OP_BIGGER_EQUAL))
                        break;
                    this.tokens.addRear(new Token(TT.type.TOKEN_OP_BIGGER, pos.getValues()));
                    break; 
                    
                // cases that require to look for a while
                default:
                    {
                        // check first character
                        if (!this.isAlphaNumeric(c) && (c != '_'))
                            break;
                            //console.log("Error invalid identifier "+c+" at pos "+pos.row + " " +pos.column);

                        // get a string
                        var stringHolder = "";
                        stringHolder += c;
                        var nextC = ""+this.source[pos.character + 1];
                        var posIncrement = 0;
                        
                        while ((this.isAlphaNumeric(nextC) || (nextC === '_') || (nextC === '.')))
                        {
                            stringHolder += nextC;
                            posIncrement++;
                            nextC = this.source[pos.character + 1 + posIncrement];
                        }
                        
                        // we now have a string, let's check what it is
                        if (this.isANumber(stringHolder[0]))
                        {
                            // check if hex or binary
                            if ((stringHolder.length > 1) && (stringHolder[0] === '0') && (!this.isANumber(stringHolder[1])))
                            {
                                // check if we have a valid number
                                if (stringHolder[1] === 'x')
                                {
                                    for (var i = 2; i < stringHolder.length; i++)
                                        if (!this.isHexNumber(stringHolder[i]))
                                            console.log("Invalid hexa number at pos " + pos);
                                }
                                else if (stringHolder[1] === 'b')
                                {
                                    for (var i = 2; i < stringHolder.length; i++)
                                        if ((stringHolder[i] != '0') && (stringHolder[i] != '1'))
                                            console.log("Invalid binary number at pos "+pos);
                                }
                                else
                                    console.log("Invalid number base at pos "+pos);

                            }
                            else
                            {
                                // check if we have a valid number
                                for (var i = 1; i < stringHolder.length; i++)
                                    if (!this.isANumber(stringHolder[i]))
                                        console.log ("Error in number at pos "+pos);
                            }
                            this.tokens.addRear(new Token(TT.type.TOKEN_INT_LITERAL, pos.getValues(), stringHolder));
                        }
                        else
                        {
                            // check if it is a known keyword
                            if (stringHolder == "when")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_when, pos.getValues()));
                            else if (stringHolder == "emit")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_emit, pos.getValues()));
                            else if (stringHolder == "_emit")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_hidden_emit, pos.getValues()));
                            else if (stringHolder == "for")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_for, pos.getValues()));
                            else if (stringHolder == "in")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_in, pos.getValues()));
                            else if (stringHolder == "step")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_step, pos.getValues()));
                            else if (stringHolder == "while")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_while, pos.getValues()));
                            else if (stringHolder == "do")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_do, pos.getValues()));
                            else if (stringHolder == "if")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_if, pos.getValues()));
                            else if (stringHolder == "then")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_then, pos.getValues()));
                            else if (stringHolder == "else")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_else, pos.getValues()));
                            else if (stringHolder == "elseif")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_elseif, pos.getValues()));
                            else if (stringHolder == "end")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_end, pos.getValues()));
                            else if (stringHolder == "var")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_var, pos.getValues()));
                            else if (stringHolder == "const")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_const, pos.getValues()));
                            else if (stringHolder == "call")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_call, pos.getValues()));
                            else if (stringHolder == "sub")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_sub, pos.getValues()));
                            else if (stringHolder == "callsub")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_callsub, pos.getValues()));
                            else if (stringHolder == "onevent")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_onevent, pos.getValues()));
                            else if (stringHolder == "abs")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_abs, pos.getValues()));
                            else if (stringHolder == "return")
                                this.tokens.addRear(new Token(TT.type.TOKEN_STR_return, pos.getValues()));
                            else if (stringHolder == "or")
                                this.tokens.addRear(new Token(TT.type.TOKEN_OP_OR, pos.getValues()));
                            else if (stringHolder == "and")
                                this.tokens.addRear(new Token(TT.type.TOKEN_OP_AND, pos.getValues()));
                            else if (stringHolder == "not")
                                this.tokens.addRear(new Token(TT.type.TOKEN_OP_NOT, pos.getValues()));
                            else
                                this.tokens.addRear(new Token(TT.type.TOKEN_STRING_LITERAL, pos.getValues(), stringHolder));
                        }

                        pos.column += posIncrement;
                        pos.character += posIncrement;
                    }
                    break;
            }
        }
        this.printTokens();
    }

    getNextCharacter(pos) {
        pos.column++;
        pos.character++;
        return this.source[pos.character];
    }

    testNextCharacter(pos, strtest, tokenIfTrue) {

        if (this.source[pos.character + 1]=== strtest)
        {

            this.tokens.addRear(new Token(tokenIfTrue, pos.getValues()));
            this.getNextCharacter(pos);
            return true;
        }
        return false;
    }

    printTokens(){
        console.log("Tokens", this.tokens);
    }

    isAlphaNumeric(ch) {
        return ch.match(/^[a-z0-9]+$/i) !== null;
    }

    isANumber(ch) {
        return ch.match(/^[0-9]+$/i) !== null;
    }

    isHexNumber(ch) {
        return ch.match(/^[a-f0-9]+$/i) !==null;
    }
    
}