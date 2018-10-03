import * as vscode from "vscode";
import * as fs from "fs";
import * as os from "os";

module.exports = function() {
  let config = vscode.workspace.getConfiguration("vsorg");
  let checkFolder = config.get("folderPath");
  let folder: any;
  let dateArray: string[] = [];
readFiles();
  function readFiles() {
    fs.readdir(setMainDir(), (err: any, items: any) => {
      let agendaFile = checkFolder + "\\agendas\\agenda.vsorg";
      //erase data in file
      fs.writeFileSync(agendaFile, "");
      for (let i = 0; i < items.length; i++) {
        if(items[i].includes('.vsorg')){

          //check files for #+ TAGS:
          let fileText = fs.readFileSync(setMainDir() + "\\" + items[i], "utf8");
          if (fileText.includes("SCHEDULED")) {
            let fileName: string = items[i];
            let getText: any = fileText.match(/.*SCHEDULED.*/g);
              getText.forEach(element => {
                //write all of these in the correct spot
                let datelessText: any = element.match(/.*(?=.*SCHEDULED)/g);
                let getDate: any = element.match(/\[(.*)\]/);
                let convertedDate:string;
              
                
                     //get the day of the week
                     let d = new Date(getDate[1]).getDay();
                     let nameOfDay;
                  
                     if (d === 0) {
                       nameOfDay = "Sunday";
                     } else if (d === 1) {
                       nameOfDay = "Monday";
                     } else if (d === 2) {
                       nameOfDay = "Tuesday";
                     } else if (d === 3) {
                       nameOfDay = "Wednesday";
                     } else if (d === 4) {
                       nameOfDay = "Thursday";
                     } else if (d === 5) {
                       nameOfDay = "Friday";
                     } else if (d === 6) {
                       nameOfDay = "Saturday";
                     }
                    convertedDate = getDate[0] + ',' + nameOfDay;
                    dateArray.push(convertedDate);
                    
                     if (!fs.existsSync(checkFolder + "\\agendas")) {

                       fs.mkdirSync(checkFolder + "\\agendas");
                       
                      } 
                      if(!fs.existsSync(agendaFile)){

                  
                       
                        //fs.appendFileSync(checkFolder + "\\agendas\\agenda.vsorg", "\n" + current_line.text);
                      } else{

                     //write the first date to the file
                     let contents =  fs.readFileSync(agendaFile, 'utf-8').split('\n');
                    
                     for(let j = 0; j < contents.length; j++){
                        if(!contents[j].includes('⊙') || !contents[j].includes('⊘') || !contents[j].includes('⊖')) {

                        } 
                       fs.appendFileSync(agendaFile, convertedDate + '\n'); 
                       fs.appendFileSync(agendaFile, datelessText + "\n");
                      }
                       //organize new data 

                      }
              });
          } else {

          }
    }
  }
}
}

  function setMainDir() {
    if (checkFolder === "") {
      let homeDir = os.homedir();
      folder = homeDir + "\\VSOrgFiles";
    } else {
      folder = checkFolder;
    }
    return folder;
  }
}
