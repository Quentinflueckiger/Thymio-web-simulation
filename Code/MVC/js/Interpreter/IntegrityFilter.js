import Lexer from './Lexer.js'


// This content will most likely end in the compiler
function loadFile(file, environmentController) {
    var reader = new FileReader();

    // file reading started
    reader.addEventListener('loadstart', function() {
        console.log('File reading started');
    });

    // file reading finished successfully
    reader.addEventListener('load', function(e) {
        var text = e.target.result;

        var lines = this.result.split('\n');
        /*for(var line = 0; line < lines.length; line++){
            console.log(lines[line]);
        }*/

        /*
        var sourceType = getSourceType(lines);

        switch (sourceType) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            default:
                break;
        }*/
        // contents of the file
        //console.log(text);

        interpreteSource(text);
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

function interpreteSource(source) {
    //var lexer = new Lexer(source);
    //console.log("T: ",lexer.getToken());
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