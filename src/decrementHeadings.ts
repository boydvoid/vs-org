//get number of spaces in front of the unicode char
// get the unicode char
// incrementing increase spaces by 1 and rotate character array to the left
// decrementing is the reverse of increment

import * as vscode from "vscode";
module.exports = function() {
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
    const { document } = activeTextEditor;
    let characterArray: any = ["⊖ ", "⊙ ", "⊘ "];
    let position = activeTextEditor.selection.active.line;
    let getCurrentLine = document.lineAt(position);
    let currentLineText = getCurrentLine.text;
    let char: any = characterDecode(characterArray);
    let getLeadingSpace = currentLineText.substr(0, currentLineText.indexOf(char));
    let newSpaces: string = "";
    let convertSpaces: any[] = [];
    let newChar: any;
    let formattedText = currentLineText.replace(/[⊙⊘⊖\?]/g, "").trim();
    decrement();
    function decrement() {
      if (currentLineText.includes(char)) {
        let edit = new vscode.WorkspaceEdit();
        edit.delete(document.uri, getCurrentLine.range);

        //setting the new char
        if (currentLineText.includes("⊖")) {
          newChar = "⊘ ";
        }
        if (currentLineText.includes("⊙")) {
          newChar = "⊖ ";
        }
        if (currentLineText.includes("⊘")) {
          newChar = "⊙ ";
        }
        //remove a space before the char
        if (getLeadingSpace.length !== 0) {
          for (let i = 1; i <= getLeadingSpace.length - 1; i++) {
            convertSpaces.push(" ");

            newSpaces = convertSpaces.join("");
          }
          edit.insert(document.uri, getCurrentLine.range.start, newSpaces + newChar + formattedText);
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
  }
};
