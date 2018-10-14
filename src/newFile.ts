import * as vscode from "vscode";
import * as path from 'path';

const fs = require('fs-extra');
import { WindowMessage } from "./showMessage";
import { SetDir } from './setMainDir';

module.exports = function () {

  let extension = ".vsorg";
  let getDirectory: any = new SetDir().setMainDir();

  //all messages
  // let changeLogMessage = new WindowMessage("information", "VS-Org was just updated to v0.1.0, view the change log here.", true,
  //   true, "View Change Log", "https://github.com/robaboyd/vs-org/blob/master/CHANGELOG.md");

  let createFileError = new WindowMessage("error", "Could not create new file, make sure you have your directory set. VS-Org: Change VS-Org Directory.", false, false);
  //show the changelog message, flip true and false every update 
  // if (vscode.workspace.getConfiguration("vsorg").get("showChangeMessage") === true) {
  //   let config = vscode.workspace.getConfiguration("vsorg");
  //   config.update("showChangeMessage", false);
  //   changeLogMessage.showMessage();
  // }
  vscode.window
    .showInputBox({
      placeHolder: "Enter in File Name.",
      prompt: "This file will be saved in your Documents folder."
    })
    .then((setName: any) => {
      if (setName == null || !setName) {
        return false;
      }

      let fileName = setName;

      //create new file
      createFile(getDirectory, fileName)
        .then(path => {
          if (typeof path !== "string") {
            return false;
          }
          vscode.window.showTextDocument(vscode.Uri.file(path), {
            preserveFocus: false,
            preview: false
          });
        })
        .catch(err => {
          createFileError.showMessage();
        });
    });

  // Create the given file if it doesn't exist
  function createFile(folderPath: any, fileName: any) {
    return new Promise((resolve, reject) => {
      if (folderPath == null || fileName == null) {
        reject();
      }
      let fullPath = path.join(folderPath, fileName + extension);
      // fs-extra
      fs.ensureFile(fullPath).then(() => {
        resolve(fullPath);
      });
    });
  }

};
