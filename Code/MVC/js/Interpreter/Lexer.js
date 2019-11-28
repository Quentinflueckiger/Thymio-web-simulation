import Token from './Token.js';
import Deque from '../Deque.js';
import SourcePos from './SourcePos.js';
import * as TT from './TokenType.js';

export default class Lexer {
    constructor(source) {
        this.source = source;
        this.tokens = new Deque();
        
    }
    
    getToken() {
        return new Token("test", 0, "test");
    }

    tokenize() {
        
        this.tokens.clear();
        var pos = new SourcePos();
        const tabSize = 4; //???

        while(true) {
            if (pos.character === this.source.length-2){
                console.log("Iterator out of bound");
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
                case '(': this.tokens.addRear({token : TT.type.TOKEN_PAR_OPEN, position : pos.getValues()}); break;
                case ')': this.tokens.addRear({token : TT.type.TOKEN_PAR_CLOSE, position : pos.getValues()}); break;
                case '[': this.tokens.addRear({token : TT.type.TOKEN_BRACKET_OPEN, position : pos.getValues()}); break;
                case ']': this.tokens.addRear({token : TT.type.TOKEN_BRACKET_CLOSE, position : pos.getValues()}); break;
                case ':': this.tokens.addRear({token : TT.type.TOKEN_COLON, position : pos.getValues()}); break;
                case ',': this.tokens.addRear({token : TT.type.TOKEN_COMMA, position : pos.getValues()}); break;
                
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
                    this.tokens.addRear({token : TT.type.TOKEN_OP_ADD, position : pos.getValues()});
                    break;
                    
                default:
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

            this.tokens.addRear({token : tokenIfTrue, position : pos.getValues()});
            this.getNextCharacter(pos);
            return true;
        }
        return false;
    }

    printTokens(){
        console.log("Tokens", this.tokens);
    }
}

// Lexer from aseba
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
   /*
 	//! Position in a source file or string. First is line, second is column
	 struct SourcePos
	 {
		 unsigned character{0}; //!< position in source text
		 unsigned row{0}; //!< line in source text
		 unsigned column{0}; //!< column in source text
		 bool valid{false}; //!< true if character, row and column hold valid values
 
		 SourcePos(unsigned character, unsigned row, unsigned column) : character(character - 1), row(row), column(column - 1) { valid = true; }
		 SourcePos() = default;
		 std::wstring toWString() const;
	 }; 
//! Return a string representation of the token
std::wstring Compiler::Token::toWString() const
{
    std::wostringstream oss;
    oss << pos.toWString() << " ";
    oss << typeName();
    if (type == TOKEN_INT_LITERAL)
        oss << L" : " << iValue;
    if (type == TOKEN_STRING_LITERAL)
        oss << L" : " << sValue;
    return oss.str();
}
//! Parse source and build tokens vector
//! \param source source code
void Compiler::tokenize(std::wistream& source)
{
    tokens.clear();
    SourcePos pos(0, 0, 0);
    const unsigned tabSize = 4;

    // tokenize text source
    while (source.good())
    {
        wchar_t c = source.get();

        if (source.eof())
            break;

        pos.column++;
        pos.character++;

        switch (c)
        {
            // simple cases of one character
            case ' ': break;
            //case '\t': pos.column += tabSize - 1; break;
            case '\t': break;
            case '\n': pos.row++; pos.column = -1; break; // -1 so next call to pos.column++ result set 0
            case '\r': pos.column = -1; break; // -1 so next call to pos.column++ result set 0
            case '(': tokens.emplace_back(Token::TOKEN_PAR_OPEN, pos); break;
            case ')': tokens.emplace_back(Token::TOKEN_PAR_CLOSE, pos); break;
            case '[': tokens.emplace_back(Token::TOKEN_BRACKET_OPEN, pos); break;
            case ']': tokens.emplace_back(Token::TOKEN_BRACKET_CLOSE, pos); break;
            case ':': tokens.emplace_back(Token::TOKEN_COLON, pos); break;
            case ',': tokens.emplace_back(Token::TOKEN_COMMA, pos); break;

            // special case for comment
            case '#':
            {
                // check if it's a comment block #* ... *#
                if (source.peek() == '*')
                {
                    // comment block
                    // record position of the begining
                    SourcePos begin(pos);
                    // move forward by 2 characters then search for the end
                    int step = 2;
                    while ((step > 0) || (c != '*') || (source.peek() != '#'))
                    {
                        if (step)
                            step--;

                        if (c == '\t')
                            pos.column += tabSize;
                        else if (c == '\n')
                        {
                            pos.row++;
                            pos.column = 0;
                        }
                        else
                            pos.column++;
                        c = source.get();
                        pos.character++;
                        if (source.eof())
                        {
                            // EOF -> unbalanced block
                            throw TranslatableError(begin, ERROR_UNBALANCED_COMMENT_BLOCK);
                        }
                    }
                    // fetch the #
                    getNextCharacter(source, pos);
                }
                else
                {
                    // simple comment
                    while ((c != '\n') && (c != '\r') && (!source.eof()))
                    {
                        if (c == '\t')
                            pos.column += tabSize;
                        else
                            pos.column++;
                        c = source.get();
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
                if (testNextCharacter(source, pos, '=', Token::TOKEN_OP_ADD_EQUAL))
                    break;
                if (testNextCharacter(source, pos, '+', Token::TOKEN_OP_PLUS_PLUS))
                    break;
                tokens.emplace_back(Token::TOKEN_OP_ADD, pos);
                break;

            case '-':
                if (testNextCharacter(source, pos, '=', Token::TOKEN_OP_NEG_EQUAL))
                    break;
                if (testNextCharacter(source, pos, '-', Token::TOKEN_OP_MINUS_MINUS))
                    break;
                tokens.emplace_back(Token::TOKEN_OP_NEG, pos);
                break;

            case '*':
                if (testNextCharacter(source, pos, '=', Token::TOKEN_OP_MULT_EQUAL))
                    break;
                tokens.emplace_back(Token::TOKEN_OP_MULT, pos);
                break;

            case '/':
                if (testNextCharacter(source, pos, '=', Token::TOKEN_OP_DIV_EQUAL))
                    break;
                tokens.emplace_back(Token::TOKEN_OP_DIV, pos);
                break;

            case '%':
                if (testNextCharacter(source, pos, '=', Token::TOKEN_OP_MOD_EQUAL))
                    break;
                tokens.emplace_back(Token::TOKEN_OP_MOD, pos);
                break;

            case '|':
                if (testNextCharacter(source, pos, '=', Token::TOKEN_OP_BIT_OR_EQUAL))
                    break;
                tokens.emplace_back(Token::TOKEN_OP_BIT_OR, pos);
                break;

            case '^':
                if (testNextCharacter(source, pos, '=', Token::TOKEN_OP_BIT_XOR_EQUAL))
                    break;
                tokens.emplace_back(Token::TOKEN_OP_BIT_XOR, pos);
                break;

            case '&':
                if (testNextCharacter(source, pos, '=', Token::TOKEN_OP_BIT_AND_EQUAL))
                    break;
                tokens.emplace_back(Token::TOKEN_OP_BIT_AND, pos);
                break;

            case '~':
                tokens.emplace_back(Token::TOKEN_OP_BIT_NOT, pos);
                break;

            case '!':
                if (testNextCharacter(source, pos, '=', Token::TOKEN_OP_NOT_EQUAL))
                    break;
                throw TranslatableError(pos, ERROR_SYNTAX);
                break;

            case '=':
                if (testNextCharacter(source, pos, '=', Token::TOKEN_OP_EQUAL))
                    break;
                tokens.emplace_back(Token::TOKEN_ASSIGN, pos);
                break;

            // cases that require two characters look-ahead
            case '<':
                if (source.peek() == '<')
                {
                    // <<
                    getNextCharacter(source, pos);
                    if (testNextCharacter(source, pos, '=', Token::TOKEN_OP_SHIFT_LEFT_EQUAL))
                        break;
                    tokens.emplace_back(Token::TOKEN_OP_SHIFT_LEFT, pos);
                    break;
                }
                // <
                if (testNextCharacter(source, pos, '=', Token::TOKEN_OP_SMALLER_EQUAL))
                    break;
                tokens.emplace_back(Token::TOKEN_OP_SMALLER, pos);
                break;

            case '>':
                if (source.peek() == '>')
                {
                    // >>
                    getNextCharacter(source, pos);
                    if (testNextCharacter(source, pos, '=', Token::TOKEN_OP_SHIFT_RIGHT_EQUAL))
                        break;
                    tokens.emplace_back(Token::TOKEN_OP_SHIFT_RIGHT, pos);
                    break;
                }
                // >
                if (testNextCharacter(source, pos, '=', Token::TOKEN_OP_BIGGER_EQUAL))
                    break;
                tokens.emplace_back(Token::TOKEN_OP_BIGGER, pos);
                break;

            // cases that require to look for a while
            default:
            {
                // check first character
                if (!is_utf8_alpha_num(c) && (c != '_'))
                    throw TranslatableError(pos, ERROR_INVALID_IDENTIFIER).arg((unsigned)c, 0, 16);

                // get a string
                std::wstring s;
                s += c;
                wchar_t nextC = source.peek();
                int posIncrement = 0;
                while ((source.good()) && (is_utf8_alpha_num(nextC) || (nextC == '_') || (nextC == '.')))
                {
                    s += nextC;
                    source.get();
                    posIncrement++;
                    nextC = source.peek();
                }

                // we now have a string, let's check what it is
                if (std::iswdigit(s[0]))
                {
                    // check if hex or binary
                    if ((s.length() > 1) && (s[0] == '0') && (!std::iswdigit(s[1])))
                    {
                        // check if we have a valid number
                        if (s[1] == 'x')
                        {
                            for (unsigned i = 2; i < s.size(); i++)
                                if (!std::iswxdigit(s[i]))
                                    throw TranslatableError(pos, ERROR_INVALID_HEXA_NUMBER);
                        }
                        else if (s[1] == 'b')
                        {
                            for (unsigned i = 2; i < s.size(); i++)
                                if ((s[i] != '0') && (s[i] != '1'))
                                    throw TranslatableError(pos, ERROR_INVALID_BINARY_NUMBER);
                        }
                        else
                            throw TranslatableError(pos, ERROR_NUMBER_INVALID_BASE);

                    }
                    else
                    {
                        // check if we have a valid number
                        for (unsigned i = 1; i < s.size(); i++)
                            if (!std::iswdigit(s[i]))
                                throw TranslatableError(pos, ERROR_IN_NUMBER);
                    }
                    tokens.emplace_back(Token::TOKEN_INT_LITERAL, pos, s);
                }
                else
                {
                    // check if it is a known keyword
                    // FIXME: clean-up that with a table
                    if (s == L"when")
                        tokens.emplace_back(Token::TOKEN_STR_when, pos);
                    else if (s == L"emit")
                        tokens.emplace_back(Token::TOKEN_STR_emit, pos);
                    else if (s == L"_emit")
                        tokens.emplace_back(Token::TOKEN_STR_hidden_emit, pos);
                    else if (s == L"for")
                        tokens.emplace_back(Token::TOKEN_STR_for, pos);
                    else if (s == L"in")
                        tokens.emplace_back(Token::TOKEN_STR_in, pos);
                    else if (s == L"step")
                        tokens.emplace_back(Token::TOKEN_STR_step, pos);
                    else if (s == L"while")
                        tokens.emplace_back(Token::TOKEN_STR_while, pos);
                    else if (s == L"do")
                        tokens.emplace_back(Token::TOKEN_STR_do, pos);
                    else if (s == L"if")
                        tokens.emplace_back(Token::TOKEN_STR_if, pos);
                    else if (s == L"then")
                        tokens.emplace_back(Token::TOKEN_STR_then, pos);
                    else if (s == L"else")
                        tokens.emplace_back(Token::TOKEN_STR_else, pos);
                    else if (s == L"elseif")
                        tokens.emplace_back(Token::TOKEN_STR_elseif, pos);
                    else if (s == L"end")
                        tokens.emplace_back(Token::TOKEN_STR_end, pos);
                    else if (s == L"var")
                        tokens.emplace_back(Token::TOKEN_STR_var, pos);
                    else if (s == L"const")
                        tokens.emplace_back(Token::TOKEN_STR_const, pos);
                    else if (s == L"call")
                        tokens.emplace_back(Token::TOKEN_STR_call, pos);
                    else if (s == L"sub")
                        tokens.emplace_back(Token::TOKEN_STR_sub, pos);
                    else if (s == L"callsub")
                        tokens.emplace_back(Token::TOKEN_STR_callsub, pos);
                    else if (s == L"onevent")
                        tokens.emplace_back(Token::TOKEN_STR_onevent, pos);
                    else if (s == L"abs")
                        tokens.emplace_back(Token::TOKEN_STR_abs, pos);
                    else if (s == L"return")
                        tokens.emplace_back(Token::TOKEN_STR_return, pos);
                    else if (s == L"or")
                        tokens.emplace_back(Token::TOKEN_OP_OR, pos);
                    else if (s == L"and")
                        tokens.emplace_back(Token::TOKEN_OP_AND, pos);
                    else if (s == L"not")
                        tokens.emplace_back(Token::TOKEN_OP_NOT, pos);
                    else
                        tokens.emplace_back(Token::TOKEN_STRING_LITERAL, pos, s);
                }

                pos.column += posIncrement;
                pos.character += posIncrement;
            }
            break;
        } // switch (c)
    } // while (source.good())

    tokens.emplace_back(Token::TOKEN_END_OF_STREAM, pos);
}

wchar_t Compiler::getNextCharacter(std::wistream &source, SourcePos &pos)
{
    pos.column++;
    pos.character++;
    return source.get();
}

bool Compiler::testNextCharacter(std::wistream &source, SourcePos &pos, wchar_t test, Token::Type tokenIfTrue)
{
    if ((int)source.peek() == int(test))
    {
        tokens.emplace_back(tokenIfTrue, pos);
        getNextCharacter(source, pos);
        return true;
    }
    return false;
}*/