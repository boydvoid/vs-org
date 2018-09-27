import * as vscode from "vscode";
module.exports = function() {
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
    const { document } = activeTextEditor;

    let characterArray: any = ["⊖ ", "⊙ ", "⊘ "];
    let position = activeTextEditor.selection.active.line;
    let char: any = characterDecode(characterArray);
    let getCurrentLine = document.lineAt(position);
    let currentLineText = getCurrentLine.text;
    let removeDate = currentLineText.substring(currentLineText.indexOf("["), currentLineText.indexOf("]") + 1);
    let datelessText = currentLineText.replace(removeDate, "");
    let formattedText = datelessText.replace(/[⊙⊘⊖\?]/g, "").trim();
    let getLeadingSpace = currentLineText.substr(0, currentLineText.indexOf(char));
    let date = new Date().toLocaleString();
    let lastLine = document.lineAt(document.lineCount - 1);
    let nextLine = document.lineAt(position + 1);
    let twoLinesDown = document.lineAt(position + 2);
    if (currentLineText.includes(char)) {
      if (currentLineText.includes(char)) {
        let edit = new vscode.WorkspaceEdit();
        let removeEdit = new vscode.WorkspaceEdit();
        edit.delete(document.uri, getCurrentLine.range);
        if (currentLineText.includes("TODO")) {
          //remove the keyword
          let removedKeyword = formattedText.replace(/\b(DONE|TODO)\b/, "").trim();
          removeEdit.delete(document.uri, getCurrentLine.range);
          removeEdit.insert(document.uri, getCurrentLine.range.start, getLeadingSpace + char + removedKeyword);

          vscode.workspace.applyEdit(removeEdit);
        } else if (!currentLineText.includes("DONE")) {
          let textToMoveDown = document.getText(
            new vscode.Range(new vscode.Position(position + 1, 0), new vscode.Position(lastLine.lineNumber, 0))
          );
          edit.insert(document.uri, getCurrentLine.range.start, getLeadingSpace + char + "DONE " + formattedText);
          //remove the text on the next line
          edit.delete(document.uri, nextLine.range);
          //insert the text under the DONE keyword
          edit.insert(
            document.uri,
            new vscode.Position(nextLine.lineNumber, 0),
            getLeadingSpace + "  " + "COMPLETED: " + "[" + date + "] "
          );

          edit.replace(
            document.uri,
            new vscode.Range(
              new vscode.Position(twoLinesDown.lineNumber, 0),
              new vscode.Position(lastLine.lineNumber, 0)
            ),
            textToMoveDown
          );
        } else if (!currentLineText.includes("TODO")) {
          let removeDone = formattedText.replace(/\b(DONE)\b/, "").trim();
          edit.insert(document.uri, getCurrentLine.range.start, getLeadingSpace + char + "TODO" + " " + removeDone);

          //need to remove the completed: line
          if (nextLine.text.includes("COMPLETED:")) {
            edit.replace(
              document.uri,
              new vscode.Range(new vscode.Position(position + 1, 0), new vscode.Position(lastLine.lineNumber, 0)),
              document.getText(
                new vscode.Range(new vscode.Position(position + 2, 0), new vscode.Position(lastLine.lineNumber, 0))
              )
            );
          }
        }
        vscode.workspace.applyEdit(edit);
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
};
