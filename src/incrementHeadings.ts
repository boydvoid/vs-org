//get number of spaces in front of the unicode char
// get the unicode char
// incrementing increase spaces by 1 and rotate character array to the left
// decrementing is the reverse of increment

import * as vscode from "vscode";
module.exports = function() {
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
    const { document } = activeTextEditor;
    let direction = "right";
    let characterArray: any = ["⊖ ", "⊙ ", "⊘ "];
    let position = activeTextEditor.selection.active.line;
    let getCurrentLine = document.lineAt(position);
    let currentLineText = getCurrentLine.text;
    let char: any = characterDecode(characterArray);
    let getLeadingSpace = currentLineText.substr(0, currentLineText.indexOf(char));
    let newSpaces: any;
    if (currentLineText.includes(char)) {
      let edit = new vscode.WorkspaceEdit();
      edit.delete(document.uri, getCurrentLine.range);

      if (direction === "right") {
        //add another space before char
        for (let i = 0; i < getLeadingSpace.length + 1; i++) {
          newSpaces.push(" ");
        } 

        edit.insert(document.uri, getCurrentLine.range.start, newSpaces + newChar + formattedText)
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
