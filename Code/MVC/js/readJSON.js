/**
 * @author  Quentinflueckiger   /   https://github.com/Quentinflueckiger
 */

readFile();

function readFile() {
    var file, fr;
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText("../json/basePlayground.json");
}



function receivedText(e) {
    let lines = e.target.result;
    var newArr = JSON.parse(lines); 
    console.log(newArr);
}
  