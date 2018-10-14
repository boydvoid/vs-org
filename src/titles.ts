import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { SetDir } from './setMainDir';

module.exports = function () {
  let getDirectory: any = new SetDir().setMainDir();
  let titles: any[] = [];

  let listObject: TitleObject = {};
  let splitTitle: string[];

  readFiles();
  interface TitleObject {
    [key: string]: any;
  }

  function readFiles() {
    fs.readdir(getDirectory, (err: any, items: any) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].includes(".vsorg")) {
          let fileText;

          if (os.platform() === 'darwin') {
            fileText = fs.readFileSync(getDirectory + "/" + items[i], "utf8");
          } else {
            fileText = fs.readFileSync(getDirectory + "\\" + items[i], "utf8");
          }

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
      }
    });
  }

  function setQuickPick() {
    vscode.window.showQuickPick(titles).then((title: any) => {
      if (title in listObject) {
        let fullpath: any = path.join(getDirectory, listObject[title]);
        vscode.workspace.openTextDocument(vscode.Uri.file(fullpath)).then(doc => {
          vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside, true);
        });
      }
    });
  }

};
