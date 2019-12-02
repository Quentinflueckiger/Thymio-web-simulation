import Lexer from "./Lexer.js";

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

		console.log("Compile");
		if(typeof this.targetDescription === 'undefined') {
			console.error("TargetDescription not defined.");
			//return false;
		}
		if(typeof this.commonDefinitions === 'undefined') {
			console.error("CommonDefinitions not defined.");
			//return false;
		}

		this.buildMaps();

		// tokenization
		try {
			lexer.tokenize();
		}
		catch(error) {
			console.error(error);
			return false;
		}

		// parsing
		var program;// = new Node();
		
		try {
			program.reset(parseProgram());
		} catch (error) {
			console.error(error);
			//return false;
		}

		// check vectors' size
		try {
			program.checkVectorSize();
		} catch (error) {
			console.error(error);
			//return false;
		}

		// expand the syntax tree to Aseba-like syntax
		try {
			var expandedProgram = program.expandAbstractNodes();
			program.release();
			program.reset(expandedProgram);
		} catch (error) {
			console.error(error);
			//return false;
		}

		// expand the vectorial nodes into scalar operations
		try {
			var expandedProgram = program.expandVectorialNodes();
			program.release();
			program.reset(expandedProgram);
		} catch (error) {
			console.error(error);
			//return false;
		}

		// typecheck
		try {
			program.typeCheck();
		} catch (error) {
			console.error(error);
			//return false;
		}

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
		return true;
	}

	buildMaps() {
		
		this.implementedEvents.length = 0;
		this.subroutineTable.length = 0;
		this.subroutineReverseTable.length = 0;

		this.variablesMap.length = 0//this.targetDescription.getVariablesMap(this.freeVariableIndex);

		this.functionsMap.length = 0;//this.targetDescription.getFunctionsMap();

		this.constantsMap.length = 0;
		for(var i = 0; i < this.commonDefinitions; i++){

		}
	}

}    