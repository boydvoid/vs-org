import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

module.exports = function() {
  let config = vscode.workspace.getConfiguration("vsorg");
  let checkFolder = config.get("folderPath");
  let folder: any;
  let tags: string[] = [];
  let files: any = [];
  let listObject: TagObject = {};
  let splitTags: string[];

  readFiles();

  interface TagObject {
    [key: string]: any;
  }
  //get tags
  function readFiles() {
    fs.readdir(setMainDir(), (err: any, items: any) => {
      for (let i = 0; i < items.length; i++) {
        //check files for #+ TAGS:
        let fileText = fs.readFileSync(setMainDir() + "\\" + items[i], "utf8");
        if (fileText.includes("#+TAGS:") && fileText.match(/\#\+TAGS.*/gi) !== null) {
          files.push(items[i]);
          let fileName: string = items[i];
          let getTags: any = fileText.match(/\#\+TAGS.*/gi);
          splitTags = getTags
            .join("")
            .split("#+TAGS:")
            .join("")
            .trim()
            .split(",");

          let formatTag: any = [];

          splitTags.forEach((element: any) => {
            formatTag.push(element);
          });

          //push the tag into tag array so we can check for them in the listObject
          //tags.push(formatTag);

          for (let j = 0; j < formatTag.length; j++) {
            if (listObject[formatTag[j]] === undefined) {
              listObject[formatTag[j]] = "";
            }
            listObject[formatTag[j]] = listObject[formatTag[j]] + fileName + ",";
          }
          console.log(files);
        }
      }

      console.log(tags);
      setQuickPick();
    });
  }

  function setQuickPick() {
    vscode.window.showQuickPick(splitTags).then((tag: any) => {
      if (tag != null) {
        if (tag in listObject) {
          let getFileName = listObject[tag].split(",");
          vscode.window.showQuickPick(getFileName).then((filePath: any) => {
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
