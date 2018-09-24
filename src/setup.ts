const vscode = require("vscode");
const path = require("path");

module.exports = function() {
  vscode.window
    .showInformationMessage(
      "VS-Org: The default path to create a file is your home directory. Would you like to change it?",
      ...["Change VSO file directory"]
    )
    .then((x: any) => {
      if (x === "Change VSO file directory") {
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
                vscode.window.showInformationMessage(
                  "Folder selected. You can chang the path from the settings, or by re-running the setup."
                );
              });
          });
      }
    });
};
