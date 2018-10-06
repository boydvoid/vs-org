import * as vscode from "vscode";
import * as fs from "fs";
import * as os from "os";
module.exports = function() {
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
    const { document } = activeTextEditor;
    let config = vscode.workspace.getConfiguration("vsorg");
    let checkFolder = config.get("folderPath");
    let folder: any;
    let characterArray: any = ["⊖ ", "⊙ ", "⊘ "];
    let position: number = activeTextEditor.selection.active.line;
    let current_line: vscode.TextLine = document.lineAt(position);
    let nextLine: vscode.TextLine = document.lineAt(position + 1);
    let unicode_char = characterDecode(characterArray);
    let line_leading_spaces: string = current_line.text.substr(0, current_line.text.indexOf(unicode_char));
    let text_after_unicode_char: string = current_line.text.replace(/[⊙⊘⊖\?]/g, "").trim();
    let date = new Date().toLocaleString();
    let workspaceEdit = new vscode.WorkspaceEdit();
    //check if the char exists on the line
    if (current_line.text.includes(unicode_char)) {
      if (current_line.text.includes("DONE")) {
        //remove keywords if there are any
        let removeDone = text_after_unicode_char.replace(/\b(DONE)\b/, "").trim();

        //delete the current line
        workspaceEdit.delete(document.uri, current_line.range);
        workspaceEdit.delete(document.uri, nextLine.range);

        //delete the completed line and move all the text below up

        //inset the new text
        workspaceEdit.insert(document.uri, current_line.range.start, line_leading_spaces + unicode_char + removeDone);
        //replace the empty line below
        workspaceEdit.replace(document.uri, new vscode.Range(current_line.range.end, nextLine.range.start), "");
        vscode.workspace.applyEdit(workspaceEdit);
      } else if (!current_line.text.includes("TODO")) {
        //check if the line doesnt includes TODO
        workspaceEdit.delete(document.uri, current_line.range);
        workspaceEdit.insert(
          document.uri,
          current_line.range.start,
          line_leading_spaces + unicode_char + "TODO " + text_after_unicode_char
        );
        vscode.workspace.applyEdit(workspaceEdit);
      } else if (!current_line.text.includes("DONE")) {
        // remove todo from the line
        let text_without_todo = text_after_unicode_char.replace(/\b(TODO)\b/, "").trim();

        workspaceEdit.delete(document.uri, current_line.range);

        workspaceEdit.insert(
          document.uri,
          current_line.range.start,
          line_leading_spaces + unicode_char + "DONE " + text_without_todo + "\n   COMPLETED:" + "[" + date + "]"
        );

        vscode.workspace.applyEdit(workspaceEdit);
      }
    } else {
      if (document.fileName.includes("agenda.vsorg")) {
        //for line containing done in the main file
        if (current_line.text.includes("DONE")) {
          //remove keywords if there are any
          let otherFilename: any = current_line.text.match(/\FILENAME:(.*)/);
          otherFilename = otherFilename[1].trim();
          let removeDone = current_line.text.replace(/\b(DONE)\b/, "").trim();
          removeDone = removeDone.replace("D:", "");
          let replaceText: any = removeDone.replace(/\#\+(.*)/, "").trim();
          //delete the current line
          workspaceEdit.delete(document.uri, current_line.range);
          //inset the new text
          workspaceEdit.insert(document.uri, current_line.range.start, "  S: " + removeDone.trim());
          //change text in file
          let contents = fs.readFileSync(setMainDir() + "\\" + otherFilename, "utf-8");
          contents = contents.replace("DONE " + replaceText, replaceText);
          fs.writeFileSync(setMainDir() + "\\" + otherFilename, contents, "utf-8");

          return vscode.workspace.applyEdit(workspaceEdit);
        } else if (!current_line.text.includes("TODO")) {
          let otherFilename: any = current_line.text.match(/\FILENAME:(.*)/);
          otherFilename = otherFilename[1].trim();

          let text = current_line.text.replace("S:", "S: TODO");
          let mainText = current_line.text.replace(/\#\+(.*)/, "").trim();
          mainText = mainText.replace("S:", "").trim();
          workspaceEdit.delete(document.uri, current_line.range);
          workspaceEdit.insert(document.uri, current_line.range.start, text);

          let contents = fs.readFileSync(setMainDir() + "\\" + otherFilename, "utf-8");
          contents = contents.replace(mainText, "TODO " + mainText);

          fs.writeFileSync(setMainDir() + "\\" + otherFilename, contents, "utf-8");
          return vscode.workspace.applyEdit(workspaceEdit);
        } else {
          let otherFilename: any = current_line.text.match(/\FILENAME:(.*)/);
          otherFilename = otherFilename[1].trim();

          let text = current_line.text.replace("S:", "");
          text = text.replace("TODO", "");
          let mainText = text.replace(/\#\+(.*)/, "").trim();
          mainText = mainText.replace("S:", "").trim();

          //delete the current line
          workspaceEdit.delete(document.uri, current_line.range);
          workspaceEdit.insert(document.uri, current_line.range.start, "  D: DONE " + text.trim());

          let contents = fs.readFileSync(setMainDir() + "\\" + otherFilename, "utf-8");
          contents = contents.replace("TODO " + mainText, "DONE " + mainText);
          fs.writeFileSync(setMainDir() + "\\" + otherFilename, contents, "utf-8");

          return vscode.workspace.applyEdit(workspaceEdit);
        }
      }
    }
    function characterDecode(characterArray: any) {
      const { activeTextEditor } = vscode.window;
      if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
        const { document } = activeTextEditor;

        let position = activeTextEditor.selection.active.line;
        const getCurrentLine = document.lineAt(position);
        let currentLineText = getCurrentLine.text;

        for (let i = 0; i < characterArray.length; i++) {
          if (currentLineText.includes(characterArray[i])) {
            return characterArray[i];
          }
        }
      }
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
  }
};
