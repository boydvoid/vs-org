import * as vscode from "vscode";
import * as fs from "fs";
import * as os from "os";

module.exports = function() {
  let config = vscode.workspace.getConfiguration("vsorg");
  let checkFolder = config.get("folderPath");
  let folder: any;
readFiles();
  function readFiles() {
    fs.readdir(setMainDir(), (err: any, items: any) => {
      for (let i = 0; i < items.length; i++) {
        if(items[i].includes('.vsorg')){

          //check files for #+ TAGS:
          let fileText = fs.readFileSync(setMainDir() + "\\" + items[i], "utf8");
          if (fileText.includes("SCHEDULED")) {
            let fileName: string = items[i];
          let getText: any = fileText.match(/.*(?=.*SCHEDULED)/g);
          let getDate: any = fileText.match(/\[(.*)\]/);

         let contents =  fs.readFileSync(setMainDir() + '\\agenda\\agenda.vsorg', 'utf-8');
            console.log(contents);
            console.log(getText);
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
