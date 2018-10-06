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
      if (current_line.text.includes("TODO")) {
        //remove keywords if there are any
        let remove_todo = text_after_unicode_char.replace(/\b(TODO)\b/, "").trim();

        //delete the current line
        workspaceEdit.delete(document.uri, current_line.range);

        //delete the completed line and move all the text below up

        //inset the new text
        workspaceEdit.insert(document.uri, current_line.range.start, line_leading_spaces + unicode_char + remove_todo);
        return vscode.workspace.applyEdit(workspaceEdit);
      } else if (!current_line.text.includes("DONE")) {
        //check if the line doesnt includes TODO

        workspaceEdit.delete(document.uri, current_line.range);
        workspaceEdit.insert(
          document.uri,
          current_line.range.start,
          line_leading_spaces + unicode_char + "DONE " + text_after_unicode_char + "\n    COMPLETED:" + "[" + date + "]"
        );
        return vscode.workspace.applyEdit(workspaceEdit);
      } else if (!current_line.text.includes("TODO")) {
        let removeDone = text_after_unicode_char.replace(/\b(DONE)\b/, "").trim();
        let removeDate = removeDone.replace(/\b(COMPLETED)\b(.*)/, "").trim();

        // remove todo from the line

        //delete the current text on the line
        workspaceEdit.delete(document.uri, current_line.range);
        workspaceEdit.delete(document.uri, nextLine.range);
        //insert a new line for the completed line

        //need to append file
        workspaceEdit.insert(
          document.uri,
          current_line.range.start,
          line_leading_spaces + unicode_char + "TODO " + removeDate
        );
        workspaceEdit.replace(document.uri, new vscode.Range(current_line.range.end, nextLine.range.start), "");

        return vscode.workspace.applyEdit(workspaceEdit);
      }
    } else {
      if (document.fileName.includes("agenda.vsorg")) {
        if (current_line.text.includes("TODO")) {
          //remove keywords if there are any
          let otherFilename: any = current_line.text.match(/^[^:]+/);
          otherFilename = otherFilename[0].trim();
          let removeTodo = current_line.text.replace(/\b(TODO)\b/, "").trim();
          removeTodo = removeTodo.replace("SCHED:", "");
          removeTodo = removeTodo.replace(otherFilename + ":", "").trim();
          //delete the current line
          workspaceEdit.delete(document.uri, current_line.range);
          //inset the new text
          workspaceEdit.insert(
            document.uri,
            current_line.range.start,
            " " + otherFilename + ": " + "SCHED: " + removeTodo.trim()
          );

          //change text in file
          let contents = fs.readFileSync(setMainDir() + "\\" + otherFilename, "utf-8");
          contents = contents.replace("TODO " + removeTodo, removeTodo);
          fs.writeFileSync(setMainDir() + "\\" + otherFilename, contents, "utf-8");

          return vscode.workspace.applyEdit(workspaceEdit);
        } else if (!current_line.text.includes("DONE")) {
          let testingLine: any;
          let otherFilename: any = current_line.text.match(/\FILENAME:(.*)/);
          otherFilename = otherFilename[1].trim();

          let text = current_line.text.replace("SCHED:", "SCHED: DONE");
          let mainText = current_line.text.replace(/\#\+(.*)/, "").trim();
          mainText = mainText.replace("SCHED:", "").trim();
          workspaceEdit.delete(document.uri, current_line.range);
          workspaceEdit.insert(document.uri, current_line.range.start, text);

          //get date
          let scheduledDate;
          for (let i = 0; i < current_line.lineNumber; i++) {
            testingLine = document.lineAt(position - i);
            if (testingLine.text[0] !== " ") {
              scheduledDate = testingLine.text.match(/\[(.*)\]/);
              break;
            }
          }
          let contents = fs
            .readFileSync(setMainDir() + "\\" + otherFilename)
            .toString()
            .split(/[\r\n]/);
          contents = contents.replace(mainText, "DONE " + mainText + "    COMPLETED:" + "[" + date + "]");

          fs.writeFileSync(setMainDir() + "\\" + otherFilename, contents, "utf-8");
          return vscode.workspace.applyEdit(workspaceEdit);
        } else {
          let otherFilename: any = current_line.text.match(/\FILENAME:(.*)/);
          otherFilename = otherFilename[1].trim();

          let text = current_line.text.replace("SCHED: DONE", "SCHED: TODO");
          let mainText = text.replace(/\#\+(.*)/, "").trim();
          mainText = mainText.replace("SCHED: TODO", "").trim();

          //get date scheduled

          workspaceEdit.delete(document.uri, current_line.range);
          workspaceEdit.insert(document.uri, current_line.range.start, text);

          let contents: any = fs.readFileSync(setMainDir() + "\\" + otherFilename, "utf-8");
          contents = contents.replace("DONE " + mainText, "TODO " + mainText);

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
