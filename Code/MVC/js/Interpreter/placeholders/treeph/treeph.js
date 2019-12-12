	/** \addtogroup compiler */
	/*@{*/

        const AsebaBinaryOperator ArithmeticAssignmentNode::operatorMap[] = {
            ASEBA_OP_ADD,			// TOKEN_OP_ADD_EQUAL
            ASEBA_OP_SUB,			// TOKEN_OP_NEG_EQUAL
            ASEBA_OP_MULT,			// TOKEN_OP_MULT_EQUAL
            ASEBA_OP_DIV,			// TOKEN_OP_DIV_EQUAL
            ASEBA_OP_MOD,			// TOKEN_OP_MOD_EQUAL
            ASEBA_OP_SHIFT_LEFT,		// TOKEN_OP_SHIFT_LEFT_EQUAL
            ASEBA_OP_SHIFT_RIGHT,		// TOKEN_OP_SHIFT_RIGHT_EQUAL
            ASEBA_OP_BIT_OR,		// TOKEN_OP_BIT_OR_EQUAL
            ASEBA_OP_BIT_XOR,		// TOKEN_OP_BIT_XOR_EQUAL
            ASEBA_OP_BIT_AND		// TOKEN_OP_BIT_AND_EQUAL
        };
    
        //! Destructor, delete all children.
        Node::~Node()
        {
            // we assume that if children is nullptr, another node has taken ownership of it
            for (auto & child : children)
            {
                if (child)
                {
                    delete child;
                    child = nullptr;
                }
            }
        }
    
        Node* Node::deepCopy() const
        {
            Node* newCopy = shallowCopy();
            for (size_t i = 0; i < children.size(); i++)
                if (children[i])
                    newCopy->children[i] = children[i]->deepCopy();
            return newCopy;
        }
    
        //! Constructor
        AssignmentNode::AssignmentNode(const SourcePos &sourcePos, Node *left, Node *right) :
            Node(sourcePos)
        {
            children.push_back(left);
            children.push_back(right);
        }
    
        //! Constructor
        EventDeclNode::EventDeclNode(const SourcePos& sourcePos, unsigned eventId) :
            Node(sourcePos),
            eventId(eventId)
        {
    
        }
    
        //! Constructor
        SubDeclNode::SubDeclNode(const SourcePos& sourcePos, unsigned subroutineId) :
            Node(sourcePos),
            subroutineId(subroutineId)
        {
    
        }
    
        //! Constructor
        CallSubNode::CallSubNode(const SourcePos& sourcePos, std::wstring  subroutineName) :
            Node(sourcePos),
            subroutineName(std::move(subroutineName)),
            subroutineId(-1)
        {
    
        }
    
        //! Constructor
        BinaryArithmeticNode::BinaryArithmeticNode(const SourcePos& sourcePos, AsebaBinaryOperator op, Node *left, Node *right) :
            Node(sourcePos),
            op(op)
        {
            children.push_back(left);
            children.push_back(right);
        }
    
        //! Create a binary arithmetic node for comparaison operation op
        BinaryArithmeticNode *BinaryArithmeticNode::fromComparison(const SourcePos& sourcePos, Compiler::Token::Type op, Node *left, Node *right)
        {
            return new BinaryArithmeticNode(
                sourcePos,
                static_cast<AsebaBinaryOperator>((op - Compiler::Token::TOKEN_OP_EQUAL) + ASEBA_OP_EQUAL),
                left,
                right
            );
        }
    
        //! Create a binary arithmetic node for shift operation op
        BinaryArithmeticNode *BinaryArithmeticNode::fromShiftExpression(const SourcePos& sourcePos, Compiler::Token::Type op, Node *left, Node *right)
        {
            return new BinaryArithmeticNode(
                sourcePos,
                static_cast<AsebaBinaryOperator>((op - Compiler::Token::TOKEN_OP_SHIFT_LEFT) + ASEBA_OP_SHIFT_LEFT),
                left,
                right
            );
        }
    
        //! Create a binary arithmetic node for add/sub operation op
        BinaryArithmeticNode *BinaryArithmeticNode::fromAddExpression(const SourcePos& sourcePos, Compiler::Token::Type op, Node *left, Node *right)
        {
            return new BinaryArithmeticNode(
                sourcePos,
                static_cast<AsebaBinaryOperator>((op - Compiler::Token::TOKEN_OP_ADD) + ASEBA_OP_ADD),
                left,
                right
            );
        }
    
        //! Create a binary arithmetic node for mult/div/mod operation op
        BinaryArithmeticNode *BinaryArithmeticNode::fromMultExpression(const SourcePos& sourcePos, Compiler::Token::Type op, Node *left, Node *right)
        {
            return new BinaryArithmeticNode(
                sourcePos,
                static_cast<AsebaBinaryOperator>((op - Compiler::Token::TOKEN_OP_MULT) + ASEBA_OP_MULT),
                left,
                right
            );
        }
    
        //! Create a binary arithmetic node for or/xor/and operation op
        BinaryArithmeticNode *BinaryArithmeticNode::fromBinaryExpression(const SourcePos& sourcePos, Compiler::Token::Type op, Node *left, Node *right)
        {
            return new BinaryArithmeticNode(
                sourcePos,
                static_cast<AsebaBinaryOperator>((op - Compiler::Token::TOKEN_OP_BIT_OR) + ASEBA_OP_BIT_OR),
                left,
                right
            );
        }
    
        //! Constructor
        UnaryArithmeticNode::UnaryArithmeticNode(const SourcePos& sourcePos, AsebaUnaryOperator op, Node *child) :
            Node(sourcePos),
            op(op)
        {
            children.push_back(child);
        }
    
        //! Constructor
        ArrayWriteNode::ArrayWriteNode(const SourcePos& sourcePos, unsigned arrayAddr, unsigned arraySize, std::wstring arrayName) :
            Node(sourcePos),
            arrayAddr(arrayAddr),
            arraySize(arraySize),
            arrayName(std::move(arrayName))
        {
    
        }
    
        //! Constructor
        ArrayReadNode::ArrayReadNode(const SourcePos& sourcePos, unsigned arrayAddr, unsigned arraySize, std::wstring arrayName) :
            Node(sourcePos),
            arrayAddr(arrayAddr),
            arraySize(arraySize),
            arrayName(std::move(arrayName))
        {
    
        }
    
        //! Constructor, delete the provided memoryNode
        LoadNativeArgNode::LoadNativeArgNode(MemoryVectorNode* memoryNode, unsigned tempAddr):
            Node(memoryNode->sourcePos),
            tempAddr(tempAddr),
            arrayAddr(memoryNode->arrayAddr),
            arraySize(memoryNode->arraySize),
            arrayName(memoryNode->arrayName)
        {
            // safety check
            assert(memoryNode);
            assert(memoryNode->children.size() == 1);
            assert(memoryNode->children[0]);
            assert(!dynamic_cast<TupleVectorNode*>(memoryNode->children[0]));
    
            // get the child from memoryNode
            children.push_back(memoryNode->children[0]);
            memoryNode->children[0] = nullptr;
            delete memoryNode;
        }
    
        //! Constructor
        MemoryVectorNode::MemoryVectorNode(const SourcePos &sourcePos, unsigned arrayAddr, unsigned arraySize, std::wstring arrayName) :
            AbstractTreeNode(sourcePos),
            arrayAddr(arrayAddr),
            arraySize(arraySize),
            arrayName(std::move(arrayName)),
            write(false)
        {
    
        }
    
        //! Constructor
        CallNode::CallNode(const SourcePos& sourcePos, unsigned funcId) :
            Node(sourcePos),
            funcId(funcId)
        {
    
        }
    
        //! Constructor
        ArithmeticAssignmentNode::ArithmeticAssignmentNode(const SourcePos& sourcePos, AsebaBinaryOperator op, Node *left, Node *right) :
            AbstractTreeNode(sourcePos),
            op(op)
        {
            children.push_back(left);
            children.push_back(right);
        }
    
        ArithmeticAssignmentNode* ArithmeticAssignmentNode::fromArithmeticAssignmentToken(const SourcePos& sourcePos, Compiler::Token::Type token, Node *left, Node *right)
        {
            return new ArithmeticAssignmentNode(sourcePos, getBinaryOperator(token), left, right);
        }
    
        AsebaBinaryOperator ArithmeticAssignmentNode::getBinaryOperator(Compiler::Token::Type token)
        {
            return operatorMap[token - Compiler::Token::TOKEN_OP_ADD_EQUAL];
        }
    
        //! Constructor
        UnaryArithmeticAssignmentNode::UnaryArithmeticAssignmentNode(const SourcePos& sourcePos, Compiler::Token::Type token, Node *memory) :
            AbstractTreeNode(sourcePos)
        {
            switch (token)
            {
            case Compiler::Token::TOKEN_OP_PLUS_PLUS:
                arithmeticOp = ASEBA_OP_ADD;
                break;
    
            case Compiler::Token::TOKEN_OP_MINUS_MINUS:
                arithmeticOp = ASEBA_OP_SUB;
                break;
    
            default:
                throw TranslatableError(sourcePos, ERROR_UNARY_ARITH_BUILD_UNEXPECTED);
                break;
            }
    
            children.push_back(memory);
        }

        	//! return the children's size, check for equal size, or E_NOVAL if no child
            unsigned Node::getVectorSize() const
            {
                unsigned size = E_NOVAL;
                unsigned new_size = E_NOVAL;

                for (auto it : children)
                {
                    new_size = it->getVectorSize();
                    if (size == E_NOVAL)
                        size = new_size;
                    else if (size != new_size)
                        throw TranslatableError(sourcePos, ERROR_ARRAY_SIZE_MISMATCH).arg(size).arg(new_size);
                }

                return size;
            }


            unsigned TupleVectorNode::getVectorSize() const
            {
                unsigned size = 0;
                NodesVector::const_iterator it;
                for (it = children.begin(); it != children.end(); it++)
                    size += (*it)->getVectorSize();
                return size;
            }