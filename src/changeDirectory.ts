const vscode = require("vscode");
const path = require("path");

module.exports = function() {
  vscode.window
    .showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      canSelectMany: false,
      openLabel: "Set As VS-Org Folder"
    })
    .then((response: any) => {
      vscode.workspace
        .getConfiguration("vsorg")
        .update("folderPath", path.normalize(response[0].fsPath), true)
        .then(() => {
          vscode.window.showInformationMessage("VS-Org: " + response[0].fsPath + " set as directory");
        });
    });
};
