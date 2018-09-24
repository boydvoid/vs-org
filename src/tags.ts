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
  let files: any = [];
  let listObject: any = {};
  let paths: any = [];
  readFiles();
  //get tags
  function readFiles() {
    fs.readdir(setMainDir(), (err: any, items: any) => {
      for (let i = 0; i < items.length; i++) {
        //check files for #+ TAGS:
        let fileText = fs.readFileSync(setMainDir() + "\\" + items[i], "utf8");
        if (fileText.includes("#+TAGS:") && fileText.match(/\#\+TAGS.*/gi) !== null) {
          files.push(items[i]);
          let result: any = fileText.match(/\#\+TAGS.*/gi);
          tags = result
            .join("")
            .split("#+TAGS:")
            .join("")
            .trim()
            .split(",");

          console.log(files);
        }
      }
      for (let j = 0; j < files.length; j++) {
        for (let tag of tags) {
          if (tag in listObject) {
            listObject[tag].push(files[j]);
          } else {
            listObject[tag] = [files[j]];
          }
        }
      }
      console.log(listObject);
      setQuickPick();
    });
  }

  function setQuickPick() {
    vscode.window.showQuickPick(tags).then((tag: any) => {
      if (tag != null) {
        if (tag in listObject) {
          listObject[tag].forEach((element: any) => {
            paths.push(element);
          });

          vscode.window.showQuickPick(paths).then((filePath: any) => {
            let fullpath: any = path.join(setMainDir(), filePath);
            vscode.window.showTextDocument(vscode.Uri.file(fullpath));
          });
        }
        // vscode.window.showQuickPick(listObject)
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
