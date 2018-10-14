import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { SetDir } from './setMainDir';

module.exports = function () {
  let getDirectory: any = new SetDir().setMainDir();
  let listObject: TagObject = {};
  let splitTags: string[];
  let formatTag: any = [];

  readFiles();

  //interfaces
  interface TagObject {
    [key: string]: any;
  }
  //get tags
  function readFiles() {
    fs.readdir(getDirectory, (err: any, items: any) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].includes(".vsorg")) {
          //check files for #+ TAGS:'
          let fileText;
          if (os.platform() === "darwin" || os.platform() === "linux") {
            fileText = fs.readFileSync(getDirectory + "/" + items[i], "utf-8");
          } else {
            fileText = fs.readFileSync(getDirectory + "\\" + items[i], "utf-8");
          }

          if (fileText.includes("#+TAGS:") && fileText.match(/\#\+TAGS.*/gi) !== null) {
            let fileName: string = items[i];
            let getTags: any = fileText.match(/\#\+TAGS.*/gi);
            splitTags = getTags
              .join("")
              .split("#+TAGS:")
              .join("")
              .trim()
              .split(",");

            splitTags.forEach((element: any) => {
              if (!formatTag.includes(element)) {
                formatTag.push(element);
              }
            });

            splitTags.forEach((element: any) => {
              if (listObject[element] === undefined) {
                listObject[element] = "";
              }
              listObject[element] = listObject[element] + fileName + ",";
            });
          }
        }

        setQuickPick();
      }
    });
  }

  function setQuickPick() {
    vscode.window.showQuickPick(formatTag).then((tag: any) => {
      if (tag != null) {
        if (tag in listObject) {
          let getFileName = listObject[tag].split(",");
          vscode.window.showQuickPick(getFileName).then((filePath: any) => {
            let fullpath: any = path.join(getDirectory, filePath);
            vscode.workspace.openTextDocument(vscode.Uri.file(fullpath)).then(doc => {
              vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside, true);
            });
          });
        }
        // vscode.window.showQuickPick(listObject)
      }
    });
  }


};
