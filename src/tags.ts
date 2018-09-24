import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

module.exports = function() {
  let config = vscode.workspace.getConfiguration("vsorg");
  let checkFolder = config.get("folderPath");
  let extension = ".vsorg";
  let folder: any;
  let tags: any;
  readFiles();
  //get tags
  function readFiles() {
    fs.readdir(setMainDir(), (err: any, items: any) => {
      for (let i = 0; i < items.length; i++) {
        //check files for #+ TAGS:
        let fileText = fs.readFileSync(setMainDir() + "\\" + items[i], "utf8");
        if (fileText.includes("#+TAGS:") && fileText.match(/\#\+TAGS.*/gi) !== null) {
          let result: any = fileText.match(/\#\+TAGS.*/gi);
          tags = result
            .join("")
            .split("#+TAGS:")
            .join("")
            .trim()
            .split(",");
        }
      }
      setQuickPick();
    });
  }

  function setQuickPick() {
    vscode.window.showQuickPick(tags).then(tag => {
      if (tag != null) {
        console.log(tag);
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
