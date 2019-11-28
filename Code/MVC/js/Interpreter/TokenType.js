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
    TOKEN_STR_when : "TOKEN_STR_when",
    TOKEN_STR_emit : "TOKEN_STR_emit",
    TOKEN_STR_hidden_emit : "TOKEN_STR_hidden_emit",
    TOKEN_STR_for : "TOKEN_STR_for",
    TOKEN_STR_in : "TOKEN_STR_in",
    TOKEN_STR_step : "TOKEN_STR_step",
    TOKEN_STR_while : "TOKEN_STR_while",
    TOKEN_STR_do : "TOKEN_STR_do",
    TOKEN_STR_if : "TOKEN_STR_if",
    TOKEN_STR_then : "TOKEN_STR_then",
    TOKEN_STR_else : "TOKEN_STR_else",
    TOKEN_STR_elseif : "TOKEN_STR_elseif",
    TOKEN_STR_end : "TOKEN_STR_end",
    TOKEN_STR_var : "TOKEN_STR_var",
    TOKEN_STR_const : "TOKEN_STR_const",
    TOKEN_STR_call : "TOKEN_STR_call",
    TOKEN_STR_sub : "TOKEN_STR_sub",
    TOKEN_STR_callsub : "TOKEN_STR_callsub",
    TOKEN_STR_onevent : "TOKEN_STR_onevent",
    TOKEN_STR_abs : "TOKEN_STR_abs",
    TOKEN_STR_return : "TOKEN_STR_return",
    TOKEN_STRING_LITERAL : "TOKEN_STRING_LITERAL",
    TOKEN_INT_LITERAL : "TOKEN_INT_LITERAL",
    TOKEN_PAR_OPEN : "TOKEN_PAR_OPEN",
    TOKEN_PAR_CLOSE : "TOKEN_PAR_CLOSE",
    TOKEN_BRACKET_OPEN : "TOKEN_BRACKET_OPEN",
    TOKEN_BRACKET_CLOSE : "TOKEN_BRACKET_CLOSE",
    TOKEN_COLON : "TOKEN_COLON",
    TOKEN_COMMA : "TOKEN_COMMA",
    TOKEN_ASSIGN : "TOKEN_ASSIGN",
    TOKEN_OP_OR : "TOKEN_OP_OR",
    TOKEN_OP_AND : "TOKEN_OP_AND",
    TOKEN_OP_NOT : "TOKEN_OP_NOT",

    TOKEN_OP_EQUAL : "TOKEN_OP_EQUAL",			                // group of tokens, don't split or mess up
    TOKEN_OP_NOT_EQUAL : "TOKEN_OP_NOT_EQUAL",		            //
    TOKEN_OP_BIGGER : "TOKEN_OP_BIGGER",		                //
    TOKEN_OP_BIGGER_EQUAL : "TOKEN_OP_BIGGER_EQUAL",            //
    TOKEN_OP_SMALLER : "TOKEN_OP_SMALLER",		                //
    TOKEN_OP_SMALLER_EQUAL : "TOKEN_OP_SMALLER_EQUAL",	        //

    TOKEN_OP_ADD : "TOKEN_OP_ADD",			                    // group of 2 tokens, don't split or mess up
    TOKEN_OP_NEG : "TOKEN_OP_NEG",			                    //
    TOKEN_OP_MULT : "TOKEN_OP_MULT",			                // group of 3 tokens, don't split or mess up
    TOKEN_OP_DIV : "TOKEN_OP_DIV",			                    //
    TOKEN_OP_MOD : "TOKEN_OP_MOD",			                    //
    TOKEN_OP_SHIFT_LEFT : "TOKEN_OP_SHIFT_LEFT",		        // group of 2 tokens, don't split or mess up
    TOKEN_OP_SHIFT_RIGHT : "TOKEN_OP_SHIFT_RIGHT",		        //
    TOKEN_OP_BIT_OR : "TOKEN_OP_BIT_OR",		                // group of 4 tokens, don't split or mess up
    TOKEN_OP_BIT_XOR : "TOKEN_OP_BIT_XOR",		                //
    TOKEN_OP_BIT_AND : "TOKEN_OP_BIT_AND",		                //
    TOKEN_OP_BIT_NOT : "TOKEN_OP_BIT_NOT",		                //

    TOKEN_OP_ADD_EQUAL : "TOKEN_OP_ADD_EQUAL",		            // group of 12 tokens, don't split or mess up
    TOKEN_OP_NEG_EQUAL : "TOKEN_OP_NEG_EQUAL",		            //
    TOKEN_OP_MULT_EQUAL : "TOKEN_OP_MULT_EQUAL",		        //
    TOKEN_OP_DIV_EQUAL : "TOKEN_OP_DIV_EQUAL",		            //
    TOKEN_OP_MOD_EQUAL : "TOKEN_OP_MOD_EQUAL",		            //
    TOKEN_OP_SHIFT_LEFT_EQUAL : "TOKEN_OP_SHIFT_LEFT_EQUAL",	//
    TOKEN_OP_SHIFT_RIGHT_EQUAL : "TOKEN_OP_SHIFT_RIGHT_EQUAL",	//
    TOKEN_OP_BIT_OR_EQUAL : "TOKEN_OP_BIT_OR_EQUAL",		    //
    TOKEN_OP_BIT_XOR_EQUAL : "TOKEN_OP_BIT_XOR_EQUAL",		    //
    TOKEN_OP_BIT_AND_EQUAL : "TOKEN_OP_BIT_AND_EQUAL",		    //

    TOKEN_OP_PLUS_PLUS : "TOKEN_OP_PLUS_PLUS",
    TOKEN_OP_MINUS_MINUS : "TOKEN_OP_MINUS_MINUS"

});

export {type}