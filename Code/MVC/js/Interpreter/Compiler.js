import Lexer from "./Lexer.js";
import Parser from "./Parser.js";

export default class Compiler {
    constructor(){
		this.targetDescription;
		this.commonDefinitions;
		this.freeVariableIndex = 0;
		this.endVariableIndex = 0;
		this.implementedEvents = [];
		this.subroutineTable = [];
		this.subroutineReverseTable = [];
		this.constantsMap = [];
		this.variablesMap = [];
		this.functionsMap = [];
		this.globalEventsMap = [];
		this.allEventsMap = [];
	};

	setTargetDescription(description){
		this.targetDescription = description;
	}
	
	setCommonDefinitions(description){
		this.commonDefinitions = description;
	}
	//compile(std::wistream& source, BytecodeVector& bytecode, unsigned& allocatedVariablesCount, Error &errorDescription, std::wostream* dump)
	compile(source, destByteCode, allocatedVariablesCount, dump){
		var lexer = new Lexer(source);
		var parser = new Parser(this);
		var tokens, parsed, program;

		console.log("Compile");
		if(typeof this.targetDescription === 'undefined') {
			//console.error("TargetDescription not defined.");
			//return false;
		}
		if(typeof this.commonDefinitions === 'undefined') {
			//console.error("CommonDefinitions not defined.");
			//return false;
		}

		this.buildMaps();

		// tokenization
		try {
			tokens = lexer.tokenize();
		}
		catch(error) {
			console.error(error);
			return false;
		}

		// parsing
		
		try {
			parsed = parser.parseProgram(tokens);
		} catch (error) {
			console.error(error);
			//return false;
		}
		/*
		// check vectors' size
		try {
			checkVectorSize(parsed);
		} catch (error) {
			console.error(error);
			//return false;
		}

		// expand the syntax tree to Aseba-like syntax
		try {
			var expandedProgram = expandAbstractNodes(parsed);
			release();//program.release();
			reset(expandedProgram);//program.reset(expandedProgram);
		} catch (error) {
			console.error(error);
			//return false;
		}

		// expand the vectorial nodes into scalar operations
		try {
			var expandedProgram = expandVectorialNodes(parsed);
			release();//program.release();
			reset(expandedProgram);//program.reset(expandedProgram);
		} catch (error) {
			console.error(error);
			//return false;
		}

		// typecheck
		try {
			typeCheck(program);
		} catch (error) {
			console.error(error);
			//return false;
		}
		*/
		/*
		// set the number of allocated variables
		allocatedVariablesCount = this.freeVariableIndex;

		// code generation
		var preLinkByteCode;
		program.emit(preLinkByteCode);

		// fix-up (add of missing STOP and RET bytecodes at code generation)
		preLinkByteCode.fixup(subroutineTable);

		// linking (flattening of complex structure into linear vector)
		if(!this.link(preLinkByteCode, destByteCode)){
			console.error("Script too big.");
			return false;
		}
		*/
		console.log("Consts:", this.constantsMap);
		console.log("Variables: ", this.variablesMap);
		return true;
	}

	buildMaps() {
		
		this.implementedEvents.length = 0;
		this.subroutineTable.length = 0;
		this.subroutineReverseTable.length = 0;

		this.variablesMap.length = 0//this.targetDescription.getVariablesMap(this.freeVariableIndex);

		this.functionsMap.length = 0;//this.targetDescription.getFunctionsMap();

		this.constantsMap.length = 0;

		this.globalEventsMap.length = 0;
		this.allEventsMap.length = 0;
		
		this.allEventsMap.push({eventName : "testevent", eventId : "testId"});
	}

}    