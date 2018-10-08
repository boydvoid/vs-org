import * as vscode from "vscode";
module.exports = function () {
  vscode.commands.executeCommand("workbench.action.files.save").then(() => {
    const { activeTextEditor } = vscode.window;
    if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
      const { document } = activeTextEditor;
      let characterArray: any = ["⊖ ", "⊙ ", "⊘ "];
      let char: any = characterDecode(characterArray);
      let position = activeTextEditor.selection.active.line;
      let currentLineText = document.lineAt(position).text;
      let lineCount = document.lineCount;
      let start = new vscode.Position(position, 0);
      let leadingSpaces = getLeadingSpaces(currentLineText);
      let textUpEndPos: any;
      let textDownEndPos: any;
      let textToMoveUp: any;
      let textToMoveDown: any;
      let edit = new vscode.WorkspaceEdit();
      let direction = "down";

      if (currentLineText.includes(char)) {

        for (let i = position; i <= lineCount; i++) {
          if (position !== lineCount - 1) {
            let nextLine = document.lineAt(i + 1);

            if (leadingSpaces < nextLine.text.search(/\S/)) {
            } else if (nextLine.text.search(/\S/) <= leadingSpaces) {
              textUpEndPos = new vscode.Position(i + 1, 0);
              if (direction === "up") {
                textToMoveUp = document.getText(new vscode.Range(start, textUpEndPos));
              } else {
                textToMoveDown = document.getText(new vscode.Range(start, textUpEndPos));
              }
              break;
            }
          } else {
            textUpEndPos = new vscode.Position(i + 1, 0);
            if (direction === "up") {
              textToMoveUp = document.getText(new vscode.Range(start, textUpEndPos));
            } else {
              textToMoveDown = document.getText(new vscode.Range(start, textUpEndPos));
            }
          }
        }

        if (direction === "up") {
          for (let i = position; i >= 0; i--) {
            if (position !== 1) {
              let previousLine = document.lineAt(i - 1);
              console.log(i);
              console.log(previousLine);
              if (leadingSpaces < previousLine.text.search(/\S/)) {
              } else if (previousLine.text.search(/\S/) <= leadingSpaces) {
                textDownEndPos = new vscode.Position(i - 1, 0);
                textToMoveDown = document.getText(new vscode.Range(start, textDownEndPos));
                break;
              }
            } else {
              textDownEndPos = new vscode.Position(i - 1, 0);
              textToMoveDown = document.getText(new vscode.Range(start, textDownEndPos));
            }
          }
        } else {
          for (let i = textUpEndPos.line; i <= lineCount; i++) {
            if (position !== lineCount - 1) {
              let nextLine = document.lineAt(i + 1);
              if (leadingSpaces < nextLine.text.search(/\S/)) {
              } else if (nextLine.text.search(/\S/) <= leadingSpaces) {
                textDownEndPos = new vscode.Position(i + 1, 0);
                textToMoveUp = document.getText(new vscode.Range(textUpEndPos, textDownEndPos));
                break;
              }
            } else {
              textDownEndPos = new vscode.Position(i + 1, 0);
              textToMoveUp = document.getText(new vscode.Range(start, textDownEndPos));
            }
          }
        }
      }

      if (direction === "up") {
        edit.replace(document.uri, new vscode.Range(start, textUpEndPos), textToMoveDown);
        edit.replace(document.uri, new vscode.Range(textDownEndPos, start), textToMoveUp);
        let selection = new vscode.Selection(textDownEndPos, textDownEndPos);
        vscode.workspace.applyEdit(edit).then(undefined => {
          activeTextEditor.selection = selection;
        });
      } else {
        edit.replace(document.uri, new vscode.Range(start, textUpEndPos), textToMoveUp);
        edit.replace(document.uri, new vscode.Range(textUpEndPos, textDownEndPos), textToMoveDown);
        vscode.workspace.applyEdit(edit);
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

    /**
     *  Return the leading spaces of the line that the cursor is on
     * @param currentLineText The current selected lines text
     * @returns The number of Leading spaces
     */
    function getLeadingSpaces(currentLineText: any) {
      return currentLineText.search(/\S/);
    }
  });
};
