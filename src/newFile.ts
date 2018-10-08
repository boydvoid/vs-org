import * as vscode from "vscode";
import * as path from 'path';
import * as os from 'os';
const fs = require('fs-extra');
import { WindowMessage } from "./showMessage";
module.exports = function () {

  //get the name of the new file
  let config = vscode.workspace.getConfiguration("vsorg");
  let checkFolder = config.get("folderPath");
  let extension = ".vsorg";
  let folder: any;


  //show changelog message
  let changeLogMessage = new WindowMessage("information", "VS-Org was just updated to v0.1.0, view the change log here.", true,
    "View Change Log", true, "https://github.com/robaboyd/vs-org/blob/master/CHANGELOG.md");

  //show the changelog message, flip true and false every update 
  if (vscode.workspace.getConfiguration("vsorg").get("showChangeMessage") === true) {
    let config = vscode.workspace.getConfiguration("vsorg");
    config.update("showChangeMessage", false);
    changeLogMessage.showMessage();
  }
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
      createFile(setMainDir(), fileName)
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
          vscode.window.showErrorMessage("There was an error.");
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

  //check to see if the folder path in settings was changed
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
