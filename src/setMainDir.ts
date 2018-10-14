import * as vscode from 'vscode';
import * as os from "os";

export class SetDir {
  config: any = vscode.workspace.getConfiguration("vsorg");
  folderPath: string = this.config.get("folderPath");
  folder: any;

  setMainDir() {
    if (this.folderPath === "") {
      let homeDir = os.homedir();
      if (os.platform() === "darwin" || os.platform() === "linux") {
        this.folder = homeDir + "/VSOrgFiles";
      } else {

        this.folder = homeDir + "\\VSOrgFiles";
      }
    } else {
      this.folder = this.folderPath;
    }
    return this.folder;
  }

}