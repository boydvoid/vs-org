import * as vscode from "vscode";
import * as fs from "fs";
import * as os from "os";

module.exports = function() {
  let config = vscode.workspace.getConfiguration("vsorg");
  let checkFolder = config.get("folderPath");
  let folder: any;
  let dateArray: any[] = [];
  let textArray: string[] = [];
  let datelessText: any;
  let getDate: any;
  let convertedDateArray: any = [];
  let unsortedObject: any = {};
  let sortedObject: any = {};
  readFiles();

  function readFiles() {
    fs.readdir(setMainDir(), (err, items: any) => {
      let agendaFile = checkFolder + "\\agendas\\agenda.vsorg";
      //erase data in file
      fs.writeFileSync(agendaFile, "");

      //loop through all of the files in the directory
      for (let i = 0; i < items.length; i++) {
        //make sure its a vsorg file
        if (items[i].includes(".vsorg")) {
          //check for SCHEDULED
          let fileText = fs.readFileSync(setMainDir() + "\\" + items[i], "utf8");
          if (fileText.includes("SCHEDULED")) {
            let getTextBeforeScheduled: any = fileText.match(/.*SCHEDULED.*/g);
            getTextBeforeScheduled.forEach(element => {
              datelessText = element.match(/.*(?=.*SCHEDULED)/g);
              textArray.push();
              getDate = element.match(/\[(.*)\]/);

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
              convertedDateArray = [];
              convertedDateArray.push({
                date: getDate[0] + "," + nameOfDay,
                text: datelessText
              });
              convertedDateArray.forEach(element => {
                if (!unsortedObject[element.date]) {
                  unsortedObject[element.date] = [element.text[0]];
                } else {
                  unsortedObject[element.date].push(element.text[0]);
                }
              });

              Object.keys(unsortedObject)
                .sort()
                .forEach(function(key) {
                  sortedObject[key] = unsortedObject[key];
                });
              console.log(sortedObject);
            });

            //write the sorted object to the agenda file

            if (!fs.existsSync(checkFolder + "\\agendas")) {
              fs.mkdirSync(checkFolder + "\\agendas");
            }

            if (!fs.existsSync(agendaFile)) {
            } else {
              fs.appendFileSync(agendaFile, JSON.stringify(sortedObject, null, 2), "utf-8");
            }
          }
        }
      }
    });
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
};
