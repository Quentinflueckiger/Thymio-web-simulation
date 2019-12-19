import Lexer from './Lexer.js'
import Compiler from './Compiler.js';


// This content will most likely end in the compiler
function loadFile(file, ec) {
    var reader = new FileReader();

    
    // file reading started
    reader.addEventListener('loadstart', function() {
        console.log('File reading started');
    });

    // file reading finished successfully
    reader.addEventListener('load', function(e) {
        var text = e.target.result;

        interpreteSource(text, ec);
    });
    
    // file reading failed
    reader.addEventListener('error', function() {
        alert('Error : Failed to read file');
    });

    // file read progress 
    reader.addEventListener('progress', function(e) {
        if(e.lengthComputable == true) {
            var percent_read = Math.floor((e.loaded/e.total)*100);
            console.log(percent_read + '% read');
        }
    });

    // read as text file
    reader.readAsText(file);
}

function interpreteSource(source, ec) {
    var compiler = new Compiler();
    
    compiler.setTargetDescription();//getDescription(nodeId));
    compiler.setCommonDefinitions();

    var result = compiler.compile(source, 1, 1, 1);

    if (result) {
        ec.setProgram(result);
    }
    else {
        
    }
    //var lexer = new Lexer(source);
    //lexer.tokenize();
}

function getSourceType(contents) {

    var sourceType;
    for (let index = 0; index < contents.length; index++) {
        if (contents[index].includes("<ThymioVisualProgramming>"))
        {
            sourceType = 0;
        }
        else if (contents[index].includes("<ThymioBlockly>"))
        {
            sourceType = 1;
        }
        else if (contents[index].includes("Something unique to aseba"))
        {
            // most likely aseba, but have to find a way to confirm it
            sourceType = 2;
        }
        else 
        {
            sourceType = 3;
        }
        
        return sourceType;
    }
}

export{ loadFile }