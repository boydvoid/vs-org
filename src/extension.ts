"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const GO_MODE: vscode.DocumentFilter = { language: "vso", scheme: "file" };
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
class GoOnTypingFormatter implements vscode.OnTypeFormattingEditProvider {
  public provideOnTypeFormattingEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    ch: string,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Thenable<vscode.TextEdit[]> {
    return new Promise((resolve, reject) => {
      //get the current line as a number
      let currentLine = document.lineAt(position);
      // only format if it has a *
      if (currentLine.text.indexOf("*") > -1) {
        //get the number of *

        let numOfAsterisk = currentLine.text.split("*").length - 1;
        console.log(numOfAsterisk);
        for (var i = 0; i < currentLine.text.length; i++) {
          //only format if it doesn't have the character
          // TODO clean this up
          if (
            !currentLine.text.includes("⊙") ||
            !currentLine.text.includes("⊘") ||
            !currentLine.text.includes("⊖")
          ) {
            console.log(getChar(numOfAsterisk));
            resolve(
              textEdit(
                getChar(numOfAsterisk),
                position,
                document,
                numOfSpaces(numOfAsterisk)
              )
            );
          }
        }
      }
    });
  }
}

//get the unicode character depending on how many asterisks there are
function getChar(asterisk: any) {
  let characters = ["⊖", "⊙", "⊘"];
  for (let i = 0; i < asterisk; i++) {
    characters.push(characters.shift());
  }

  return characters[0];
}

// text edit function
function textEdit(char: any, position: any, document: any, spaces: any) {
  const getRange = document.lineAt(position).range;
  let removeText = vscode.TextEdit.delete(getRange);
  let insertText = vscode.TextEdit.insert(position, spaces + char);
  return [removeText, insertText];
}

// number of spaces to add function
function numOfSpaces(asterisk: number) {
  let spacesArray = [];
  for (let i = 0; i < asterisk; i++) {
    spacesArray.push(" ");
  }
  return spacesArray.join("");
}
//activate function, format on space bar press
export function activate(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(
    vscode.languages.registerOnTypeFormattingEditProvider(
      GO_MODE,
      new GoOnTypingFormatter(),
      " "
    )
  );

  //---commands---------------//

  //shift + right
  vscode.commands.registerCommand("extension.toggleStatusRight", () => {
    addKeywordRight("⊖");
    addKeywordRight(" ⊙");
    addKeywordRight("   ✪");
  });
  //add or remove TODO then DONE
  function addKeywordRight(char: string) {
    const { activeTextEditor } = vscode.window;
    if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
      const { document } = activeTextEditor;
      //get the current line
      let position = activeTextEditor.selection.active.line;
      const getCurrentLine = document.lineAt(position);
      //get the text of the current line
      let currentLineText = getCurrentLine.text;
      //remove special characters and leading and trailing spaces
      let formattedText = currentLineText.replace(/[^\w\s!?]/g, "").trim();
      //make sure there is a character
      if (currentLineText.includes(char)) {
        let edit = new vscode.WorkspaceEdit();
        let removeEdit = new vscode.WorkspaceEdit();
        edit.delete(document.uri, getCurrentLine.range);

        //
        if (currentLineText.includes("DONE")) {
          //remove the keyword
          let removedKeyword = formattedText
            .replace(/\b(DONE|TODO)\b/gi, "")
            .trim();
          removeEdit.delete(document.uri, getCurrentLine.range);
          removeEdit.insert(
            document.uri,
            getCurrentLine.range.start,
            char + removedKeyword
          );

          return vscode.workspace.applyEdit(removeEdit);
        } else if (!currentLineText.includes("TODO")) {
          edit.insert(
            document.uri,
            getCurrentLine.range.start,
            char + " " + "TODO" + " " + formattedText
          );
        } else if (!currentLineText.includes("DONE")) {
          let removeTodo = formattedText.replace(/\b(TODO)\b/gi, "").trim();
          edit.insert(
            document.uri,
            getCurrentLine.range.start,
            char + " " + "DONE" + " " + removeTodo
          );
        }
        return vscode.workspace.applyEdit(edit);
      }
    }
  }
}

//shift + left
vscode.commands.registerCommand("extension.toggleStatusLeft", () => {
  addKeywordLeft("⊖");
  addKeywordLeft(" ⊙");
  addKeywordLeft("   ✪");
});

//add or remove DONE then TODO
function addKeywordLeft(char: string) {
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
    const { document } = activeTextEditor;
    //get the current line
    let position = activeTextEditor.selection.active.line;
    const getCurrentLine = document.lineAt(position);
    //get the text of the current line
    let currentLineText = getCurrentLine.text;
    //remove special characters
    let formattedText = currentLineText.replace(/[^\w\s!?]/g, "").trim();
    if (currentLineText.includes(char)) {
      let edit = new vscode.WorkspaceEdit();
      let removeEdit = new vscode.WorkspaceEdit();
      edit.delete(document.uri, getCurrentLine.range);
      if (currentLineText.includes("TODO")) {
        //remove the keyword
        let removedKeyword = formattedText
          .replace(/\b(DONE|TODO)\b/gi, "")
          .trim();
        removeEdit.delete(document.uri, getCurrentLine.range);
        removeEdit.insert(
          document.uri,
          getCurrentLine.range.start,
          char + removedKeyword
        );

        return vscode.workspace.applyEdit(removeEdit);
      } else if (!currentLineText.includes("DONE")) {
        edit.insert(
          document.uri,
          getCurrentLine.range.start,
          char + " " + "DONE" + " " + formattedText
        );
      } else if (!currentLineText.includes("TODO")) {
        let removeDone = formattedText.replace(/\b(DONE)\b/gi, "").trim();
        edit.insert(
          document.uri,
          getCurrentLine.range.start,
          char + " " + "TODO" + " " + removeDone
        );
      }
      return vscode.workspace.applyEdit(edit);
    }
  }
}
