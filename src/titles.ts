import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

module.exports = function() {
  let config = vscode.workspace.getConfiguration("vsorg");
  let checkFolder = config.get("folderPath");
  let folder: any;
  let titles: any[] = [];
  let files: any[] = [];
  let listObject: TitleObject = {};
  let splitTitle: string[];

  readFiles();
  interface TitleObject {
    [key: string]: any;
  }

  function readFiles() {
    fs.readdir(setMainDir(), (err: any, items: any) => {
      for (let i = 0; i < items.length; i++) {
        let fileText = fs.readFileSync(setMainDir() + "\\" + items[i], "utf8");
        if (fileText.includes("#+TITLE:") && fileText.match(/\#\+TITLE.*/gi) !== null) {
          let fileName: string = items[i];
          let getTitle: any = fileText.match(/\#\+TITLE.*/gi);
          splitTitle = getTitle
            .join("")
            .split("#+TITLE:")
            .join("")
            .trim();

          titles.push(splitTitle);

          for (let j = 0; j < titles.length; j++) {
            if (listObject[titles[j]] === undefined) {
              listObject[titles[j]] = "";
            }

            if (listObject[titles[j]] === "") {
              listObject[titles[j]] = fileName;
            }
          }
        }
      }
      setQuickPick();
    });
  }

  function setQuickPick() {
    vscode.window.showQuickPick(titles).then((title: any) => {
      if (title in listObject) {
        let fullpath: any = path.join(setMainDir(), listObject[title]);
        vscode.window.showTextDocument(vscode.Uri.file(fullpath));
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
