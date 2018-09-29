import * as vscode from "vscode";
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
module.exports = function() {
  //get the name of the new file
  let config = vscode.workspace.getConfiguration("vsorg");
  let checkFolder = config.get("folderPath");
  let extension = ".vsorg";
  let folder: any;
  //set folder path to
  vscode.window.showWarningMessage("VS-Org: Make sure to read the change log to see the updated features.");
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
