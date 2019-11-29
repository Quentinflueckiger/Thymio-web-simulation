TOKEN PLACEHOLDER
//! Construct a new token of given type and value
if(this.type == TOKEN_INT_LITERAL) {
    var decode;
    var wasUnsigned = false;
    // all values are assumed to be signed 16-bits
    if ((value.length() > 1) && (value[1] == 'x')) {
        decode = wcstol(value.c_str() + 2, nullptr, 16);
        wasUnsigned = true;
    }
    else if ((value.length() > 1) && (value[1] == 'b')) {
        decode = wcstol(value.c_str() + 2, nullptr, 2);
        wasUnsigned = true;
    }
    else
        decode = wcstol(value.c_str(), nullptr, 10);
    if (decode >= 65536)
        throw TranslatableError(pos, ERROR_INT16_OUT_OF_RANGE).arg(decode);
    if (wasUnsigned && decode > 32767)
        decode -= 65536;
    iValue = decode;
}
else {
    iValue = 0;
    pos.column--; // column has already been incremented when token is created, so we remove one
    pos.character--; // character has already been incremented when token is created, so we remove one
}
//! Return the name of the type of this token
getTypeName() {
    switch (Type)
    {
        case TOKEN_END_OF_STREAM: return translate(ERROR_TOKEN_END_OF_STREAM);
        case TOKEN_STR_when: return translate(ERROR_TOKEN_STR_when);
        case TOKEN_STR_emit: return translate(ERROR_TOKEN_STR_emit);
        case TOKEN_STR_hidden_emit: return translate(ERROR_TOKEN_STR_hidden_emit);
        case TOKEN_STR_for: return translate(ERROR_TOKEN_STR_for);
        case TOKEN_STR_in: return translate(ERROR_TOKEN_STR_in);
        case TOKEN_STR_step: return translate(ERROR_TOKEN_STR_step);
        case TOKEN_STR_while: return translate(ERROR_TOKEN_STR_while);
        case TOKEN_STR_do: return translate(ERROR_TOKEN_STR_do);
        case TOKEN_STR_if: return translate(ERROR_TOKEN_STR_if);
        case TOKEN_STR_then: return translate(ERROR_TOKEN_STR_then);
        case TOKEN_STR_else: return translate(ERROR_TOKEN_STR_else);
        case TOKEN_STR_elseif: return translate(ERROR_TOKEN_STR_elseif);
        case TOKEN_STR_end: return translate(ERROR_TOKEN_STR_end);
        case TOKEN_STR_var: return translate(ERROR_TOKEN_STR_var);
        case TOKEN_STR_const: return translate(ERROR_TOKEN_STR_const);
        case TOKEN_STR_call: return translate(ERROR_TOKEN_STR_call);
        case TOKEN_STR_sub: return translate(ERROR_TOKEN_STR_sub);
        case TOKEN_STR_callsub: return translate(ERROR_TOKEN_STR_callsub);
        case TOKEN_STR_onevent: return translate(ERROR_TOKEN_STR_onevent);
        case TOKEN_STR_abs: return translate(ERROR_TOKEN_STR_abs);
        case TOKEN_STR_return: return translate(ERROR_TOKEN_STR_return);
        case TOKEN_STRING_LITERAL: return translate(ERROR_TOKEN_STRING_LITERAL);
        case TOKEN_INT_LITERAL: return translate(ERROR_TOKEN_INT_LITERAL);
        case TOKEN_PAR_OPEN: return translate(ERROR_TOKEN_PAR_OPEN);
        case TOKEN_PAR_CLOSE: return translate(ERROR_TOKEN_PAR_CLOSE);
        case TOKEN_BRACKET_OPEN: return translate(ERROR_TOKEN_BRACKET_OPEN);
        case TOKEN_BRACKET_CLOSE: return translate(ERROR_TOKEN_BRACKET_CLOSE);
        case TOKEN_COLON: return translate(ERROR_TOKEN_COLON);
        case TOKEN_COMMA: return translate(ERROR_TOKEN_COMMA);
        case TOKEN_ASSIGN: return translate(ERROR_TOKEN_ASSIGN);
        case TOKEN_OP_OR: return translate(ERROR_TOKEN_OP_OR);
        case TOKEN_OP_AND: return translate(ERROR_TOKEN_OP_AND);
        case TOKEN_OP_NOT: return translate(ERROR_TOKEN_OP_NOT);
        case TOKEN_OP_BIT_OR: return translate(ERROR_TOKEN_OP_BIT_OR);
        case TOKEN_OP_BIT_XOR: return translate(ERROR_TOKEN_OP_BIT_XOR);
        case TOKEN_OP_BIT_AND: return translate(ERROR_TOKEN_OP_BIT_AND);
        case TOKEN_OP_BIT_NOT: return translate(ERROR_TOKEN_OP_BIT_NOT);
        case TOKEN_OP_BIT_OR_EQUAL: return translate(ERROR_TOKEN_OP_BIT_OR_EQUAL);
        case TOKEN_OP_BIT_XOR_EQUAL: return translate(ERROR_TOKEN_OP_BIT_XOR_EQUAL);
        case TOKEN_OP_BIT_AND_EQUAL: return translate(ERROR_TOKEN_OP_BIT_AND_EQUAL);
        case TOKEN_OP_EQUAL: return translate(ERROR_TOKEN_OP_EQUAL);
        case TOKEN_OP_NOT_EQUAL: return translate(ERROR_TOKEN_OP_NOT_EQUAL);
        case TOKEN_OP_BIGGER: return translate(ERROR_TOKEN_OP_BIGGER);
        case TOKEN_OP_BIGGER_EQUAL: return translate(ERROR_TOKEN_OP_BIGGER_EQUAL);
        case TOKEN_OP_SMALLER: return translate(ERROR_TOKEN_OP_SMALLER);
        case TOKEN_OP_SMALLER_EQUAL: return translate(ERROR_TOKEN_OP_SMALLER_EQUAL);
        case TOKEN_OP_SHIFT_LEFT: return translate(ERROR_TOKEN_OP_SHIFT_LEFT);
        case TOKEN_OP_SHIFT_RIGHT: return translate(ERROR_TOKEN_OP_SHIFT_RIGHT);
        case TOKEN_OP_SHIFT_LEFT_EQUAL: return translate(ERROR_TOKEN_OP_SHIFT_LEFT_EQUAL);
        case TOKEN_OP_SHIFT_RIGHT_EQUAL: return translate(ERROR_TOKEN_OP_SHIFT_RIGHT_EQUAL);
        case TOKEN_OP_ADD: return translate(ERROR_TOKEN_OP_ADD);
        case TOKEN_OP_NEG: return translate(ERROR_TOKEN_OP_NEG);
        case TOKEN_OP_ADD_EQUAL: return translate(ERROR_TOKEN_OP_ADD_EQUAL);
        case TOKEN_OP_NEG_EQUAL: return translate(ERROR_TOKEN_OP_NEG_EQUAL);
        case TOKEN_OP_PLUS_PLUS: return translate(ERROR_TOKEN_OP_PLUS_PLUS);
        case TOKEN_OP_MINUS_MINUS: return translate(ERROR_TOKEN_OP_MINUS_MINUS);
        case TOKEN_OP_MULT: return translate(ERROR_TOKEN_OP_MULT);
        case TOKEN_OP_DIV: return translate(ERROR_TOKEN_OP_DIV);
        case TOKEN_OP_MOD: return translate(ERROR_TOKEN_OP_MOD);
        case TOKEN_OP_MULT_EQUAL: return translate(ERROR_TOKEN_OP_MULT_EQUAL);
        case TOKEN_OP_DIV_EQUAL: return translate(ERROR_TOKEN_OP_DIV_EQUAL);
        case TOKEN_OP_MOD_EQUAL: return translate(ERROR_TOKEN_OP_MOD_EQUAL);
        default: return translate(ERROR_TOKEN_UNKNOWN);
    }
}