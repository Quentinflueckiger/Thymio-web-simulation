/**
 * @fileoverview A color palette with the hex values of multiple colors.
 * 
 * @author  Quentinflueckiger   /   https://github.com/Quentinflueckiger
 * Was extracted from the file compiler.h from the following:
 * Aseba - an event-based framework for distributed robot control
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
const type = Object.freeze( //freeze so it can't be modified from outside
{
    TOKEN_END_OF_STREAM : 0,
    TOKEN_STR_when : 1,//"TOKEN_STR_when",
    TOKEN_STR_emit : 2,//"TOKEN_STR_emit",
    TOKEN_STR_hidden_emit : 3,//"TOKEN_STR_hidden_emit",
    TOKEN_STR_for : 4,//"TOKEN_STR_for",
    TOKEN_STR_in : 5,//"TOKEN_STR_in",
    TOKEN_STR_step : 6,//"TOKEN_STR_step",
    TOKEN_STR_while : 7,//"TOKEN_STR_while",
    TOKEN_STR_do : 8,//"TOKEN_STR_do",
    TOKEN_STR_if : 9,//"TOKEN_STR_if",
    TOKEN_STR_then : 10,//"TOKEN_STR_then",
    TOKEN_STR_else : 11,//"TOKEN_STR_else",
    TOKEN_STR_elseif : 12,//"TOKEN_STR_elseif",
    TOKEN_STR_end : 13,//"TOKEN_STR_end",
    TOKEN_STR_var : 14,//"TOKEN_STR_var",
    TOKEN_STR_const : 15,//"TOKEN_STR_const",
    TOKEN_STR_call : 16,//"TOKEN_STR_call",
    TOKEN_STR_sub : 17,//"TOKEN_STR_sub",
    TOKEN_STR_callsub : 18,//"TOKEN_STR_callsub",
    TOKEN_STR_onevent : 19,//"TOKEN_STR_onevent",
    TOKEN_STR_abs : 20,//"TOKEN_STR_abs",
    TOKEN_STR_return : 21,//"TOKEN_STR_return",
    TOKEN_STRING_LITERAL : 22,//"TOKEN_STRING_LITERAL",
    TOKEN_INT_LITERAL : 23,//"TOKEN_INT_LITERAL",
    TOKEN_PAR_OPEN : 24,//"TOKEN_PAR_OPEN",
    TOKEN_PAR_CLOSE : 25,//"TOKEN_PAR_CLOSE",
    TOKEN_BRACKET_OPEN : 26,//"TOKEN_BRACKET_OPEN",
    TOKEN_BRACKET_CLOSE : 27,//"TOKEN_BRACKET_CLOSE",
    TOKEN_COLON : 28,//"TOKEN_COLON",
    TOKEN_COMMA : 29,//"TOKEN_COMMA",
    TOKEN_EXCLAMATION : 30,//"TOKEN_EXCLAMATION",
    TOKEN_ASSIGN : 31,//"TOKEN_ASSIGN",
    TOKEN_OP_OR : 32,//"TOKEN_OP_OR",
    TOKEN_OP_AND : 33,//"TOKEN_OP_AND",
    TOKEN_OP_NOT : 34,//"TOKEN_OP_NOT",

    TOKEN_OP_EQUAL : 35,//"TOKEN_OP_EQUAL",			                // group of tokens, don't split or mess up
    TOKEN_OP_NOT_EQUAL : 36,//"TOKEN_OP_NOT_EQUAL",		            //
    TOKEN_OP_BIGGER : 37,//"TOKEN_OP_BIGGER",		                //
    TOKEN_OP_BIGGER_EQUAL : 38,//"TOKEN_OP_BIGGER_EQUAL",            //
    TOKEN_OP_SMALLER : 39,//"TOKEN_OP_SMALLER",		                //
    TOKEN_OP_SMALLER_EQUAL : 40,//"TOKEN_OP_SMALLER_EQUAL",	        //

    TOKEN_OP_ADD : 41,//"TOKEN_OP_ADD",			                    // group of 2 tokens, don't split or mess up
    TOKEN_OP_NEG : 42,//"TOKEN_OP_NEG",			                    //
    TOKEN_OP_MULT : 43,//"TOKEN_OP_MULT",			                // group of 3 tokens, don't split or mess up
    TOKEN_OP_DIV : 44,//"TOKEN_OP_DIV",			                    //
    TOKEN_OP_MOD : 45,//"TOKEN_OP_MOD",			                    //
    TOKEN_OP_SHIFT_LEFT : 46,//"TOKEN_OP_SHIFT_LEFT",		        // group of 2 tokens, don't split or mess up
    TOKEN_OP_SHIFT_RIGHT : 47,//"TOKEN_OP_SHIFT_RIGHT",		        //
    TOKEN_OP_BIT_OR : 48,//"TOKEN_OP_BIT_OR",		                // group of 4 tokens, don't split or mess up
    TOKEN_OP_BIT_XOR : 49,//"TOKEN_OP_BIT_XOR",		                //
    TOKEN_OP_BIT_AND : 50,//"TOKEN_OP_BIT_AND",		                //
    TOKEN_OP_BIT_NOT : 51,//"TOKEN_OP_BIT_NOT",		                //

    TOKEN_OP_ADD_EQUAL : 52,//"TOKEN_OP_ADD_EQUAL",		            // group of 12 tokens, don't split or mess up
    TOKEN_OP_NEG_EQUAL : 53,//"TOKEN_OP_NEG_EQUAL",		            //
    TOKEN_OP_MULT_EQUAL : 54,//"TOKEN_OP_MULT_EQUAL",		        //
    TOKEN_OP_DIV_EQUAL : 55,//"TOKEN_OP_DIV_EQUAL",		            //
    TOKEN_OP_MOD_EQUAL : 56,//"TOKEN_OP_MOD_EQUAL",		            //
    TOKEN_OP_SHIFT_LEFT_EQUAL : 57,//"TOKEN_OP_SHIFT_LEFT_EQUAL",	//
    TOKEN_OP_SHIFT_RIGHT_EQUAL : 58,//"TOKEN_OP_SHIFT_RIGHT_EQUAL",	//
    TOKEN_OP_BIT_OR_EQUAL : 59,//"TOKEN_OP_BIT_OR_EQUAL",		    //
    TOKEN_OP_BIT_XOR_EQUAL : 60,//"TOKEN_OP_BIT_XOR_EQUAL",		    //
    TOKEN_OP_BIT_AND_EQUAL : 61,//"TOKEN_OP_BIT_AND_EQUAL",		    //

    TOKEN_OP_PLUS_PLUS : 62,//"TOKEN_OP_PLUS_PLUS",
    TOKEN_OP_MINUS_MINUS : 63,//"TOKEN_OP_MINUS_MINUS"

});

export {type}